
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', // Original max-width was 500px, md is 28rem = 448px, lg is 32rem = 512px
    lg: 'max-w-lg', 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className={`bg-white rounded-lg shadow-xl p-6 md:p-8 w-full ${sizeClasses[size]} modal-content`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-dark">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
    