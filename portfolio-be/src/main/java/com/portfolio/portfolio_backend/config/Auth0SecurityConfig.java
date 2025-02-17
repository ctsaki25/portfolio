package com.portfolio.portfolio_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class Auth0SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeExchange(authorize -> authorize
                // Public endpoints
                .pathMatchers("/api/v1/projects/published/**").permitAll()
                .pathMatchers("/api/v1/projects/images/**").permitAll()
                .pathMatchers("/api/v1/testimonials/**").permitAll()
                .pathMatchers("/api/public/**").permitAll()
                .pathMatchers("/api/images/**").permitAll()
                .pathMatchers("/api/v1/email/send/**").permitAll()
                .pathMatchers("https://tsakirisportfolio.ca.auth0.com/oauth/token").permitAll()

                // Protected endpoints
                .pathMatchers("/api/v1/projects/admin/**").authenticated()
                .pathMatchers("/api/v1/testimonials/admin/**").authenticated()
                .pathMatchers("/api/v1/projects/update/**").authenticated()
                .pathMatchers("/api/v1/projects/delete/**").authenticated()
                // Any other endpoint requires authentication
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwkSetUri("https://tsakirisportfolio.ca.auth0.com/.well-known/jwks.json"))
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://your-production-domain.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 