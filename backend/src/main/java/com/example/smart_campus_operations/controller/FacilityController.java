package com.example.smart_campus_operations.controller;

import com.example.smart_campus_operations.dto.*;
import com.example.smart_campus_operations.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    @Autowired
    private FacilityService service;

    @PostMapping
    public FacilityResponseDTO create(@RequestBody FacilityRequestDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<FacilityResponseDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public FacilityResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public FacilityResponseDTO update(@PathVariable Long id,
                                      @RequestBody FacilityRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Facility deleted successfully";
    }
}