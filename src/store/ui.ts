/**
 * MIDI STUDIO — UI Store v3.0
 * Estado global de la interfaz
 * 
 * FORGE territory — UI state management
 */

// ─── Tipos ────────────────────────────────────────────────────────
export type Theme = 'midi-dark' | 'midi-midnight' | 'midi-forest' | 'midi-ember' | 'midi-arctic';
export type LayoutMode = 'focus' | 'swarm' | 'kanban';
export type ActivePanel = 'swarm' | 'kanban' | 'editor' | 'browser' | 'graph';

export interface UIState {
  theme: Theme;
  layout: LayoutMode;
  sidebarCollapsed: boolean;
  activePanel: ActivePanel;
  activeProject: string | null;
  terminalOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

// ─── Estado Inicial ───────────────────────────────────────────────
const initialState: UIState = {
  theme: 'midi-dark',
  layout: 'swarm',
  sidebarCollapsed: false,
  activePanel: 'swarm',
  activeProject: null,
  terminalOpen: false,
  notifications: [],
};

// ─── Store ──────────────────────────────────────────────────────
class UIStore {
  private state: UIState = { ...initialState };
  private listeners: Set<(state: UIState) => void> = new Set();

  // Getters
  getState(): UIState {
    return { ...this.state };
  }

  getTheme(): Theme {
    return this.state.theme;
  }

  getLayout(): LayoutMode {
    return this.state.layout;
  }

  getActivePanel(): ActivePanel {
    return this.state.activePanel;
  }

  getActiveProject(): string | null {
    return this.state.activeProject;
  }

  isSidebarCollapsed(): boolean {
    return this.state.sidebarCollapsed;
  }

  isTerminalOpen(): boolean {
    return this.state.terminalOpen;
  }

  // Setters
  setTheme(theme: Theme): void {
    this.state.theme = theme;
    this.applyTheme(theme);
    this.notifyListeners();
  }

  setLayout(layout: LayoutMode): void {
    this.state.layout = layout;
    this.notifyListeners();
  }

  setActivePanel(panel: ActivePanel): void {
    this.state.activePanel = panel;
    this.notifyListeners();
  }

  setActiveProject(project: string): void {
    this.state.activeProject = project;
    this.notifyListeners();
  }

  toggleSidebar(): void {
    this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
    this.notifyListeners();
  }

  setTerminalOpen(open: boolean): void {
    this.state.terminalOpen = open;
    this.notifyListeners();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    this.state.notifications = [...this.state.notifications, newNotification];
    this.notifyListeners();
  }

  removeNotification(id: string): void {
    this.state.notifications = this.state.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Helpers
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  onChange(listener: (state: UIState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const uiStore = new UIStore();
