package com.example.smart_campus_operations.dto;

import com.example.smart_campus_operations.entity.Role;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String email,
    String name,
    String profilePicture,
    Role role,
    String provider
) {}
