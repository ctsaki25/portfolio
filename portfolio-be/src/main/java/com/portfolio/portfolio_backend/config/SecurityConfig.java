package com.portfolio.portfolio_backend.config;

import com.portfolio.portfolio_backend.utils.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import com.portfolio.portfolio_backend.utils.JwtAuthenticationFilter;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())
            .authorizeExchange(auth -> auth
                .pathMatchers("/api/v1/auth/**").permitAll()
                .pathMatchers("/api/v1/projects/published").permitAll()
                .pathMatchers("/api/v1/testimonials").permitAll()
                .pathMatchers("/api/v1/skills/**").permitAll()
                .pathMatchers("/api/v1/contact/**").permitAll()
                .pathMatchers("/api/v1/images/**").permitAll()
                .pathMatchers("/api/v1/cv/**").permitAll()
                .pathMatchers("/api/v1/projects/admin").authenticated()
                .pathMatchers("/api/v1/projects/**").authenticated()
                .pathMatchers("/api/v1/testimonials/all").authenticated()
                .pathMatchers("/api/v1/testimonials/**").authenticated()
                .anyExchange().permitAll()
            )
            .addFilterAt(new JwtAuthenticationFilter(jwtUtil), SecurityWebFiltersOrder.AUTHENTICATION)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 