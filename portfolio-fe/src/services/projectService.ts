import axiosInstance from "../utils/axiosInstance";
import { Project } from "@/models/Project";
import { AxiosResponse } from "axios";

export const useProjectService = () => {
    const uploadProjectImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axiosInstance.post<{ imageUrl: string }>(
            '/projects/upload-image',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        return response.data.imageUrl;
    };

    const getAdminProjects = async (): Promise<Project[]> => {
        try {
            const response = await axiosInstance.get('/projects/admin');
            return response.data;
        } catch (error) {
            console.error('Error fetching admin projects:', error);
            throw error;
        }
    };

    const getPublishedProjects = async (): Promise<Project[]> => {
        try {
            const response = await axiosInstance.get('/projects/published');
            return response.data;
        } catch (error) {
            console.error('Error fetching published projects:', error);
            throw error;
        }
    };

    const createProject = async (project: Project, imageFile?: File): Promise<AxiosResponse> => {
        try {
            const formData = new FormData();
            formData.append('project', new Blob([JSON.stringify(project)], { type: 'application/json' }));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axiosInstance.post('/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    };

    const updateProject = async (projectId: string, project: Project, imageFile?: File): Promise<Project> => {
        try {
            const formData = new FormData();
            formData.append('project', new Blob([JSON.stringify(project)], { type: 'application/json' }));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axiosInstance.put(`/projects/${projectId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    };

    const updateProjectStatus = async (projectId: string, published: boolean): Promise<Project> => {
        try {
            const response = await axiosInstance.patch(`/projects/${projectId}/status`, { published });
            return response.data;
        } catch (error) {
            console.error('Error updating project status:', error);
            throw error;
        }
    };

    const getProjectById = async (projectId: string): Promise<Project> => {
        const response = await axiosInstance.get<Project>(`/projects/${projectId}`);
        return response.data;
    };

    const deleteProject = async (projectId: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/projects/${projectId}`);
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    };

    return {
        getAdminProjects,
        getPublishedProjects,
        createProject,
        updateProject,
        updateProjectStatus,
        getProjectById,
        deleteProject,
        uploadProjectImage
    };
};