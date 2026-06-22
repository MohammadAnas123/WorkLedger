package com.workLedger.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public record Labour(
    String id,
    String clientId,
    String description,
    Double amount,
    @JsonFormat(pattern = "yyyy-MM-dd") LocalDate date
) {}
