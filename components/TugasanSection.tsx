
import React, { useState, useEffect } from 'react';
import { MiniGameLink, SectionId, HomeworkLink } from '../types';
import MiniGameModal from './MiniGameModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import HomeworkLinkModal from './HomeworkLinkModal'; // Import the new modal
import { INITIAL_HOMEWORK_LINK_1_DATA, INITIAL_HOMEWORK_LINK_2_DATA } from '../constants';


interface TugasanSectionProps {
  isAdminMode: boolean;
  onNavigate: (sectionId: SectionId) => void; 
}

const TugasanSection: React.FC<TugasanSectionProps> = ({ isAdminMode, onNavigate }) => {
  // Homework Notes State
  const [homeworkNotes, setHomeworkNotes] = useState("Kerja rumah belum ditetapkan."); // Updated placeholder
  const [editingHomeworkNotes, setEditingHomeworkNotes] = useState(homeworkNotes);
  const [homeworkSaveStatus, setHomeworkSaveStatus] = useState('');

  // Homework Links State
  const [homeworkLink1, setHomeworkLink1] = useState<HomeworkLink>(INITIAL_HOMEWORK_LINK_1_DATA);
  const [homeworkLink2, setHomeworkLink2] = useState<HomeworkLink>(INITIAL_HOMEWORK_LINK_2_DATA);
  const [showHomeworkLinkModal, setShowHomeworkLinkModal] = useState(false);
  const [editingHomeworkLink, setEditingHomeworkLink] = useState<HomeworkLink | null>(null);


  // Mini Games State
  const [miniGames, setMiniGames] = useState<MiniGameLink[]>([
    { id: '1', name: 'Kuiz Asas Tajwid', url: 'https://wordwall.net/ms-my/community/kuiz-asas-tajwid' },
    { id: '2', name: 'Permainan Makhraj Huruf', url: 'https://learningapps.org/watch?v=p2z5jfc1a21' },
  ]);
  const [showMiniGameModal, setShowMiniGameModal] = useState(false);
  const [editingMiniGame, setEditingMiniGame] = useState<MiniGameLink | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingMiniGame, setDeletingMiniGame] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    setEditingHomeworkNotes(homeworkNotes); 
  }, [homeworkNotes]);

  const handleSaveHomeworkNotes = () => {
    setHomeworkNotes(editingHomeworkNotes);
    setHomeworkSaveStatus('Kerja rumah berjaya disimpan!');
    setTimeout(() => setHomeworkSaveStatus(''), 3000);
  };

  // Homework Link Functions
  const openEditHomeworkLinkModal = (link: HomeworkLink) => {
    setEditingHomeworkLink(link);
    setShowHomeworkLinkModal(true);
  };

  const handleSaveHomeworkLink = (updatedLink: HomeworkLink) => {
    if (updatedLink.id === 'homeworkLink1') {
      setHomeworkLink1(updatedLink);
    } else if (updatedLink.id === 'homeworkLink2') {
      setHomeworkLink2(updatedLink);
    }
    setShowHomeworkLinkModal(false);
    setEditingHomeworkLink(null);
  };


  // Mini Game Functions
  const handleSaveMiniGame = (game: MiniGameLink) => {
    setMiniGames(prevGames => {
      const existing = prevGames.find(g => g.id === game.id);
      if (existing) {
        return prevGames.map(g => g.id === game.id ? game : g);
      }
      return [...prevGames, game];
    });
    setShowMiniGameModal(false);
    setEditingMiniGame(null);
  };

  const openEditMiniGameModal = (game: MiniGameLink) => {
    setEditingMiniGame(game);
    setShowMiniGameModal(true);
  };

  const openAddMiniGameModal = () => {
    setEditingMiniGame(null);
    setShowMiniGameModal(true);
  };

  const triggerDeleteMiniGame = (id: string, name: string) => {
    setDeletingMiniGame({id, name});
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteMiniGame = () => {
    if (deletingMiniGame) {
      setMiniGames(prevGames => prevGames.filter(g => g.id !== deletingMiniGame.id));
    }
    setShowDeleteConfirmModal(false);
    setDeletingMiniGame(null);
  };
  

  return (
    <section id="game" className="content-section">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 flex items-center">
          <i className="fas fa-clipboard-list mr-3 text-accent"></i> TUGASAN
        </h2>

        {/* KERJA RUMAH */}
        <div className="game-box">
          <h3 className="text-xl font-semibold text-dark mb-4">KERJA RUMAH</h3>
          {isAdminMode && (
            <div id="homework-input-area" className="admin-input-area mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Kemaskini Nota Kerja Rumah (Admin)</h4>
              <textarea
                id="homework-notes-textarea"
                rows={4}
                value={editingHomeworkNotes}
                onChange={(e) => setEditingHomeworkNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Masukkan kerja rumah di sini..."
              ></textarea>
              <button
                onClick={handleSaveHomeworkNotes}
                className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary text-sm"
              >
                Simpan Nota Kerja Rumah
              </button>
              {homeworkSaveStatus && <p className={`text-sm mt-2 ${homeworkSaveStatus.includes('berjaya') ? 'text-green-500' : 'text-red-500'}`}>{homeworkSaveStatus}</p>}
            </div>
          )}
          <div
            id="homework-notes-text"
            className="text-gray-700 mb-6 p-3 bg-indigo-50 rounded-md min-h-[60px] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: homeworkNotes.replace(/\n/g, '<br />') }}
          >
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[homeworkLink1, homeworkLink2].map(link => (
              <div key={link.id} className="relative group">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`block card-hover bg-gradient-to-r ${link.gradientClass} text-white p-4 rounded-lg text-center shadow-lg`}
                >
                  <i className="fas fa-link mr-2"></i> {link.text}
                </a>
                {isAdminMode && (
                  <button 
                    onClick={() => openEditHomeworkLinkModal(link)} 
                    title={`Edit Pautan: ${link.text}`}
                    className="absolute top-1 right-1 bg-white bg-opacity-75 hover:bg-opacity-100 text-blue-600 p-1 rounded-full shadow text-xs"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MINI GAMES */}
        <div className="game-box">
          <h3 className="text-xl font-semibold text-dark mb-4">MINI GAMES</h3>
          <div id="mini-games-list" className="space-y-3">
            {miniGames.length === 0 ? (
              <p className="text-gray-500 text-sm">Tiada mini games ditetapkan lagi.</p>
            ) : (
              miniGames.map(link => (
                <div key={link.id} className="link-strip group">
                  <div className="flex-grow flex items-center">
                    <span>{link.name}</span>
                    {!isAdminMode && <i className="fas fa-external-link-alt ml-2 text-xs text-gray-400 group-hover:text-primary"></i>}
                  </div>
                  {isAdminMode ? (
                    <div className="ml-4 space-x-2 flex-shrink-0">
                      <button onClick={() => openEditMiniGameModal(link)} title="Edit Pautan" className="p-1">
                        <i className="fas fa-edit text-blue-500 hover:text-blue-700"></i>
                      </button>
                      <button onClick={() => triggerDeleteMiniGame(link.id, link.name)} title="Padam Pautan" className="p-1">
                        <i className="fas fa-trash text-red-500 hover:text-red-700"></i>
                      </button>
                    </div>
                  ) : (
                     <a href={link.url} target="_blank" rel="noopener noreferrer" className="w-full h-full absolute inset-0" aria-label={`Buka ${link.name} dalam tab baru`}></a>
                  )}
                </div>
              ))
            )}
          </div>
          {isAdminMode && (
            <div id="mini-games-admin-controls" className="mt-4">
              <button
                id="add-new-mini-game-button"
                onClick={openAddMiniGameModal}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
              >
                <i className="fas fa-plus mr-2"></i> Tambah Pautan Mini Game
              </button>
            </div>
          )}
        </div>
      </div>

      <HomeworkLinkModal
        isOpen={showHomeworkLinkModal}
        onClose={() => {setShowHomeworkLinkModal(false); setEditingHomeworkLink(null);}}
        onSave={handleSaveHomeworkLink}
        editingLink={editingHomeworkLink}
      />

      <MiniGameModal
        isOpen={showMiniGameModal}
        onClose={() => {setShowMiniGameModal(false); setEditingMiniGame(null);}}
        onSave={handleSaveMiniGame}
        existingGame={editingMiniGame}
      />
      {deletingMiniGame && (
        <DeleteConfirmModal
            isOpen={showDeleteConfirmModal}
            onClose={() => {setShowDeleteConfirmModal(false); setDeletingMiniGame(null);}}
            onConfirm={confirmDeleteMiniGame}
            itemName={deletingMiniGame.name}
        />
      )}
    </section>
  );
};

export default TugasanSection;
