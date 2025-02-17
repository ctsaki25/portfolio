export interface Testimonial {
  testimonialId: string;
  name: string;
  title: string;
  content: string;
  stars: number;
  author: string;
  role: string;
  company: string;
  published: boolean;
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