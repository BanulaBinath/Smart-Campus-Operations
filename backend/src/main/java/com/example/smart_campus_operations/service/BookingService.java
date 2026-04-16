package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.BookingRequestDTO;
import com.example.smart_campus_operations.dto.BookingResponseDTO;
import com.example.smart_campus_operations.dto.BookingStatusUpdateDTO;

import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO dto, String userEmail);
    List<BookingResponseDTO> getMyBookings(String userEmail);
    List<BookingResponseDTO> getAllBookings();
    BookingResponseDTO updateBookingStatus(Long id, BookingStatusUpdateDTO dto);
    void cancelBooking(Long id, String userEmail);
}