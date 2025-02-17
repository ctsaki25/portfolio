package com.portfolio.portfolio_backend.presentationlayer.projects;

import com.portfolio.portfolio_backend.datalayer.projects.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

import java.time.Instant;

@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponseModel {
    private String projectId;
    private String title;
    private String description;
    private String imageUrl;
    private String technologies;
    private String githubUrl;
    private String liveUrl;
    private boolean published;
    private Instant createdAt;
    private Instant updatedAt;

    public static ProjectResponseModel from(Project project) {
        ProjectResponseModel responseModel = new ProjectResponseModel();
        BeanUtils.copyProperties(project, responseModel);
        return responseModel;
    }
}
