package com.example.smart_campus_operations.repository;

import com.example.smart_campus_operations.entity.Booking;
import com.example.smart_campus_operations.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRequestedBy(String requestedBy);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.bookingDate = :date " +
           "AND b.status = 'APPROVED' " +
           "AND (:start < b.endTime AND :end > b.startTime)")
    List<Booking> findConflictingBookings(
            @Param("resourceId") String resourceId,
            @Param("date") LocalDate date,
            @Param("start") LocalTime start,
            @Param("end") LocalTime end
    );
}