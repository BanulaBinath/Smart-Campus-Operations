package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.*;
import com.example.smart_campus_operations.model.Facility;
import com.example.smart_campus_operations.repo.FacilityRepository;
import com.example.smart_campus_operations.entity.NotificationType;
import com.example.smart_campus_operations.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityServiceImpl implements FacilityService {

    @Autowired
    private FacilityRepository repository;

    @Autowired
    private NotificationService notificationService;

    private FacilityResponseDTO mapToDTO(Facility f) {
        return new FacilityResponseDTO(
                f.getId(),
                f.getName(),
                f.getType(),
                f.getCategory(),
                f.getCapacity(),
                f.getLocation(),
                f.getStatus(),
                f.getDescription()
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
        return f;
    }

    @Override
    public FacilityResponseDTO create(FacilityRequestDTO dto) {
        Facility f = repository.save(mapToEntity(dto));
        
        String msg = "New facility added: " + f.getName();
        notificationService.sendNotificationToRole(Role.LECTURER, NotificationType.FACILITY_ADDED, msg, null, "FACILITY");
        
        if (!"Classroom".equalsIgnoreCase(f.getType()) && !"Lab".equalsIgnoreCase(f.getType())) {
            notificationService.sendNotificationToRole(Role.STUDENT, NotificationType.FACILITY_ADDED, msg, null, "FACILITY");
            notificationService.sendNotificationToRole(Role.USER, NotificationType.FACILITY_ADDED, msg, null, "FACILITY");
        }
        
        return mapToDTO(f);
    }

    @Override
    public List<FacilityResponseDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FacilityResponseDTO getById(Long id) {
        Facility f = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));
        return mapToDTO(f);
    }

    @Override
    public FacilityResponseDTO update(Long id, FacilityRequestDTO dto) {
        Facility f = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        f.setName(dto.getName());
        f.setType(dto.getType());
        f.setCategory(dto.getCategory());
        f.setCapacity(dto.getCapacity());
        f.setLocation(dto.getLocation());
        f.setStatus(dto.getStatus());
        f.setDescription(dto.getDescription());

        return mapToDTO(repository.save(f));
    }

    @Override
    public void delete(Long id) {
        Facility f = repository.findById(id).orElse(null);
        if (f != null) {
            repository.deleteById(id);
            
            String msg = "Facility deleted: " + f.getName();
            notificationService.sendNotificationToRole(Role.LECTURER, NotificationType.FACILITY_DELETED, msg, null, "FACILITY");
            
            if (!"Classroom".equalsIgnoreCase(f.getType()) && !"Lab".equalsIgnoreCase(f.getType())) {
                notificationService.sendNotificationToRole(Role.STUDENT, NotificationType.FACILITY_DELETED, msg, null, "FACILITY");
                notificationService.sendNotificationToRole(Role.USER, NotificationType.FACILITY_DELETED, msg, null, "FACILITY");
            }
        }
    }
}