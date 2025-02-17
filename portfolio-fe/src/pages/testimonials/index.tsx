import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Testimonial as TestimonialModel, TestimonialRequest } from '@/types/testimonial';
import { useTestimonialService } from '@/services/testimonialService';
import styles from './Testimonials.module.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const TestimonialForm = ({ onSubmit }: { onSubmit: (testimonial: { name: string, title: string, content: string, stars: number }) => void }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [stars, setStars] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, title, content, stars });
        setName('');
        setTitle('');
        setContent('');
        setStars(5);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.testimonialForm}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("Your Name")}
                required
                className={styles.input}
            />
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("Your Title")}
                required
                className={styles.input}
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("Your Testimonial")}
                required
                className={styles.textarea}
            />
            <div className={styles.starsInput}>
                <label>{t("Rating:")}</label>
                <select 
                    value={stars} 
                    onChange={(e) => setStars(Number(e.target.value))}
                    className={styles.select}
                >
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} ⭐</option>
                    ))}
                </select>
            </div>
            <button type="submit" className={styles.submitButton}>
                {t("Submit Testimonial")}
            </button>
        </form>
    );
};

const Testimonials = () => {
    const { t } = useTranslation();
    const [testimonials, setTestimonials] = useState<TestimonialModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    const testimonialService = useTestimonialService();
    const { isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();

    const fetchTestimonials = useCallback(async () => {
        try {
            console.log('Fetching testimonials...');
            const data = await testimonialService.getPublishedTestimonials();
            console.log('Received testimonials:', data);
            if (!data || data.length === 0) {
                console.log('No testimonials received from backend');
            }
            setTestimonials(data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading testimonials:', err);
            setError('Failed to load testimonials');
            setLoading(false);
        }
    }, [testimonialService]);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const handleSubmitTestimonial = async (testimonial: { name: string, title: string, content: string, stars: number }) => {
        try {
            const newTestimonial: TestimonialRequest = {
                name: testimonial.name,
                title: testimonial.title,
                content: testimonial.content,
                stars: testimonial.stars,
                author: testimonial.name,
                role: testimonial.title,
                company: ''
            };
            await testimonialService.createTestimonial(newTestimonial);
            setShowForm(false);
            // Show success message
            alert(t("Thank you for your testimonial! It will be reviewed by an administrator."));
        } catch (err) {
            console.error('Error submitting testimonial:', err);
            setError('Failed to submit testimonial');
        }
    };

    const isAdmin = () => {
        return isAuthenticated && 
            user && 
            user['https://tsakirisportfolio.ca.auth0.com/api/v2/']?.includes('admin');
    };

    const handleAdminClick = () => {
        navigate('/admin/testimonials');
    };

    if (loading) return <div className={styles.loading}>{t("Loading...")}</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <div className="hero">
                <div className="heroContainer">
                    <div className="heroContent">
                        <div className="heroTextContent">
                            <h1 className="heroTitle">
                                <span>Constantine Tsakiris</span>
                                <span className="heroTitleHighlight">{t("Client Testimonials")}</span>
                            </h1>
                            {isAdmin() && (
                                <button 
                                    onClick={handleAdminClick}
                                    className={styles.adminButton}
                                >
                                    {t("Manage Testimonials")}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className={styles.testimonialsSection}>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={styles.addButton}
                >
                    {showForm ? t("Cancel") : t("Leave a Testimonial")}
                </button>

                {showForm && (
                    <TestimonialForm onSubmit={handleSubmitTestimonial} />
                )}

                <div className={styles.testimonialsGrid}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.testimonialId} className={styles.testimonialCard}>
                            <div className={styles.testimonialContent}>
                                <div className={styles.testimonialHeader}>
                                    <h3 className={styles.testimonialName}>{testimonial.name}</h3>
                                    <div className={styles.stars}>
                                        {'⭐'.repeat(testimonial.stars)}
                                    </div>
                                    <p className={styles.testimonialTitle}>{testimonial.title}</p>
                                </div>
                                <p className={styles.testimonialText}>{testimonial.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials; 