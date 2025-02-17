package com.portfolio.portfolio_backend.datalayer.projects;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "project_comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectComment {
    @Id
    private String id;
    private String commentId;
    private String projectId;
    private String authorName;
    private String authorEmail;
    private String content;
    private boolean approved;
    private Instant createdAt;
}
