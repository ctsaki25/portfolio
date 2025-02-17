import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  author: string;
  content: string;
  role: string;
  company: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema); 