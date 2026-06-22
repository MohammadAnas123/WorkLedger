package com.workLedger.api.repository;

import com.workLedger.api.model.LabourEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LabourRepository extends JpaRepository<LabourEntity, String> {
    List<LabourEntity> findByClientIdOrderByDateDesc(String clientId);
    void deleteByClientId(String clientId);
    List<LabourEntity> findByDateBetween(LocalDate from, LocalDate to);
    List<LabourEntity> findByDateGreaterThanEqual(LocalDate from);
    List<LabourEntity> findByDateLessThanEqual(LocalDate to);
}
