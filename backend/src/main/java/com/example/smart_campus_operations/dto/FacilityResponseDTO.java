package com.example.smart_campus_operations.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FacilityResponseDTO {

    private Long id;
    private String name;
    private String type;
    private String category;
    private int capacity;
    private String location;
    private String status;
    private String description;
    private String imageUrl;
}