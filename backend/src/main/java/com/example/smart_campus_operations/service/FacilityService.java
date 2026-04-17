package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.FacilityRequestDTO;
import com.example.smart_campus_operations.dto.FacilityResponseDTO;

import java.util.List;

public interface FacilityService {

    FacilityResponseDTO create(FacilityRequestDTO dto);

    List<FacilityResponseDTO> getAll();

    FacilityResponseDTO getById(Long id);

    FacilityResponseDTO update(Long id, FacilityRequestDTO dto);

    void delete(Long id);
}