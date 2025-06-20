
import React from 'react';

interface FooterProps {
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
}

const Footer: React.FC<FooterProps> = ({ isAdminMode, onToggleAdminMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 py-8 border-t border-gray-200 text-center">
      <p className="text-gray-600">&copy; {currentYear} FLIPPED KKQ - Platform Pembelajaran KKQ. Hak Cipta Terpelihara.</p>
      <p className="text-sm text-gray-500 mt-1">Dibangunkan dengan <i className="fas fa-heart text-red-500"></i> untuk Pendidikan Al-Quran.</p>
      <div className="mt-4">
        <button
          id="footer-admin-mode-button"
          onClick={onToggleAdminMode}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${
            isAdminMode 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'text-gray-500 hover:text-primary hover:bg-gray-100'
          }`}
        >
          {isAdminMode ? <><i className="fas fa-unlock mr-1"></i> Keluar Mod Admin</> : <><i className="fas fa-lock mr-1"></i> Mod Admin</>}
        </button>
      </div>
    </footer>
  );
};

export default Footer;