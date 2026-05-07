/**
 * MIDI STUDIO — Theme System v3.0
 * Gestión de themes intercambiables
 * 
 * PIXEL territory — Theme engine
 */

// ─── Tipos ────────────────────────────────────────────────────────
export interface ThemeConfig {
  name: string;
  background: string;
  foreground: string;
  cursor: string;
  accent: string;
  selection: string;
}

export interface TerminalTheme {
  background: string;
  foreground: string;
  cursor: string;
  selectionBackground: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

// ─── Themes Oficiales ────────────────────────────────────────────
export const themes: Record<string, ThemeConfig> = {
  'midi-dark': {
    name: 'MIDI Dark',
    background: '#0D0D0B',
    foreground: '#F8F8F2',
    cursor: '#4AF2A1',
    accent: '#6366F1',
    selection: '#6366F140',
  },
  'midi-midnight': {
    name: 'MIDI Midnight',
    background: '#060610',
    foreground: '#E2E8F0',
    cursor: '#818CF8',
    accent: '#6366F1',
    selection: '#6366F140',
  },
  'midi-forest': {
    name: 'MIDI Forest',
    background: '#0A0F0A',
    foreground: '#D4EDDA',
    cursor: '#4AF2A1',
    accent: '#22C55E',
    selection: '#22C55E40',
  },
  'midi-ember': {
    name: 'MIDI Ember',
    background: '#0F0A06',
    foreground: '#F5E6D3',
    cursor: '#FB923C',
    accent: '#F97316',
    selection: '#F9731640',
  },
  'midi-arctic': {
    name: 'MIDI Arctic',
    background: '#0A0D12',
    foreground: '#E8EEF4',
    cursor: '#67E8F9',
    accent: '#06B6D4',
    selection: '#06B6D440',
  },
};

// ─── Theme por defecto ──────────────────────────────────────────
export const defaultTheme = 'midi-dark';

// ─── Funciones ───────────────────────────────────────────────────
export function getTheme(name: string): ThemeConfig {
  return themes[name] || themes[defaultTheme];
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(themes);
}

export function getTerminalTheme(name: string): TerminalTheme {
  const theme = getTheme(name);
  return {
    background: theme.background,
    foreground: theme.foreground,
    cursor: theme.cursor,
    selectionBackground: theme.selection,
    black: '#000000',
    red: '#F87171',
    green: '#4AF2A1',
    yellow: '#FBBF24',
    blue: '#60A5FA',
    magenta: '#A78BFA',
    cyan: '#67E8F9',
    white: '#F8F8F2',
    brightBlack: '#4A4A48',
    brightRed: '#FCA5A5',
    brightGreen: '#86EFAC',
    brightYellow: '#FDE68A',
    brightBlue: '#93C5FD',
    brightMagenta: '#C4B5FD',
    brightCyan: '#A5F3FC',
    brightWhite: '#FFFFFF',
  };
}
