package com.workLedger.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "materials")
public class MaterialEntity {

    @Id
    private String id;

    @Column(name = "client_id")
    private String clientId;

    @Column(name = "item_name")
    private String itemName;

    @Column(name = "shop_name")
    private String shopName;

    private Integer quantity;
    private String unit;

    @Column(name = "real_price")
    private Double realPrice;

    private Double commission;
    private LocalDate date;

    public MaterialEntity() {
    }

    public MaterialEntity(String id, String clientId, String itemName, String shopName, Integer quantity, String unit, Double realPrice, Double commission, LocalDate date) {
        this.id = id;
        this.clientId = clientId;
        this.itemName = itemName;
        this.shopName = shopName;
        this.quantity = quantity;
        this.unit = unit;
        this.realPrice = realPrice;
        this.commission = commission;
        this.date = date;
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

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getRealPrice() {
        return realPrice;
    }

    public void setRealPrice(Double realPrice) {
        this.realPrice = realPrice;
    }

    public Double getCommission() {
        return commission;
    }

    public void setCommission(Double commission) {
        this.commission = commission;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
