package com.workLedger.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public record Material(
    String id,
    String clientId,
    String itemName,
    String shopName,
    Integer quantity,
    String unit,
    Double realPrice,
    Double commission,
    @JsonFormat(pattern = "yyyy-MM-dd") LocalDate date
) {}
