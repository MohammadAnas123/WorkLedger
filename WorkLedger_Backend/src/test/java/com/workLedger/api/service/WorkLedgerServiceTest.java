package com.workLedger.api.service;

import com.workLedger.api.model.ClientEntity;
import com.workLedger.api.model.LabourEntity;
import com.workLedger.api.model.ReportSummary;
import com.workLedger.api.repository.ClientRepository;
import com.workLedger.api.repository.LabourRepository;
import com.workLedger.api.repository.MaterialRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkLedgerServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private LabourRepository labourRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private WorkLedgerService service;

    @Test
    void getReportSummaryCountsSelfLabourAsProfitAndHiredLabourAsCost() {
        ClientEntity client = new ClientEntity();
        client.setId("client-1");
        client.setStatus("in_progress");

        LabourEntity selfLabour = new LabourEntity();
        selfLabour.setId("labour-1");
        selfLabour.setClientId("client-1");
        selfLabour.setDescription("Self labour");
        selfLabour.setAmount(100.0);
        selfLabour.setDate(LocalDate.now());
        selfLabour.setLabourType("self");

        LabourEntity hiredLabour = new LabourEntity();
        hiredLabour.setId("labour-2");
        hiredLabour.setClientId("client-1");
        hiredLabour.setDescription("Hired labour");
        hiredLabour.setAmount(80.0);
        hiredLabour.setDate(LocalDate.now());
        hiredLabour.setLabourType("hired");

        when(clientRepository.findAll()).thenReturn(List.of(client));
        when(labourRepository.findByDateBetween(any(), any())).thenReturn(List.of(selfLabour, hiredLabour));
        when(materialRepository.findByDateBetween(any(), any())).thenReturn(List.of());

        ReportSummary summary = service.getReportSummary(LocalDate.now().minusDays(1), LocalDate.now().plusDays(1));

        assertEquals(180.0, summary.revenue());
        assertEquals(100.0, summary.profit());
        assertEquals(80.0, summary.labourCost());
    }
}
