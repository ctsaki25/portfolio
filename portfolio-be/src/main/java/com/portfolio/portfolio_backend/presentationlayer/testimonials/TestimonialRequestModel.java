package com.portfolio.portfolio_backend.presentationlayer.testimonials;

import com.portfolio.portfolio_backend.datalayer.testimonials.Testimonial;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

import java.time.Instant;
import java.util.UUID;

@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialRequestModel {
    private String name;
    private String title;
    private String content;
    private int stars;

    public Testimonial toEntity() {
        Testimonial testimonial = new Testimonial();
        BeanUtils.copyProperties(this, testimonial);
        testimonial.setTestimonialId(UUID.randomUUID().toString());
        testimonial.setApproved(false);
        testimonial.setCreatedAt(Instant.now());
        testimonial.setUpdatedAt(Instant.now());
        return testimonial;
    }
} 

