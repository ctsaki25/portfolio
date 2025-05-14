package com.portfolio.portfolio_backend.presentationlayer.skills;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SkillRequestModel {
    private String name;
    private String level;
    private String category;
    private Integer displayOrder; // Optional
    // imageUrl will be handled separately if an image file is uploaded
} 