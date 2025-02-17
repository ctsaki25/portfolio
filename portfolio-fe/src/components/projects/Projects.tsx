import { useEffect, useState, useCallback } from "react";
import { Project } from "@/models/Project";
import { useProjectService } from "@/services/projectService";
import { Link } from 'react-router-dom';
import './Projects.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from 'react-i18next';

// Add this constant at the top of the file
const BACKEND_URL = 'http://localhost:8080';

// Create a custom hook to manage project data and fetching
const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const projectService = useProjectService();
  const { t } = useTranslation();

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchProjects = useCallback(async (force: boolean = false) => {
    // Only fetch if forced or if it's been more than 5 minutes since last fetch
    const now = Date.now();
    if (!force && lastFetchTime && now - lastFetchTime < 300000) {
      return;
    }

    try {
      setLoading(true);
      const response = await projectService.getPublishedProjects();
      
      if (Array.isArray(response)) {
        setProjects(response);
        setLastFetchTime(now);
        setError("");
      } else {
        setError(t("Failed to load projects: Data format incorrect"));
      }
    } catch (error) {
      console.error(t("Error fetching projects:"), error);
      setError(t("Failed to fetch projects: {{error}}", { error }));
    } finally {
      setLoading(false);
    }
  }, [projectService, lastFetchTime, t]);

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects: () => fetchProjects(true)
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
  const { projects, loading, error, refreshProjects } = useProjects();
  const { isAuthenticated, user } = useAuth0();
  const { t } = useTranslation();
  
  const isAdmin = isAuthenticated && 
    user?.['https://tsakirisportfolio.ca.auth0.com/roles']?.includes('Admin');

  if (loading) return <div className="loading">{t("Loading...")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <div className="heroContainer">
          <div className="heroContent">
            <h1 className="heroTitle">
              <span>Constantine Tsakiris</span>
              <span className="heroTitleHighlight">{t("My Projects")}</span>
            </h1>
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
          <button onClick={refreshProjects} className="refresh-button">
            {t("Refresh Projects")}
          </button>
          {isAdmin && (
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