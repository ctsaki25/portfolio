package com.portfolio.portfolio_backend.presentationlayer.testimonials;

import com.portfolio.portfolio_backend.datalayer.testimonials.Testimonial;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

import java.time.Instant;

@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialResponseModel {
    private String testimonialId;
    private String name;
    private String title;
    private String content;
    private int stars;
    private boolean approved;
    private Instant createdAt;
    private Instant updatedAt;

    public static TestimonialResponseModel from(Testimonial testimonial) {
        TestimonialResponseModel responseModel = new TestimonialResponseModel();
        BeanUtils.copyProperties(testimonial, responseModel);
        return responseModel;
    }
} 