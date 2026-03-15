import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcherComponent: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.substring(0, 2) || 'ru';

  const toggleLanguage = () => {
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${className}`}
      aria-label="Switch language"
    >
      <span className={currentLang === 'ru' ? 'text-gray-900' : 'text-gray-400'}>RU</span>
      <span className="text-gray-300">/</span>
      <span className={currentLang === 'en' ? 'text-gray-900' : 'text-gray-400'}>EN</span>
    </button>
  );
};

export const LanguageSwitcher = memo(LanguageSwitcherComponent);
