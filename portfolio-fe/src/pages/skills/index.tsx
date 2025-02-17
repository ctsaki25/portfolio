import { useTranslation } from "react-i18next";
import styles from './Skills.module.css';
import { Award, Code, Wrench, Languages } from 'lucide-react';

interface SkillCategory {
  category: string;
  icon: React.ReactElement;
  items: string[];
}

const Skills = () => {
  const { t } = useTranslation();

  const skills: SkillCategory[] = [
    {
      category: t("Certificates"),
      icon: <Award size={24} />,
      items: [
        t("AWS Certified Cloud Practitioner"),
        t("Oracle Certified Associate, Java SE 8 Programmer"),
        t("Microsoft Azure Fundamentals AZ-900")
      ]
    },
    {
      category: t("Coding Languages"),
      icon: <Code size={24} />,
      items: [
        "Java",
        "TypeScript",
        "JavaScript",
        "Python",
        "SQL",
        "HTML/CSS"
      ]
    },
    {
      category: t("Tools & Frameworks"),
      icon: <Wrench size={24} />,
      items: [
        "Spring Boot",
        "React",
        "Angular",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "Git",
        "Docker",
        "AWS",
        "Azure"
      ]
    },
    {
      category: t("Spoken Languages"),
      icon: <Languages size={24} />,
      items: [
        t("English (Fluent)"),
        t("French (Intermediate)"),
        t("Greek (Native)")
      ]
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className="hero">
        <div className="heroContainer">
          <div className="heroContent">
            <div className="heroTextContent">
              <h1 className="heroTitle">
                <span>{t("Constantine Tsakiris")}</span>
                <span className="heroTitleHighlight">{t("Skills & Expertise")}</span>
              </h1>
              <p className={styles.heroDescription}>
                {t("Technical Overview")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className={styles.skillsSection}>
        <div className={styles.skillsContainer}>
          {skills.map((skillGroup, index) => (
            <div key={index} className={styles.skillGroup}>
              <div className={styles.skillGroupHeader}>
                {skillGroup.icon}
                <h2 className={styles.skillGroupTitle}>{skillGroup.category}</h2>
              </div>
              <div className={styles.skillsList}>
                {skillGroup.items.map((skill, skillIndex) => (
                  <div key={skillIndex} className={styles.skillItem}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills; 