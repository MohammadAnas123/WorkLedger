package com.workLedger.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public record Client(
    String id,
    String name,
    String phone,
    String address,
    String workType,
    String status,
    @JsonFormat(pattern = "yyyy-MM-dd") LocalDate createdAt,
    String notes,
    String cancelReason,
    String cancelNote,
    @JsonFormat(pattern = "yyyy-MM-dd") LocalDate cancelledAt
) {}
