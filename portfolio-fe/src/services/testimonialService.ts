import axiosInstance from "../utils/axiosInstance";
import { Testimonial } from "@/types/testimonial";

export interface TestimonialRequest {
    name: string;
    title: string;
    content: string;
    stars: number;
}

export const useTestimonialService = () => {
    const getAdminTestimonials = async (): Promise<Testimonial[]> => {
        try {
            const response = await axiosInstance.get<Testimonial[]>("/testimonials/all");
            return response.data;
        } catch (error) {
            console.error('Error fetching admin testimonials:', error);
            throw error;
        }
    };

    const getPublishedTestimonials = async (): Promise<Testimonial[]> => {
        try {
            const response = await axiosInstance.get<Testimonial[]>("/testimonials");
            return response.data;
        } catch (error) {
            console.error('Error fetching published testimonials:', error);
            throw error;
        }
    };

    const createTestimonial = async (testimonial: TestimonialRequest): Promise<Testimonial> => {
        try {
            const response = await axiosInstance.post<Testimonial>("/testimonials", testimonial);
            return response.data;
        } catch (error) {
            console.error('Error creating testimonial:', error);
            throw error;
        }
    };

    const approveTestimonial = async (testimonialId: string): Promise<Testimonial> => {
        try {
            const response = await axiosInstance.put<Testimonial>(`/testimonials/${testimonialId}/approve`);
            return response.data;
        } catch (error) {
            console.error('Error approving testimonial:', error);
            throw error;
        }
    };

    const rejectTestimonial = async (testimonialId: string): Promise<Testimonial> => {
        const response = await axiosInstance.put<Testimonial>(`/testimonials/${testimonialId}/reject`);
        return response.data;
    };

    const deleteTestimonial = async (testimonialId: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/testimonials/${testimonialId}`);
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            throw error;
        }
    };

    return {
        getAdminTestimonials,
        getPublishedTestimonials,
        createTestimonial,
        approveTestimonial,
        rejectTestimonial,
        deleteTestimonial
    };
}; 