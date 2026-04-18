package com.example.smart_campus_operations.event;

import java.util.UUID;

public record TicketStatusChangedEvent(
    UUID ticketId,
    UUID userId,
    String newStatus,
    UUID assignedTo
) {}
