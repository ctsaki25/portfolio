package com.portfolio.portfolio_backend.datalayer.skills;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface SkillRepository extends ReactiveMongoRepository<Skill, String> {
    Mono<Skill> findBySkillId(String skillId);
    Mono<Boolean> existsBySkillId(String skillId);
} 