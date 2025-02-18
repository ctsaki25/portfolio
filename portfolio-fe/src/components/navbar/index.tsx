import { useState } from 'react';
import classes from './navbar.module.css';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/CV_Tsakiris.pdf';
    link.download = 'Tsakiris_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className={classes.nav}>
      <div className={classes.navContainer}>
        <div className={classes.navContent}>
          {/* Logo/Brand */}
          <a href="/" className={classes.logo}>
            <h2>{t('Home')}</h2>
          </a>

          {/* Desktop Navigation */}
          <div className={classes.desktopNav}>
            <button className={classes.cvButton} onClick={handleDownloadCV}>
              CV
            </button>
            <a href="/projects" className={classes.navLink}>
              {t('Projects')}
            </a>
            <a href="/skills" className={classes.navLink}>
              {t('Skills')}
            </a>
            <a href="/testimonials" className={classes.navLink}>
              {t('Testimonials')}
            </a>
            <a href="/contact" className={classes.navLink}>
              {t('Contact')}
            </a>
            {isAuthenticated ? (
              <button onClick={logout} className={classes.navLink}>
                {t('Logout')}
              </button>
            ) : (
              <Link to="/login" className={classes.navLink}>
                {t('Login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={classes.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '×' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={classes.mobileMenu}>
            <a href="/projects" className={classes.mobileMenuItem}>
              {t('Projects')}
            </a>
            <a href="/skills" className={classes.mobileMenuItem}>
              {t('Skills')}
            </a>
            <a href="/testimonials" className={classes.mobileMenuItem}>
              {t('Testimonials')}
            </a>
            <a href="/contact" className={classes.mobileMenuItem}>
              {t('Contact')}
            </a>
            <button className={classes.mobileMenuItem} onClick={handleDownloadCV}>
              CV
            </button>
            {isAuthenticated ? (
              <button onClick={logout} className={classes.mobileMenuItem}>
                {t('Logout')}
              </button>
            ) : (
              <Link to="/login" className={classes.mobileMenuItem}>
                {t('Login')}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
