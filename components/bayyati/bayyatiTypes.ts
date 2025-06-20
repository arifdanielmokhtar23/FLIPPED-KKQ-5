export type HarakahOptionValue = "1" | "2" | "3" | "4" | "5" | "6";
export type HummingOptionValue = "1" | "2" | "3" | "4" | "5" | "6"; // Can be same as Harakah if values overlap

export interface DropdownOption<T extends string = string> { // Made T default to string
  value: T;
  label: string;
}

export interface Verse {
  id: string;
  number: number | string; // Updated to allow string for ranges like "153-154"
  text: string;
}

export interface ArrowPattern {
  row1: string[]; // AWALAN
  row2: string[]; // PERTENGAHAN
  row3: string[]; // AKHIRAN
}

export interface ArrowPatterns {
  [key: string]: ArrowPattern;
}

export interface IconProps {
  className?: string;
}