package com.example.smart_campus_operations.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.smart_campus_operations.model.Comment;
import com.example.smart_campus_operations.model.Ticket;
import com.example.smart_campus_operations.repo.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketService ticketService;

    public Comment addComment(Long ticketId, Comment comment) {
        Ticket ticket = ticketService.getTicketById(ticketId);
        comment.setTicket(ticket);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    public Comment updateComment(Long commentId, String newMessage, String requestedBy) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        if (!comment.getCreatedBy().equals(requestedBy)) {
            throw new RuntimeException("You are not allowed to edit this comment");
        }

        comment.setMessage(newMessage);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, String requestedBy) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        if (!comment.getCreatedBy().equals(requestedBy)) {
            throw new RuntimeException("You are not allowed to delete this comment");
        }

        commentRepository.deleteById(commentId);
    }
}