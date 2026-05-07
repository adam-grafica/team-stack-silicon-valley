/**
 * MIDI STUDIO — Icon System v3.0
 * SVG Icons inline — Zero dependencies
 * 
 * PIXEL territory — Iconography
 */

// ─── Icon Interface ───────────────────────────────────────────────
export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// ─── Helper para crear SVG ──────────────────────────────────────
function createSVG(path: string, props: IconProps = {}): string {
  const { size = 16, color = 'currentColor', className = '' } = props;
  
  return `<svg 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="${color}" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    ${path}
  </svg>`;
}

// ─── Logo ────────────────────────────────────────────────────────
export const logoIcon = (props: IconProps = {}) => createSVG(`
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <line x1="9" y1="9" x2="9" y2="15"/>
  <line x1="12" y1="7" x2="12" y2="17"/>
  <line x1="15" y1="11" x2="15" y2="13"/>
`, props);

// ─── Navigation ────────────────────────────────────────────────
export const folderIcon = (props: IconProps = {}) => createSVG(`
  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
`, props);

export const folderOpenIcon = (props: IconProps = {}) => createSVG(`
  <path d="M6 14l1.5-2.5A2 2 0 0 1 9.3 10.5H20a2 2 0 0 1 2 2v.5a2 2 0 0 1-2 2H6z"/>
  <path d="M2 10.5V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v.5"/>
`, props);

export const fileIcon = (props: IconProps = {}) => createSVG(`
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="16" y1="13" x2="8" y2="13"/>
  <line x1="16" y1="17" x2="8" y2="17"/>
`, props);

// ─── Agents ─────────────────────────────────────────────────────
export const botIcon = (props: IconProps = {}) => createSVG(`
  <rect x="3" y="11" width="18" height="10" rx="2"/>
  <circle cx="12" cy="5" r="2"/>
  <path d="M12 7v4"/>
  <line x1="8" y1="16" x2="8" y2="16"/>
  <line x1="16" y1="16" x2="16" y2="16"/>
`, props);

export const cpuIcon = (props: IconProps = {}) => createSVG(`
  <rect x="4" y="4" width="16" height="16" rx="2"/>
  <rect x="9" y="9" width="6" height="6"/>
  <line x1="9" y1="1" x2="9" y2="4"/>
  <line x1="15" y1="1" x2="15" y2="4"/>
  <line x1="9" y1="20" x2="9" y2="23"/>
  <line x1="15" y1="20" x2="15" y2="23"/>
  <line x1="20" y1="9" x2="23" y2="9"/>
  <line x1="20" y1="14" x2="23" y2="14"/>
  <line x1="1" y1="9" x2="4" y2="9"/>
  <line x1="1" y1="14" x2="4" y2="14"/>
`, props);

// ─── Terminal ───────────────────────────────────────────────────
export const terminalIcon = (props: IconProps = {}) => createSVG(`
  <polyline points="4 17 10 11 4 5"/>
  <line x1="12" y1="19" x2="20" y2="19"/>
`, props);

export const monitorIcon = (props: IconProps = {}) => createSVG(`
  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
  <line x1="8" y1="21" x2="16" y2="21"/>
  <line x1="12" y1="17" x2="12" y2="21"/>
`, props);

// ─── Theme ──────────────────────────────────────────────────────
export const moonIcon = (props: IconProps = {}) => createSVG(`
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
`, props);

export const sunIcon = (props: IconProps = {}) => createSVG(`
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
`, props);

// ─── Settings ───────────────────────────────────────────────────
export const settingsIcon = (props: IconProps = {}) => createSVG(`
  <circle cx="12" cy="12" r="3"/>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 18.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 2.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 6.4 4.6a1.65 1.65 0 0 0 1.51-1H9a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
`, props);

// ─── Status ─────────────────────────────────────────────────────
export const checkCircleIcon = (props: IconProps = {}) => createSVG(`
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
  <polyline points="22 4 12 14.01 9 11.01"/>
`, props);

export const clockIcon = (props: IconProps = {}) => createSVG(`
  <circle cx="12" cy="12" r="10"/>
  <polyline points="12 6 12 12 16 14"/>
`, props);

export const gitBranchIcon = (props: IconProps = {}) => createSVG(`
  <line x1="6" y1="3" x2="6" y2="15"/>
  <circle cx="18" cy="6" r="3"/>
  <circle cx="6" cy="18" r="3"/>
  <path d="M18 9a9 9 0 0 1-9 9"/>
`, props);

// ─── Tools ──────────────────────────────────────────────────────
export const usersIcon = (props: IconProps = {}) => createSVG(`
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
`, props);

export const layoutIcon = (props: IconProps = {}) => createSVG(`
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <line x1="3" y1="9" x2="21" y2="9"/>
  <line x1="9" y1="21" x2="9" y2="9"/>
`, props);

export const editIcon = (props: IconProps = {}) => createSVG(`
  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
`, props);

export const globeIcon = (props: IconProps = {}) => createSVG(`
  <circle cx="12" cy="12" r="10"/>
  <line x1="2" y1="12" x2="22" y2="12"/>
  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
`, props);

export const activityIcon = (props: IconProps = {}) => createSVG(`
  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
`, props);

// ─── Actions ────────────────────────────────────────────────────
export const plusIcon = (props: IconProps = {}) => createSVG(`
  <line x1="12" y1="5" x2="12" y2="19"/>
  <line x1="5" y1="12" x2="19" y2="12"/>
`, props);

export const closeIcon = (props: IconProps = {}) => createSVG(`
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
`, props);

export const maximizeIcon = (props: IconProps = {}) => createSVG(`
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
`, props);

export const minimizeIcon = (props: IconProps = {}) => createSVG(`
  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
`, props);

export const moreVerticalIcon = (props: IconProps = {}) => createSVG(`
  <circle cx="12" cy="12" r="1"/>
  <circle cx="12" cy="5" r="1"/>
  <circle cx="12" cy="19" r="1"/>
`, props);

// ─── Status Dots ────────────────────────────────────────────────
export const statusDot = (color: string, size: number = 8) => `
  <svg width="${size}" height="${size}" viewBox="0 0 8 8" fill="${color}">
    <circle cx="4" cy="4" r="4"/>
  </svg>
`;

// ─── Helper para insertar iconos en DOM ──────────────────────────
export function insertIcon(element: HTMLElement, iconSVG: string): void {
  element.innerHTML = iconSVG;
}
