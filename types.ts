
export interface MiniGameLink {
  id: string;
  name: string;
  url:string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isLoading?: boolean; // Added for AI thinking state
}

export type SectionId = 
  | 'home' 
  | 'modul-teks' 
  | 'bayyati-content' 
  | 'hijaz-content' 
  | 'nahawand-content' 
  | 'tyson-assistant' 
  | 'hantar-rakaman' 
  | 'game';

export interface Tarannum {
  id: string;
  name: string;
  description: string;
  iconClass: string;
  bgColor: string;
  textColor: string;
  targetSection: SectionId;
}

export interface TextModule {
  id: string;
  title: string;
  description: string; // Will not be managed by new UI, but kept in type
  link: string;
  content: string; 
}

export interface RelatedLink {
  id: string;
  text: string;
  url: string;
  iconClass?: string; // Made optional for admin-added links
  iconColor?: string; // Made optional for admin-added links
}

export interface HomeworkLink {
  id: 'homeworkLink1' | 'homeworkLink2'; // Specific IDs for the two links
  text: string;
  url: string;
  gradientClass: string; // To maintain specific styling
}

// Updated NavItem type
export interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
  ariaLabelOverride?: string; // Optional field for TTS pronunciation
}