package com.workLedger.api.model;

public record ReportClientDto(
    String clientId,
    String name,
    String workType,
    Double revenue,
    Double profit
) {}
