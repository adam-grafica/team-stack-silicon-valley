/**
 * MIDI STUDIO — Tools Panel v3.0
 * Swarm / Kanban / Editor / Browser / Graph / Explorer
 * 
 * PIXEL territory — Tools UI
 */

import { FileExplorer } from '../explorer/explorer';
import { KanbanBoard } from '../kanban/kanban';
import { CodeEditor } from '../editor/editor';

// ─── Tipos ────────────────────────────────────────────────────────
export type ToolPanel = 'swarm' | 'kanban' | 'editor' | 'browser' | 'graph' | 'explorer';

// ─── Clase ToolsPanel ────────────────────────────────────────────
export class ToolsPanel {
  private container: HTMLElement;
  private activePanel: ToolPanel = 'swarm';
  private explorer: FileExplorer | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = '';

    switch (this.activePanel) {
      case 'swarm':
        this.renderSwarmPanel();
        break;
      case 'kanban':
        this.renderKanbanPanel();
        break;
      case 'editor':
        this.renderEditorPanel();
        break;
      case 'browser':
        this.renderBrowserPanel();
        break;
      case 'graph':
        this.renderGraphPanel();
        break;
      case 'explorer':
        this.renderExplorerPanel();
        break;
      default:
        this.renderSwarmPanel();
    }
  }

  private renderSwarmPanel(): void {
    this.container.innerHTML = `
      <div class="swarm-panel">
        <h3>Swarm Status</h3>
        <div class="agent-list">
          <div class="agent-item">
            <span class="agent-status online"></span>
            <span>ADAM — Orquestador</span>
          </div>
          <div class="agent-item">
            <span class="agent-status online"></span>
            <span>ATLAS — Arquitecto</span>
          </div>
          <div class="agent-item">
            <span class="agent-status busy"></span>
            <span>FORGE — Backend</span>
          </div>
          <div class="agent-item">
            <span class="agent-status online"></span>
            <span>PIXEL — Frontend</span>
          </div>
        </div>
      </div>
    `;
  }

  private renderKanbanPanel(): void {
    const kanbanContainer = document.createElement('div');
    kanbanContainer.className = 'kanban-container';
    this.container.innerHTML = '';
    this.container.appendChild(kanbanContainer);
    
    new KanbanBoard(kanbanContainer);
  }

  private renderEditorPanel(): void {
    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor-container';
    this.container.innerHTML = '';
    this.container.appendChild(editorContainer);
    
    new CodeEditor(editorContainer);
  }

  private renderBrowserPanel(): void {
    this.container.innerHTML = `
      <div class="browser-panel">
        <h3>Browser</h3>
        <p>Web browser integration</p>
      </div>
    `;
  }

  private renderGraphPanel(): void {
    this.container.innerHTML = `
      <div class="graph-panel">
        <h3>Agent Graph</h3>
        <p>Visual agent relationships</p>
      </div>
    `;
  }

  private renderExplorerPanel(): void {
    const explorerContainer = document.createElement('div');
    explorerContainer.className = 'explorer-container';
    this.container.innerHTML = '';
    this.container.appendChild(explorerContainer);
    
    this.explorer = new FileExplorer(explorerContainer);
    this.explorer.setOnFileSelect((path) => {
      console.log('📄 Archivo seleccionado:', path);
    });
  }

  setPanel(panel: ToolPanel): void {
    this.activePanel = panel;
    this.render();
  }
}
