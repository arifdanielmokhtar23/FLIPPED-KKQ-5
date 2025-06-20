
import { DropdownOption, HarakahOptionValue, HummingOptionValue, Verse, ArrowPatterns } from './bayyatiTypes';

export const HARAKAH_OPTIONS: DropdownOption<HarakahOptionValue>[] = [
  { value: "1", label: "Harakah 1" }, { value: "2", label: "Harakah 2" },
  { value: "3", label: "Harakah 3" }, { value: "4", label: "Harakah 4" },
  { value: "5", label: "Harakah 5" }, { value: "6", label: "Harakah 6" },
];

export const HUMMING_OPTIONS: DropdownOption<HummingOptionValue>[] = [
  { value: "1", label: "Harakah 1" }, { value: "2", label: "Harakah 2" },
  { value: "3", label: "Harakah 3" }, { value: "4", label: "Harakah 4" },
  { value: "5", label: "Harakah 5" }, { value: "6", label: "Harakah 6" },
];

// Surah As-Saffat, Ayat 145-150
export const VERSE_DATA: Verse[] = [
  { id: "verse145", number: 145, text: "فَنَبَذْنَاهُ بِالْعَرَاءِ وَهُوَ سَقِيمٌ" },      // Corresponds to Harakah 1
  { id: "verse146", number: 146, text: "وَأَنۢبَتْنَا عَلَيْهِ شَجَرَةً مِّن يَقْطِينٍ" },  // Corresponds to Harakah 2
  { id: "verse147", number: 147, text: "وَأَرْسَلْنَاهُ إِلَىٰ مِا۟ئَةِ أَلْفٍ أَوْ يَزِيدُونَ" },// Corresponds to Harakah 3
  { id: "verse148", number: 148, text: "فَـَٔامَنُوا۟ فَمَتَّعْنَاهُمْ إِلَىٰ حِينٍ" },      // Corresponds to Harakah 4
  { id: "verse149", number: 149, text: "فَٱسْتَفْتِهِمْ أَلِرَبِّكَ ٱلْبَنَاتُ وَلَهُمُ ٱلْبَنُونَ" },// Corresponds to Harakah 5
  { id: "verse150", number: 150, text: "أَمْ خَلَقْنَا ٱلْمَلَـٰٓئِكَةَ إِنَـٰثًا وَهُمْ شَـٰهِدُونَ" },// Corresponds to Harakah 6
];

// row1: AWALAN, row2: PERTENGAHAN, row3: AKHIRAN
// Arrows are in logical order (1st, 2nd, 3rd sound unit)
// For RTL display, the 1st arrow will be under the rightmost 'ن'
export const ARROW_PATTERNS: ArrowPatterns = {
  "1": { row1: ['←', '↑', '←'], row2: ['←', '↓', '←'], row3: ['←', '↑', '←'] },
  "2": { row1: ['←', '↑', '←'], row2: ['←', '↑', '←'], row3: ['←', '↓', '←'] },
  "3": { row1: ['←', '↑', '←'], row2: ['←', '↓', '←'], row3: ['←', '↑', '←'] },
  "4": { row1: ['←', '←', '↑'], row2: ['←', '↑', '↑'], row3: ['←', '↑', '←'] },
  "5": { row1: ['←', '←', '↑'], row2: ['←', '↑', '↑'], row3: ['←', '↑', '←'] },
  "6": { row1: ['←', '↑', '↑'], row2: ['←', '↑', '↑'], row3: ['←', '↑', '←'] }
};

export const SELECT_ARROW_SVG_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjI5MyA3LjI5M2ExIDEgMCAwMTEuNDE0IDBMMTAgMTAuNTg2bDMuMjkzLTMuMjkzYTEgMSAwIDExMS40MTQgMS40MTRsLTQgNGExIDEgMCAwMS0xLjQxNCAwbC00LTRhMSAxIDAgMDEwLTEuNDE0eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==";
