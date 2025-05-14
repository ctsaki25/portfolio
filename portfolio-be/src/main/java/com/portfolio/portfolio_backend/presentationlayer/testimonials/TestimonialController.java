package com.portfolio.portfolio_backend.presentationlayer.testimonials;

import com.portfolio.portfolio_backend.datalayer.testimonials.Testimonial;
import com.portfolio.portfolio_backend.logiclayer.testimonials.TestimonialService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1/testimonials")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
public class TestimonialController {
    private final TestimonialService testimonialService;

    public TestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping
    public Flux<TestimonialResponseModel> getApprovedTestimonials() {
        log.info("Getting approved testimonials");
        return testimonialService.getApprovedTestimonials()
            .doOnNext(testimonial -> log.info("Found approved testimonial: {}", testimonial))
            .doOnComplete(() -> log.info("Completed getting approved testimonials"))
            .doOnError(error -> log.error("Error getting approved testimonials: {}", error.getMessage()));
    }

    @GetMapping("/all")
    public Flux<TestimonialResponseModel> getAllTestimonials() {
        log.info("Getting all testimonials");
        return testimonialService.getAllTestimonials()
            .doOnComplete(() -> log.info("Completed getting all testimonials"))
            .doOnError(error -> log.error("Error getting all testimonials: {}", error.getMessage()));
    }

    @PostMapping
    public Mono<TestimonialResponseModel> createTestimonial(@RequestBody TestimonialRequestModel request) {
        return testimonialService.createTestimonial(request);
    }

    @PutMapping("/{testimonialId}/approve")
    public Mono<TestimonialResponseModel> approveTestimonial(@PathVariable String testimonialId) {
        return testimonialService.updateApprovalStatus(testimonialId, true);
    }

    @PutMapping("/{testimonialId}/reject")
    public Mono<TestimonialResponseModel> rejectTestimonial(@PathVariable String testimonialId) {
        return testimonialService.updateApprovalStatus(testimonialId, false);
    }

    @DeleteMapping("/{testimonialId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteTestimonial(@PathVariable String testimonialId) {
        log.info("Received request to delete project with ID: {}", testimonialId);
        return testimonialService.deleteTestimonial(testimonialId);
    }
} 