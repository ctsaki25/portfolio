import React, { useState, useEffect, FormEvent } from 'react';
import { Skill, SkillRequest } from '@/models/Skill';
import './SkillFormModal.css'; // Changed import
import { useTranslation } from 'react-i18next';

interface SkillFormModalProps {
  skill?: Skill; // For editing an existing skill
  onClose: () => void;
  onSubmit: (skillRequest: SkillRequest) => Promise<boolean>; // Removed imageFile from signature
}

const SkillFormModal: React.FC<SkillFormModalProps> = ({ skill, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(skill?.name || '');
  const [level, setLevel] = useState(skill?.level || 'Intermediate');
  const [category, setCategory] = useState(skill?.category || 'Technical');
  const [displayOrder, setDisplayOrder] = useState<number>(skill?.displayOrder || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const skillCategories = ["Frontend", "Backend", "Database", "DevOps", "Mobile", "Testing", "Soft Skill", "Other"];

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setLevel(skill.level);
      setCategory(skill.category);
      setDisplayOrder(skill.displayOrder || 0);
    } else {
      // Reset form for new skill
      setName('');
      setLevel('Intermediate');
      setCategory('Technical');
      setDisplayOrder(0);
    }
  }, [skill]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('Skill name is required'));
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const skillRequest: SkillRequest = {
      name,
      level,
      category,
      displayOrder,
    };

    try {
      const success = await onSubmit(skillRequest); // Removed imageFile
      if (success) {
        onClose();
      }
    } catch (apiError: unknown) { // Catching API error from the onSubmit handler
      if (apiError instanceof Error) {
        setError(apiError.message || t('Failed to save skill. Please try again.'));
      } else {
        setError(t('An unknown error occurred while trying to save the skill.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <h2>{skill ? t('Edit Skill') : t('Add New Skill')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="skillName">{t('Skill Name')}:</label>
            <input
              id="skillName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="skillLevel">{t('Level')}:</label>
            <select
              id="skillLevel"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={isSubmitting}
            >
              {skillLevels.map(lvl => <option key={lvl} value={lvl}>{t(lvl)}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="skillCategory">{t('Category')}:</label>
            <select
              id="skillCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              {skillCategories.map(cat => <option key={cat} value={cat}>{t(cat)}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="displayOrder">{t('Display Order')}:</label>
            <input
              id="displayOrder"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? t('Submitting...') : (skill ? t('Update Skill') : t('Create Skill'))}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              {t('Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillFormModal; 