package com.example.smart_campus_operations.event;

public record NewCommentEvent(
    Long commentId,
    Long ticketId,
    String ticketOwnerId,
    String commenterName
) {}
