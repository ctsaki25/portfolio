import { useEffect, useState, useRef, useCallback } from "react";
import { Project } from "@/models/Project";
import { useProjectService } from "@/services/projectService";
import { useTranslation } from "react-i18next";
import styles from './home.module.css';

const BACKEND_URL = 'http://localhost:8080'; 

// Properly type the ProjectCard component
const ProjectCard = ({ project }: { project: Project }) => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectInfo}>
        <div className={styles.projectHeader}>{project.title}</div>
        <div className={styles.projectDetails}>
          <div className={styles.projectDescription}>{project.description}</div>
          <div className={styles.projectTech}>
            <span>{t("Technologies Used")}:</span> {project.technologies}
          </div>
          <div className={styles.projectLinks}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectLink}
              >
                {t("View Source")}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectLink}
              >
                {t("View Live")}
              </a>
            )}
          </div>
        </div>
      </div>
      {project.imageUrl && (
        <div className={styles.projectImage}>
          <img
            src={`${BACKEND_URL}/api${project.imageUrl}`}
            alt={project.title}
            className={styles.projectImg}
          />
        </div>
      )}
    </div>
  );
};

const useHomeProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const projectService = useProjectService();
  const isFirstLoad = useRef(true);

  const fetchProjects = useCallback(async () => {
    if (!isFirstLoad.current) return;
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
  }, [projectService]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error };
};

const Home = () => {
  const { t } = useTranslation();
  const { projects, loading, error } = useHomeProjects();

  const renderContent = () => {
    if (loading) return <div className={styles.loading}>{t("Loading...")}</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (projects.length === 0) return <div className={styles.noProjects}>{t("No projects found")}</div>;

    return (
      <div className={styles.projectsContainer}>
        {projects.map((project) => (
          <ProjectCard key={project.projectId} project={project} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextContent}>
              <h1 className={styles.heroTitle}>
                <span>{t("Constantine Tsakiris")}</span>
                <span className={styles.heroTitleHighlight}>{t("IT Professional")}</span>
              </h1>
              <p className={styles.heroDescription}>
                {t("Professional Bio")}
              </p>
              <div className={styles.buttonContainer}>
                <a href="/contact" className={styles.primaryButton}>
                  {t("Contact Me")}
                </a>
                <a href="/testimonials" className={styles.secondaryButton}>
                  {t("View Testimonials")}
                </a>
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

      {/* Projects Section */}
      <div className={styles.projectsSection}>
        <h2 className={styles.sectionTitle}>{t("Featured Projects")}</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;