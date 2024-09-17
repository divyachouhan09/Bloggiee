package com.example.blog_server.article;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {
    ArticleEntity findBySlug(String slug);

    List<ArticleEntity> findAllByAuthorId(Long authorId); // New method to fetch articles by authorId
}