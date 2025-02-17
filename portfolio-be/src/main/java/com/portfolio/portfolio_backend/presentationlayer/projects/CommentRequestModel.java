package com.portfolio.portfolio_backend.presentationlayer.projects;

import com.portfolio.portfolio_backend.datalayer.projects.ProjectComment;
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
public class CommentRequestModel {
    private String projectId;
    private String authorName;
    private String authorEmail;
    private String userId;
    private String userEmail;
    private String content;

    public ProjectComment toEntity() {
        ProjectComment comment = new ProjectComment();
        BeanUtils.copyProperties(this, comment);
        comment.setCommentId(UUID.randomUUID().toString());
        comment.setApproved(false);
        comment.setCreatedAt(Instant.now());
        return comment;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}