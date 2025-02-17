package com.portfolio.portfolio_backend.logiclayer.projects;

import com.portfolio.portfolio_backend.presentationlayer.projects.CommentRequestModel;
import com.portfolio.portfolio_backend.presentationlayer.projects.CommentResponseModel;
import com.portfolio.portfolio_backend.presentationlayer.projects.ProjectRequestModel;
import com.portfolio.portfolio_backend.presentationlayer.projects.ProjectResponseModel;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

public interface ProjectService {
    Flux<ProjectResponseModel> getAllProjects();
    Flux<ProjectResponseModel> getAllPublishedProjects();
    Mono<ProjectResponseModel> getProjectById(String projectId);
    Mono<ProjectResponseModel> createProject(ProjectRequestModel projectRequestModel);
    Mono<ProjectResponseModel> updateProject(String projectId, ProjectRequestModel projectRequestModel);
    Mono<Void> deleteProject(String projectId);
    Mono<ProjectResponseModel> toggleProjectPublished(String projectId);

    // Comment-related operations
    Mono<CommentResponseModel> addComment(CommentRequestModel commentRequestModel);
    Mono<CommentResponseModel> approveComment(String commentId);
    Mono<Void> rejectComment(String commentId);
    Flux<CommentResponseModel> getPendingComments();
    Flux<CommentResponseModel> getApprovedComments(String projectId);
}
