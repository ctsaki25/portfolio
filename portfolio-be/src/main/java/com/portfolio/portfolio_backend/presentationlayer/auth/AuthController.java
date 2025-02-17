package com.portfolio.portfolio_backend.presentationlayer.auth;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/user")
    public Mono<Map<String, Object>> getUser(Authentication auth) {
        Map<String, Object> userInfo = new HashMap<>();
        if (auth != null && auth.getPrincipal() != null) {
            userInfo.putAll(((Map) auth.getPrincipal()));
        }
        return Mono.just(userInfo);
    }
} 