
import React, { useState } from 'react';
import { TextModule } from '../types';
import TextModuleModal from './TextModuleModal'; // Komponen baru
import DeleteConfirmModal from './DeleteConfirmModal';

interface ModulTeksSectionProps {
  textModules: TextModule[];
  isAdminMode: boolean;
  onSaveTextModule: (module: TextModule) => void;
  onDeleteTextModule: (moduleId: string) => void;
}

const ModulTeksSection: React.FC<ModulTeksSectionProps> = ({ textModules, isAdminMode, onSaveTextModule, onDeleteTextModule }) => {
  const [showTextModuleModal, setShowTextModuleModal] = useState(false);
  const [editingTextModule, setEditingTextModule] = useState<TextModule | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingTextModuleInfo, setDeletingTextModuleInfo] = useState<{ id: string; title: string } | null>(null);

  const handleOpenAddModal = () => {
    setEditingTextModule(null);
    setShowTextModuleModal(true);
  };

  const handleOpenEditModal = (module: TextModule) => {
    setEditingTextModule(module);
    setShowTextModuleModal(true);
  };

  const handleSaveModule = (module: TextModule) => {
    onSaveTextModule(module);
    setShowTextModuleModal(false);
    setEditingTextModule(null);
  };

  const handleDeleteModule = (id: string, title: string) => {
    setDeletingTextModuleInfo({ id, title });
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteModule = () => {
    if (deletingTextModuleInfo) {
      onDeleteTextModule(deletingTextModuleInfo.id);
    }
    setShowDeleteConfirmModal(false);
    setDeletingTextModuleInfo(null);
  };

  return (
    <>
      <section id="modul-teks" className="content-section">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center">
            <i className="fas fa-book mr-3 text-accent"></i> MODUL TEKS PEMBELAJARAN
          </h2>
          
          <div id="text-modules-list" className="space-y-3">
            {textModules.length === 0 ? (
              <p className="text-gray-500 text-sm">Tiada modul teks ditetapkan lagi.</p>
            ) : (
              textModules.map(module => (
                <div key={module.id} className="link-strip group">
                  <div className="flex-grow flex items-center overflow-hidden"> {/* Added overflow-hidden for long titles */}
                    <span className="truncate" title={module.title}>{module.title}</span>
                    {!isAdminMode && <i className="fas fa-external-link-alt ml-2 text-xs text-gray-400 group-hover:text-primary flex-shrink-0"></i>}
                  </div>
                  {isAdminMode ? (
                    <div className="ml-4 space-x-2 flex-shrink-0">
                      <button 
                        onClick={() => handleOpenEditModal(module)} 
                        title={`Edit Modul: ${module.title}`} 
                        className="p-1 text-blue-500 hover:text-blue-700"
                        aria-label={`Edit modul ${module.title}`}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => handleDeleteModule(module.id, module.title)} 
                        title={`Padam Modul: ${module.title}`} 
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label={`Padam modul ${module.title}`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ) : (
                     <a 
                       href={module.link} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="w-full h-full absolute inset-0" 
                       aria-label={`Buka modul ${module.title} dalam tab baru`}
                     ></a>
                  )}
                </div>
              ))
            )}
          </div>

          {isAdminMode && (
            <div className="mt-6">
              <button
                id="add-new-text-module-button"
                onClick={handleOpenAddModal}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
              >
                <i className="fas fa-plus mr-2"></i> Tambah Modul Teks Baru
              </button>
            </div>
          )}
        </div>
      </section>

      <TextModuleModal
        isOpen={showTextModuleModal}
        onClose={() => { setShowTextModuleModal(false); setEditingTextModule(null); }}
        onSave={handleSaveModule}
        existingModule={editingTextModule}
      />

      {deletingTextModuleInfo && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirmModal}
          onClose={() => { setShowDeleteConfirmModal(false); setDeletingTextModuleInfo(null); }}
          onConfirm={confirmDeleteModule}
          itemName={deletingTextModuleInfo.title}
        />
      )}
    </>
  );
};

export default ModulTeksSection;