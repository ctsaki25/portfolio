package com.portfolio.portfolio_backend.datalayer.projects;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ProjectRepository extends ReactiveMongoRepository<Project, String> {
    Mono<Project> findByProjectId(String projectId);
    Flux<Project> findByPublishedTrue();
    Flux<Project> findAllByOrderByCreatedAtDesc();
}