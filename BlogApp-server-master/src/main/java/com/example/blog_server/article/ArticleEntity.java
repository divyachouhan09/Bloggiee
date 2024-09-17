package com.example.blog_server.article;

import org.springframework.lang.NonNull;

import com.example.blog_server.user.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity(name = "articles")
@Getter
@Setter
@ToString
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ArticleEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;


    @NonNull
    private String title;

    @NonNull
    @Column(unique = true)
    private String slug;

    @NonNull
    private String subtitle;

    @NonNull
    @Column(length = 65535)
    private String body;

    private String createdAt;


    @Column(length = 65535)
    private String imageLink;

    @ManyToOne
    @JoinColumn(name = "authorId", nullable = false)
    private UserEntity author;
    
}
