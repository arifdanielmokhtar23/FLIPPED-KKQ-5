
import React, { useState } from 'react';
import Modal from './Modal';
import { ADMIN_PASSWORD } from '../constants';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setError('');
      onSuccess();
      setPassword(''); // Clear password after successful login
    } else {
      setError('Kata laluan salah. Sila cuba lagi.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Masukkan Kata Laluan Admin">
      <input
        type="password"
        id="admin-password-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-primary focus:border-primary"
        placeholder="Kata Laluan"
      />
      {error && <p id="admin-password-error" className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex justify-end space-x-2">
        <button
          id="admin-password-cancel"
          onClick={handleClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
        >
          Batal
        </button>
        <button
          id="admin-password-submit"
          onClick={handleSubmit}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary text-sm"
        >
          Masuk
        </button>
      </div>
    </Modal>
  );
};

export default AdminPasswordModal;
    