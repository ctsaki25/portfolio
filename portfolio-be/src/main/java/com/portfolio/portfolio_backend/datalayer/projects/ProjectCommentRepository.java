package com.portfolio.portfolio_backend.datalayer.projects;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface ProjectCommentRepository extends ReactiveMongoRepository<ProjectComment, String> {
    Mono<ProjectComment> findByCommentId(String commentId);
    Flux<ProjectComment> findByProjectId(String projectId);
    Flux<ProjectComment> findByApprovedFalse();
    Flux<ProjectComment> findByProjectIdAndApprovedTrue(String projectId);

    Flux<Object> deleteByProjectId(String projectId);
}