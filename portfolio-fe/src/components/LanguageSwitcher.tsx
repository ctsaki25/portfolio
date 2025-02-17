// import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    console.log('Language changed to:', newLang);
  };

  return (
    <button 
      onClick={toggleLanguage} 
      className="language-switcher"
      type="button"
    >
      {i18n.language === 'fr' ? 'EN' : 'FR'}
    </button>
  );
};

export default LanguageSwitcher;