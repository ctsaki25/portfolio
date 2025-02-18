package com.portfolio.portfolio_backend.businesslayer;

import com.portfolio.portfolio_backend.datalayer.User;
import com.portfolio.portfolio_backend.datalayer.UserRepository;
import com.portfolio.portfolio_backend.utils.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Mono<String> authenticate(String username, String password) {
        log.debug("Attempting to authenticate user: {}", username);
        return userRepository.findByUsername(username)
            .switchIfEmpty(Mono.defer(() -> {
                log.error("User not found: {}", username);
                return Mono.error(new RuntimeException("Invalid credentials"));
            }))
            .filter(user -> {
                boolean matches = passwordEncoder.matches(password, user.getPassword());
                if (!matches) {
                    log.error("Invalid password for user: {}", username);
                }
                return matches;
            })
            .switchIfEmpty(Mono.defer(() -> {
                log.error("Invalid password for user: {}", username);
                return Mono.error(new RuntimeException("Invalid credentials"));
            }))
            .map(user -> {
                log.debug("Generating token for user: {}", username);
                return jwtUtil.generateToken(user);
            });
    }

    public Mono<User> createUser(String username, String password, String role) {
        log.debug("Attempting to create user: {}", username);
        return userRepository.findByUsername(username)
            .<User>flatMap(existingUser -> {
                log.error("Username already exists: {}", username);
                return Mono.<User>error(new RuntimeException("Username already exists"));
            })
            .switchIfEmpty(Mono.defer(() -> {
                User newUser = new User(username, passwordEncoder.encode(password), role);
                log.info("Creating new user: {}", username);
                return userRepository.save(newUser);
            }));
    }
} 