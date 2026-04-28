package com.example.smart_campus_operations.entity;

import com.example.smart_campus_operations.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(
    name = "bookings",
    indexes = {
        @Index(name = "idx_booking_facility", columnList = "facility_id"),
        @Index(name = "idx_booking_user",     columnList = "user_id"),
        @Index(name = "idx_booking_status",   columnList = "status")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Who booked ────────────────────────────────────────────────────────────
    @Column(name = "user_id", nullable = false, columnDefinition = "BINARY(16)")
    private UUID userId;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "user_name")
    private String userName;

    // ── What they booked ──────────────────────────────────────────────────────
    @Column(name = "facility_id", nullable = false)
    private Long facilityId;

    @Column(name = "facility_name", nullable = false)
    private String facilityName;

    @Column(name = "resource_type")
    private String resourceType;

    // ── When ──────────────────────────────────────────────────────────────────
    @Column(name = "booking_date", nullable = false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    // ── Details ───────────────────────────────────────────────────────────────
    @Column(nullable = false, length = 1000)
    private String purpose;

    @Column
    private Integer attendees;

    // ── Workflow ──────────────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "reviewed_by", columnDefinition = "BINARY(16)")
    private UUID reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    // ── Audit ─────────────────────────────────────────────────────────────────
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}