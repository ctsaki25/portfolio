import { useAxiosInstance } from "@/utils/axiosInstance";
import { Project, CommentStatus } from "@/models/Project";
import { AxiosResponse } from "axios";

export const useProjectService = () => {
    const axiosInstance = useAxiosInstance();

    const getAllProjects = async () => {
        const response = await axiosInstance.get("/projects");
        return response.data;
    };

    const createProject = async (project: Project): Promise<AxiosResponse<Project>> => {
        return await axiosInstance.post<Project>("/projects", project);
    };

    const getProjectById = async (projectId: string): Promise<Project> => {
        const response = await axiosInstance.get<Project>(`/projects/${projectId}`);
        return response.data;
    };

    const updateProjectStatus = async (
        projectId: string,
        published: boolean
    ): Promise<Project> => {
        const response = await axiosInstance.patch<Project>(
            `/projects/${projectId}/publish`,
            { published }
        );
        return response.data;
    };

    const updateProjectDetails = async (
        projectId: string,
        project: Project
    ): Promise<Project> => {
        const response = await axiosInstance.put<Project>(
            `/projects/${projectId}`,
            project
        );
        return response.data;
    };

    const getPublishedProjects = async () => {
        const response = await axiosInstance.get("/projects/published");
        return response.data;
    };

    const addComment = async (
        projectId: string, 
        comment: { authorName: string, authorEmail: string, content: string }
    ): Promise<AxiosResponse<Comment>> => {
        return await axiosInstance.post<Comment>(
            `/projects/${projectId}/comments`,
            comment
        );
    };

    const updateCommentStatus = async (
        commentId: string,
        status: CommentStatus
    ): Promise<Comment> => {
        const response = await axiosInstance.patch<Comment>(
            `/projects/comments/${commentId}/status`,
            { status }
        );
        return response.data;
    };

    const getPendingComments = async () => {
        const response = await axiosInstance.get("/projects/comments/pending");
        return response.data;
    };

    const getProjectComments = async (projectId: string) => {
        const response = await axiosInstance.get(`/projects/${projectId}/comments`);
        return response.data;
    };

    const deleteProject = async (projectId: string): Promise<void> => {
        await axiosInstance.delete(`/projects/${projectId}`);
    };

    return {
        getAllProjects,
        createProject,
        getProjectById,
        updateProjectStatus,
        updateProjectDetails,
        getPublishedProjects,
        addComment,
        updateCommentStatus,
        getPendingComments,
        getProjectComments,
        deleteProject
    };
};