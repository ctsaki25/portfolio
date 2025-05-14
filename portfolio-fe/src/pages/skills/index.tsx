import React, { useState, useEffect, useCallback } from 'react';
import { Skill } from '@/models/Skill';
import { useSkillService } from '@/services/skillService';
import './SkillsPage.css'; // Create this CSS file for styling
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // For admin link if authenticated
import { useAuth } from '@/contexts/AuthContext'; // To show admin link

// PublicSkillCard component (can be moved to its own file if it grows larger)
const PublicSkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  const { t } = useTranslation();
  return (
    <div className="public-skill-card">
      <div className="public-skill-content">
        <h3 className="public-skill-name">{skill.name}</h3>
        <p className="public-skill-category">{t('Category')}: {t(skill.category)}</p>
        <p className="public-skill-level">{t('Level')}: {t(skill.level)}</p>
      </div>
    </div>
  );
};

const SkillsPage: React.FC = () => {
  const { t } = useTranslation();
  const skillService = useSkillService();
  const { isAuthenticated } = useAuth();

  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicSkills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await skillService.getPublicSkills();
      // Group skills by category
      const groupedSkills = data.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>);
      
      // Sort skills within each category by displayOrder, then by name
      for (const category in groupedSkills) {
        groupedSkills[category].sort((a, b) => {
          const orderA = a.displayOrder === undefined ? Infinity : a.displayOrder;
          const orderB = b.displayOrder === undefined ? Infinity : b.displayOrder;
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          return a.name.localeCompare(b.name);
        });
      }
      setSkillsByCategory(groupedSkills);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching public skills:", err);
      if (err instanceof Error) {
        setError(err.message || t('Failed to fetch skills'));
      } else {
        setError(t('An unknown error occurred while fetching skills'));
      }
    } finally {
      setLoading(false);
    }
  }, [skillService, t]);

  useEffect(() => {
    fetchPublicSkills();
  }, [fetchPublicSkills]);

  if (loading) {
    return <div className="loading-full-page">{t('Loading Skills...')}</div>;
  }

  if (error) {
    return <div className="error-full-page">{error}</div>;
  }

  const categories = Object.keys(skillsByCategory).sort(); // Sort categories alphabetically for display

  return (
    <div className="skills-page-container">
      <div className="hero-section skills-hero">
        <h1>{t('My Skills & Expertise')}</h1>
        <p>{t('A showcase of the technologies and competencies I work with.')}</p>
      </div>

      {categories.length === 0 && !loading && (
        <p className="no-skills-message">{t('No skills to display at the moment.')}</p>
      )}

      {categories.map(category => (
        <section key={category} className="skills-category-section">
          <h2>{t(category)}</h2>
          <div className="skills-grid">
            {skillsByCategory[category].map(skill => (
              <PublicSkillCard key={skill.skillId} skill={skill} />
            ))}
          </div>
        </section>
      ))}

      {isAuthenticated && (
        <div className="admin-management-link">
          <Link to="/admin/skills" className="admin-btn">{t('Manage Skills')}</Link>
        </div>
      )}
    </div>
  );
};

export default SkillsPage; 