package com.portfolio.portfolio_backend.presentationlayer.projects;

import com.portfolio.portfolio_backend.datalayer.projects.ProjectComment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

import java.time.Instant;

@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseModel {
    private String commentId;
    private String projectId;
    private String authorName;
    private String content;
    private boolean approved;
    private Instant createdAt;
    private String userId;
    private String userEmail;

    public static CommentResponseModel from(ProjectComment comment) {
        CommentResponseModel responseModel = new CommentResponseModel();
        BeanUtils.copyProperties(comment, responseModel);
        return responseModel;
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
