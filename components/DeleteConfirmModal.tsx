
import React from 'react';
import Modal from './Modal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sahkan Pemadaman">
      <p className="mb-6 text-gray-700">
        Anda pasti ingin memadam pautan "{itemName}"? Tindakan ini tidak boleh diundur.
      </p>
      <div className="flex justify-end space-x-2">
        <button
          id="delete-confirm-cancel-button"
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
        >
          Batal
        </button>
        <button
          id="delete-confirm-delete-button"
          onClick={onConfirm}
          className="bg-danger text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
        >
          Padam
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
    