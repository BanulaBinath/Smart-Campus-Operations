package com.example.smart_campus_operations.repo;

import com.example.smart_campus_operations.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    List<Facility> findByType(String type);

    List<Facility> findByStatus(String status);
}