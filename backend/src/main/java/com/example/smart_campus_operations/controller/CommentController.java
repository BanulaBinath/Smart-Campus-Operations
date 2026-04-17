package com.example.smart_campus_operations.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.smart_campus_operations.model.Comment;
import com.example.smart_campus_operations.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // ADD comment to a ticket
    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long ticketId,
                                              @RequestBody Comment comment) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(ticketId, comment));
    }

    // GET all comments for a ticket
    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    // EDIT a comment
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long commentId,
                                                 @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(commentService.updateComment(
                commentId,
                body.get("message"),
                body.get("requestedBy")
        ));
    }

    // DELETE a comment
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
                                              @RequestParam String requestedBy) {
        commentService.deleteComment(commentId, requestedBy);
        return ResponseEntity.noContent().build();
    }
}