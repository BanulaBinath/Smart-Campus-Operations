package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.BookingRequestDTO;
import com.example.smart_campus_operations.dto.BookingResponseDTO;
import com.example.smart_campus_operations.dto.BookingStatusUpdateDTO;
import com.example.smart_campus_operations.entity.Booking;
import com.example.smart_campus_operations.enums.BookingStatus;
import com.example.smart_campus_operations.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO dto, String userEmail) {
        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(), dto.getBookingDate(), dto.getStartTime(), dto.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Resource is already booked for this time slot");
        }

        Booking booking = new Booking();
        booking.setResourceId(dto.getResourceId());
        booking.setRequestedBy(userEmail);
        booking.setBookingDate(dto.getBookingDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setExpectedAttendees(dto.getExpectedAttendees());

        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public List<BookingResponseDTO> getMyBookings(String userEmail) {
        return bookingRepository.findByRequestedBy(userEmail)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatusUpdateDTO dto) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(dto.getStatus());
        booking.setAdminReason(dto.getAdminReason());
        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public void cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getRequestedBy().equals(userEmail)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only approved bookings can be cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingResponseDTO mapToResponse(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setResourceId(booking.getResourceId());
        dto.setRequestedBy(booking.getRequestedBy());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setExpectedAttendees(booking.getExpectedAttendees());
        dto.setStatus(booking.getStatus());
        dto.setAdminReason(booking.getAdminReason());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}