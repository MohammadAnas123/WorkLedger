package com.workLedger.api.controller;

import com.workLedger.api.model.ReportClientDto;
import com.workLedger.api.model.ReportSummary;
import com.workLedger.api.model.ReportWorkTypeDto;
import com.workLedger.api.service.WorkLedgerService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final WorkLedgerService service;

    public ReportsController(WorkLedgerService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public ReportSummary getSummary(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return service.getReportSummary(from, to);
    }

    @GetMapping("/by-client")
    public List<ReportClientDto> getByClient(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return service.getReportByClient(from, to);
    }

    @GetMapping("/by-worktype")
    public List<ReportWorkTypeDto> getByWorkType(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return service.getReportByWorkType(from, to);
    }
}
