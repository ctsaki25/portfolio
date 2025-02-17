package com.portfolio.portfolio_backend.datalayer.testimonials;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface TestimonialRepository extends ReactiveMongoRepository<Testimonial, String> {
    Mono<Testimonial> findByTestimonialId(String testimonialId);
    Flux<Testimonial> findByApprovedTrue();
    Flux<Testimonial> findAllByOrderByCreatedAtDesc();
} 