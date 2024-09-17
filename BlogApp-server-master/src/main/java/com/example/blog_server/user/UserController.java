package com.example.blog_server.user;

import java.net.URI;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog_server.common.dtos.ErrorResponse;
import com.example.blog_server.email.EmailDetails;
import com.example.blog_server.email.EmailServiceImpl;
import com.example.blog_server.security.JWTService;
import com.example.blog_server.user.dtos.CreateUserRequest;
import com.example.blog_server.user.dtos.LoginUserRequest;
import com.example.blog_server.user.dtos.UserResponse;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final JWTService jwtService;
    private final EmailServiceImpl emailService;

    public UserController(UserService userService, ModelMapper modelMapper, JWTService jwtService,EmailServiceImpl emailService){
        this.userService = userService;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @PostMapping("")
    ResponseEntity<UserResponse> signupUser(@RequestBody CreateUserRequest request){
        UserEntity savedUser = userService.createUser(request);
        URI savedUserUri = URI.create("/users/"+savedUser.getId());
        var userResponse = modelMapper.map(savedUser, UserResponse.class);
        userResponse.setToken(jwtService.createJwt(savedUser.getId()));
        EmailDetails e = EmailDetails.builder()
        .recipient(savedUser.getEmail())
        .msgBody("You have Successfully registered in Blog Reflectory, \n\n\n\nhappy writing")
        .subject("Blog Reflectory Signup")
        //.attachment(null)
        .build();

        emailService.sendSimpleEmail(e);
        return ResponseEntity.created(savedUserUri).body(userResponse);
    }   


    @PostMapping("/login")
    ResponseEntity<UserResponse> loginUser(@RequestBody LoginUserRequest request){
        UserEntity savedUser = userService.loginUser(request.getUsername(), request.getPassword());
        var userResponse = modelMapper.map(savedUser, UserResponse.class);
        userResponse.setToken(
                jwtService.createJwt(savedUser.getId())
        );

        return ResponseEntity.ok(userResponse);
    }

    @ExceptionHandler({
            UserService.UserNotFoundException.class,
            UserService.InvalidCredentialsException.class
    })
    ResponseEntity<ErrorResponse> handleUserExceptions(Exception ex) {
        String message;
        HttpStatus status;

        if (ex instanceof UserService.UserNotFoundException) {
            message = ex.getMessage();
            status = HttpStatus.NOT_FOUND;
        } else if (ex instanceof UserService.InvalidCredentialsException) {
            message = ex.getMessage();
            status = HttpStatus.UNAUTHORIZED;
        } else {
            message = "Something went wrong";
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

         
        ErrorResponse response = ErrorResponse.builder()
        .message(message)
        .build();               

        return ResponseEntity.status(status).body(response);
    }

    @GetMapping("")
    ResponseEntity<String> test(){
        return ResponseEntity.ok("success");
    }
}
