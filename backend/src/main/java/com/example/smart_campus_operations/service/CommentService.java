package com.example.smart_campus_operations.service;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.example.smart_campus_operations.event.NewCommentEvent;
import com.example.smart_campus_operations.model.Comment;
import com.example.smart_campus_operations.model.Ticket;
import com.example.smart_campus_operations.repo.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketService ticketService;
    private final ApplicationEventPublisher eventPublisher;

    public Comment addComment(Long ticketId, Comment comment) {
        Ticket ticket = ticketService.getTicketById(ticketId);
        comment.setTicket(ticket);
        Comment savedComment = commentRepository.save(comment);
        
        // Only send notification if commenter is not the ticket owner
        if (!savedComment.getCreatedBy().equals(ticket.getCreatedBy())) {
            eventPublisher.publishEvent(new NewCommentEvent(
                savedComment.getId(),
                ticket.getId(),
                ticket.getCreatedBy(),
                savedComment.getCreatedBy()
            ));
        }
        
        return savedComment;
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