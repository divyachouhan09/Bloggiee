package com.example.blog_server.comments.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCommentRequest {
    private String title;
    private String body;
    private String author;
}
