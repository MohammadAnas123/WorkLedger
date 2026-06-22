package com.workLedger.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "clients")
public class ClientEntity {

    @Id
    private String id;

    private String name;
    private String phone;
    private String address;

    @Column(name = "work_type")
    private String workType;

    private String status;

    @Column(name = "created_at")
    private LocalDate createdAt;

    private String notes;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Column(name = "cancel_note")
    private String cancelNote;

    @Column(name = "cancelled_at")
    private LocalDate cancelledAt;

    public ClientEntity() {
    }

    public ClientEntity(String id, String name, String phone, String address, String workType, String status, LocalDate createdAt, String notes, String cancelReason, String cancelNote, LocalDate cancelledAt) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.workType = workType;
        this.status = status;
        this.createdAt = createdAt;
        this.notes = notes;
        this.cancelReason = cancelReason;
        this.cancelNote = cancelNote;
        this.cancelledAt = cancelledAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public String getCancelNote() {
        return cancelNote;
    }

    public void setCancelNote(String cancelNote) {
        this.cancelNote = cancelNote;
    }

    public LocalDate getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDate cancelledAt) {
        this.cancelledAt = cancelledAt;
    }
}
