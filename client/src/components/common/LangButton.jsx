import React from 'react'
import { useTranslation } from 'react-i18next';

const LangButton = () => {
    const { t, i18n } = useTranslation();
    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };
    const isLightNavbar = location.pathname === '/login' || location.pathname === '/guest-booking';
    return (
        <div className="flex items-center space-x-4">
            <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className={`p-1 ${isLightNavbar ? 'bg-white text-gray-700' : 'bg-blue-600 text-white'}`}
            >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
            </select>
        </div>
    )
}

export default LangButton