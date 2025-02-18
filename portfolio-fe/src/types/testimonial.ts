export interface Testimonial {
  testimonialId: string;
  name: string;
  title: string;
  content: string;
  stars: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialRequest {
  name: string;
  title: string;
  content: string;
  stars: number;
  author: string;
  role: string;
  company: string;
} 