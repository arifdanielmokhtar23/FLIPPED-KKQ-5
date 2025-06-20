
export type NahawandHarakahOptionValue = "1" | "2" | "3" | "4" | "5";
export type NahawandHummingOptionValue = "1" | "2" | "3" | "4" | "5";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
}

export interface Verse {
  id: string;
  number: number | string; // To allow string for ranges like "153-154" or distinct parts of a verse
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
