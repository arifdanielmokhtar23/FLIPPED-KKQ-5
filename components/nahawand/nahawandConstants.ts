
import { DropdownOption, NahawandHarakahOptionValue, NahawandHummingOptionValue, Verse, ArrowPatterns } from './nahawandTypes';

export const NAHAWAND_HARAKAH_OPTIONS: DropdownOption<NahawandHarakahOptionValue>[] = [
  { value: "1", label: "Harakah 1" }, { value: "2", label: "Harakah 2" },
  { value: "3", label: "Harakah 3" }, { value: "4", label: "Harakah 4" },
  { value: "5", label: "Harakah 5" },
];

export const NAHAWAND_HUMMING_OPTIONS: DropdownOption<NahawandHummingOptionValue>[] = [
  { value: "1", label: "Harakah 1" }, { value: "2", label: "Harakah 2" },
  { value: "3", label: "Harakah 3" }, { value: "4", label: "Harakah 4" },
  { value: "5", label: "Harakah 5" },
];

// Surah As-Saffat, Ayat 157-160 for Nahawand
export const NAHAWAND_VERSE_DATA: Verse[] = [
  { id: "nahawand_verse157", number: 157, text: "فَأْتُوا بِكِتَابِكُمْ إِن كُنتُمْ صَادِقِينَ" },      // Corresponds to Harakah 1
  { id: "nahawand_verse158_part1", number: 158, text: "وَجَعَلُوا بَيْنَهُ وَبَيْنَ الْجِنَّةِ نَسَبًا ۚ" },  // Corresponds to Harakah 2
  { id: "nahawand_verse158_part2", number: 158, text: "وَلَقَدْ عَلِمَتِ الْجِنَّةُ إِنَّهُمْ لَمُحْضَرُونَ" },// Corresponds to Harakah 3
  { id: "nahawand_verse159", number: 159, text: "سُبْحَانَ اللَّهِ عَمَّا يَصِفُونَ" },      // Corresponds to Harakah 4
  { id: "nahawand_verse160", number: 160, text: "إِلَّا عِبَادَ اللَّهِ الْمُخْلَصِينَ" },      // Corresponds to Harakah 5
];

// row1: AWALAN, row2: PERTENGAHAN, row3: AKHIRAN
export const NAHAWAND_ARROW_PATTERNS: ArrowPatterns = {
  "1": { row1: ['←', '↑', '←'], row2: ['←', '↓', '←'], row3: ['←', '↑', '←'] },
  "2": { row1: ['←', '←', '↑'], row2: ['←', '↑', '↑'], row3: ['←', '↑', '↑'] },
  "3": { row1: ['←', '↑', '↑'], row2: ['←', '↑', '↑'], row3: ['←', '↑', '←'] },
  "4": { row1: ['←', '←', '↓'], row2: ['←', '←', '↓'], row3: ['←', '↓', '↓'] },
  "5": { row1: ['←', '↑', '←'], row2: ['←', '↑', '↑'], row3: ['←', '↑', '←'] },
};

export const SELECT_ARROW_SVG_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjI5MyA3LjI5M2ExIDEgMCAwMTEuNDE0IDBMMTAgMTAuNTg2bDMuMjkzLTMuMjkzYTEgMSAwIDExMS40MTQgMS40MTRsLTQgNGExIDEgMCAwMS0xLjQxNCAwbC00LTRhMSAxIDAgMDEwLTEuNDE0eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==";
