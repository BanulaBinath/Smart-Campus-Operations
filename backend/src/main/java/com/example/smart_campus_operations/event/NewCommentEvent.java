package com.example.smart_campus_operations.event;

import java.util.UUID;

public record NewCommentEvent(
    UUID commentId,
    UUID ticketId,
    UUID ticketOwnerId,
    String commenterName
) {}
