package com.portfolio.portfolio_backend.datalayer.projects;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "projects")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
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
}