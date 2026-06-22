package com.workLedger.api.model;

public record ReportWorkTypeDto(
    String workType,
    Double revenue,
    Double profit,
    Integer jobs
) {}
