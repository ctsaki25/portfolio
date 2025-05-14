package com.portfolio.portfolio_backend.logiclayer.testimonials;

import com.portfolio.portfolio_backend.datalayer.testimonials.Testimonial;
import com.portfolio.portfolio_backend.datalayer.testimonials.TestimonialRepository;
import com.portfolio.portfolio_backend.presentationlayer.testimonials.TestimonialRequestModel;
import com.portfolio.portfolio_backend.presentationlayer.testimonials.TestimonialResponseModel;
import com.portfolio.portfolio_backend.utils.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TestimonialServiceImpl implements TestimonialService {
    private final TestimonialRepository testimonialRepository;

    public TestimonialServiceImpl(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    @Override
    public Flux<TestimonialResponseModel> getAllTestimonials() {
        return testimonialRepository.findAll()
                .map(TestimonialResponseModel::from);
    }

    @Override
    public Flux<TestimonialResponseModel> getApprovedTestimonials() {
        return testimonialRepository.findByApprovedTrue()
                .map(TestimonialResponseModel::from);
    }

    @Override
    public Mono<TestimonialResponseModel> createTestimonial(TestimonialRequestModel requestModel) {
        Testimonial testimonial = Testimonial.builder()
                .testimonialId(UUID.randomUUID().toString())
                .name(requestModel.getName())
                .title(requestModel.getTitle())
                .content(requestModel.getContent())
                .stars(requestModel.getStars())
                .approved(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return testimonialRepository.save(testimonial)
                .map(TestimonialResponseModel::from);
    }

    @Override
    public Mono<TestimonialResponseModel> updateApprovalStatus(String testimonialId, boolean approved) {
        return testimonialRepository.findByTestimonialId(testimonialId)
                .switchIfEmpty(Mono.error(new NotFoundException("Testimonial not found with id: " + testimonialId)))
                .map(testimonial -> {
                    testimonial.setApproved(approved);
                    testimonial.setUpdatedAt(Instant.now());
                    return testimonial;
                })
                .flatMap(testimonialRepository::save)
                .map(TestimonialResponseModel::from);
    }

    @Override
    public Mono<Void> deleteTestimonial(String testimonialId) {
        log.info("Deleting testimonial with ID: {}", testimonialId);
        return testimonialRepository.findByTestimonialId(testimonialId)
                .switchIfEmpty(Mono.error(new NotFoundException("Testimonial not found with id: " + testimonialId)))
                .flatMap(testimonial -> {
                    log.info("Found testimonial with ID: {}. Deleting now.", testimonialId);
                    return testimonialRepository.delete(testimonial);
                })
                .doOnSuccess(v -> log.info("Successfully deleted testimonial with ID: {}", testimonialId))
                .doOnError(error -> log.error("Error deleting testimonial with ID: {}: {}", testimonialId, error.getMessage()));
    }
} 