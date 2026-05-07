/**
 * MIDI STUDIO — Terminal Component
 * Wrapper de xterm.js para terminal integrada
 * 
 * PIXEL territory — Terminal UI
 */

import { Terminal } from '@xterm/xterm';
import { WebglAddon } from '@xterm/addon-webgl';
import { uiStore } from '../../store/ui';

// ─── Clase TerminalPanel ────────────────────────────────────────
export class TerminalPanel {
  private container: HTMLElement;
  private terminal: Terminal | null = null;
  private webglAddon: WebglAddon | null = null;
  private isOpen: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = `
      <div class="terminal-panel ${this.isOpen ? 'open' : ''}">
        <div class="terminal-header">
          <div class="terminal-tabs">
            <button class="tab active" data-tab="main">Terminal</button>
            <button class="tab" data-tab="logs">Logs</button>
          </div>
          <div class="terminal-actions">
            <button class="btn-icon" id="terminal-clear" title="Limpiar">🗑️</button>
            <button class="btn-icon" id="terminal-toggle" title="Minimizar">⬇️</button>
          </div>
        </div>
        <div class="terminal-body">
          <div id="xterm-container" class="xterm-container"></div>
        </div>
        <div class="terminal-input">
          <span class="prompt">$</span>
          <input type="text" class="command-input" placeholder="Escribe un comando..." />
          <button class="btn-send">➤</button>
        </div>
      </div>
    `;

    this.initializeXTerm();
    this.attachEvents();
  }

  private async initializeXTerm(): Promise<void> {
    const xtermContainer = this.container.querySelector('#xterm-container');
    if (!xtermContainer) return;

    this.terminal = new Terminal({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      theme: {
        background: '#0a0a0a',
        foreground: '#e0e0e0',
        cursor: '#00ff88',
        selectionBackground: '#1a3a2a',
      },
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 10000,
      rows: 20,
      cols: 80,
    });

    // Añadir addon WebGL para rendimiento
    try {
      this.webglAddon = new WebglAddon();
      this.terminal.loadAddon(this.webglAddon);
    } catch (e) {
      console.warn('WebGL no disponible, usando renderizado Canvas');
    }

    this.terminal.open(xtermContainer as HTMLElement);

    // Mensaje de bienvenida
    this.terminal.writeln('🎹 MIDI Studio Terminal v1.0');
    this.terminal.writeln('Type \x1b[32mhelp\x1b[0m for available commands');
    this.terminal.writeln('');
    this.terminal.write('$ ');
  }

  private attachEvents(): void {
    // Toggle terminal
    this.container.querySelector('#terminal-toggle')?.addEventListener('click', () => {
      this.toggle();
    });

    // Clear terminal
    this.container.querySelector('#terminal-clear')?.addEventListener('click', () => {
      this.terminal?.clear();
    });

    // Input de comandos
    const input = this.container.querySelector('.command-input') as HTMLInputElement;
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(input.value);
        input.value = '';
      }
    });

    // Botón send
    this.container.querySelector('.btn-send')?.addEventListener('click', () => {
      if (input.value.trim()) {
        this.executeCommand(input.value);
        input.value = '';
      }
    });
  }

  private executeCommand(command: string): void {
    if (!this.terminal) return;

    this.terminal.writeln(command);

    // Comandos básicos
    const cmd = command.trim().toLowerCase();
    switch (cmd) {
      case 'help':
        this.terminal.writeln('Available commands:');
        this.terminal.writeln('  help     - Show this help');
        this.terminal.writeln('  clear    - Clear terminal');
        this.terminal.writeln('  agents   - List agents');
        this.terminal.writeln('  status   - System status');
        break;
      case 'clear':
        this.terminal.clear();
        break;
      case 'agents':
        this.terminal.writeln('Active agents: 8');
        this.terminal.writeln('  ADAM, ATLAS, FORGE, PIXEL, SENTINEL, HERALD, NEXUS, CIPHER');
        break;
      case 'status':
        this.terminal.writeln('System status: 🟢 Online');
        this.terminal.writeln('All systems operational');
        break;
      default:
        this.terminal.writeln(`Command not found: ${command}`);
    }

    this.terminal.write('$ ');
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.container.querySelector('.terminal-panel')?.classList.toggle('open', this.isOpen);
    uiStore.setTerminalOpen(this.isOpen);
  }

  focus(): void {
    if (!this.isOpen) {
      this.toggle();
    }
    (this.container.querySelector('.command-input') as HTMLElement)?.focus();
  }

  write(message: string): void {
    this.terminal?.writeln(message);
  }
}
