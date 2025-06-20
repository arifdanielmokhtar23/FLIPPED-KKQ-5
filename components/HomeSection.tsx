
import React from 'react';
import { AUDITORI_MODULES } from '../constants';
import { SectionId, Tarannum } from '../types';

interface AuditoriCardProps {
  module: Tarannum;
  onNavigate: (sectionId: SectionId) => void;
}

const AuditoriCard: React.FC<AuditoriCardProps> = ({ module, onNavigate }) => {
  let phoneticLabel = `${module.name}.`; // Default to module name with a period

  if (module.name === 'Bayyati') {
    phoneticLabel = `BuhYa Tee.`;
  } else if (module.name === 'Hijaz') {
    phoneticLabel = `Hee Juzz.`;
  } else if (module.name === 'Nahawand') {
    phoneticLabel = `Naa Haa Wand.`;
  }

  return (
  <a
    href={`#${module.targetSection}`}
    onClick={(e) => {
      e.preventDefault();
      onNavigate(module.targetSection);
    }}
    className="module-card-link"
    aria-label={phoneticLabel} // Use the phonetically adjusted label
  >
    <div className="p-5 flex items-center">
      <div className={`module-icon ${module.bgColor} ${module.textColor}`}>
        <i className={module.iconClass}></i>
      </div>
      <div>
        <h3 className="font-bold text-lg text-dark">{module.name}</h3>
        <p className="text-gray-600 text-sm">{module.description}</p>
      </div>
    </div>
  </a>
  );
};

interface HomeSectionProps {
  onNavigate: (sectionId: SectionId) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  return (
    <section id="home" className="content-section">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 flex items-center justify-center">
          <i className="fas fa-music mr-3 text-accent"></i> MODUL AUDITORI
        </h2>
        <p className="text-gray-600 mb-8">Pilih salah satu jenis tarannum di bawah untuk melihat kandungan berkaitan.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {AUDITORI_MODULES.map(module => (
            <AuditoriCard key={module.id} module={module} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeSection;