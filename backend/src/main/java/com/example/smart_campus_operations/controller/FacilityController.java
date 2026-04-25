package com.example.smart_campus_operations.controller;

import com.example.smart_campus_operations.dto.*;
import com.example.smart_campus_operations.service.FacilityImageStorageService;
import com.example.smart_campus_operations.service.FacilityService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/facilities", "/api/v1/facilities"})
@CrossOrigin(origins = "*")
@Slf4j
public class FacilityController {

    @Autowired
    private FacilityService service;

    @Autowired
    private FacilityImageStorageService facilityImageStorageService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponseDTO> create(@Valid @RequestBody FacilityRequestDTO dto) {
        log.debug("POST /api/facilities - create facility request received: {}", dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponseDTO> createWithImage(
            @RequestPart("facility") @Valid FacilityRequestDTO facility,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        log.debug("POST /api/v1/facilities multipart - create facility with image request received");

        if (image != null && !image.isEmpty()) {
            String imageUrl = facilityImageStorageService.storeImage(image);
            facility.setImageUrl(imageUrl);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(facility));
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestPart("image") MultipartFile image) {
        log.debug("POST /api/v1/facilities/upload - image upload request received");
        String imageUrl = facilityImageStorageService.storeImage(image);
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<FacilityResponseDTO>> getAll() {
        log.debug("GET /api/facilities - fetching all facilities");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacilityResponseDTO> getById(@PathVariable("id") Long id) {
        log.debug("GET /api/facilities/{} - fetching facility by id", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponseDTO> update(@PathVariable("id") Long id,
                                                      @Valid @RequestBody FacilityRequestDTO dto) {
        log.debug("PUT /api/facilities/{} - update request received: {}", id, dto);
        return ResponseEntity.ok(service.update(id, dto));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponseDTO> updateWithImage(
            @PathVariable("id") Long id,
            @RequestPart("facility") @Valid FacilityRequestDTO facility,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        log.debug("PUT /api/facilities/{} multipart - update facility with image request received", id);

        if (image != null && !image.isEmpty()) {
            String imageUrl = facilityImageStorageService.storeImage(image);
            facility.setImageUrl(imageUrl);
        }

        return ResponseEntity.ok(service.update(id, facility));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        log.debug("DELETE /api/facilities/{} - delete request received", id);
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}