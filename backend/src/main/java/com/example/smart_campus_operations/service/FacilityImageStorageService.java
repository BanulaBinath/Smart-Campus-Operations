package com.example.smart_campus_operations.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Service
@Slf4j
public class FacilityImageStorageService {

    private static final Path FACILITY_UPLOAD_DIR = Paths.get("uploads", "facilities").toAbsolutePath().normalize();

    public String storeImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        String contentType = image.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        try {
            Files.createDirectories(FACILITY_UPLOAD_DIR);

            String extension = resolveExtension(image.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID() + extension;
            Path targetPath = FACILITY_UPLOAD_DIR.resolve(uniqueFileName);

            Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            String publicPath = "/uploads/facilities/" + uniqueFileName;
            log.debug("Stored facility image at {}", publicPath);
            return publicPath;
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store image", ex);
        }
    }

    private String resolveExtension(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "";
        }

        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(dotIndex);
    }
}
