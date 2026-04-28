package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.BookingRequestDTO;
import com.example.smart_campus_operations.dto.BookingResponseDTO;
import com.example.smart_campus_operations.entity.Booking;
import com.example.smart_campus_operations.enums.BookingStatus;
import com.example.smart_campus_operations.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    // ── CREATE ────────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO req, UUID userId, String userEmail, String userName) {

        if (!req.getEndTime().isAfter(req.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        boolean conflict = bookingRepository.existsConflict(
            req.getFacilityId(),
            req.getDate(),
            req.getStartTime(),
            req.getEndTime(),
            null
        );
        if (conflict) {
            throw new IllegalStateException(
                "This facility is already booked for the selected date and time range"
            );
        }

        // TODO: wire in FacilityService to get real facilityName + resourceType
        // Facility facility = facilityService.getById(req.getFacilityId());

        Booking booking = Booking.builder()
            .userId(userId)
            .userEmail(userEmail)
            .userName(userName)
            .facilityId(req.getFacilityId())
            .facilityName("Facility #" + req.getFacilityId()) // replace with facility.getName()
            .resourceType("Room")                              // replace with facility.getType()
            .date(req.getDate())
            .startTime(req.getStartTime())
            .endTime(req.getEndTime())
            .purpose(req.getPurpose())
            .attendees(req.getAttendees())
            .status(BookingStatus.PENDING)
            .build();

        return toDTO(bookingRepository.save(booking));
    }

    // ── READ ──────────────────────────────────────────────────────────────────

    public Page<BookingResponseDTO> getMyBookings(UUID userId, BookingStatus status, Pageable pageable) {
        Page<Booking> page = (status != null)
            ? bookingRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status, pageable)
            : bookingRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return page.map(this::toDTO);
    }

    public Page<BookingResponseDTO> getAllBookings(BookingStatus status, Pageable pageable) {
        Page<Booking> page = (status != null)
            ? bookingRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
            : bookingRepository.findAllByOrderByCreatedAtDesc(pageable);
        return page.map(this::toDTO);
    }

    public BookingResponseDTO getBookingById(Long id, UUID requestingUserId, boolean isAdmin) {
        Booking booking = findOrThrow(id);
        if (!isAdmin && !booking.getUserId().equals(requestingUserId)) {
            throw new AccessDeniedException("You do not have permission to view this booking");
        }
        return toDTO(booking);
    }

    public List<BookingResponseDTO> getBookedSlots(Long facilityId, java.time.LocalDate date) {
        return bookingRepository.findBookedSlots(facilityId, date)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── APPROVE ───────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponseDTO approveBooking(Long id, UUID adminId) {
        Booking booking = findOrThrow(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved");
        }

        boolean conflict = bookingRepository.existsConflict(
            booking.getFacilityId(),
            booking.getDate(),
            booking.getStartTime(),
            booking.getEndTime(),
            booking.getId()
        );
        if (conflict) {
            throw new IllegalStateException(
                "Cannot approve: a conflicting booking already exists for this slot"
            );
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setReviewedBy(adminId);
        booking.setReviewedAt(LocalDateTime.now());

        return toDTO(bookingRepository.save(booking));
    }

    // ── REJECT ────────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponseDTO rejectBooking(Long id, String reason, UUID adminId) {
        Booking booking = findOrThrow(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        booking.setReviewedBy(adminId);
        booking.setReviewedAt(LocalDateTime.now());

        return toDTO(bookingRepository.save(booking));
    }

    // ── CANCEL ────────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponseDTO cancelBooking(Long id, UUID requestingUserId, boolean isAdmin) {
        Booking booking = findOrThrow(id);

        if (!isAdmin && !booking.getUserId().equals(requestingUserId)) {
            throw new AccessDeniedException("You do not have permission to cancel this booking");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toDTO(bookingRepository.save(booking));
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    @Transactional
    public void deleteBooking(Long id) {
        bookingRepository.delete(findOrThrow(id));
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    private Booking findOrThrow(Long id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
    }

    private BookingResponseDTO toDTO(Booking b) {
        return BookingResponseDTO.builder()
            .id(b.getId())
            .userId(b.getUserId())
            .userEmail(b.getUserEmail())
            .userName(b.getUserName())
            .facilityId(b.getFacilityId())
            .facilityName(b.getFacilityName())
            .resourceType(b.getResourceType())
            .date(b.getDate())
            .startTime(b.getStartTime())
            .endTime(b.getEndTime())
            .purpose(b.getPurpose())
            .attendees(b.getAttendees())
            .status(b.getStatus())
            .rejectionReason(b.getRejectionReason())
            .reviewedBy(b.getReviewedBy())
            .reviewedAt(b.getReviewedAt())
            .createdAt(b.getCreatedAt())
            .updatedAt(b.getUpdatedAt())
            .build();
    }
}