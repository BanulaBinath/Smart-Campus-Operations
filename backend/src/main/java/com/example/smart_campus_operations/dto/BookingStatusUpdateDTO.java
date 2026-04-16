package com.example.smart_campus_operations.dto;

import com.example.smart_campus_operations.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String adminReason;
}