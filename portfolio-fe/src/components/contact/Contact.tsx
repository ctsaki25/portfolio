import { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './contact.module.css';
import { API_URL_V1, API_URL } from '../../config/api';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const BACKEND_URL = API_URL;

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | ''>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    setErrorMessage('');

    try {
      console.log('Sending email to:', `${API_URL_V1}/email/send`);
      const response = await fetch(`${API_URL_V1}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        // Add a timeout to the fetch request
        signal: AbortSignal.timeout(15000) // 15 seconds timeout
      });

      const responseText = await response.text();
      console.log('Response from server:', responseText);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      if (error instanceof Error) {
        setErrorMessage(error.message.includes('AbortError') 
          ? 'Request timed out. The server may be temporarily unavailable.' 
          : error.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                <span>Constantine Tsakiris</span>
                <span className={styles.heroTitleHighlight}>{t("Get in Touch")}</span>
              </h1>
              <p className={styles.heroDescription}>
                {t("I'm always interested in hearing about new projects and opportunities. Feel free to reach out!")}
              </p>
              
              {/* Contact Information */}
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>{t("Email:")} </span>
                  <a 
                    href="mailto:ctsaki25@gmail.com" 
                    className={styles.contactLink}
                  >
                    ctsaki25@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.heroImageContainer}>
              <img 
                src={`${BACKEND_URL}/api/images/profile.webp`}
                alt={t("Constantine Tsakiris")}
                className={styles.profileImage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.label}>
                {t("Name")}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="email" className={styles.label}>
                {t("Email")}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label htmlFor="subject" className={styles.label}>
                {t("Subject")}
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label htmlFor="message" className={styles.label}>
                {t("Message")}
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className={styles.textarea}
              />
            </div>

            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? t("Sending...") : t("Send Message")}
              </button>

              {submitStatus === 'success' && (
                <div className={styles.success}>
                  {t("Message sent successfully! I'll get back to you soon.")}
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className={styles.error}>
                  {errorMessage || t("Failed to send message. Please try again or contact me directly at ctsaki25@gmail.com.")}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;