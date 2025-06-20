
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { RelatedLink } from '../types';

interface RelatedLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: RelatedLink) => void;
  existingLink: RelatedLink | null;
}

const RelatedLinkModal: React.FC<RelatedLinkModalProps> = ({ isOpen, onClose, onSave, existingLink }) => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingLink) {
      setText(existingLink.text);
      setUrl(existingLink.url);
      setId(existingLink.id);
    } else {
      setText('');
      setUrl('');
      setId(''); 
    }
    setError('');
  }, [existingLink, isOpen]);

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
    // For new links, ID is generated. For existing, ID is retained.
    // IconClass and IconColor are not managed in this modal for now.
    onSave({ id: id || crypto.randomUUID(), text, url });
  };
  
  const handleClose = () => {
    setText('');
    setUrl('');
    setId('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={existingLink ? "Edit Pautan Berkaitan" : "Tambah Pautan Berkaitan Baru"}>
      <div className="mb-3">
        <label htmlFor="related-link-text" className="block text-sm font-medium text-gray-700 mb-1">Nama Pautan</label>
        <input
          type="text"
          id="related-link-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Cth: Laman Web Rasmi"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="related-link-url" className="block text-sm font-medium text-gray-700 mb-1">URL Pautan</label>
        <input
          type="url"
          id="related-link-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="https://contoh.com"
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

export default RelatedLinkModal;