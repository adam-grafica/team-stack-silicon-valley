/**
 * MIDI STUDIO — Right Panel v3.1 BRIDGEMIND
 * Browser embebido + Icon Switcher
 * 
 * PIXEL territory — Right panel
 */

// ─── Tipos ────────────────────────────────────────────────────────
export type PanelView = 'browser' | 'editor' | 'swarm' | 'canvas';

// ─── Clase RightPanel ────────────────────────────────────────────
export class RightPanel {
  private container: HTMLElement;
  private activeView: PanelView = 'browser';

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = '';

    switch (this.activeView) {
      case 'browser':
        this.renderBrowser();
        break;
      case 'editor':
        this.renderEditor();
        break;
      case 'swarm':
        this.renderSwarm();
        break;
      case 'canvas':
        this.renderCanvas();
        break;
      default:
        this.renderBrowser();
    }
  }

  private renderBrowser(): void {
    this.container.innerHTML = `
      <div class="browser-panel">
        <div class="browser-header">
          <span class="browser-label">Browser</span>
          <div class="browser-url-bar">
            <input type="text" class="browser-url-input" value="http://localhost:3006/" readonly>
          </div>
          <button class="browser-menu-btn" title="Menú">≡</button>
        </div>
        <div class="browser-content">
          <iframe src="http://localhost:3006/" class="browser-iframe" sandbox="allow-scripts allow-same-origin"></iframe>
        </div>
      </div>
    `;
  }

  private renderEditor(): void {
    this.container.innerHTML = `
      <div class="editor-panel">
        <div class="editor-header">
          <span class="editor-label">Code Editor</span>
        </div>
        <div class="editor-content">
          <p class="editor-placeholder">Select a file to edit</p>
        </div>
      </div>
    `;
  }

  private renderSwarm(): void {
    this.container.innerHTML = `
      <div class="swarm-panel">
        <div class="swarm-header">
          <span class="swarm-label">Swarm Status</span>
        </div>
        <div class="swarm-content">
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
      </div>
    `;
  }

  private renderCanvas(): void {
    this.container.innerHTML = `
      <div class="canvas-panel">
        <div class="canvas-header">
          <span class="canvas-label">Canvas</span>
        </div>
        <div class="canvas-content">
          <p class="canvas-placeholder">Visual canvas for agent workflows</p>
        </div>
      </div>
    `;
  }

  setView(view: PanelView): void {
    this.activeView = view;
    this.render();
  }
}
