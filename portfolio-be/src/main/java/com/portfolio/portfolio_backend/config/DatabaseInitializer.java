package com.portfolio.portfolio_backend.config;

import com.portfolio.portfolio_backend.businesslayer.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Configuration
public class DatabaseInitializer {
    
    @Value("${admin.username}")
    private String adminUsername;
    
    @Value("${admin.password}")
    private String adminPassword;
    
    @Bean
    CommandLineRunner init(AuthService authService) {
        return args -> {
            log.info("Initializing database...");
            
            // Create default admin user if it doesn't exist
            authService.createUser(adminUsername, adminPassword, "ADMIN")
                .onErrorResume(e -> {
                    if (e.getMessage().contains("Username already exists")) {
                        log.info("Admin user already exists");
                        return Mono.empty();
                    }
                    log.error("Error creating admin user: {}", e.getMessage());
                    return Mono.error(e);
                })
                .doOnSuccess(user -> {
                    if (user != null) {
                        log.info("Admin user created successfully");
                    }
                })
                .block(); // Wait for completion since this is initialization
            
            log.info("Database initialization completed");
        };
    }
} 