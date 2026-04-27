package com.example.smart_campus_operations.controller;

import com.example.smart_campus_operations.dto.BookingRequestDTO;
import com.example.smart_campus_operations.dto.BookingResponseDTO;
import com.example.smart_campus_operations.dto.RejectRequestDTO;
import com.example.smart_campus_operations.enums.BookingStatus;
import com.example.smart_campus_operations.security.CustomOAuth2User;
import com.example.smart_campus_operations.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    private UUID getUserId(CustomOAuth2User principal) {
        return principal.getId();
    }

    private String getUserEmail(CustomOAuth2User principal) {
        return principal.getName(); // returns appUser.getEmail()
    }

    private String getUserName(CustomOAuth2User principal) {
        return principal.getAppUser().getName();
    }

    private boolean isAdmin(CustomOAuth2User principal) {
        return principal.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    // ────────────────────────────────────────────────────────────────────────
    // POST /api/v1/bookings
    // Create a new booking request (any authenticated user)
    // ────────────────────────────────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDTO> createBooking(
        @Valid @RequestBody BookingRequestDTO request,
        @AuthenticationPrincipal CustomOAuth2User principal
    ) {
        BookingResponseDTO response = bookingService.createBooking(
            request,
            getUserId(principal),
            getUserEmail(principal),
            getUserName(principal)
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ────────────────────────────────────────────────────────────────────────
    // GET /api/v1/bookings/my
    // Current user's own bookings
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<BookingResponseDTO>> getMyBookings(
        @RequestParam(required = false) BookingStatus status,
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "10") int size,
        @AuthenticationPrincipal CustomOAuth2User principal
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
            bookingService.getMyBookings(getUserId(principal), status, pageable)
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // GET /api/v1/bookings
    // All bookings — ADMIN only
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BookingResponseDTO>> getAllBookings(
        @RequestParam(required = false) BookingStatus status,
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingService.getAllBookings(status, pageable));
    }

    // ────────────────────────────────────────────────────────────────────────
    // GET /api/v1/bookings/{id}
    // Single booking — owner or ADMIN
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDTO> getBookingById(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomOAuth2User principal
    ) {
        return ResponseEntity.ok(
            bookingService.getBookingById(id, getUserId(principal), isAdmin(principal))
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // GET /api/v1/bookings/availability?facilityId=1&date=2026-05-01
    // Booked slots for a facility on a date
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping("/availability")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookingResponseDTO>> getAvailability(
        @RequestParam Long facilityId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(bookingService.getBookedSlots(facilityId, date));
    }

    // ────────────────────────────────────────────────────────────────────────
    // PATCH /api/v1/bookings/{id}/approve — ADMIN only
    // ────────────────────────────────────────────────────────────────────────
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> approveBooking(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomOAuth2User principal
    ) {
        return ResponseEntity.ok(bookingService.approveBooking(id, getUserId(principal)));
    }

    // ────────────────────────────────────────────────────────────────────────
    // PATCH /api/v1/bookings/{id}/reject — ADMIN only
    // ────────────────────────────────────────────────────────────────────────
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> rejectBooking(
        @PathVariable Long id,
        @Valid @RequestBody RejectRequestDTO request,
        @AuthenticationPrincipal CustomOAuth2User principal
    ) {
        return ResponseEntity.ok(
            bookingService.rejectBooking(id, request.getReason(), getUserId(principal))
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // PATCH /api/v1/bookings/{id}/cancel — owner or ADMIN
    // ────────────────────────────────────────────────────────────────────────
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomOAuth2User principal
    ) {
        return ResponseEntity.ok(
            bookingService.cancelBooking(id, getUserId(principal), isAdmin(principal))
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // DELETE /api/v1/bookings/{id} — ADMIN only
    // ────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(Map.of("message", "Booking deleted successfully"));
    }
}