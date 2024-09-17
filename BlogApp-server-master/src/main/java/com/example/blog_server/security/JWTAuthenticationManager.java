package com.example.blog_server.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import com.example.blog_server.user.UserService;

public class JWTAuthenticationManager implements AuthenticationManager {
    private JWTService jwtService;
    private UserService userService;

    public JWTAuthenticationManager(JWTService jwtService, UserService userService){
        this.jwtService = jwtService;
        this.userService = userService;

    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if(authentication instanceof JWTAuthentication){
            var jwtAuthentication = (JWTAuthentication)authentication;

            var jwt = jwtAuthentication.getCredentials();
            var userId = jwtService.retrieveUserId(jwt);
            var userEntity = userService.getUser(userId);

            jwtAuthentication.userEntity = userEntity;
            jwtAuthentication.setAuthenticated(true);

            return jwtAuthentication;
        }
        

        // TODO Auto-generated method stub
        throw new IllegalAccessError("Cannot authenticate with non-JWT authentication");
    }
}
