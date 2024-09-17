package com.example.blog_server.user.dtos;

import org.springframework.lang.NonNull;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Data
@Setter(AccessLevel.NONE)
public class CreateUserRequest {

    @NonNull
    private String username;

    @NonNull
    private String password;

    @NonNull
    private String email;

}
