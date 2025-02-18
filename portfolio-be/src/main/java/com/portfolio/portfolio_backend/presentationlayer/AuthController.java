package com.portfolio.portfolio_backend.presentationlayer;

import com.portfolio.portfolio_backend.businesslayer.AuthService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Mono<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.username());
        return authService.authenticate(request.username(), request.password())
            .map(token -> {
                log.info("Login successful for user: {}", request.username());
                return new LoginResponse(token);
            })
            .onErrorResume(e -> {
                log.error("Login failed for user: {}, error: {}", request.username(), e.getMessage());
                return Mono.error(new RuntimeException("Invalid credentials"));
            });
    }
}

record LoginRequest(String username, String password) {}
record LoginResponse(String token) {} 