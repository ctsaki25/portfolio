import 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Testimonial } from '../../types/testimonial';
import { useTestimonialService } from '../../services/testimonialService';
import './AdminTestimonials.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TestimonialCard = ({ testimonial, onApprove, onReject, onDelete, disabled }: {
  testimonial: Testimonial;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
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
        <div className="testimonial-actions">
          {!testimonial.approved && (
            <>
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
            </>
          )}
          <button
            className="delete-btn"
            onClick={() => onDelete(testimonial.testimonialId)}
            disabled={disabled}
          >
            {t('Delete')}
          </button>
        </div>
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
    if (operationInProgressRef.current && loading) return; // Prevent re-entry if already fetching/operating
    
    operationInProgressRef.current = true;
    setLoading(true);
    try {
      const data = await testimonialServiceRef.current.getAdminTestimonials();
      setTestimonials(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError(t('Failed to fetch testimonials'));
    } finally {
      setLoading(false);
      operationInProgressRef.current = false;
    }
  }, [t, loading]); // Added loading to useCallback dependencies

  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      fetchTestimonials();
      initialFetchDoneRef.current = true;
    }
  }, [fetchTestimonials]);

  const handleApprove = async (id: string) => {
    if (operationInProgressRef.current) return;
    
    operationInProgressRef.current = true;
    setLoading(true);
    try {
      const updatedTestimonial = await testimonialServiceRef.current.approveTestimonial(id);
      setTestimonials(prev => 
        prev.map(t => t.testimonialId === id ? updatedTestimonial : t)
      );
      setError(null);
    } catch (err) {
      console.error("Error approving testimonial:", err);
      setError(t('Failed to approve testimonial'));
    } finally {
      setLoading(false);
      operationInProgressRef.current = false;
      fetchTestimonials(); // Re-fetch for consistency
    }
  };

  const handleReject = async (id: string) => {
    if (operationInProgressRef.current) return;
    
    operationInProgressRef.current = true;
    setLoading(true);
    try {
      const updatedTestimonial = await testimonialServiceRef.current.rejectTestimonial(id);
      setTestimonials(prev => 
        prev.map(t => t.testimonialId === id ? updatedTestimonial : t)
      );
      setError(null);
    } catch (err) {
      console.error("Error rejecting testimonial:", err);
      setError(t('Failed to reject testimonial'));
    } finally {
      setLoading(false);
      operationInProgressRef.current = false;
      fetchTestimonials(); // Re-fetch for consistency
    }
  };

  const handleDelete = async (id: string) => {
    if (operationInProgressRef.current) return;

    // eslint-disable-next-line no-alert
    if (window.confirm(t('Are you sure you want to delete this testimonial?'))) {
      operationInProgressRef.current = true;
      setLoading(true);
      try {
        await testimonialServiceRef.current.deleteTestimonial(id);
        setTestimonials(prev => prev.filter(t => t.testimonialId !== id));
        setError(null);
      } catch (err) {
        console.error("Error deleting testimonial:", err);
        setError(t('Failed to delete testimonial'));
      } finally {
        setLoading(false);
        operationInProgressRef.current = false;
        fetchTestimonials(); // Re-fetch for consistency
      }
    }
  };

  if (loading && testimonials.length === 0 && initialFetchDoneRef.current) { // Adjusted loading condition
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
          onClick={fetchTestimonials} // Keep this direct call
          disabled={loading} // Disable if loading (which operationInProgressRef also implies via fetchTestimonials)
        >
          {t('Refresh Testimonials')}
        </button>
        <button 
          className="add-testimonial-button"
          disabled={loading} // Disable if loading
        >
          {t('Add Testimonial')}
        </button>
      </div>
      {loading && testimonials.length > 0 && <div className="loading-overlay">{t('Updating testimonials...')}</div>}
      <div className="testimonials-list">
        {testimonials.map(testimonial => (
          <TestimonialCard
            key={testimonial.testimonialId}
            testimonial={testimonial}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            disabled={loading} // Disable card buttons if loading
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