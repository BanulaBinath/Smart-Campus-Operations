package com.example.smart_campus_operations.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.smart_campus_operations.model.Ticket;
import com.example.smart_campus_operations.model.TicketAttachment;
import com.example.smart_campus_operations.repo.TicketAttachmentRepository;
import com.example.smart_campus_operations.service.TicketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketAttachmentController {

    private final TicketAttachmentRepository attachmentRepository;
    private final TicketService ticketService;

    private static final String UPLOAD_DIR = "uploads/tickets/";
    private static final int MAX_ATTACHMENTS = 3;

    // UPLOAD image attachment
    @PostMapping("/{ticketId}/attachments")
    public ResponseEntity<?> uploadAttachment(@PathVariable Long ticketId,
                                              @RequestParam("file") MultipartFile file) throws IOException {

        List<TicketAttachment> existing = attachmentRepository.findByTicketId(ticketId);
        if (existing.size() >= MAX_ATTACHMENTS) {
            return ResponseEntity.badRequest().body("Maximum 3 attachments allowed per ticket");
        }

        // Create upload directory if not exists
        Path uploadPath = Paths.get(UPLOAD_DIR + ticketId);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // Save attachment record
        Ticket ticket = ticketService.getTicketById(ticketId);
        TicketAttachment attachment = TicketAttachment.builder()
                .ticket(ticket)
                .fileName(fileName)
                .filePath(filePath.toString())
                .fileType(file.getContentType())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attachmentRepository.save(attachment));
    }

    // GET all attachments for a ticket
    @GetMapping("/{ticketId}/attachments")
    public ResponseEntity<List<TicketAttachment>> getAttachments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(attachmentRepository.findByTicketId(ticketId));
    }

    // DELETE an attachment
    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId) throws IOException {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        // Delete file from disk
        Files.deleteIfExists(Paths.get(attachment.getFilePath()));
        attachmentRepository.deleteById(attachmentId);
        return ResponseEntity.noContent().build();
    }
}