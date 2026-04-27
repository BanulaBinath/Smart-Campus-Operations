package com.example.smart_campus_operations.dto;

import com.example.smart_campus_operations.enums.BookingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

    private Long id;

    // User info
    private UUID userId;
    private String userEmail;
    private String userName;

    // Facility info
    private Long facilityId;
    private String facilityName;
    private String resourceType;

    // Booking details
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer attendees;

    // Workflow
    private BookingStatus status;
    private String rejectionReason;
    private UUID reviewedBy;
    private LocalDateTime reviewedAt;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}