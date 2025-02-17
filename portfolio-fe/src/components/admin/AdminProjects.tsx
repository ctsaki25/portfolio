import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/models/Project';
import { useProjectService } from '@/services/projectService';
import './AdminProjects.css';
import ProjectFormModal from './ProjectFormModal';
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:8080';

const ProjectCard = ({ project, onPublishToggle, onDelete, onEdit }: {
  project: Project;
  onPublishToggle: (projectId: string, currentStatus: boolean) => void;
  onDelete: (projectId: string) => void;
  onEdit: (project: Project) => void;
}) => (
  <div className="project-card">
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
      <div className="project-tech">{project.technologies}</div>
      <div className="project-links">
        {project.githubUrl && (
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="live-link"
          >
            Live Demo
          </a>
        )}
      </div>
      <div className="project-actions">
        <button 
          className={`status-button ${project.published ? 'published' : 'draft'}`}
          onClick={() => onPublishToggle(project.projectId!, project.published)}
        >
          {project.published ? 'Unpublish' : 'Publish'}
        </button>
        <button 
          className="edit-button"
          onClick={() => onEdit(project)}
        >
          Edit
        </button>
        <button 
          className="delete-button"
          onClick={() => onDelete(project.projectId!)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const AdminProjects = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const projectService = useProjectService();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectService.getAdminProjects();
      setProjects(response);
      setError("");
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [projectService]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handlePublishToggle = async (projectId: string, currentStatus: boolean) => {
    try {
      await projectService.updateProjectStatus(projectId, !currentStatus);
      await fetchProjects();
    } catch (error) {
      console.error("Error updating project status:", error);
      setError("Failed to update project status. Please try again.");
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(projectId);
        await fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        setError("Failed to delete project. Please try again.");
      }
    }
  };

  const handleCreateProject = async (project: Project) => {
    try {
      await projectService.createProject(project);
      await fetchProjects();
      return true;
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project. Please try again.");
      return false;
    }
  };

  const handleUpdateProject = async (projectId: string, project: Project) => {
    try {
      await projectService.updateProject(projectId, project);
      await fetchProjects();
      return true;
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Failed to update project. Please try again.");
      return false;
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-projects">
      <div className="admin-header">
        <h1>Project Management</h1>
        <div className="admin-controls">
          <button 
            className="refresh-button"
            onClick={fetchProjects}
          >
            Refresh Projects
          </button>
          <button 
            className="add-project-button"
            onClick={() => setShowAddModal(true)}
          >
            Add New Project
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.projectId}
            project={project}
            onPublishToggle={handlePublishToggle}
            onDelete={handleDelete}
            onEdit={setEditingProject}
          />
        ))}
      </div>

      {showAddModal && (
        <ProjectFormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={async (project) => {
            const success = await handleCreateProject(project);
            if (success) setShowAddModal(false);
          }}
        />
      )}

      {editingProject && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSubmit={async (project) => {
            const success = await handleUpdateProject(editingProject.projectId!, project);
            if (success) setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProjects;