/**
 * MIDI STUDIO — Sidebar Component v3.0
 * Workspaces list con iconos coloridos
 * 
 * PIXEL territory — Navigation UI
 */

import { uiStore } from '../../store/ui';
// folderIcon se usa en futuras versiones

// ─── Tipos ────────────────────────────────────────────────────────
export interface WorkspaceItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  active: boolean;
  agentCount: number;
}

// ─── Datos Mock ──────────────────────────────────────────────────
const MOCK_WORKSPACES: WorkspaceItem[] = [
  { id: 'super-prueba', name: 'super prueba', icon: '📁', color: '#22C55E', active: false, agentCount: 12 },
  { id: 'prueba-midi', name: 'prueba midi project', icon: '📁', color: '#22C55E', active: false, agentCount: 12 },
  { id: 'smoke-test', name: 'SMOKE_TEST_PROJECT', icon: '📁', color: '#EF4444', active: true, agentCount: 12 },
];

// ─── Clase Sidebar ──────────────────────────────────────────────
export class Sidebar {
  private container: HTMLElement;
  private workspaces: WorkspaceItem[] = [...MOCK_WORKSPACES];

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.attachEvents();
  }

  render(): void {
    this.container.innerHTML = `
      <div class="workspaces-list">
        ${this.workspaces.map(ws => this.renderWorkspaceItem(ws)).join('')}
      </div>
    `;
  }

  private renderWorkspaceItem(ws: WorkspaceItem): string {
    return `
      <div class="workspace-item ${ws.active ? 'active' : ''}" data-id="${ws.id}">
        <div class="workspace-icon-square" style="background: ${ws.color};">
          <span class="workspace-initial">${ws.name.charAt(0).toUpperCase()}</span>
        </div>
        <span class="workspace-name">${ws.name}</span>
        <span class="workspace-badge">${ws.agentCount}</span>
      </div>
    `;
  }

  private attachEvents(): void {
    this.container.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.workspace-item');
      if (!target) return;

      const id = target.getAttribute('data-id');
      if (!id) return;

      this.setActiveWorkspace(id);
    });
  }

  setActiveWorkspace(id: string): void {
    this.workspaces.forEach(ws => {
      ws.active = ws.id === id;
    });

    // Actualizar UI
    this.container.querySelectorAll('.workspace-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-id') === id);
    });

    uiStore.setActiveProject(id);
  }

  addWorkspace(workspace: WorkspaceItem): void {
    this.workspaces.push(workspace);
    this.render();
  }

  removeWorkspace(id: string): void {
    this.workspaces = this.workspaces.filter(ws => ws.id !== id);
    this.render();
  }
}
