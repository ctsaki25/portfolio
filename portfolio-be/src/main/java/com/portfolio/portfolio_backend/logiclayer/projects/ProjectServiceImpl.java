package com.portfolio.portfolio_backend.logiclayer.projects;

import com.portfolio.portfolio_backend.datalayer.projects.Project;
import com.portfolio.portfolio_backend.datalayer.projects.ProjectComment;
import com.portfolio.portfolio_backend.datalayer.projects.ProjectCommentRepository;
import com.portfolio.portfolio_backend.datalayer.projects.ProjectRepository;
import com.portfolio.portfolio_backend.presentationlayer.*;
import com.portfolio.portfolio_backend.presentationlayer.projects.ProjectResponseModel;
import com.portfolio.portfolio_backend.utils.exceptions.InvalidInputException;
import com.portfolio.portfolio_backend.utils.exceptions.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import com.portfolio.portfolio_backend.presentationlayer.projects.CommentRequestModel;
import com.portfolio.portfolio_backend.presentationlayer.projects.CommentResponseModel;
import com.portfolio.portfolio_backend.presentationlayer.projects.ProjectRequestModel;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectCommentRepository commentRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectCommentRepository commentRepository) {
        this.projectRepository = projectRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public Flux<ProjectResponseModel> getAllProjects() {
        log.info("Getting all projects");
        return projectRepository.findAll()
                .map(ProjectResponseModel::from)
                .doOnComplete(() -> log.info("Retrieved all projects"));
    }

    @Override
    public Flux<ProjectResponseModel> getAllPublishedProjects() {
        log.info("Getting all published projects");
        return projectRepository.findByPublishedTrue()
                .map(ProjectResponseModel::from)
                .doOnComplete(() -> log.info("Retrieved all published projects"));
    }

    @Override
    public Mono<ProjectResponseModel> getProjectById(String projectId) {
        log.info("Getting project with ID: {}", projectId);
        return projectRepository.findByProjectId(projectId)
                .map(ProjectResponseModel::from)
                .switchIfEmpty(Mono.error(
                        new NotFoundException("Project not found with id: " + projectId)))
                .doOnSuccess(project -> log.info("Retrieved project with ID: {}", projectId));
    }

    @Override
    public Mono<ProjectResponseModel> createProject(ProjectRequestModel projectRequestModel) {
        if (projectRequestModel.getTitle() == null || projectRequestModel.getTitle().trim().isEmpty()) {
            return Mono.error(new InvalidInputException("Project title cannot be empty"));
        }

        log.info("Creating new project with title: {}", projectRequestModel.getTitle());
        return Mono.just(projectRequestModel)
                .map(ProjectRequestModel::toEntity)
                .flatMap(projectRepository::save)
                .map(ProjectResponseModel::from)
                .doOnSuccess(project -> log.info("Created project with ID: {}", project.getProjectId()));
    }

    @Override
    public Mono<ProjectResponseModel> updateProject(String projectId, ProjectRequestModel projectRequestModel) {
        if (projectRequestModel.getTitle() == null || projectRequestModel.getTitle().trim().isEmpty()) {
            return Mono.error(new InvalidInputException("Project title cannot be empty"));
        }

        log.info("Updating project with ID: {}", projectId);
        return projectRepository.findByProjectId(projectId)
                .switchIfEmpty(Mono.error(new NotFoundException("Project not found with id: " + projectId)))
                .flatMap(existingProject -> {
                    existingProject.setTitle(projectRequestModel.getTitle());
                    existingProject.setDescription(projectRequestModel.getDescription());
                    existingProject.setImageUrl(projectRequestModel.getImageUrl());
                    existingProject.setTechnologies(projectRequestModel.getTechnologies());
                    existingProject.setGithubUrl(projectRequestModel.getGithubUrl());
                    existingProject.setLiveUrl(projectRequestModel.getLiveUrl());
                    return projectRepository.save(existingProject);
                })
                .map(ProjectResponseModel::from)
                .doOnSuccess(project -> log.info("Updated project with ID: {}", projectId));
    }

    @Override
    public Mono<Void> deleteProject(String projectId) {
        log.info("Deleting project with ID: {}", projectId);
        return projectRepository.findByProjectId(projectId)
                .switchIfEmpty(Mono.error(new NotFoundException("Project not found with id: " + projectId)))
                .flatMap(project -> commentRepository.deleteByProjectId(project.getProjectId())
                        .then(projectRepository.delete(project)))
                .doOnSuccess(v -> log.info("Deleted project with ID: {}", projectId));
    }

    @Override
    public Mono<ProjectResponseModel> toggleProjectPublished(String projectId) {
        log.info("Toggling published status for project with ID: {}", projectId);
        return projectRepository.findByProjectId(projectId)
                .switchIfEmpty(Mono.error(new NotFoundException("Project not found with id: " + projectId)))
                .flatMap(project -> {
                    project.setPublished(!project.isPublished());
                    return projectRepository.save(project);
                })
                .map(ProjectResponseModel::from)
                .doOnSuccess(project -> log.info("Toggled published status for project with ID: {}", projectId));
    }

    @Override
    public Mono<CommentResponseModel> addComment(CommentRequestModel commentRequestModel) {
        if (commentRequestModel.getContent() == null || commentRequestModel.getContent().trim().isEmpty()) {
            return Mono.error(new InvalidInputException("Comment content cannot be empty"));
        }

        log.info("Adding comment for project with ID: {}", commentRequestModel.getProjectId());
        return projectRepository.findByProjectId(commentRequestModel.getProjectId())
                .switchIfEmpty(Mono.error(new NotFoundException("Project not found")))
                .then(Mono.just(commentRequestModel.toEntity()))
                .flatMap(commentRepository::save)
                .map(CommentResponseModel::from)
                .doOnSuccess(comment -> log.info("Added comment with ID: {}", comment.getCommentId()));
    }

    @Override
    public Mono<CommentResponseModel> approveComment(String commentId) {
        log.info("Approving comment with ID: {}", commentId);
        return commentRepository.findByCommentId(commentId)
                .switchIfEmpty(Mono.error(new NotFoundException("Comment not found")))
                .flatMap(comment -> {
                    comment.setApproved(true);
                    return commentRepository.save(comment);
                })
                .map(CommentResponseModel::from)
                .doOnSuccess(comment -> log.info("Approved comment with ID: {}", commentId));
    }

    @Override
    public Mono<Void> rejectComment(String commentId) {
        log.info("Rejecting comment with ID: {}", commentId);
        return commentRepository.findByCommentId(commentId)
                .switchIfEmpty(Mono.error(new NotFoundException("Comment not found")))
                .flatMap(commentRepository::delete)
                .doOnSuccess(v -> log.info("Rejected comment with ID: {}", commentId));
    }

    @Override
    public Flux<CommentResponseModel> getPendingComments() {
        log.info("Getting all pending comments");
        return commentRepository.findByApprovedFalse()
                .map(CommentResponseModel::from)
                .doOnComplete(() -> log.info("Retrieved all pending comments"));
    }

    @Override
    public Flux<CommentResponseModel> getApprovedComments(String projectId) {
        log.info("Getting approved comments for project with ID: {}", projectId);
        return commentRepository.findByProjectIdAndApprovedTrue(projectId)
                .map(CommentResponseModel::from)
                .doOnComplete(() -> log.info("Retrieved approved comments for project with ID: {}", projectId));
    }
}