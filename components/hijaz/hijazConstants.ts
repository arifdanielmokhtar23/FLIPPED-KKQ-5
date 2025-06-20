
import { DropdownOption, HijazHarakahOptionValue, HijazHummingOptionValue, Verse, ArrowPatterns } from './hijazTypes';

export const HIJAZ_HARAKAH_OPTIONS: DropdownOption<HijazHarakahOptionValue>[] = [
  { value: "1", label: "Harakah 1" }, { value: "2", label: "Harakah 2" },
  { value: "3", label: "Harakah 3" }, { value: "4", label: "Harakah 4" },
];

export const HIJAZ_HUMMING_OPTIONS: DropdownOption<HijazHummingOptionValue>[] = [
  { value: "1", label: "Harakah 1" }, { value: "2", label: "Harakah 2" },
  { value: "3", label: "Harakah 3" }, { value: "4", label: "Harakah 4" },
];

// Surah As-Saffat, Ayat 151-156 for Hijaz
export const HIJAZ_VERSE_DATA: Verse[] = [
  { id: "hijaz_verse151", number: 151, text: "أَلَا إِنَّهُم مِّنْ إِفْكِهِمْ لَيَقُولُونَ" },      // Corresponds to Harakah 1
  { id: "hijaz_verse152", number: 152, text: "وَلَدَ اللَّهُ وَإِنَّهُمْ لَكَاذِبُونَ" },  // Corresponds to Harakah 2
  { id: "hijaz_verse153_154", number: "153-154", text: "أَصْطَفَى الْبَنَاتِ عَلَى الْبَنِينَ﴿ ﴾ مَا لَكُمْ كَيْفَ تَحْكُمُونَ" },// Corresponds to Harakah 3
  { id: "hijaz_verse155_156", number: "155-156", text: "أَفَلَا تَذَكَّرُونَ ﴿ ﴾ أَمْ لَكُمْ سُلْطَانٌ مُّبِينٌ" },      // Corresponds to Harakah 4
];

// row1: AWALAN, row2: PERTENGAHAN, row3: AKHIRAN
// Arrows are in logical order (1st, 2nd, 3rd sound unit)
// For RTL display, the 1st arrow will be under the rightmost 'ن'
export const HIJAZ_ARROW_PATTERNS: ArrowPatterns = {
  "1": { row1: ['←', '↑', '←'], row2: ['←', '↑', '←'], row3: ['←', '↓', '←'] },
  "2": { row1: ['←', '↑', '↑'], row2: ['←', '↑', '↑'], row3: ['←', '↑', '↑'] },
  "3": { row1: ['↑', '↑', '↑'], row2: ['←', '↑', '←'], row3: ['←', '↑', '←'] },
  "4": { row1: ['←', '←', '↑'], row2: ['←', '↓', '↓'], row3: ['←', '↓', '↓'] },
};

export const SELECT_ARROW_SVG_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjI5MyA3LjI5M2ExIDEgMCAwMTEuNDE0IDBMMTAgMTAuNTg2bDMuMjkzLTMuMjkzYTEgMSAwIDExMS40MTQgMS40MTRsLTQgNGExIDEgMCAwMS0xLjQxNCAwbC00LTRhMSAxIDAgMDEwLTEuNDE0eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==";
