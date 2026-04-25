package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.*;
import com.example.smart_campus_operations.exception.ResourceNotFoundException;
import com.example.smart_campus_operations.model.Facility;
import com.example.smart_campus_operations.repo.FacilityRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FacilityServiceImpl implements FacilityService {

    @Autowired
    private FacilityRepository repository;

    private FacilityResponseDTO mapToDTO(Facility f) {
        if (f == null) {
            return null;
        }

        return new FacilityResponseDTO(
                f.getId(),
                f.getName(),
                f.getType(),
                f.getCategory(),
                f.getCapacity(),
                f.getLocation(),
                f.getStatus(),
            f.getDescription(),
            f.getImageUrl()
        );
    }

    private Facility mapToEntity(FacilityRequestDTO dto) {
        Facility f = new Facility();
        f.setName(dto.getName());
        f.setType(dto.getType());
        f.setCategory(dto.getCategory());
        f.setCapacity(dto.getCapacity());
        f.setLocation(dto.getLocation());
        f.setStatus(dto.getStatus());
        f.setDescription(dto.getDescription());
        f.setImageUrl(dto.getImageUrl());
        return f;
    }

    @Override
    @Transactional
    public FacilityResponseDTO create(FacilityRequestDTO dto) {
        log.debug("Creating facility with name={}, type={}, category={}, status={}", dto.getName(), dto.getType(), dto.getCategory(), dto.getStatus());
        Facility saved = repository.save(mapToEntity(dto));
        log.debug("Facility created with id={}", saved.getId());
        return mapToDTO(saved);
    }

    @Override
    public List<FacilityResponseDTO> getAll() {
        log.debug("Loading all facilities");
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FacilityResponseDTO getById(Long id) {
        log.debug("Loading facility by id={}", id);
        Facility f = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + id));
        return mapToDTO(f);
    }

    @Override
    @Transactional
    public FacilityResponseDTO update(Long id, FacilityRequestDTO dto) {
        log.debug("Updating facility id={} with payload name={}, type={}, category={}, status={}", id, dto.getName(), dto.getType(), dto.getCategory(), dto.getStatus());
        Facility f = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + id));

        f.setName(dto.getName());
        f.setType(dto.getType());
        f.setCategory(dto.getCategory());
        f.setCapacity(dto.getCapacity());
        f.setLocation(dto.getLocation());
        f.setStatus(dto.getStatus());
        f.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) {
            f.setImageUrl(dto.getImageUrl());
        }

        Facility saved = repository.save(f);
        log.debug("Facility updated id={}", saved.getId());
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.debug("Deleting facility id={}", id);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Facility not found: " + id);
        }

        repository.deleteById(id);
        log.debug("Facility deleted id={}", id);
    }
}