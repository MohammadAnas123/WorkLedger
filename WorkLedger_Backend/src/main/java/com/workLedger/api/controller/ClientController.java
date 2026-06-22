package com.workLedger.api.controller;

import com.workLedger.api.model.Client;
import com.workLedger.api.model.Labour;
import com.workLedger.api.model.Material;
import com.workLedger.api.service.WorkLedgerService;
import org.springframework.http.HttpStatus;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ClientController {

    private final WorkLedgerService service;

    public ClientController(WorkLedgerService service) {
        this.service = service;
    }

    @GetMapping("/clients")
    public List<Client> listClients(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String search
    ) {
        return service.listClients(status, search);
    }

    @GetMapping("/clients/{clientId}")
    public Client getClient(@PathVariable String clientId) {
        return service.getClient(clientId);
    }

    @PostMapping("/clients")
    @ResponseStatus(HttpStatus.CREATED)
    public Client createClient(@RequestBody Map<String, Object> payload) {
        return service.createClient(payload);
    }

    @PatchMapping("/clients/{clientId}")
    public Client updateClient(@PathVariable String clientId, @RequestBody Map<String, Object> patch) {
        return service.updateClient(clientId, patch);
    }

    @DeleteMapping("/clients/{clientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClient(@PathVariable String clientId) {
        service.deleteClient(clientId);
    }

    @GetMapping("/clients/{clientId}/labour")
    public List<Labour> listLabour(@PathVariable String clientId) {
        return service.listLabour(clientId);
    }

    @PostMapping("/clients/{clientId}/labour")
    @ResponseStatus(HttpStatus.CREATED)
    public Labour addLabour(@PathVariable String clientId, @RequestBody Map<String, Object> payload) {
        return service.addLabour(clientId, payload);
    }

    @DeleteMapping("/labour/{labourId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLabour(@PathVariable String labourId) {
        service.deleteLabour(labourId);
    }

    @GetMapping("/clients/{clientId}/materials")
    public List<Material> listMaterials(@PathVariable String clientId) {
        return service.listMaterials(clientId);
    }

    @PostMapping("/clients/{clientId}/materials")
    @ResponseStatus(HttpStatus.CREATED)
    public Material addMaterial(@PathVariable String clientId, @RequestBody Map<String, Object> payload) {
        return service.addMaterial(clientId, payload);
    }

    @DeleteMapping("/materials/{materialId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMaterial(@PathVariable String materialId) {
        service.deleteMaterial(materialId);
    }

    @GetMapping("/clients/{clientId}/receipt")
    public ReceiptResponse receipt(@PathVariable String clientId) {
        return new ReceiptResponse(service.nextReceiptNo(clientId));
    }

    public record ReceiptResponse(String receiptNo) {}
}
