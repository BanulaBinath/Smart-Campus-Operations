package com.example.smart_campus_operations.event;

import java.util.UUID;

public record BookingStatusChangedEvent(
    UUID bookingId,
    UUID userId,
    String newStatus
) {}
