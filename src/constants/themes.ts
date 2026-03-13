export interface Theme {
  isDark: boolean;
  bg: string;
  surface: string;
  card: string;
  border: string;
  borderStrong: string;
  text: string;
  textSub: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
  userBubbleBg: string;
  userBubbleText: string;
  assistantBubbleBg: string;
  assistantBubbleText: string;
  statusBar: 'light-content' | 'dark-content';
}

export const DARK: Theme = {
  isDark: true,
  bg: '#0D0D0D',
  surface: '#111111',
  card: '#161616',
  border: '#1E1E1E',
  borderStrong: '#2A2A2A',
  text: '#FFFFFF',
  textSub: '#888888',
  textMuted: '#444444',
  inputBg: '#161616',
  inputBorder: '#2A2A2A',
  userBubbleBg: '#FFFFFF',
  userBubbleText: '#000000',
  assistantBubbleBg: '#161616',
  assistantBubbleText: '#E8E8E8',
  statusBar: 'light-content',
};

export const LIGHT: Theme = {
  isDark: false,
  bg: '#F5F0E8',
  surface: '#FDFAF4',
  card: '#FFFFFF',
  border: '#E8DFC8',
  borderStrong: '#D0C4AA',
  text: '#1A1105',
  textSub: '#6B5A3E',
  textMuted: '#B8A88A',
  inputBg: '#FFFFFF',
  inputBorder: '#D0C4AA',
  userBubbleBg: '#2C1F0E',
  userBubbleText: '#FFFFFF',
  assistantBubbleBg: '#FFFFFF',
  assistantBubbleText: '#1A1105',
  statusBar: 'dark-content',
};
