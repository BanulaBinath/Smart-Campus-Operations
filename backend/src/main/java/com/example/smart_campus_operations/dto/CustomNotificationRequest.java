package com.example.smart_campus_operations.dto;

import lombok.Data;
import java.util.List;

@Data
public class CustomNotificationRequest {
    private String title;
    private String message;
    private List<String> targetRoles;
}