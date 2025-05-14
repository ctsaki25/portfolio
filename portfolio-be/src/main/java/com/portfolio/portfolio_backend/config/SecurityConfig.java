package com.portfolio.portfolio_backend.config;

import com.portfolio.portfolio_backend.utils.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .logout(ServerHttpSecurity.LogoutSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance()) // Stateless
                .authorizeExchange(exchanges -> exchanges
                        // Public endpoints
                        .pathMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/projects/published").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/projects/images/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/projects/{projectId}").permitAll() // Allow fetching single project
                        .pathMatchers(HttpMethod.GET, "/api/v1/projects/{projectId}/comments/approved").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/v1/projects/{projectId}/comments").permitAll() // Allow submitting comments
                        .pathMatchers(HttpMethod.GET, "/api/v1/testimonials").permitAll() // Public testimonials
                        .pathMatchers(HttpMethod.POST, "/api/v1/testimonials").permitAll() // Allow submitting testimonials
                        .pathMatchers(HttpMethod.POST, "/api/v1/email/send").permitAll()
                        // New Skill endpoints (public)
                        .pathMatchers(HttpMethod.GET, "/api/v1/skills/public").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/skills/{skillId}").permitAll() // If public view of single skill needed
                        // Generic file serving endpoint
                        // .pathMatchers(HttpMethod.GET, "/api/v1/files/**").permitAll()
                        
                        // Project Admin endpoints (require ADMIN role)
                        .pathMatchers(HttpMethod.GET, "/api/v1/projects/admin").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/v1/projects").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/v1/projects/{projectId}").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/v1/projects/{projectId}").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/v1/projects/{projectId}/status").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/v1/projects/comments/pending").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/v1/projects/comments/{commentId}/approve").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/v1/projects/comments/{commentId}/reject").hasRole("ADMIN")
                        
                        // Testimonial Admin endpoints (require ADMIN role)
                        .pathMatchers(HttpMethod.GET, "/api/v1/testimonials/all").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/v1/testimonials/{testimonialId}/approve").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/v1/testimonials/{testimonialId}/reject").hasRole("ADMIN") // This was changed to PUT for consistency
                        .pathMatchers(HttpMethod.DELETE, "/api/v1/testimonials/{testimonialId}").hasRole("ADMIN")

                        // New Skill Admin endpoints (require ADMIN role)
                        .pathMatchers(HttpMethod.GET, "/api/v1/skills/admin").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/v1/skills").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/v1/skills/{skillId}").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/v1/skills/{skillId}").hasRole("ADMIN")
                        
                        // Any other request must be authenticated
                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
} 