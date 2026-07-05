package com.workLedger.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "labour")
public class LabourEntity {

    @Id
    private String id;

    @Column(name = "client_id")
    private String clientId;

    private String description;
    private Double amount;
    private LocalDate date;

    @Column(name = "labour_type")
    private String labourType;

    public LabourEntity() {
    }

    public LabourEntity(String id, String clientId, String description, Double amount, LocalDate date) {
        this(id, clientId, description, amount, date, "hired");
    }

    public LabourEntity(String id, String clientId, String description, Double amount, LocalDate date, String labourType) {
        this.id = id;
        this.clientId = clientId;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.labourType = normalizeLabourType(labourType);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getLabourType() {
        return labourType;
    }

    public void setLabourType(String labourType) {
        this.labourType = normalizeLabourType(labourType);
    }

    private String normalizeLabourType(String labourType) {
        if ("self".equalsIgnoreCase(labourType)) {
            return "self";
        }
        return "hired";
    }
}
