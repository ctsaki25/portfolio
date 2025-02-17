import { useState, useEffect, useCallback } from 'react';
import { Testimonial } from '../../types/testimonial';
import { useTestimonialService } from '../../services/testimonialService';
import './AdminTestimonials.css';
import { useTranslation } from 'react-i18next';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const testimonialService = useTestimonialService();
  const { t } = useTranslation();

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAllTestimonials();
      setTestimonials(data);
      setError(null);
    } catch {
      setError('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, [testimonialService]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleApprove = async (id: string) => {
    try {
      await testimonialService.updateTestimonialStatus(id, true);
      await fetchTestimonials();
    } catch (err) {
      setError('Failed to approve testimonial');
      console.error(err);
    }
  };

  const handleDiscard = async (id: string) => {
    try {
      await testimonialService.updateTestimonialStatus(id, false);
      await fetchTestimonials();
    } catch (err) {
      setError('Failed to reject testimonial');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="admin-testimonials">Loading...</div>;
  }

  if (error) {
    return <div className="admin-testimonials error">{error}</div>;
  }

  return (
    <div className="admin-testimonials">
      <h2>{t('Manage Testimonials')}</h2>
      <button>{t('Add Testimonial')}</button>
      <div className="testimonials-list">
        {testimonials.map(testimonial => (
          <div key={testimonial.testimonialId} className="testimonial-card">
            <div className="testimonial-content">
              <p>{testimonial.content}</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role} at {testimonial.company}</span>
              </div>
              <div className="testimonial-status">
                Status: {testimonial.published ? 'Approved' : 'Pending'}
              </div>
            </div>
            <div className="testimonial-actions">
              {!testimonial.published && (
                <>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(testimonial.testimonialId)}
                  >
                    Approve
                  </button>
                  <button
                    className="discard-btn"
                    onClick={() => handleDiscard(testimonial.testimonialId)}
                  >
                    Discard
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials; 