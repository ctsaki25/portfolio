import { useEffect, useState, useRef } from "react";
import { Project } from "@/models/Project";
import { useProjectService } from "@/services/projectService";
import { Link } from 'react-router-dom';
import './Projects.css';
import '@/styles/hero.css';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config/api';

// Replace the BACKEND_URL constant with:
const BACKEND_URL = API_URL;

// Create a custom hook to manage project data and fetching
const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const projectService = useProjectService();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!isFirstLoad.current) return;
    
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getPublishedProjects();
        setProjects(response);
        isFirstLoad.current = false;
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array

  return {
    projects,
    loading,
    error,
    refreshProjects: async () => {
      try {
        setLoading(true);
        const response = await projectService.getPublishedProjects();
        setProjects(response);
      } catch (error) {
        console.error("Error refreshing projects:", error);
        setError("Failed to refresh projects");
      } finally {
        setLoading(false);
      }
    }
  };
};

const ProjectCard = ({ project }: { project: Project }) => {
  const { t } = useTranslation();
  
  return (
    <div key={project.projectId} className="project-card">
      {project.imageUrl && (
        <div className="project-image">
          <img 
            src={`${BACKEND_URL}/api${project.imageUrl}`} 
            alt={project.title}
          />
        </div>
      )}
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tech">
          <span>{t("Technologies Used")}:</span> {project.technologies}
        </div>
        <div className="project-links">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              {t("View Source")}
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              {t("View Live")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { projects, loading, error } = useProjects();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  if (loading) return <div className="loading">{t("Loading...")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <div className="heroContainer">
          <div className="heroContent">
            <div className="heroTextContent">
              <h1 className="heroTitle">
                <span>{t('Constantine Tsakiris')}</span>
                <span className="heroTitleHighlight">{t('Projects')}</span>
              </h1>
              <p className="heroDescription">
                {t('Explore my collection of projects showcasing my expertise in full-stack development, game development, and modern web applications.')}
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

      {/* Projects Section */}
      <div className="projects-page">
        <div className="projects-container">
          {projects.length === 0 ? (
            <p className="no-projects">{t("No projects found")}</p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))
          )}
        </div>
        <div className="admin-controls">
          {isAuthenticated && (
            <Link to="/admin/projects" className="admin-button">
              {t("Manage Projects")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;