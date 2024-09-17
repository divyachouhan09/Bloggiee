package com.example.blog_server.article;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.blog_server.article.dtos.CreateArticleRequest;
import com.example.blog_server.article.dtos.UpdateArticleRequest;
import com.example.blog_server.security.JWTService;
import com.example.blog_server.user.UserEntity;
import com.example.blog_server.user.UserService;

@RestController
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleService articleService;
    private final JWTService jwtService;

    public ArticleController(ArticleService articleService, JWTService jwtService) {
        this.articleService = articleService;
        this.jwtService = jwtService;
    }

    @GetMapping("")
    public ResponseEntity<Iterable<ArticleEntity>> getAllArticles() {
        try {
            Iterable<ArticleEntity> articles = articleService.getAllArticle();
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleEntity> getArticleById(@PathVariable("id") Long id) {
        try {
            ArticleEntity article = articleService.getArticleById(id).orElseThrow(() -> new ArticleService.ArticleNotFoundException("Article not found"));
            return ResponseEntity.ok(article);
        } catch (ArticleService.ArticleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createArticle(@AuthenticationPrincipal UserEntity user,
                                           @RequestBody CreateArticleRequest article) {
        try {
            if (article.getTitle() != null && article.getBody() != null) {
                ArticleEntity createdArticle = articleService.createArticle(article, user.getId());
                URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(createdArticle.getId())
                        .toUri();
                return ResponseEntity.created(location).body(createdArticle);
            } else {
                return ResponseEntity.badRequest().body("Title and body must not be null");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the article");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable("id") Long articleId,
                                           @RequestBody UpdateArticleRequest articleRequest,
                                           @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract the JWT token and retrieve the userId
            String token = authHeader.replace("Bearer ", "");
            Long userId = jwtService.retrieveUserId(token);

            // Call the update service method with the userId
            ArticleEntity updatedArticle = articleService.updateArticle(articleId, articleRequest, userId);

            return ResponseEntity.ok(updatedArticle);
        } catch (ArticleService.UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (ArticleService.ArticleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the article");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable("id") Long id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.noContent().build();
        } catch (ArticleService.ArticleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Article not found");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the article");
        }
    }

    @GetMapping("/user/articles")
    public ResponseEntity<List<ArticleEntity>> getArticlesByUser(@AuthenticationPrincipal UserEntity user) {
        try {
            List<ArticleEntity> articles = articleService.getArticlesByUserId(user.getId());
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
