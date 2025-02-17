package com.portfolio.portfolio_backend.datalayer.testimonials;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "testimonials")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Testimonial {
    @Id
    private String testimonialId;
    private String name;
    private String title;
    private String content;
    private int stars;
    private boolean approved;
    private Instant createdAt;
    private Instant updatedAt;
} 