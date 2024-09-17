package com.example.blog_server.comments;

import org.springframework.web.bind.annotation.*;
import com.example.blog_server.article.ArticleService;
import com.example.blog_server.comments.dtos.CreateCommentRequest;
import com.example.blog_server.security.JWTService;

@RestController
@RequestMapping("/articles/{articleSlug}/comments")
public class CommentsController {

    private final CommentService commentService;
    private final ArticleService articleService;

    private final JWTService jwtService;

    public CommentsController(CommentService commentService, ArticleService articleService, JWTService jwtService) {
        this.commentService = commentService;
        this.articleService = articleService;
        this.jwtService = jwtService;
    }



    @GetMapping
    public Iterable<CommentEntity> getCommentsByArticleSlug(@PathVariable("articleSlug") String articleSlug) {
        // Get the article by slug
        var article = articleService.getArticleBySlug(articleSlug);
        // Fetch comments for the article
        return commentService.getCommentsByArticle(article.getId());
    }

    @PostMapping
    public CommentEntity createComment(@PathVariable("articleSlug") String articleSlug,
                                       @RequestBody CreateCommentRequest request,
                                       @RequestHeader("Authorization") String token) {
        // Extract userId from JWT token
        Long userId = extractUserIdFromToken(token);
        // Get the article by slug
        var article = articleService.getArticleBySlug(articleSlug);
        // Create and return the new comment
        return commentService.createComment(request, userId, article.getId());
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable("articleSlug") String articleSlug,
                              @PathVariable("commentId") Long commentId,
                              @RequestHeader("Authorization") String token) {
        // Extract userId from JWT token
        Long userId = extractUserIdFromToken(token);
        // Delete the comment
        commentService.deleteComment(commentId, userId);
    }

    private Long extractUserIdFromToken(String token) {
        // Assuming the JWT token starts with "Bearer "
        String jwtToken = token.substring(7);
        return jwtService.retrieveUserId(jwtToken);
    }

    
}
