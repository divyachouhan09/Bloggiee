package com.example.blog_server.security;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

@Service
public class JWTService {
    private static final String JWT_KEY = "jh537bkv323ug98dby0aqruboi29g847ty905";
    private Algorithm algorithm = Algorithm.HMAC256(JWT_KEY);

    public String createJwt(Long userId){
        return JWT.create().withSubject(userId.toString())
                .withIssuedAt(new Date())
                //.withExpiresAt()
                .sign(algorithm);
    }

    public Long retrieveUserId(String jwtString){
        var decodedJWT = JWT.decode(jwtString);
        var userId = Long.valueOf(decodedJWT.getSubject());
        return userId;
    }

}
