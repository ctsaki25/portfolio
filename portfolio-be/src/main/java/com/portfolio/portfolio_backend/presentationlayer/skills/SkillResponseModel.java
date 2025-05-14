package com.portfolio.portfolio_backend.presentationlayer.skills;

import com.portfolio.portfolio_backend.datalayer.skills.Skill;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class SkillResponseModel {
    private String skillId;
    private String name;
    private String level;
    private String category;
    private Integer displayOrder;
    private Instant createdAt;
    private Instant updatedAt;

    public static SkillResponseModel from(Skill skill) {
        return SkillResponseModel.builder()
                .skillId(skill.getSkillId())
                .name(skill.getName())
                .level(skill.getLevel())
                .category(skill.getCategory())
                .displayOrder(skill.getDisplayOrder())
                .createdAt(skill.getCreatedAt())
                .updatedAt(skill.getUpdatedAt())
                .build();
    }
} 