import React from 'react';

interface BayyatiHeaderProps {
  title: string; // e.g., "Tarannum Bayyati"
}

const BayyatiHeader: React.FC<BayyatiHeaderProps> = ({ title }) => {
  return (
    <header className="text-center py-8 md:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider text-primary mb-2">
        MODUL AUDITORI {title.toUpperCase()}
      </h1>
      <p className="text-lg text-slate-600">
        Selami Alunan {title.split(' ').pop()} 
      </p>
    </header>
  );
};

export default BayyatiHeader;