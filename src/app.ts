/**
 * MIDI STUDIO — App Shell v3.1 BRIDGEMIND
 * Layout 3 columnas: Sidebar | Terminales | Panel Derecho
 * 
 * PIXEL territory — Application architecture
 */

import { Sidebar } from './components/sidebar/sidebar';
import { TerminalGrid } from './components/grid/grid';
import { RightPanel } from './components/rightpanel/rightpanel';
// import { VoiceButton } from './components/voicebutton/voicebutton'; // Deshabilitado temporalmente
// import { uiStore } from './store/ui'; // Se usará en futuras versiones

// ─── Tipos ────────────────────────────────────────────────────────
export type LayoutMode = 'focus' | 'swarm' | 'kanban';

export interface AppConfig {
  theme: string;
  layout: LayoutMode;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  activeProject: string | null;
}

// ─── Estado Global ───────────────────────────────────────────────
const config: AppConfig = {
  theme: 'midi-dark',
  layout: 'swarm',
  sidebarCollapsed: true,
  rightPanelCollapsed: false,
  activeProject: 'SMOKE_TEST_PROJECT',
};

// ─── Inicialización ─────────────────────────────────────────────
export function initializeApp(): void {
  console.log('🎹 MIDI Studio v3.1 BRIDGEMIND — Inicializando...');

  const app = document.getElementById('app');
  if (!app) {
    console.error('❌ No se encontró el contenedor #app');
    return;
  }

  // Limpiar contenido previo
  app.innerHTML = '';

  // Crear estructura principal 3 columnas
  app.className = 'app-shell';
  app.innerHTML = `
    <!-- Sidebar Izquierdo -->
    <aside class="sidebar-left ${config.sidebarCollapsed ? 'collapsed' : ''}" id="sidebar-left">
      <div class="sidebar-header">
        <span class="sidebar-title">WORKSPACES</span>
        <button class="btn-toggle-sidebar" id="toggle-sidebar" title="Colapsar/Expandir">
          ${config.sidebarCollapsed ? '›' : '‹'}
        </button>
      </div>
      <nav class="sidebar-nav" id="sidebar-nav"></nav>
      <div class="sidebar-footer">
        <span class="status-text">Online</span>
        <span class="version-text">v3.1</span>
      </div>
    </aside>

    <!-- Área Central — Terminales -->
    <main class="main-area" id="main-area">
      <!-- Tab Bar -->
      <div class="tab-bar" id="tab-bar">
        <div class="tab-list" id="tab-list">
          <div class="tab-item active" data-tab="orchestrator">
            <span class="tab-name">orchestrator</span>
            <div class="tab-actions">
              <button class="tab-btn" title="Editar">✏</button>
              <button class="tab-btn" title="Split">⬌</button>
              <button class="tab-btn" title="Maximizar">□</button>
              <button class="tab-btn" title="Cerrar">×</button>
            </div>
          </div>
          <div class="tab-item" data-tab="executor">
            <span class="tab-name">executor</span>
            <div class="tab-actions">
              <button class="tab-btn" title="Editar">✏</button>
              <button class="tab-btn" title="Split">⬌</button>
              <button class="tab-btn" title="Maximizar">□</button>
              <button class="tab-btn" title="Cerrar">×</button>
            </div>
          </div>
          <div class="tab-item" data-tab="planner">
            <span class="tab-name">planner</span>
            <div class="tab-actions">
              <button class="tab-btn" title="Editar">✏</button>
              <button class="tab-btn" title="Split">⬌</button>
              <button class="tab-btn" title="Maximizar">□</button>
              <button class="tab-btn" title="Cerrar">×</button>
            </div>
          </div>
          <div class="tab-item" data-tab="tester">
            <span class="tab-name">tester</span>
            <div class="tab-actions">
              <button class="tab-btn" title="Editar">✏</button>
              <button class="tab-btn" title="Split">⬌</button>
              <button class="tab-btn" title="Maximizar">□</button>
              <button class="tab-btn" title="Cerrar">×</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Grid de Terminales -->
      <div class="terminal-grid" id="terminal-grid"></div>
      
      <!-- Status Bar Global -->
      <div class="global-status" id="global-status">
        <span class="status-auto-mode">►► auto mode on</span>
        <span class="status-hint">(shift+tab to cycle)</span>
      </div>
    </main>

    <!-- Panel Derecho -->
    <aside class="right-panel ${config.rightPanelCollapsed ? 'collapsed' : ''}" id="right-panel">
      <div class="panel-switcher" id="panel-switcher">
        <button class="switcher-btn active" data-panel="browser" title="Browser">🌐</button>
        <button class="switcher-btn" data-panel="editor" title="Editor"></></button>
        <button class="switcher-btn" data-panel="swarm" title="Swarm">◈</button>
        <button class="switcher-btn" data-panel="canvas" title="Canvas">▢</button>
      </div>
      <div class="panel-content" id="panel-content"></div>
      <button class="btn-toggle-panel" id="toggle-panel" title="Colapsar/Expandir">
        ${config.rightPanelCollapsed ? '‹' : '›'}
      </button>
    </aside>
  `;

  // Inicializar componentes
  new Sidebar(document.getElementById('sidebar-nav')!);
  new TerminalGrid(document.getElementById('terminal-grid')!);
  new RightPanel(document.getElementById('panel-content')!);
  // VoiceButton se añadirá dentro del layout, no al body

  // Configurar eventos
  setupEventListeners();

  console.log('✅ MIDI Studio v3.1 BRIDGEMIND — Listo');
}

// ─── Event Listeners ─────────────────────────────────────────────
function setupEventListeners(): void {
  // Toggle sidebar
  document.getElementById('toggle-sidebar')?.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar-left');
    sidebar?.classList.toggle('collapsed');
    config.sidebarCollapsed = !config.sidebarCollapsed;
  });

  // Toggle right panel
  document.getElementById('toggle-panel')?.addEventListener('click', () => {
    const panel = document.getElementById('right-panel');
    panel?.classList.toggle('collapsed');
    config.rightPanelCollapsed = !config.rightPanelCollapsed;
  });

  // Tabs
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      target.classList.add('active');
    });
  });

  // Panel switcher
  document.querySelectorAll('.switcher-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      document.querySelectorAll('.switcher-btn').forEach(b => b.classList.remove('active'));
      target.classList.add('active');
    });
  });
}

// ─── API Pública ────────────────────────────────────────────────
export function getConfig(): AppConfig {
  return { ...config };
}
