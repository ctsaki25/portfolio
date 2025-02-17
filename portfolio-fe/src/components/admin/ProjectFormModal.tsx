import React, { useState } from 'react';
import { Project } from '@/models/Project';
import { useProjectService } from '@/services/projectService';
import './ProjectFormModal.css';

interface ProjectFormModalProps {
  project?: Project;
  onClose: () => void;
  onSubmit: (project: Project) => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ project, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    imageUrl: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    published: false,
    ...project
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(project?.imageUrl || '');

  const { createProject, updateProject } = useProjectService();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resizeImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = (base64: string) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = 560;
      canvas.height = 300;

      // Draw the image onto the canvas with resizing
      ctx.drawImage(img, 0, 0, 560, 300);

      // Convert back to base64
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.9);
      setPreviewUrl(resizedBase64);
      setFormData(prev => ({ ...prev, imageUrl: resizedBase64 }));
    };
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (project?.projectId) {
        await updateProject(project.projectId, formData, imageFile || undefined);
      } else {
        await createProject(formData, imageFile || undefined);
      }
      onSubmit(formData);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          <div className="image-upload-container">
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="preview-image" />
                <button type="button" className="remove-image" onClick={removeImage}>×</button>
              </>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <div className="upload-text">Drag and drop an image or click to browse</div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="technologies">Technologies</label>
            <input type="text" id="technologies" name="technologies" value={formData.technologies} onChange={e => setFormData({ ...formData, technologies: e.target.value })} required />
          </div>

          <div className="form-group">
            <label htmlFor="githubUrl">GitHub URL</label>
            <input type="url" id="githubUrl" name="githubUrl" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
          </div>

          <div className="form-group">
            <label htmlFor="liveUrl">Live Demo URL</label>
            <input type="url" id="liveUrl" name="liveUrl" value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} />
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit-button">{project ? 'Update' : 'Create'} Project</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
