
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { TextModule } from '../types';

interface TextModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: TextModule) => void;
  existingModule: TextModule | null;
}

const TextModuleModal: React.FC<TextModuleModalProps> = ({ isOpen, onClose, onSave, existingModule }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (existingModule) {
        setTitle(existingModule.title);
        setLink(existingModule.link);
        setContent(existingModule.content);
        setId(existingModule.id);
      } else {
        setTitle('');
        setLink('');
        setContent('');
        setId(''); 
      }
      setError('');
    }
  }, [existingModule, isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Tajuk modul tidak boleh kosong.");
      return;
    }
    if (!link.trim()) {
      setError("URL pautan tidak boleh kosong.");
      return;
    }
    if (!content.trim()) {
        setError("Kandungan penuh modul tidak boleh kosong.");
        return;
    }
    try {
      new URL(link); 
    } catch (_) {
      setError("Format URL tidak sah. Pastikan ia bermula dengan http:// atau https://");
      return;
    }
    setError('');
    
    const moduleToSave: TextModule = { 
      id: id || crypto.randomUUID(), 
      title, 
      link, 
      content,
      description: existingModule?.description || "" // Preserve description if editing, or set empty for new
    };
    onSave(moduleToSave);
  };
  
  const handleClose = () => {
    // Keep fields if modal reopens for editing, reset error
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={existingModule ? "Edit Modul Teks" : "Tambah Modul Teks Baru"} size="lg">
      <input type="hidden" id="text-module-id" value={id} />
      <div className="mb-3">
        <label htmlFor="text-module-title" className="block text-sm font-medium text-gray-700 mb-1">Tajuk Modul</label>
        <input
          type="text"
          id="text-module-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Cth: Pengenalan Ilmu Tajwid"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="text-module-link" className="block text-sm font-medium text-gray-700 mb-1">URL Pautan</label>
        <input
          type="url"
          id="text-module-link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="https://contoh.com/tajwid"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="text-module-content" className="block text-sm font-medium text-gray-700 mb-1">Kandungan Penuh Modul</label>
        <textarea
          id="text-module-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Masukkan kandungan penuh artikel atau nota di sini..."
        />
      </div>
      {error && <p id="text-module-modal-error" className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex justify-end space-x-2">
        <button
          id="text-module-modal-cancel"
          onClick={handleClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
        >
          Batal
        </button>
        <button
          id="text-module-modal-save"
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary text-sm"
        >
          Simpan Modul
        </button>
      </div>
    </Modal>
  );
};

export default TextModuleModal;