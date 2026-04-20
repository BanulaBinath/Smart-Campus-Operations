package com.example.smart_campus_operations.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.example.smart_campus_operations.entity.NotificationType;
import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
    UUID id,
    NotificationType type,
    String message,
    @JsonProperty("isRead") boolean isRead,
    UUID referenceId,
    String referenceType,
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss") LocalDateTime createdAt
) {}
