import { useState } from 'react';
import classes from './navbar.module.css';
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from "@mantine/core";
import { useTranslation } from 'react-i18next';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'EN' ? 'FR' : 'EN');
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/CV_Tsakiris.pdf'; // CV should be placed in the public folder
    link.download = 'Tsakiris_CV.pdf'; // Change this to your preferred filename
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
            <button onClick={toggleLanguage} className={classes.navLink}>
              {currentLanguage}
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
            <button className={classes.cvButton} onClick={handleDownloadCV}>
              CV
            </button>
            {isAuthenticated ? (
              <div className={classes.authContainer}>
                <Avatar 
                  src={user?.picture} 
                  alt={user?.name || ""} 
                  radius="xl"
                  size="sm"
                  className={classes.avatar}
                />
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className={`${classes.navLink} ${classes.logoutButton}`}
                >
                  {t('Log Out')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className={`${classes.navLink} ${classes.loginButton}`}
              >
                {t('Log In')}
              </button>
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
            <button onClick={toggleLanguage} className={classes.mobileMenuItem}>
              {currentLanguage}
            </button>
            {isAuthenticated ? (
              <>
                <div className={`${classes.mobileMenuItem} ${classes.userInfo}`}>
                  <Avatar 
                    src={user?.picture} 
                    alt={user?.name || ""} 
                    radius="xl"
                    size="sm"
                  />
                  <span>{user?.name}</span>
                </div>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className={classes.mobileMenuItem}
                >
                  {t('Log Out')}
                </button>
              </>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className={classes.mobileMenuItem}
              >
                {t('Log In')}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
