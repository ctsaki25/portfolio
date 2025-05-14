package com.portfolio.portfolio_backend.logiclayer.testimonials;

import com.portfolio.portfolio_backend.presentationlayer.testimonials.TestimonialRequestModel;
import com.portfolio.portfolio_backend.presentationlayer.testimonials.TestimonialResponseModel;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface TestimonialService {
    Flux<TestimonialResponseModel> getAllTestimonials();
    Flux<TestimonialResponseModel> getApprovedTestimonials();
    Mono<TestimonialResponseModel> createTestimonial(TestimonialRequestModel requestModel);
    Mono<TestimonialResponseModel> updateApprovalStatus(String testimonialId, boolean approved);    
    Mono<Void> deleteTestimonial(String testimonialId);
} 