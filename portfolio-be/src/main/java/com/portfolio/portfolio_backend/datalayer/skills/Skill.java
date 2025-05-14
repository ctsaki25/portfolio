package com.portfolio.portfolio_backend.datalayer.skills;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "skills")
public class Skill {

    @Id
    private String id; // Internal MongoDB ID
    private String skillId; // Public unique ID
    private String name;
    private String level; // e.g., "Beginner", "Intermediate", "Advanced", "Expert"
    private String category; // e.g., "Frontend", "Backend", "Database", "DevOps", "Soft Skill"
    private Integer displayOrder; // Optional: for ordering skills in a list
    private Instant createdAt;
    private Instant updatedAt;
} 