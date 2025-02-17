package com.portfolio.portfolio_backend.presentationlayer.projects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDisplayDTO {
    private String projectId;
    private String title;
    private String imageUrl;
    private String technologies;
}