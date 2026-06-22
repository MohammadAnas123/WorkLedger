package com.workLedger.api.service;

import com.workLedger.api.model.Client;
import com.workLedger.api.model.ClientEntity;
import com.workLedger.api.model.Labour;
import com.workLedger.api.model.LabourEntity;
import com.workLedger.api.model.Material;
import com.workLedger.api.model.MaterialEntity;
import com.workLedger.api.model.ReportClientDto;
import com.workLedger.api.model.ReportSummary;
import com.workLedger.api.model.ReportWorkTypeDto;
import com.workLedger.api.repository.ClientRepository;
import com.workLedger.api.repository.LabourRepository;
import com.workLedger.api.repository.MaterialRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkLedgerService {

    private final ClientRepository clientRepository;
    private final MaterialRepository materialRepository;
    private final LabourRepository labourRepository;
    private final JdbcTemplate jdbcTemplate;

    public WorkLedgerService(
        ClientRepository clientRepository,
        MaterialRepository materialRepository,
        LabourRepository labourRepository,
        JdbcTemplate jdbcTemplate
    ) {
        this.clientRepository = clientRepository;
        this.materialRepository = materialRepository;
        this.labourRepository = labourRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Client> listClients(String status, String search) {
        List<ClientEntity> entities = clientRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return entities.stream()
            .filter(client -> matchesStatus(client, status))
            .filter(client -> matchesSearch(client, search))
            .map(this::toClient)
            .toList();
    }

    public Client getClient(String id) {
        ClientEntity entity = clientRepository.findById(id).orElseThrow(() -> notFound("Client not found"));
        return toClient(entity);
    }

    public Client createClient(Map<String, Object> payload) {
        String id = uuid();
        LocalDate createdAt = LocalDate.now();
        String name = getString(payload, "name");
        String phone = getString(payload, "phone");
        String address = getString(payload, "address");
        String workType = getString(payload, "workType");
        String notes = getString(payload, "notes");

        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Client name is required");
        }

        ClientEntity entity = new ClientEntity(id, name, phone, address, workType, "in_progress", createdAt, notes, null, null, null);
        return toClient(clientRepository.save(entity));
    }

    @Transactional
    public Client updateClient(String id, Map<String, Object> patch) {
        ClientEntity entity = clientRepository.findById(id).orElseThrow(() -> notFound("Client not found"));
        String status = getStringOrDefault(patch, "status", entity.getStatus());
        String name = getStringOrDefault(patch, "name", entity.getName());
        String phone = getStringOrDefault(patch, "phone", entity.getPhone());
        String address = getStringOrDefault(patch, "address", entity.getAddress());
        String workType = getStringOrDefault(patch, "workType", entity.getWorkType());
        String notes = getStringOrDefault(patch, "notes", entity.getNotes());
        String cancelReason = getStringOrDefault(patch, "cancelReason", entity.getCancelReason());
        String cancelNote = getStringOrDefault(patch, "cancelNote", entity.getCancelNote());
        LocalDate cancelledAt = entity.getCancelledAt();

        if ("cancelled".equals(status) && cancelledAt == null) {
            cancelledAt = LocalDate.now();
        }
        if (!"cancelled".equals(status)) {
            cancelReason = null;
            cancelNote = null;
            cancelledAt = null;
        }

        entity.setStatus(status);
        entity.setName(name);
        entity.setPhone(phone);
        entity.setAddress(address);
        entity.setWorkType(workType);
        entity.setNotes(notes);
        entity.setCancelReason(cancelReason);
        entity.setCancelNote(cancelNote);
        entity.setCancelledAt(cancelledAt);

        return toClient(clientRepository.save(entity));
    }

    @Transactional
    public void deleteClient(String id) {
        if (!clientRepository.existsById(id)) {
            throw notFound("Client not found");
        }
        materialRepository.deleteByClientId(id);
        labourRepository.deleteByClientId(id);
        clientRepository.deleteById(id);
    }

    public List<Labour> listLabour(String clientId) {
        ensureClientExists(clientId);
        return labourRepository.findByClientIdOrderByDateDesc(clientId).stream()
            .map(this::toLabour)
            .toList();
    }

    public Labour addLabour(String clientId, Map<String, Object> payload) {
        ensureClientExists(clientId);
        String description = getString(payload, "description");
        Double amount = getDouble(payload, "amount");

        if (description == null || description.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is required");
        }
        if (amount == null || amount <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be a positive number");
        }

        LabourEntity entity = new LabourEntity(uuid(), clientId, description, amount, LocalDate.now());
        return toLabour(labourRepository.save(entity));
    }

    public void deleteLabour(String id) {
        try {
            labourRepository.deleteById(id);
        } catch (EmptyResultDataAccessException ex) {
            throw notFound("Labour entry not found");
        }
    }

    public List<Material> listMaterials(String clientId) {
        ensureClientExists(clientId);
        return materialRepository.findByClientIdOrderByDateDesc(clientId).stream()
            .map(this::toMaterial)
            .toList();
    }

    public Material addMaterial(String clientId, Map<String, Object> payload) {
        ensureClientExists(clientId);
        String itemName = getString(payload, "itemName");
        String shopName = getString(payload, "shopName");
        Integer quantity = getInteger(payload, "quantity");
        String unit = getString(payload, "unit");
        Double realPrice = getDouble(payload, "realPrice");
        Double commission = getDouble(payload, "commission");

        if (itemName == null || itemName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item name is required");
        }
        if (realPrice == null || realPrice <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Real price must be a positive number");
        }
        if (quantity == null || quantity <= 0) {
            quantity = 1;
        }
        if (unit == null || unit.isBlank()) {
            unit = "pcs";
        }
        if (commission == null) {
            commission = 0.0;
        }

        MaterialEntity entity = new MaterialEntity(uuid(), clientId, itemName, shopName, quantity, unit, realPrice, commission, LocalDate.now());
        return toMaterial(materialRepository.save(entity));
    }

    public void deleteMaterial(String id) {
        try {
            materialRepository.deleteById(id);
        } catch (EmptyResultDataAccessException ex) {
            throw notFound("Material entry not found");
        }
    }

    public String nextReceiptNo(String clientId) {
        ensureClientExists(clientId);
        Long next = jdbcTemplate.queryForObject("select nextval('receipt_counter')", Long.class);
        return String.format("WL-%d", next);
    }

    public ReportSummary getReportSummary(LocalDate from, LocalDate to) {
        IntervalEntries entries = entriesForInterval(from, to);
        double materialCustomer = entries.materials().stream().mapToDouble(m -> m.getRealPrice() + m.getCommission()).sum();
        double materialProfit = entries.materials().stream().mapToDouble(MaterialEntity::getCommission).sum();
        double labourTotal = entries.labour().stream().mapToDouble(LabourEntity::getAmount).sum();
        double materialCost = entries.materials().stream().mapToDouble(MaterialEntity::getRealPrice).sum();
        int cancelledJobs = cancelledClientsInRange(from, to);
        return new ReportSummary(materialCustomer + labourTotal, materialProfit, materialCost, labourTotal, cancelledJobs);
    }

    public List<ReportClientDto> getReportByClient(LocalDate from, LocalDate to) {
        IntervalEntries entries = entriesForInterval(from, to);
        Set<String> cancelledIds = cancelledClientIds();

        return clientRepository.findAll().stream()
            .filter(client -> !cancelledIds.contains(client.getId()))
            .map(client -> {
                List<MaterialEntity> clientMaterials = entries.materials().stream()
                    .filter(m -> m.getClientId().equals(client.getId()))
                    .toList();
                List<LabourEntity> clientLabour = entries.labour().stream()
                    .filter(l -> l.getClientId().equals(client.getId()))
                    .toList();
                if (clientMaterials.isEmpty() && clientLabour.isEmpty()) {
                    return null;
                }
                double revenue = clientMaterials.stream().mapToDouble(m -> m.getRealPrice() + m.getCommission()).sum() + clientLabour.stream().mapToDouble(LabourEntity::getAmount).sum();
                double profit = clientMaterials.stream().mapToDouble(MaterialEntity::getCommission).sum();
                return new ReportClientDto(client.getId(), client.getName(), client.getWorkType(), revenue, profit);
            })
            .filter(dto -> dto != null)
            .sorted((a, b) -> Double.compare(b.revenue(), a.revenue()))
            .toList();
    }

    public List<ReportWorkTypeDto> getReportByWorkType(LocalDate from, LocalDate to) {
        return getReportByClient(from, to).stream()
            .collect(Collectors.groupingBy(ReportClientDto::workType))
            .values().stream()
            .map(group -> new ReportWorkTypeDto(
                group.get(0).workType(),
                group.stream().mapToDouble(ReportClientDto::revenue).sum(),
                group.stream().mapToDouble(ReportClientDto::profit).sum(),
                group.size()
            ))
            .sorted((a, b) -> Double.compare(b.revenue(), a.revenue()))
            .toList();
    }

    private boolean matchesStatus(ClientEntity client, String status) {
        if (status == null || status.isBlank() || "all".equalsIgnoreCase(status)) {
            return true;
        }
        return status.equals(client.getStatus());
    }

    private boolean matchesSearch(ClientEntity client, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }
        String query = search.toLowerCase().trim();
        return client.getName().toLowerCase().contains(query) ||
            (client.getPhone() != null && client.getPhone().contains(query));
    }

    private Set<String> cancelledClientIds() {
        return clientRepository.findAll().stream()
            .filter(client -> "cancelled".equals(client.getStatus()))
            .map(ClientEntity::getId)
            .collect(Collectors.toSet());
    }

    private int cancelledClientsInRange(LocalDate from, LocalDate to) {
        return clientRepository.findAll().stream()
            .filter(client -> "cancelled".equals(client.getStatus()))
            .filter(client -> client.getCancelledAt() != null && isInRange(client.getCancelledAt(), from, to))
            .mapToInt(i -> 1)
            .sum();
    }

    private IntervalEntries entriesForInterval(LocalDate from, LocalDate to) {
        Set<String> cancelledIds = cancelledClientIds();
        List<MaterialEntity> materialEntries = fetchMaterials(from, to).stream()
            .filter(entry -> !cancelledIds.contains(entry.getClientId()))
            .toList();
        List<LabourEntity> labourEntries = fetchLabour(from, to).stream()
            .filter(entry -> !cancelledIds.contains(entry.getClientId()))
            .toList();
        return new IntervalEntries(materialEntries, labourEntries);
    }

    private List<MaterialEntity> fetchMaterials(LocalDate from, LocalDate to) {
        if (from != null && to != null) {
            return materialRepository.findByDateBetween(from, to);
        }
        if (from != null) {
            return materialRepository.findByDateGreaterThanEqual(from);
        }
        if (to != null) {
            return materialRepository.findByDateLessThanEqual(to);
        }
        return materialRepository.findAll();
    }

    private List<LabourEntity> fetchLabour(LocalDate from, LocalDate to) {
        if (from != null && to != null) {
            return labourRepository.findByDateBetween(from, to);
        }
        if (from != null) {
            return labourRepository.findByDateGreaterThanEqual(from);
        }
        if (to != null) {
            return labourRepository.findByDateLessThanEqual(to);
        }
        return labourRepository.findAll();
    }

    private boolean isInRange(LocalDate value, LocalDate from, LocalDate to) {
        if (value == null) {
            return false;
        }
        if (from != null && value.isBefore(from)) {
            return false;
        }
        if (to != null && value.isAfter(to)) {
            return false;
        }
        return true;
    }

    private Client toClient(ClientEntity entity) {
        return new Client(
            entity.getId(),
            entity.getName(),
            entity.getPhone(),
            entity.getAddress(),
            entity.getWorkType(),
            entity.getStatus(),
            entity.getCreatedAt(),
            entity.getNotes(),
            entity.getCancelReason(),
            entity.getCancelNote(),
            entity.getCancelledAt()
        );
    }

    private Material toMaterial(MaterialEntity entity) {
        return new Material(
            entity.getId(),
            entity.getClientId(),
            entity.getItemName(),
            entity.getShopName(),
            entity.getQuantity(),
            entity.getUnit(),
            entity.getRealPrice(),
            entity.getCommission(),
            entity.getDate()
        );
    }

    private Labour toLabour(LabourEntity entity) {
        return new Labour(
            entity.getId(),
            entity.getClientId(),
            entity.getDescription(),
            entity.getAmount(),
            entity.getDate()
        );
    }

    private void ensureClientExists(String clientId) {
        if (!clientRepository.existsById(clientId)) {
            throw notFound("Client not found");
        }
    }

    private String uuid() {
        return UUID.randomUUID().toString();
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }

    private String getString(Map<String, Object> payload, String key) {
        Object value = payload.get(key);
        return value != null ? value.toString() : null;
    }

    private String getStringOrDefault(Map<String, Object> payload, String key, String defaultValue) {
        String value = getString(payload, key);
        return value != null ? value : defaultValue;
    }

    private Integer getInteger(Map<String, Object> payload, String key) {
        Object value = payload.get(key);
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String s && !s.isBlank()) {
            try {
                return Integer.valueOf(s.trim());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private Double getDouble(Map<String, Object> payload, String key) {
        Object value = payload.get(key);
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        if (value instanceof String s && !s.isBlank()) {
            try {
                return Double.valueOf(s.trim());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private static final class IntervalEntries {
        private final List<MaterialEntity> materials;
        private final List<LabourEntity> labour;

        private IntervalEntries(List<MaterialEntity> materials, List<LabourEntity> labour) {
            this.materials = materials;
            this.labour = labour;
        }

        public List<MaterialEntity> materials() {
            return materials;
        }

        public List<LabourEntity> labour() {
            return labour;
        }
    }
}
