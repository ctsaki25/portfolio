import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Testimonial as TestimonialModel, TestimonialRequest } from '@/types/testimonial';
import { useTestimonialService } from '@/services/testimonialService';
import styles from './Testimonials.module.css';
import '@/styles/hero.css';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

const BACKEND_URL = API_URL;

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

const useTestimonials = () => {
    const [testimonials, setTestimonials] = useState<TestimonialModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const testimonialService = useTestimonialService();

    const fetchTestimonials = useCallback(async () => {
        try {
            setLoading(true);
            const response = await testimonialService.getPublishedTestimonials();
            setTestimonials(response);
            setError('');
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            setError("Failed to fetch testimonials");
        } finally {
            setLoading(false);
        }
    }, [testimonialService]);

    // Only fetch testimonials once when component mounts
    useEffect(() => {
        let mounted = true;

        const loadTestimonials = async () => {
            try {
                const response = await testimonialService.getPublishedTestimonials();
                if (mounted) {
                    setTestimonials(response);
                    setError('');
                }
            } catch (error) {
                if (mounted) {
                    console.error("Error fetching testimonials:", error);
                    setError("Failed to fetch testimonials");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadTestimonials();

        return () => {
            mounted = false;
        };
    }, [testimonialService]);

    return { testimonials, loading, error, refreshTestimonials: fetchTestimonials };
};

const Testimonials = () => {
    const { t } = useTranslation();
    const { testimonials, loading, error: fetchError, refreshTestimonials } = useTestimonials();
    const [showForm, setShowForm] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const testimonialService = useTestimonialService();
    const { isAuthenticated } = useAuth();

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
            alert(t("Thank you for your testimonial! It will be reviewed by an administrator."));
            refreshTestimonials();
        } catch (err) {
            console.error('Error submitting testimonial:', err);
            setSubmitError('Failed to submit testimonial');
        }
    };

    if (loading) return <div className={styles.loading}>{t("Loading...")}</div>;
    if (fetchError || submitError) return <div className={styles.error}>{fetchError || submitError}</div>;

    return (
        <div className={styles.container}>
            <div className="hero">
                <div className="heroContainer">
                    <div className="heroContent">
                        <div className="heroTextContent">
                            <h1 className="heroTitle">
                                <span>{t('Constantine Tsakiris')}</span>
                                <span className="heroTitleHighlight">{t('Client Testimonials')}</span>
                            </h1>
                            <p className="heroDescription">
                                {t('Read what clients and colleagues have to say about their experiences working with me.')}
                            </p>
                        </div>
                        <div className="heroImageContainer">
                            <img 
                                src={`${BACKEND_URL}/api/images/profile.webp`}
                                alt={t("Constantine Tsakiris")}
                                className="profileImage"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.testimonialsSection}>
                <div className={styles.controls}>
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className={styles.addButton}
                    >
                        {showForm ? t("Cancel") : t("Leave a Testimonial")}
                    </button>
                </div>

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

                {isAuthenticated && (
                    <div className={styles.adminControls}>
                        <Link 
                            to="/admin/testimonials" 
                            className={styles.adminButton}
                        >
                            {t("Manage Testimonials")}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Testimonials; 