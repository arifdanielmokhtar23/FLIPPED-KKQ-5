
import React from 'react';

interface NahawandHeaderProps {
  title: string; // e.g., "Tarannum Nahawand"
}

const NahawandHeader: React.FC<NahawandHeaderProps> = ({ title }) => {
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

export default NahawandHeader;
