import { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '@/models/Project';
import { useProjectService } from '@/services/projectService';
import './AdminProjects.css';
import ProjectFormModal from './ProjectFormModal';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

const BACKEND_URL = API_URL;

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
  const projectServiceRef = useRef(useProjectService());
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const initialFetchDoneRef = useRef(false);
  const operationInProgressRef = useRef(false);

  // Memoize fetchProjects to prevent unnecessary recreations
  const fetchProjects = useCallback(async () => {
    if (operationInProgressRef.current) return;
    
    try {
      operationInProgressRef.current = true;
      setLoading(true);
      const response = await projectServiceRef.current.getAdminProjects();
      setProjects(response);
      setError("");
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again later.");
    } finally {
      setLoading(false);
      operationInProgressRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      fetchProjects();
      initialFetchDoneRef.current = true;
    }
  }, [fetchProjects]);

  const handleCreateProject = async (project: Project, imageFile?: File) => {
    if (operationInProgressRef.current) return false;
    
    try {
      operationInProgressRef.current = true;
      const response = await projectServiceRef.current.createProject(project, imageFile);
      setProjects(prev => [...prev, response.data]);
      return true;
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project. Please try again.");
      fetchProjects();
      return false;
    } finally {
      operationInProgressRef.current = false;
    }
  };

  const handleUpdateProject = async (projectId: string, project: Project, imageFile?: File) => {
    if (operationInProgressRef.current) return false;
    
    try {
      operationInProgressRef.current = true;
      const updatedProject = await projectServiceRef.current.updateProject(projectId, project, imageFile);
      setProjects(prev => prev.map(p => p.projectId === projectId ? updatedProject : p));
      return true;
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Failed to update project. Please try again.");
      fetchProjects();
      return false;
    } finally {
      operationInProgressRef.current = false;
    }
  };

  const handlePublishToggle = async (projectId: string, currentStatus: boolean) => {
    if (operationInProgressRef.current) return;
    
    try {
      operationInProgressRef.current = true;
      const updatedProject = await projectServiceRef.current.updateProjectStatus(projectId, !currentStatus);
      // Optimistically update the local state
      setProjects(prev => prev.map(p => p.projectId === projectId ? updatedProject : p));
    } catch (error) {
      console.error("Error updating project status:", error);
      setError("Failed to update project status. Please try again.");
    } finally {
      operationInProgressRef.current = false;
      // Fetch to ensure consistency with backend
      fetchProjects();
    }
  };

  const handleDelete = async (projectId: string) => {
    if (operationInProgressRef.current) return;
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        operationInProgressRef.current = true;
        await projectServiceRef.current.deleteProject(projectId);
        // Optimistically update the local state
        setProjects(prev => prev.filter(p => p.projectId !== projectId));
      } catch (error) {
        console.error("Error deleting project:", error);
        setError("Failed to delete project. Please try again.");
      } finally {
        operationInProgressRef.current = false;
        // Fetch to ensure consistency with backend
        fetchProjects();
      }
    }
  };

  if (loading && projects.length === 0) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-projects">
      <div className="admin-header">
        <h1>Project Management</h1>
        <div className="admin-controls">
          <button 
            className="refresh-button"
            onClick={fetchProjects}
            disabled={operationInProgressRef.current}
          >
            Refresh Projects
          </button>
          <button 
            className="add-project-button"
            onClick={() => setShowAddModal(true)}
            disabled={operationInProgressRef.current}
          >
            Add New Project
          </button>
        </div>
      </div>

      {loading && <div className="loading-overlay">Updating projects...</div>}

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

      <div className="back-to-public">
        <Link to="/projects">Back to Public View</Link>
      </div>

      {showAddModal && (
        <ProjectFormModal
          onClose={() => {
            if (!operationInProgressRef.current) {
              setShowAddModal(false);
            }
          }}
          onSubmit={async (project, imageFile) => {
            if (operationInProgressRef.current) return;
            const success = await handleCreateProject(project, imageFile);
            if (success) setShowAddModal(false);
          }}
        />
      )}

      {editingProject && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => {
            if (!operationInProgressRef.current) {
              setEditingProject(null);
            }
          }}
          onSubmit={async (project, imageFile) => {
            if (operationInProgressRef.current) return;
            const success = await handleUpdateProject(editingProject.projectId!, project, imageFile);
            if (success) setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProjects;