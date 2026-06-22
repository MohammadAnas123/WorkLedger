package com.workLedger.api.repository;

import com.workLedger.api.model.MaterialEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MaterialRepository extends JpaRepository<MaterialEntity, String> {
    List<MaterialEntity> findByClientIdOrderByDateDesc(String clientId);
    void deleteByClientId(String clientId);
    List<MaterialEntity> findByDateBetween(LocalDate from, LocalDate to);
    List<MaterialEntity> findByDateGreaterThanEqual(LocalDate from);
    List<MaterialEntity> findByDateLessThanEqual(LocalDate to);
}
