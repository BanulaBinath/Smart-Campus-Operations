package com.example.smart_campus_operations.event;

public record TicketCreatedEvent(
    Long ticketId,
    String userId,
    String ticketTitle
) {}
