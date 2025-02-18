import 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Testimonial } from '../../types/testimonial';
import { useTestimonialService } from '../../services/testimonialService';
import './AdminTestimonials.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TestimonialCard = ({ testimonial, onApprove, onReject, disabled }: {
  testimonial: Testimonial;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  disabled: boolean;
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="testimonial-card">
      <div className="testimonial-content">
        <div className="testimonial-header">
          <div className="testimonial-meta">
            <strong>{testimonial.name}</strong>
            <span>{testimonial.title}</span>
          </div>
          <div className="testimonial-rating">
            {'⭐'.repeat(testimonial.stars)}
          </div>
        </div>
        <p className="testimonial-text">{testimonial.content}</p>
        <div className="testimonial-status">
          {testimonial.approved ? t('Status: Approved') : t('Status: Pending Review')}
        </div>
        {!testimonial.approved && (
          <div className="testimonial-actions">
            <button
              className="approve-btn"
              onClick={() => onApprove(testimonial.testimonialId)}
              disabled={disabled}
            >
              {t('Approve')}
            </button>
            <button
              className="reject-btn"
              onClick={() => onReject(testimonial.testimonialId)}
              disabled={disabled}
            >
              {t('Reject')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminTestimonials = () => {
  const testimonialServiceRef = useRef(useTestimonialService());
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const initialFetchDoneRef = useRef(false);
  const operationInProgressRef = useRef(false);

  const fetchTestimonials = useCallback(async () => {
    if (operationInProgressRef.current) return;
    
    try {
      operationInProgressRef.current = true;
      setLoading(true);
      const data = await testimonialServiceRef.current.getAllTestimonials();
      setTestimonials(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError('Failed to fetch testimonials');
    } finally {
      setLoading(false);
      operationInProgressRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      fetchTestimonials();
      initialFetchDoneRef.current = true;
    }
  }, [fetchTestimonials]);

  const handleApprove = async (id: string) => {
    if (operationInProgressRef.current) return;
    
    try {
      operationInProgressRef.current = true;
      const updatedTestimonial = await testimonialServiceRef.current.approveTestimonial(id);
      // Optimistically update the UI
      setTestimonials(prev => 
        prev.map(t => t.testimonialId === id ? updatedTestimonial : t)
      );
    } catch (err) {
      console.error("Error approving testimonial:", err);
      setError('Failed to approve testimonial');
      // Only fetch on error to ensure consistency
      fetchTestimonials();
    } finally {
      operationInProgressRef.current = false;
    }
  };

  const handleReject = async (id: string) => {
    if (operationInProgressRef.current) return;
    
    try {
      operationInProgressRef.current = true;
      const updatedTestimonial = await testimonialServiceRef.current.rejectTestimonial(id);
      // Optimistically update the UI
      setTestimonials(prev => 
        prev.map(t => t.testimonialId === id ? updatedTestimonial : t)
      );
    } catch (err) {
      console.error("Error rejecting testimonial:", err);
      setError('Failed to reject testimonial');
      // Only fetch on error to ensure consistency
      fetchTestimonials();
    } finally {
      operationInProgressRef.current = false;
    }
  };

  if (loading && testimonials.length === 0) {
    return <div className="loading">{t('Loading testimonials...')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-testimonials">
      <div className="admin-header">
        <h2>{t('Manage Testimonials')}</h2>
      </div>
      <div className="admin-controls">
        <button 
          className="refresh-button"
          onClick={fetchTestimonials}
          disabled={operationInProgressRef.current}
        >
          {t('Refresh Testimonials')}
        </button>
        <button 
          className="add-testimonial-button"
          disabled={operationInProgressRef.current}
        >
          {t('Add Testimonial')}
        </button>
      </div>
      {loading && <div className="loading-overlay">{t('Updating testimonials...')}</div>}
      <div className="testimonials-list">
        {testimonials.map(testimonial => (
          <TestimonialCard
            key={testimonial.testimonialId}
            testimonial={testimonial}
            onApprove={handleApprove}
            onReject={handleReject}
            disabled={operationInProgressRef.current}
          />
        ))}
      </div>
      <div className="back-to-public">
        <Link to="/testimonials">{t('Back to Public View')}</Link>
      </div>
    </div>
  );
};

export default AdminTestimonials; 