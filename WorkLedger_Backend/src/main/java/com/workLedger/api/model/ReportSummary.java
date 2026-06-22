package com.workLedger.api.model;

public record ReportSummary(
    Double revenue,
    Double profit,
    Double materialCost,
    Double labourCost,
    Integer cancelledJobs
) {}
