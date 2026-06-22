package com.workLedger.api.controller;

import com.workLedger.api.model.ReportSummary;
import com.workLedger.api.service.WorkLedgerService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final WorkLedgerService service;

    public DashboardController(WorkLedgerService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public ReportSummary getDashboardSummary(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        if (from == null && to == null) {
            ZonedDateTime now = ZonedDateTime.now(ZoneId.systemDefault());
            from = LocalDate.of(now.getYear(), now.getMonth(), 1);
            to = now.toLocalDate();
        }
        return service.getReportSummary(from, to);
    }
}
