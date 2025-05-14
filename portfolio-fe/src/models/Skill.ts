export interface Skill {
    skillId: string;
    name: string;
    level: string; // e.g., "Beginner", "Intermediate", "Advanced", "Expert"
    category: string; // e.g., "Frontend", "Backend", "Database", "DevOps", "Soft Skill"
    displayOrder?: number; // Optional: for ordering skills
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
}

export interface SkillRequest {
    name: string;
    level: string;
    category: string;
    displayOrder?: number;
    // imageFile will be handled as File object separately in service/component
} 