export enum AppMode {
  CHAT = 'CHAT',
  SUMMARIZE = 'SUMMARIZE',
  WRITE = 'WRITE',
  SEARCH = 'SEARCH',
  FIND = 'FIND',
  TRANSLATE = 'TRANSLATE'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  ENTHUSIASTIC = 'Enthusiastic',
  CONCISE = 'Concise'
}

export interface RewriteConfig {
  text: string;
  tone: Tone;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundingResult {
  text: string;
  sources: GroundingSource[];
}
