import { useAxiosInstance } from "../utils/axiosInstance";
import { Testimonial } from "@/types/testimonial";

export interface TestimonialRequest {
    name: string;
    title: string;
    content: string;
    stars: number;
}

export const useTestimonialService = () => {
    const axiosInstance = useAxiosInstance();

    const getAllTestimonials = async (): Promise<Testimonial[]> => {
        const response = await axiosInstance.get("/testimonials/all");
        return response.data;
    };

    const getPublishedTestimonials = async (): Promise<Testimonial[]> => {
        const response = await axiosInstance.get("/testimonials");
        return response.data;
    };

    const createTestimonial = async (testimonial: TestimonialRequest): Promise<Testimonial> => {
        const response = await axiosInstance.post("/testimonials", testimonial);
        return response.data;
    };

    const approveTestimonial = async (testimonialId: string): Promise<Testimonial> => {
        const response = await axiosInstance.put(`/testimonials/${testimonialId}/approve`);
        return response.data;
    };

    const rejectTestimonial = async (testimonialId: string): Promise<Testimonial> => {
        const response = await axiosInstance.put(`/testimonials/${testimonialId}/reject`);
        return response.data;
    };

    return {
        getAllTestimonials,
        getPublishedTestimonials,
        createTestimonial,
        approveTestimonial,
        rejectTestimonial
    };
}; 