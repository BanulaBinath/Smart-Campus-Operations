package com.example.smart_campus_operations.controller;

import com.example.smart_campus_operations.dto.BookingRequestDTO;
import com.example.smart_campus_operations.dto.BookingResponseDTO;
import com.example.smart_campus_operations.dto.BookingStatusUpdateDTO;
import com.example.smart_campus_operations.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    // POST - Create a new booking request
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO dto,
            @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(dto, userEmail));
    }

    // GET - Get current user's bookings
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(bookingService.getMyBookings(userEmail));
    }

    // GET - Admin: get all bookings
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // PUT - Admin: approve or reject a booking
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateDTO dto) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, dto));
    }

    // DELETE - User: cancel their own booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String userEmail) {
        bookingService.cancelBooking(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}