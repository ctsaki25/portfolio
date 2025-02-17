package com.portfolio.portfolio_backend.presentationlayer.projects;

import com.portfolio.portfolio_backend.datalayer.projects.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

import java.time.Instant;
import java.util.UUID;

@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequestModel {
    private String title;
    private String description;
    private String imageUrl;
    private String technologies;
    private String githubUrl;
    private String liveUrl;
    private boolean published;

    public Project toEntity() {
        Project project = new Project();
        BeanUtils.copyProperties(this, project);
        project.setProjectId(UUID.randomUUID().toString());
        project.setCreatedAt(Instant.now());
        project.setUpdatedAt(Instant.now());
        return project;
    }
}
