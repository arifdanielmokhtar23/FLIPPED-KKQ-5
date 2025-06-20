
import React, { useState, useEffect, useRef } from 'react';
import { RelatedLink } from '../types';
import RelatedLinkModal from './RelatedLinkModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface HeaderProps {
  isAdminMode: boolean;
  relatedLinks: RelatedLink[];
  onSaveRelatedLink: (link: RelatedLink) => void;
  onDeleteRelatedLink: (linkId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ isAdminMode, relatedLinks, onSaveRelatedLink, onDeleteRelatedLink }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showRelatedLinkModal, setShowRelatedLinkModal] = useState(false);
  const [editingRelatedLink, setEditingRelatedLink] = useState<RelatedLink | null>(null);
  
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingLinkInfo, setDeletingLinkInfo] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenAddLinkModal = () => {
    setEditingRelatedLink(null);
    setShowRelatedLinkModal(true);
    setIsDropdownOpen(false); // Close dropdown when modal opens
  };
  
  // Future: handleOpenEditLinkModal
  // const handleOpenEditLinkModal = (link: RelatedLink) => {
  //   setEditingRelatedLink(link);
  //   setShowRelatedLinkModal(true);
  //   setIsDropdownOpen(false);
  // };

  const handleSaveLink = (link: RelatedLink) => {
    onSaveRelatedLink(link);
    setShowRelatedLinkModal(false);
  };

  const handleDeleteLink = (linkId: string, linkText: string) => {
    setDeletingLinkInfo({ id: linkId, text: linkText });
    setShowDeleteConfirmModal(true);
    setIsDropdownOpen(false); // Close dropdown
  };

  const confirmDeleteLink = () => {
    if (deletingLinkInfo) {
      onDeleteRelatedLink(deletingLinkInfo.id);
    }
    setShowDeleteConfirmModal(false);
    setDeletingLinkInfo(null);
  };

  return (
    <>
      <header className="text-center mb-12 relative">
        <div className="absolute top-0 right-0 mt-0 mr-0 md:mt-1 md:mr-1 z-10" ref={dropdownRef}>
          <div className="dropdown relative">
            <button
              id="pautan-berkaitan-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-danger text-white rounded-full shadow-md hover:bg-red-700 transition-all duration-300 font-medium flex items-center header-pautan-btn"
            >
              <i className="fas fa-link"></i> PAUTAN BERKAITAN <i className={`fas fa-chevron-down transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div
              id="pautan-dropdown-content"
              className={`dropdown-content absolute right-0 mt-2 p-3 w-56 md:w-64 text-left bg-white shadow-lg rounded-md z-50 ${isDropdownOpen ? 'show' : 'hidden'}`}
            >
              {relatedLinks.length === 0 && !isAdminMode && (
                <p className="px-3 py-2 text-sm text-gray-500">Tiada pautan berkaitan.</p>
              )}
              {relatedLinks.map((link) => (
                <div key={link.id} className="group flex items-center justify-between hover:bg-gray-100 rounded-md">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 px-3 text-sm text-gray-700 hover:text-primary flex-grow"
                  >
                    {link.iconClass && link.iconColor && <i className={`${link.iconClass} mr-2 ${link.iconColor} w-4 text-center`}></i>}
                    {!link.iconClass && <i className="fas fa-external-link-alt mr-2 text-gray-400 w-4 text-center"></i>}
                    {link.text}
                  </a>
                  {isAdminMode && (
                    <button 
                      onClick={() => handleDeleteLink(link.id, link.text)}
                      title="Padam Pautan"
                      className="p-2 text-red-500 hover:text-red-700 opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  )}
                </div>
              ))}
              {isAdminMode && (
                <>
                  {relatedLinks.length > 0 && <hr className="my-2 border-gray-200" />}
                  <button
                    onClick={handleOpenAddLinkModal}
                    className="w-full text-left py-2 px-3 text-sm text-primary hover:bg-blue-50 rounded-md flex items-center"
                  >
                    <i className="fas fa-plus-circle mr-2"></i> Tambah Pautan Baru
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 animate-bounce-slow pt-8 md:pt-0">FLIPPED KKQ</h1>
        <p className="text-lg md:text-xl text-secondary font-medium mb-6">Platform Pembelajaran KKQ Interaktif <span className="text-accent">🎵📖✨</span></p>
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-full p-3 md:p-4 shadow-lg">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-400 via-primary to-indigo-600 flex items-center justify-center ring-4 ring-white ring-offset-2 ring-offset-light">
              <span className="text-3xl md:text-4xl text-white">📚</span>
            </div>
          </div>
        </div>
      </header>

      <RelatedLinkModal
        isOpen={showRelatedLinkModal}
        onClose={() => setShowRelatedLinkModal(false)}
        onSave={handleSaveLink}
        existingLink={editingRelatedLink}
      />
      {deletingLinkInfo && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          onConfirm={confirmDeleteLink}
          itemName={deletingLinkInfo.text}
        />
      )}
    </>
  );
};

export default Header;