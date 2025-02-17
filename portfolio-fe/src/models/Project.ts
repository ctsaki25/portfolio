export interface Project {
    projectId?: string;
    title: string;
    description: string;
    imageUrl?: string;
    technologies: string;
    githubUrl?: string;
    liveUrl?: string;
    published: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProjectComment {
    commentId?: string;
    projectId: string;
    authorName: string;
    authorEmail: string;
    content: string;
    approved: boolean;
    createdAt?: Date;
}

export enum CommentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}