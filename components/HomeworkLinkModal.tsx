
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { HomeworkLink } from '../types';

interface HomeworkLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: HomeworkLink) => void;
  editingLink: HomeworkLink | null;
}

const HomeworkLinkModal: React.FC<HomeworkLinkModalProps> = ({ isOpen, onClose, onSave, editingLink }) => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingLink) {
      setText(editingLink.text);
      setUrl(editingLink.url);
    } else {
      // Should not happen if always editing an existing link
      setText('');
      setUrl('');
    }
    setError('');
  }, [editingLink, isOpen]);

  const handleSave = () => {
    if (!text.trim() || !url.trim()) {
      setError("Nama dan URL pautan tidak boleh kosong.");
      return;
    }
    try {
      new URL(url); 
    } catch (_) {
      setError("Format URL tidak sah. Pastikan ia bermula dengan http:// atau https://");
      return;
    }
    setError('');
    if (editingLink) {
      onSave({ ...editingLink, text, url }); // Retain id and gradientClass
    }
  };
  
  const handleClose = () => {
    // Don't reset fields if editingLink is present, so it re-populates correctly if reopened
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Edit Pautan Kerja Rumah: ${editingLink?.text || ''}`}>
      <div className="mb-3">
        <label htmlFor="homework-link-text" className="block text-sm font-medium text-gray-700 mb-1">Nama Pautan</label>
        <input
          type="text"
          id="homework-link-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Cth: Latihan Surah"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="homework-link-url" className="block text-sm font-medium text-gray-700 mb-1">URL Pautan</label>
        <input
          type="url"
          id="homework-link-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="https://contoh.com/latihan"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary text-sm"
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
};

export default HomeworkLinkModal;
