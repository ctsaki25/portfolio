package com.portfolio.portfolio_backend.logiclayer.skills;

import com.portfolio.portfolio_backend.presentationlayer.skills.SkillRequestModel;
import com.portfolio.portfolio_backend.presentationlayer.skills.SkillResponseModel;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SkillService {
    Flux<SkillResponseModel> getAllSkillsAdmin(); // For admin view, potentially unfiltered
    Flux<SkillResponseModel> getAllSkillsPublic(); // For public view, could be filtered if needed later
    Mono<SkillResponseModel> getSkillById(String skillId);
    Mono<SkillResponseModel> createSkill(Mono<SkillRequestModel> skillRequestModel);
    Mono<SkillResponseModel> updateSkill(String skillId, Mono<SkillRequestModel> skillRequestModel);
    Mono<Void> deleteSkill(String skillId);
} 