package com.portfolio.portfolio_backend.logiclayer.skills;

import com.portfolio.portfolio_backend.datalayer.skills.Skill;
import com.portfolio.portfolio_backend.datalayer.skills.SkillRepository;
import com.portfolio.portfolio_backend.logiclayer.FileStorageService;
import com.portfolio.portfolio_backend.presentationlayer.skills.SkillRequestModel;
import com.portfolio.portfolio_backend.presentationlayer.skills.SkillResponseModel;
import com.portfolio.portfolio_backend.utils.exceptions.NotFoundException;
import com.portfolio.portfolio_backend.utils.exceptions.InvalidInputException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Comparator;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    @Override
    public Flux<SkillResponseModel> getAllSkillsAdmin() {
        return skillRepository.findAll()
                .sort(Comparator.comparing(Skill::getDisplayOrder, Comparator.nullsLast(Integer::compareTo))
                                .thenComparing(Skill::getName))
                .map(SkillResponseModel::from);
    }

    @Override
    public Flux<SkillResponseModel> getAllSkillsPublic() {
        // For now, public and admin views are the same. Add filtering if needed (e.g., by a 'published' field).
        return getAllSkillsAdmin();
    }

    @Override
    public Mono<SkillResponseModel> getSkillById(String skillId) {
        return skillRepository.findBySkillId(skillId)
                .switchIfEmpty(Mono.error(new NotFoundException("Skill not found with id: " + skillId)))
                .map(SkillResponseModel::from);
    }

    @Override
    public Mono<SkillResponseModel> createSkill(Mono<SkillRequestModel> skillRequestModelMono) {
        return skillRequestModelMono
            .flatMap(requestModel -> {
                log.info("Creating skill: {}", requestModel.getName());
                if (requestModel.getName() == null || requestModel.getName().trim().isEmpty()) {
                    return Mono.error(new InvalidInputException("Skill name cannot be empty."));
                }

                Skill skill = Skill.builder()
                        .skillId(UUID.randomUUID().toString())
                        .name(requestModel.getName())
                        .level(requestModel.getLevel())
                        .category(requestModel.getCategory())
                        .displayOrder(requestModel.getDisplayOrder() == null ? 0 : requestModel.getDisplayOrder())
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build();

                return skillRepository.save(skill)
                        .map(SkillResponseModel::from)
                        .doOnSuccess(s -> log.info("Successfully created skill with id: {}", s.getSkillId()))
                        .doOnError(e -> log.error("Error creating skill: {}", e.getMessage()));
            });
    }

    @Override
    public Mono<SkillResponseModel> updateSkill(String skillId, Mono<SkillRequestModel> skillRequestModelMono) {
        return skillRepository.findBySkillId(skillId)
                .switchIfEmpty(Mono.error(new NotFoundException("Skill not found with id: " + skillId)))
                .flatMap(existingSkill -> skillRequestModelMono
                    .flatMap(requestModel -> {
                        log.info("Updating skill with id: {}", skillId);
                        if (requestModel.getName() != null && !requestModel.getName().trim().isEmpty()) {
                            existingSkill.setName(requestModel.getName());
                        }
                        if (requestModel.getLevel() != null) {
                            existingSkill.setLevel(requestModel.getLevel());
                        }
                        if (requestModel.getCategory() != null) {
                            existingSkill.setCategory(requestModel.getCategory());
                        }
                        if (requestModel.getDisplayOrder() != null) {
                            existingSkill.setDisplayOrder(requestModel.getDisplayOrder());
                        }
                        existingSkill.setUpdatedAt(Instant.now());

                        return skillRepository.save(existingSkill)
                                .map(SkillResponseModel::from)
                                .doOnSuccess(s -> log.info("Successfully updated skill with id: {}", s.getSkillId()))
                                .doOnError(e -> log.error("Error updating skill: {}", e.getMessage()));
                    }));
    }

    @Override
    public Mono<Void> deleteSkill(String skillId) {
        log.info("Attempting to delete skill with id: {}", skillId);
        return skillRepository.findBySkillId(skillId)
                .switchIfEmpty(Mono.error(new NotFoundException("Skill not found with id: " + skillId)))
                .flatMap(skill -> {
                    log.info("Deleting skill entity for id: {}", skillId);
                    return skillRepository.delete(skill)
                            .doOnSuccess(v -> log.info("Successfully deleted skill for id: {}", skillId))
                            .doOnError(e -> log.error("Error during skill deletion for id: {}: {}", skillId, e.getMessage()));
                });
    }
} 