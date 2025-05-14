import axiosInstance from "../utils/axiosInstance";
import { Skill, SkillRequest } from "@/models/Skill";
import { AxiosResponse } from "axios"; // For create and update if they return the full response

export const useSkillService = () => {
    const getAdminSkills = async (): Promise<Skill[]> => {
        try {
            const response = await axiosInstance.get<Skill[]>("/skills/admin");
            return response.data;
        } catch (error) {
            console.error('Error fetching admin skills:', error);
            throw error;
        }
    };

    const getPublicSkills = async (): Promise<Skill[]> => {
        try {
            const response = await axiosInstance.get<Skill[]>("/skills/public");
            return response.data;
        } catch (error) {
            console.error('Error fetching public skills:', error);
            throw error;
        }
    };

    const getSkillById = async (skillId: string): Promise<Skill> => {
        try {
            const response = await axiosInstance.get<Skill>(`/skills/${skillId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching skill by id ${skillId}:`, error);
            throw error;
        }
    };

    const createSkill = async (skillRequest: SkillRequest): Promise<Skill> => {
        try {
            const response = await axiosInstance.post<Skill>("/skills", skillRequest);
            return response.data;
        } catch (error) {
            console.error('Error creating skill:', error);
            throw error;
        }
    };

    const updateSkill = async (skillId: string, skillRequest: SkillRequest): Promise<Skill> => {
        try {
            const response = await axiosInstance.put<Skill>(`/skills/${skillId}`, skillRequest);
            return response.data;
        } catch (error) {
            console.error(`Error updating skill ${skillId}:`, error);
            throw error;
        }
    };

    const deleteSkill = async (skillId: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/skills/${skillId}`);
        } catch (error) {
            console.error(`Error deleting skill ${skillId}:`, error);
            throw error;
        }
    };

    return {
        getAdminSkills,
        getPublicSkills,
        getSkillById,
        createSkill,
        updateSkill,
        deleteSkill,
    };
}; 