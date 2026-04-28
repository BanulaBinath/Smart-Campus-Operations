package com.example.smart_campus_operations.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequestDTO {

    @NotNull(message = "Facility ID is required")
    private Long facilityId;

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Booking date must be today or in the future")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    @Size(max = 1000, message = "Purpose must be under 1000 characters")
    private String purpose;

    @Min(value = 1, message = "Attendees must be at least 1")
    private Integer attendees;
}