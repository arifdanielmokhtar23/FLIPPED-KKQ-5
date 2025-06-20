
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { SectionId } from '../types';

interface NavigationBarProps {
  currentSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentSection, onNavigate }) => {
  // Special handling for "Modul Auditori" which should highlight 'home' but could be a conceptual group
  const getEffectiveSection = (navItemId: SectionId, currentActualSection: SectionId) => {
    if (navItemId === 'home' && (currentActualSection === 'bayyati-content' || currentActualSection === 'hijaz-content' || currentActualSection === 'nahawand-content')) {
      return currentActualSection; // For highlighting logic if cards under home lead to sub-pages.
    }
    // The second 'Modul Auditori' button has id 'home'. If currentSection is one of the auditori content pages, 'home' should be active.
    if (navItemId === 'home' && ['bayyati-content', 'hijaz-content', 'nahawand-content'].includes(currentActualSection)) {
        return 'home'; // This makes 'HALAMAN UTAMA' and 'MODUL AUDITORI' (which points to home) active
    }
    return navItemId;
  }


  return (
    <nav className="mb-12">
      <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
        {NAV_ITEMS.map((item, index) => {
          // Distinguish the two 'home' items by their label for conceptual grouping.
          // The actual navigation target is item.id
          const isActive = item.label === 'MODUL AUDITORI' ? ['home', 'bayyati-content', 'hijaz-content', 'nahawand-content'].includes(currentSection) : currentSection === item.id;
          return (
            <button
              key={`${item.id}-${index}`} // Use index for unique key if ids can repeat (like 'home')
              data-target={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.ariaLabelOverride || item.label} // Use override if present, else default label
              className={`nav-button bg-white text-gray-700 px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md hover:bg-primary hover:text-white transition-all duration-300 font-medium flex items-center text-sm md:text-base ${
                isActive ? 'active-nav' : ''
              }`}
            >
              <i className={`${item.icon} mr-2`}></i> {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationBar;
