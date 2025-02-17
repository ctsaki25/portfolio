import { Request, Response } from 'express';
import { Testimonial } from '../models/testimonial';

export class TestimonialsController {
  async getAll(req: Request, res: Response) {
    try {
      const testimonials = await Testimonial.find().sort({ createdAt: -1 });
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  }

  async create(req: Request, res: Response) {
    const { author, content, role, company } = req.body;
    
    try {
      const testimonial = new Testimonial({
        author,
        content,
        role,
        company,
        isApproved: false
      });
      
      const savedTestimonial = await testimonial.save();
      res.status(201).json(savedTestimonial);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create testimonial' });
    }
  }

  async approve(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { isApproved: true },
        { new: true }
      );
      
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: 'Failed to approve testimonial' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
      const testimonial = await Testimonial.findByIdAndDelete(id);
      
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete testimonial' });
    }
  }
} 