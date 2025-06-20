
import React from 'react';
import { Verse } from './bayyatiTypes';

interface BayyatiVerseItemProps {
  verse: Verse;
  isHighlighted: boolean;
}

const BayyatiVerseItem: React.FC<BayyatiVerseItemProps> = ({ verse, isHighlighted }) => {
  const baseClasses = "p-4 rounded-xl relative border transition-all duration-300 ease-in-out";
  const normalClasses = "bg-white border-gray-200 hover:bg-slate-50";
  const highlightedClasses = "border-primary bg-blue-50 shadow-md";
  
  // Added pr-10 sm:pr-12 to make space for the number circle on the right
  const textBaseClasses = "font-traditional-arabic text-2xl sm:text-3xl leading-relaxed text-right dir-rtl pr-10 sm:pr-12"; 
  const textNormalClasses = "text-slate-700";
  const textHighlightedClasses = "bayyati-highlighted-text"; // Styled in index.html

  return (
    <div
      className={`${baseClasses} ${isHighlighted ? highlightedClasses : normalClasses}`}
      aria-current={isHighlighted ? "true" : undefined}
    >
      {/* Positioned Number Circle */}
      <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 bg-primary text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold shadow-sm">
        {verse.number}
      </div>
      
      <p className={`${textBaseClasses} ${isHighlighted ? textHighlightedClasses : textNormalClasses}`}>
        {verse.text}
      </p>
    </div>
  );
};

export default BayyatiVerseItem;
