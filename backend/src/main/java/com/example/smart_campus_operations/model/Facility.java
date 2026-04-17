package com.example.smart_campus_operations.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type; // ROOM, LAB, SPORTS, EQUIPMENT

    private String category;

    private int capacity;

    private String location;

    private String status; // ACTIVE, OUT_OF_SERVICE

    private String description;
}