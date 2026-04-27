package com.example.smart_campus_operations.repository;

import com.example.smart_campus_operations.entity.Booking;
import com.example.smart_campus_operations.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ── User queries ──────────────────────────────────────────────────────────

    Page<Booking> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<Booking> findByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, BookingStatus status, Pageable pageable);

    // ── Admin queries ─────────────────────────────────────────────────────────

    Page<Booking> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status, Pageable pageable);

    // ── Conflict detection ────────────────────────────────────────────────────
    @Query("""
        SELECT COUNT(b) > 0
        FROM Booking b
        WHERE b.facilityId = :facilityId
          AND b.date       = :date
          AND b.status     IN ('PENDING', 'APPROVED')
          AND b.startTime  < :endTime
          AND b.endTime    > :startTime
          AND (:excludeId IS NULL OR b.id <> :excludeId)
        """)
    boolean existsConflict(
        @Param("facilityId") Long facilityId,
        @Param("date")       LocalDate date,
        @Param("startTime")  LocalTime startTime,
        @Param("endTime")    LocalTime endTime,
        @Param("excludeId")  Long excludeId
    );

    // ── Booked slots for availability view ────────────────────────────────────
    @Query("""
        SELECT b FROM Booking b
        WHERE b.facilityId = :facilityId
          AND b.date       = :date
          AND b.status     IN ('PENDING', 'APPROVED')
        ORDER BY b.startTime
        """)
    List<Booking> findBookedSlots(
        @Param("facilityId") Long facilityId,
        @Param("date")       LocalDate date
    );
}