import { useAxiosInstance } from "../utils/axiosInstance";
import { Testimonial } from "../types/testimonial";
import { AxiosResponse } from "axios";

interface TestimonialRequest {
    author: string;
    content: string;
    role: string;
    company: string;
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

    const createTestimonial = async (testimonial: TestimonialRequest): Promise<AxiosResponse<Testimonial>> => {
        return await axiosInstance.post<Testimonial>("/testimonials", testimonial);
    };

    const updateTestimonialStatus = async (testimonialId: string, approved: boolean): Promise<Testimonial> => {
        const response = await axiosInstance.put<Testimonial>(
            `/testimonials/${testimonialId}/${approved ? 'approve' : 'reject'}`
        );
        return response.data;
    };

    return {
        getAllTestimonials,
        getPublishedTestimonials,
        createTestimonial,
        updateTestimonialStatus
    };
}; 