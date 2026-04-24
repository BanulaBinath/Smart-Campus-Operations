package com.example.smart_campus_operations.dto;

import com.example.smart_campus_operations.entity.Role;
import jakarta.validation.constraints.NotNull;

public record UserRoleUpdateRequest(
    @NotNull(message = "Role is required")
    Role role
) {}
