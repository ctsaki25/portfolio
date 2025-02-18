package com.portfolio.portfolio_backend.presentationlayer.projects;

import com.portfolio.portfolio_backend.logiclayer.FileStorageService;
import com.portfolio.portfolio_backend.logiclayer.projects.ProjectService;
import com.portfolio.portfolio_backend.presentationlayer.FileUploadResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.security.core.Authentication;

import java.util.Map;
import java.time.Duration;
import java.util.concurrent.TimeoutException;

@Slf4j
@RestController
@RequestMapping("/api/v1/projects")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
public class ProjectController {
    private final ProjectService projectService;
    private final FileStorageService fileStorageService;

    public ProjectController(ProjectService projectService, FileStorageService fileStorageService) {
        this.projectService = projectService;
        this.fileStorageService = fileStorageService;
    }

    // Add new endpoint for file upload
    @PostMapping("/upload")
    public Mono<FileUploadResponse> uploadFile(@RequestPart("file") FilePart file) {
        log.info("Received request to upload file: {}", file.filename());
        return fileStorageService.storeFile(file)
                .map(FileUploadResponse::new)
                .doOnSuccess(response -> log.info("File uploaded successfully: {}", response.getUrl()));
    }

    // Add endpoint to serve images
    @GetMapping("/images/{fileName}")
    public Mono<ResponseEntity<Resource>> getImage(@PathVariable String fileName) {
        return fileStorageService.loadFileAsResource(fileName)
                .map(resource -> ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .body(resource));
    }

    @GetMapping("/published")
    public Flux<ProjectResponseModel> getPublishedProjects() {
        log.info("Received request to get all published projects");
        return projectService.getAllPublishedProjects();
    }

    @GetMapping("/admin")
    public Flux<ProjectResponseModel> getAllProjects() {
        log.info("Received request to get all projects (admin)");
        return projectService.getAllProjects()
            .timeout(Duration.ofSeconds(10))
            .onErrorResume(TimeoutException.class, e -> {
                log.error("Timeout while retrieving projects: {}", e.getMessage());
                return Flux.error(new RuntimeException("Request timed out. Please try again."));
            })
            .onErrorResume(Exception.class, e -> {
                log.error("Error retrieving projects: {}", e.getMessage());
                return Flux.error(new RuntimeException("Failed to retrieve projects. Please try again."));
            })
            .doOnComplete(() -> log.info("Successfully retrieved all projects"))
            .doOnError(error -> log.error("Error retrieving projects: {}", error.getMessage()));
    }

    @GetMapping("/{projectId}")
    public Mono<ProjectResponseModel> getProjectById(@PathVariable String projectId) {
        log.info("Received request to get project with ID: {}", projectId);
        return projectService.getProjectById(projectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ProjectResponseModel> createProject(@RequestBody ProjectRequestModel projectRequestModel) {
        log.info("Received request to create new project");
        return projectService.createProject(projectRequestModel);
    }

    @PutMapping("/{projectId}")
    public Mono<ProjectResponseModel> updateProject(
            @PathVariable String projectId,
            @RequestBody ProjectRequestModel projectRequestModel) {
        log.info("Received request to update project with ID: {}", projectId);
        return projectService.updateProject(projectId, projectRequestModel);
    }

    @DeleteMapping("/{projectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteProject(@PathVariable String projectId) {
        log.info("Received request to delete project with ID: {}", projectId);
        return projectService.deleteProject(projectId);
    }

    @PatchMapping("/{projectId}/publish")
    public Mono<ProjectResponseModel> togglePublished(@PathVariable String projectId) {
        log.info("Received request to toggle published status for project with ID: {}", projectId);
        return projectService.toggleProjectPublished(projectId);
    }

    @PostMapping("/{projectId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<CommentResponseModel> addComment(
            @PathVariable String projectId,
            @RequestBody CommentRequestModel commentRequestModel,
            Authentication auth) {
        Object principal = auth.getPrincipal();
        if (!(principal instanceof Map)) {
            return Mono.error(new IllegalStateException("Invalid authentication principal"));
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> principalMap = (Map<String, Object>) principal;
        
        commentRequestModel.setProjectId(projectId);
        commentRequestModel.setUserId((String) principalMap.get("sub"));
        commentRequestModel.setUserEmail((String) principalMap.get("email"));
        commentRequestModel.setAuthorName((String) principalMap.get("name"));
        commentRequestModel.setAuthorEmail((String) principalMap.get("email"));
        
        return projectService.addComment(commentRequestModel);
    }

    @PostMapping("/comments/{commentId}/approve")
    public Mono<CommentResponseModel> approveComment(@PathVariable String commentId) {
        log.info("Received request to approve comment with ID: {}", commentId);
        return projectService.approveComment(commentId);
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> rejectComment(@PathVariable String commentId) {
        log.info("Received request to reject comment with ID: {}", commentId);
        return projectService.rejectComment(commentId);
    }

    @GetMapping("/comments/pending")
    public Flux<CommentResponseModel> getPendingComments() {
        log.info("Received request to get all pending comments");
        return projectService.getPendingComments();
    }

    @GetMapping("/{projectId}/comments")
    public Flux<CommentResponseModel> getProjectComments(@PathVariable String projectId) {
        log.info("Received request to get approved comments for project with ID: {}", projectId);
        return projectService.getApprovedComments(projectId);
    }
}