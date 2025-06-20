
import React from 'react';
import { ArrowPattern } from './hijazTypes';

interface SegmentDisplayBoxProps {
  label: string;
  arrows: string[];
}

const SegmentDisplayBox: React.FC<SegmentDisplayBoxProps> = ({ label, arrows }) => {
  const getArrowColor = (arrow: string) => {
    if (arrow === '↑') return 'text-green-600';
    if (arrow === '↓') return 'text-red-600';
    return 'text-slate-700';
  };

  return (
    <div className="flex flex-col items-center p-3 border border-gray-300 rounded-lg bg-slate-100 shadow-sm text-center min-w-[110px] sm:min-w-[130px] md:min-w-[140px]">
      <h4 className="text-sm sm:text-md font-semibold text-primary mb-2 whitespace-nowrap">{label}</h4>
      <div 
        className="font-traditional-arabic font-bold text-3xl sm:text-4xl text-secondary mb-1" 
        dir="rtl"
        aria-label="Alunan humming نننا"
      >
        نننا
      </div>
      <div className="flex justify-between w-full px-1 sm:px-2 mt-1" dir="rtl">
        {arrows.map((arrow, index) => (
          <span 
            key={index} 
            className={`text-2xl sm:text-3xl font-bold ${getArrowColor(arrow)} flex-1 text-center`}
            aria-label={`Arah melodi ${index + 1}: ${arrow === '←' ? 'kiri' : arrow === '↑' ? 'atas' : arrow === '↓' ? 'bawah' : 'kanan'}`}
          >
            {arrow}
          </span>
        ))}
      </div>
    </div>
  );
};

interface HijazMelodicDirectionDisplayProps {
  arrowPattern: ArrowPattern | null;
}

const HijazMelodicDirectionDisplay: React.FC<HijazMelodicDirectionDisplayProps> = ({ arrowPattern }) => {
  if (!arrowPattern) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-200 text-center">
        <p className="text-slate-500">Pilih Harakah Humming untuk melihat arah melodi.</p>
      </div>
    );
  }
  
  const displaySegments = [
    { label: "AKHIRAN", arrows: arrowPattern.row3, aria: "Akhiran melodi" },    
    { label: "PERTENGAHAN", arrows: arrowPattern.row2, aria: "Pertengahan melodi" }, 
    { label: "AWALAN", arrows: arrowPattern.row1, aria: "Awalan melodi" },    
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-200" aria-labelledby="melodic-direction-title-hijaz">
      <div className="bg-slate-50 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
        <h3 id="melodic-direction-title-hijaz" className="text-primary text-base sm:text-lg md:text-xl font-semibold mb-4 text-center">
          Arah Melodi
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 items-start justify-center" role="list">
          {displaySegments.map((seg) => (
            <div key={seg.label} role="listitem" aria-label={seg.aria}>
              <SegmentDisplayBox label={seg.label} arrows={seg.arrows} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HijazMelodicDirectionDisplay;
