import { useAxiosInstance } from "../utils/axiosInstance";
import { Project } from "@/models/Project";
import { AxiosResponse } from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const useProjectService = () => {
    const axiosInstance = useAxiosInstance();
    const { getAccessTokenSilently: getAccessToken } = useAuth0();

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
        const token = await getAccessToken();
        const response = await axiosInstance.get("/projects/admin", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    };

    const getPublishedProjects = async (): Promise<Project[]> => {
        const response = await axiosInstance.get("/projects/published");
        return response.data;
    };

    const createProject = async (project: Project, imageFile?: File): Promise<AxiosResponse<Project>> => {
        const projectData = { ...project };
        
        if (imageFile) {
            const imageUrl = await uploadProjectImage(imageFile);
            projectData.imageUrl = imageUrl;
        }
        
        return await axiosInstance.post<Project>("/projects", projectData);
    };

    const updateProject = async (
        projectId: string,
        project: Project,
        imageFile?: File
    ): Promise<Project> => {
        const projectData = { ...project };
        
        if (imageFile) {
            const imageUrl = await uploadProjectImage(imageFile);
            projectData.imageUrl = imageUrl;
        }
        
        const response = await axiosInstance.put<Project>(
            `/projects/${projectId}`,
            projectData
        );
        return response.data;
    };

    const updateProjectStatus = async (projectId: string, published: boolean): Promise<Project> => {
        const response = await axiosInstance.patch<Project>(`/projects/${projectId}/publish`, { published });
        return response.data;
    };

    const getProjectById = async (projectId: string): Promise<Project> => {
        const response = await axiosInstance.get<Project>(`/projects/${projectId}`);
        return response.data;
    };

    const deleteProject = async (projectId: string): Promise<void> => {
        await axiosInstance.delete(`/projects/${projectId}`);
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