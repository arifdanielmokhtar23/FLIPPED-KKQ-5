
import React from 'react';
import { Verse } from './hijazTypes';
import HijazVerseItem from './HijazVerseItem';

interface HijazVerseDisplayProps {
  verses: Verse[];
  highlightedVerseId: string | null;
  surahName?: string; 
}

const HijazVerseDisplay: React.FC<HijazVerseDisplayProps> = ({ verses, highlightedVerseId, surahName = "As-Saffat" }) => {
  if (!verses || verses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 border border-gray-200 h-full flex flex-col items-center justify-center">
        <p className="text-slate-500">Tiada data ayat untuk dipaparkan.</p>
      </div>
    );
  }

  const firstVerseNumber = verses[0].number;
  const lastVerseNumber = verses[verses.length - 1].number;

  return (
    <div className="bg-white rounded-xl shadow-lg p-1 md:p-3 border border-gray-200 h-full flex flex-col">
      <div className="text-center p-3 md:p-4 sticky top-0 bg-slate-50 border-b border-gray-200 backdrop-blur-sm z-10 rounded-t-xl">
        <h3 className="text-2xl sm:text-3xl font-bold text-primary uppercase">SURAH {surahName}</h3>
        <p className="text-md sm:text-lg text-slate-600">
          AYAT {firstVerseNumber} HINGGA {lastVerseNumber}
        </p>
      </div>
      <div className="flex-grow p-2 md:p-4 space-y-3 bayyati-container scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-indigo-950-50">
        {verses.map((verse) => (
          <HijazVerseItem
            key={verse.id}
            verse={verse}
            isHighlighted={verse.id === highlightedVerseId}
          />
        ))}
      </div>
    </div>
  );
};

export default HijazVerseDisplay;
