
import React from 'react';
import { Verse } from './hijazTypes';

interface HijazVerseItemProps {
  verse: Verse;
  isHighlighted: boolean;
}

const HijazVerseItem: React.FC<HijazVerseItemProps> = ({ verse, isHighlighted }) => {
  const baseClasses = "p-4 rounded-xl relative border transition-all duration-300 ease-in-out";
  const normalClasses = "bg-white border-gray-200 hover:bg-slate-50";
  const highlightedClasses = "border-primary bg-blue-50 shadow-md";
  
  // Increased right padding for text to accommodate moved numbers
  const textBaseClasses = "font-traditional-arabic text-2xl sm:text-3xl leading-relaxed text-right dir-rtl pr-12 sm:pr-14 md:pr-16"; 
  const textNormalClasses = "text-slate-700";
  const textHighlightedClasses = "bayyati-highlighted-text"; // Styled in index.html

  const isCombinedVerse = typeof verse.number === 'string' && verse.number.includes('-');
  let num1: string | number = '';
  let num2: string | number = '';

  if (isCombinedVerse) {
    [num1, num2] = (verse.number as string).split('-');
  }

  const numberCircleClasses = "w-6 h-6 sm:w-7 sm:h-7 bg-primary text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold shadow-sm";

  return (
    <div
      className={`${baseClasses} ${isHighlighted ? highlightedClasses : normalClasses}`}
      aria-current={isHighlighted ? "true" : undefined}
    >
      {/* Adjusted right positioning for the number group */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-5 md:right-6 flex flex-col items-center">
        {isCombinedVerse ? (
          <>
            <div className={numberCircleClasses}>{num1}</div>
            <div className="w-px h-2 sm:h-2.5 bg-primary my-0.5"></div> {/* Vertical line */}
            <div className={numberCircleClasses}>{num2}</div>
          </>
        ) : (
          <div className={numberCircleClasses}>
            {verse.number}
          </div>
        )}
      </div>
      
      <p className={`${textBaseClasses} ${isHighlighted ? textHighlightedClasses : textNormalClasses}`}>
        {verse.text}
      </p>
    </div>
  );
};

export default HijazVerseItem;