package com.example.smart_campus_operations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RejectRequestDTO {

    @NotBlank(message = "Rejection reason is required")
    @Size(max = 500, message = "Reason must be under 500 characters")
    private String reason;
}