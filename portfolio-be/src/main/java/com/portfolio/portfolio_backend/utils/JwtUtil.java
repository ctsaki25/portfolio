package com.portfolio.portfolio_backend.utils;

import com.portfolio.portfolio_backend.datalayer.User;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {
    private final SecretKey key;
    private final long validityInMilliseconds;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.validity}") long validityInMilliseconds) {
        if (secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 32 characters long");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.validityInMilliseconds = validityInMilliseconds;
        log.info("JwtUtil initialized with validity period of {} ms", validityInMilliseconds);
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        String token = Jwts.builder()
            .setSubject(user.getUsername())
            .claim("role", user.getRole())
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();

        log.debug("Generated token for user: {}", user.getUsername());
        return token;
    }

    public Claims validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

            // Check if token is expired
            if (claims.getExpiration().before(new Date())) {
                log.warn("Token is expired");
                throw new io.jsonwebtoken.ExpiredJwtException(null, claims, "Token is expired");
            }

            log.debug("Token validated for user: {}", claims.getSubject());
            return claims;
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            throw e;
        }
    }
} 