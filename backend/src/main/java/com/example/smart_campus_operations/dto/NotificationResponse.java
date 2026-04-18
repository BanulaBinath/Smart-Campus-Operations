package com.example.smart_campus_operations.dto;

import com.example.smart_campus_operations.entity.NotificationType;
import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
    UUID id,
    NotificationType type,
    String message,
    boolean isRead,
    UUID referenceId,
    String referenceType,
    LocalDateTime createdAt
) {}
