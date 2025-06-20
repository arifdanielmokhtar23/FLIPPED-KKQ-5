// Fungsi kira jarak Levenshtein
export function levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment along the first row of each column
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitute
          matrix[i][j - 1] + 1,     // insert
          matrix[i - 1][j] + 1      // delete
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function isSimilar(text1: string, text2: string, threshold: number): boolean {
  if (!text1 || !text2) return false;
  const distance = levenshteinDistance(text1.toLowerCase(), text2.toLowerCase());
  return distance <= threshold;
}

export const getFuzzyThreshold = (keyword: string): number => {
  const len = keyword.length;
  if (len <= 1) return 0; // Exact match for 1-char words
  if (len >= 2 && len <= 4) return 1; // Max 1 error for 2-4 char words (e.g., "rak", "dua", "satu", "baca")
  // Covers: "rak", "dua", "pat", "nam", "satu", "lima", "baca", "kaka", "enam"
  return 2; // Max 2 errors for 5+ char words (e.g., "bayyati", "hijaz", "nahawand", "harakat", "rakah", "empat", "bacaan", "humming")
};
