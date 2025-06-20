
import { isSimilar, getFuzzyThreshold } from './stringUtils';

export interface ParsedTarannumCommand {
  module: 'bayyati' | 'hijaz' | 'nahawand' | null;
  type: 'bacaan' | 'humming' | null;
  harakah: string | null; // Will be "1", "2", etc.
}

// This list contains common, exact variations. Fuzzy matching will be applied to primary forms.
const spokenNumberToDigit: { [key: string]: string } = {
  'satu': '1', 'pertama': '1',
  'dua': '2', 'kedua': '2',
  'tiga': '3', 'ketiga': '3',
  'empat': '4', 'keempat': '4', 'em': '4', 'pat': '4', 'mpat': '4',
  'lima': '5', 'kelima': '5', 'ma': '5', 'lema': '5', 'lama': '5',
  'enam': '6', 'keenam': '6', 'nam': '6', 'onam': '6', 'namnam': '6',
};

// Primary spoken forms for fuzzy matching numbers if direct lookup fails
const PRIMARY_SPOKEN_NUMBER_FORMS: { [key: string]: string[] } = {
  '1': ['satu', 'pertama'],
  '2': ['dua', 'kedua'],
  '3': ['tiga', 'ketiga'],
  '4': ['empat', 'keempat'],
  '5': ['lima', 'kelima'],
  '6': ['enam', 'keenam'],
};


export const HARAKAH_KEYWORDS = ['harakat', 'harakah', 'rakah', 'kakah', 'rak'];

// Keywords for modules and their primary forms for fuzzy matching
const MODULE_KEYWORDS = {
  bayyati: { primary: "bayyati", phrases: ["ba ya ti"] },
  hijaz: { primary: "hijaz", phrases: ["hi jazz"] }, // "hi jazz" is more a phrase variant
  nahawand: { primary: "nahawand", phrases: ["na ha wand"] },
};

const TYPE_KEYWORDS = {
  bacaan: ["bacaan", "baca"],
  humming: ["humming", "hamin", "hami"],
};


export const parseTarannumCommand = (command: string): ParsedTarannumCommand | null => {
  const lowerCommand = command.toLowerCase().trim();
  const words = lowerCommand.split(' ').filter(w => w.length > 0);
  const result: ParsedTarannumCommand = { module: null, type: null, harakah: null };

  // 1. Identify module using fuzzy matching on words and phrase checks
  for (const word of words) {
    if (isSimilar(word, MODULE_KEYWORDS.bayyati.primary, getFuzzyThreshold(MODULE_KEYWORDS.bayyati.primary))) {
      result.module = 'bayyati';
      break;
    }
    if (isSimilar(word, MODULE_KEYWORDS.hijaz.primary, getFuzzyThreshold(MODULE_KEYWORDS.hijaz.primary))) {
      result.module = 'hijaz';
      break;
    }
    if (isSimilar(word, MODULE_KEYWORDS.nahawand.primary, getFuzzyThreshold(MODULE_KEYWORDS.nahawand.primary)) || 
        isSimilar(word, "nahawan", getFuzzyThreshold("nahawan")) || // common variation for nahawand
        isSimilar(word, "hawan", getFuzzyThreshold("hawan"))) {     // shorter common variation
      result.module = 'nahawand';
      break;
    }
  }
  // Phrase-based checks as fallback or for specific multi-word utterances
  if (!result.module) {
    if (lowerCommand.includes(MODULE_KEYWORDS.bayyati.phrases[0])) result.module = 'bayyati';
    else if (lowerCommand.includes(MODULE_KEYWORDS.hijaz.phrases[0])) result.module = 'hijaz';
    else if (lowerCommand.includes(MODULE_KEYWORDS.nahawand.phrases[0])) result.module = 'nahawand';
  }


  // 2. Identify type using fuzzy matching on words
  for (const word of words) {
    if (TYPE_KEYWORDS.bacaan.some(kw => isSimilar(word, kw, getFuzzyThreshold(kw)))) {
      result.type = 'bacaan';
      break;
    }
    if (TYPE_KEYWORDS.humming.some(kw => isSimilar(word, kw, getFuzzyThreshold(kw)))) {
      result.type = 'humming';
      break;
    }
  }

  // 3. Identify harakah keyword and number
  const harakahKeywordIndex = words.findIndex(word =>
    HARAKAH_KEYWORDS.some(kw => isSimilar(word, kw, getFuzzyThreshold(kw)))
  );

  if (harakahKeywordIndex !== -1 && harakahKeywordIndex + 1 < words.length) {
    const numberWord = words[harakahKeywordIndex + 1];
    
    // Try direct lookup in spokenNumberToDigit (covers many exact variations)
    if (spokenNumberToDigit[numberWord]) {
      result.harakah = spokenNumberToDigit[numberWord];
    } 
    // Check if the word itself is a digit
    else if (/^\d$/.test(numberWord) && parseInt(numberWord) >= 1 && parseInt(numberWord) <= 6) {
      result.harakah = numberWord;
    } 
    // Try fuzzy matching against primary spoken forms
    else {
      for (const digitKey in PRIMARY_SPOKEN_NUMBER_FORMS) {
        const primaryForms = PRIMARY_SPOKEN_NUMBER_FORMS[digitKey];
        if (primaryForms.some(form => isSimilar(numberWord, form, getFuzzyThreshold(form)))) {
          result.harakah = digitKey;
          break;
        }
      }
    }
  }

  // Only return a valid command if all parts are found
  if (result.module && result.type && result.harakah) {
    return result;
  }
  return null;
};
