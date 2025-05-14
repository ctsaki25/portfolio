import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Skill, SkillRequest } from '@/models/Skill';
import { useSkillService } from '@/services/skillService';
import SkillFormModal from './SkillFormModal';
import './AdminSkills.css'; // Assuming generic CSS for admin pages, or create AdminSkills.css
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // For a potential link back to public skills page

// SkillCard component (can be moved to its own file if it grows larger)
const SkillCard: React.FC<{
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
  disabled: boolean;
}> = ({ skill, onEdit, onDelete, disabled }) => {
  const { t } = useTranslation();
  return (
    <div className="admin-card">
      <div className="admin-card-content">
        <h3 className="admin-card-title">{skill.name}</h3>
        <p>{t('Category')}: {skill.category}</p>
        <p>{t('Level')}: {skill.level}</p>
        <p>{t('Order')}: {skill.displayOrder}</p>
      </div>
      <div className="admin-card-actions">
        <button className="edit-btn" onClick={() => onEdit(skill)} disabled={disabled}>{t('Edit')}</button>
        <button className="delete-btn" onClick={() => onDelete(skill.skillId)} disabled={disabled}>{t('Delete')}</button>
      </div>
    </div>
  );
};

const AdminSkills: React.FC = () => {
  const { t } = useTranslation();
  const skillService = useSkillService();
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  
  const operationInProgressRef = useRef(false); // To prevent concurrent operations

  const fetchSkills = useCallback(async () => {
    if (operationInProgressRef.current && loading) return;

    operationInProgressRef.current = true;
    setLoading(true);
    try {
      const data = await skillService.getAdminSkills();
      setSkills(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching skills:", err);
      setError(err.message || t('Failed to fetch skills'));
    } finally {
      setLoading(false);
      operationInProgressRef.current = false;
    }
  }, [skillService, t, loading]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleModalSubmit = async (skillRequest: SkillRequest): Promise<boolean> => {
    if (operationInProgressRef.current) return false;

    operationInProgressRef.current = true;
    setLoading(true); // Show general loading for modal submission
    setError(null);
    let success = false;
    try {
      if (editingSkill) {
        await skillService.updateSkill(editingSkill.skillId, skillRequest);
        // Optionally update local state immediately or rely on fetchSkills in finally
      } else {
        await skillService.createSkill(skillRequest);
        // Optionally update local state or rely on fetchSkills
      }
      success = true;
    } catch (err: any) {
      console.error("Error saving skill:", err);
      setError(err.message || t('Failed to save skill'));
      success = false;
    } finally {
      setShowModal(false);
      setEditingSkill(null);
      setLoading(false);
      operationInProgressRef.current = false;
      if(success) fetchSkills(); // Fetch skills again on success to show changes
    }
    return success;
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (operationInProgressRef.current) return;

    if (window.confirm(t('Are you sure you want to delete this skill?'))) {
      operationInProgressRef.current = true;
      setLoading(true);
      setError(null);
      try {
        await skillService.deleteSkill(skillId);
        // Optionally update local state or rely on fetchSkills
      } catch (err: any) {
        console.error(`Error deleting skill ${skillId}:`, err);
        setError(err.message || t('Failed to delete skill'));
      } finally {
        setLoading(false);
        operationInProgressRef.current = false;
        fetchSkills(); // Always fetch after delete attempt
      }
    }
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setShowModal(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setShowModal(true);
  };

  if (loading && skills.length === 0) {
    return <div className="loading">{t('Loading skills...')}</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header-controls">
        <h1>{t('Manage Skills')}</h1>
        <button className="add-new-btn" onClick={openAddModal} disabled={loading || operationInProgressRef.current}>
          {t('Add New Skill')}
        </button>
        <button className="refresh-btn" onClick={fetchSkills} disabled={loading || operationInProgressRef.current}>
          {t('Refresh Skills')}
        </button>
      </div>

      {error && <p className="error-message page-error">{error}</p>}
      
      {(loading && skills.length > 0) && <div className="loading-overlay">{t('Updating skills...')}</div>}

      <div className="admin-grid-container">
        {skills.map(skill => (
          <SkillCard 
            key={skill.skillId} 
            skill={skill} 
            onEdit={openEditModal} 
            onDelete={handleDeleteSkill}
            disabled={loading || operationInProgressRef.current}
          />
        ))}
      </div>

      {showModal && (
        <SkillFormModal 
          skill={editingSkill || undefined} 
          onClose={() => {
            if (!operationInProgressRef.current) { // Prevent closing if an operation triggered by modal is still running elsewhere
                 setShowModal(false); setEditingSkill(null);
            }
          }} 
          onSubmit={handleModalSubmit} 
        />
      )}
      {/* Optional: Link to public skills page */}
      {/* <div className="back-to-public-link"><Link to="/skills">{t('View Public Skills Page')}</Link></div> */}
    </div>
  );
};

export default AdminSkills; 