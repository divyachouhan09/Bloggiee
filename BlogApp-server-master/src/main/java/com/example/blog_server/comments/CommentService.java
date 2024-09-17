package com.example.blog_server.comments;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.blog_server.article.ArticleEntity;
import com.example.blog_server.article.ArticleRepository;
import com.example.blog_server.article.ArticleService;
import com.example.blog_server.comments.dtos.CreateCommentRequest;
import com.example.blog_server.user.UserRepository;
import com.example.blog_server.user.UserService;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, ArticleRepository articleRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    public Iterable<CommentEntity> getCommentsByArticle(Long articleId) {
        return commentRepository.findAllByArticleId(articleId);
    }

    public CommentEntity createComment(CreateCommentRequest request, Long authorId, Long articleId) {
        var article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleService.ArticleNotFoundException(articleId));

        var author = userRepository.findById(authorId)
                .orElseThrow(() -> new UserService.UserNotFoundException(authorId));

        var comment = CommentEntity.builder()
                .body(request.getBody())
                .title(request.getTitle())
                .article(article)
                .author(author)
                .build();

        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, Long userId) {
        var comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        commentRepository.deleteById(commentId);
    }
    
    public void deleteAllByArticleId(Long articleId) {
        commentRepository.deleteAllByArticleId(articleId);
    }

    static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }

    static class CommentNotFoundException extends IllegalArgumentException {
        public CommentNotFoundException(Long id) {
            super("Comment with id: " + id + " not found");
        }
    }
}
