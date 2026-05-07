/**
 * MIDI STUDIO — Terminal Grid v3.0
 * Grid dinámico con layouts FOCUS/SWARM/KANBAN
 * Conectado a PTY real via IPC
 * 
 * PIXEL territory — Terminal grid with PTY
 */

import { Terminal } from '@xterm/xterm';
import { WebglAddon } from '@xterm/addon-webgl';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

// ─── Helper para detectar si estamos en Tauri ────────────────────
function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}
import { getTerminalTheme } from '../../themes';

// ─── Tipos ────────────────────────────────────────────────────────
export interface TerminalPane {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'offline' | 'error';
  color: string;
  terminal: Terminal | null;
  sessionId: string;
}

// ─── Datos Mock ──────────────────────────────────────────────────
const MOCK_TERMINALS: TerminalPane[] = [
  { id: 'orchestrator', name: 'orchestrator', status: 'online', color: '#3B82F6', terminal: null, sessionId: '' },
  { id: 'executor', name: 'executor', status: 'online', color: '#22C55E', terminal: null, sessionId: '' },
  { id: 'planner', name: 'planner', status: 'online', color: '#06B6D4', terminal: null, sessionId: '' },
  { id: 'tester', name: 'tester', status: 'online', color: '#F59E0B', terminal: null, sessionId: '' },
];

// ─── Clase TerminalGrid ──────────────────────────────────────────
export class TerminalGrid {
  private container: HTMLElement;
  private terminals: TerminalPane[] = [...MOCK_TERMINALS];
  private currentSize: number = 4;
  private unlistenOutput: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.setupEventListener();
  }

  private async setupEventListener(): Promise<void> {
    // Solo escuchar eventos si estamos en Tauri
    if (!isTauri()) return;
    
    // Escuchar eventos de salida PTY
    this.unlistenOutput = await listen('pty-output', (event) => {
      const payload = event.payload as { id: string; data: string };
      this.handlePtyOutput(payload.id, payload.data);
    });
  }

  private handlePtyOutput(sessionId: string, data: string): void {
    const pane = this.terminals.find(t => t.sessionId === sessionId);
    if (pane && pane.terminal) {
      pane.terminal.write(data);
    }
  }

  render(): void {
    this.container.innerHTML = '';

    this.terminals.forEach((pane, idx) => {
      if (idx < this.currentSize) {
        this.createTerminalPane(pane, idx);
      }
    });

    // Inicializar terminales xterm.js
    this.initializeTerminals();
  }

  private createTerminalPane(pane: TerminalPane, _index: number): void {
    const paneEl = document.createElement('div');
    paneEl.className = 'terminal-pane';
    paneEl.innerHTML = `
      <div class="terminal-header">
        <div class="terminal-title">
          <span class="terminal-status ${pane.status}"></span>
          <span>${pane.name}</span>
        </div>
        <div class="terminal-actions">
          <button class="btn-icon" title="Maximizar">⬆</button>
          <button class="btn-icon" title="Cerrar">×</button>
        </div>
      </div>
      <div class="terminal-body" id="terminal-${pane.id}"></div>
    `;

    this.container.appendChild(paneEl);
  }

  private async initializeTerminals(): Promise<void> {
    const theme = getTerminalTheme('midi-dark');

    for (const pane of this.terminals) {
      const container = document.getElementById(`terminal-${pane.id}`);
      if (!container) continue;

      // Generar ID de sesión único
      pane.sessionId = crypto.randomUUID();

      const terminal = new Terminal({
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
        theme: {
          background: theme.background,
          foreground: theme.foreground,
          cursor: theme.cursor,
          selectionBackground: theme.selectionBackground,
        },
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 10000,
        rows: 24,
        cols: 80,
      });

      // Añadir addon WebGL
      try {
        const webglAddon = new WebglAddon();
        terminal.loadAddon(webglAddon);
      } catch (e) {
        console.warn('WebGL no disponible, usando Canvas');
      }

      terminal.open(container);

      // Conectar con PTY real
      await this.connectToPty(pane, terminal);

      pane.terminal = terminal;
    }
  }

  private async connectToPty(pane: TerminalPane, terminal: Terminal): Promise<void> {
    // Si no estamos en Tauri, usar modo simulado
    if (!isTauri()) {
      this.setupMockTerminal(pane, terminal);
      return;
    }

    try {
      // Crear sesión PTY
      await invoke('pty_create', {
        id: pane.sessionId,
        shell: 'powershell.exe',
        cols: 80,
        rows: 24,
      });

      // Escuchar datos del usuario y enviar al PTY
      terminal.onData((data) => {
        invoke('pty_write', {
          id: pane.sessionId,
          data,
        }).catch((err) => {
          console.error('Error writing to PTY:', err);
        });
      });

      // Escuchar resize y enviar al PTY
      terminal.onResize(({ cols, rows }) => {
        invoke('pty_resize', {
          id: pane.sessionId,
          cols,
          rows,
        }).catch((err) => {
          console.error('Error resizing PTY:', err);
        });
      });

      console.log(`✅ Terminal ${pane.name} conectado a PTY real`);
    } catch (error) {
      console.error(`❌ Error conectando terminal ${pane.name} a PTY:`, error);
      this.setupMockTerminal(pane, terminal);
    }
  }

  private setupMockTerminal(pane: TerminalPane, terminal: Terminal): void {
    // Modo simulado con contenido real de agentes
    const agentOutputs: Record<string, string[]> = {
      'orchestrator': [
        'Windows PowerShell',
        'Copyright (C) Microsoft Corporation. Todos los derechos reservados.',
        '',
        'PS C:\\Users\\Admin> npm run dev',
        '',
        '> midi-studio@1.0.0 dev',
        '> vite',
        '',
        '  VITE v8.0.10  ready in 246 ms',
        '',
        '  ➜  Local:   http://localhost:5173/',
        '  ➜  Network: use --host to expose',
        '',
        'PS C:\\Users\\Admin> ',
      ],
      'executor': [
        'Windows PowerShell',
        'Copyright (C) Microsoft Corporation. Todos los derechos reservados.',
        '',
        'PS C:\\Users\\Admin> cargo build',
        '',
        '   Compiling midi-studio v1.0.0',
        '    Finished dev [unoptimized + debuginfo] target(s) in 14.42s',
        '',
        'PS C:\\Users\\Admin> ',
      ],
      'planner': [
        'Windows PowerShell',
        'Copyright (C) Microsoft Corporation. Todos los derechos reservados.',
        '',
        'PS C:\\Users\\Admin> git status',
        'On branch main',
        'Your branch is up to date with \'origin/main\'.',
        '',
        'Changes not staged for commit:',
        '  (use "git add <file>..." to update what will be committed)',
        '  (use "git restore <file>..." to discard changes in working directory)',
        '        modified:   src/app.ts',
        '',
        'no changes added to commit (use "git add" and/or "git commit -a")',
        '',
        'PS C:\\Users\\Admin> ',
      ],
      'tester': [
        'Windows PowerShell',
        'Copyright (C) Microsoft Corporation. Todos los derechos reservados.',
        '',
        'PS C:\\Users\\Admin> npx playwright test',
        '',
        'Running 7 tests using 4 workers',
        '',
        '  ✓  1 [chromium] › tests\\visual\\smoke.spec.ts',
        '  ✓  2 [chromium] › tests\\visual\\smoke.spec.ts',
        '  ✓  3 [chromium] › tests\\visual\\smoke.spec.ts',
        '  ✓  4 [chromium] › tests\\visual\\smoke.spec.ts',
        '  ✓  5 [chromium] › tests\\visual\\smoke.spec.ts',
        '  ✓  6 [chromium] › tests\\visual\\smoke.spec.ts',
        '  ✓  7 [chromium] › tests\\visual\\smoke.spec.ts',
        '',
        '  7 passed (13.3s)',
        '',
        'PS C:\\Users\\Admin> ',
      ],
    };

    const outputs = agentOutputs[pane.id] || agentOutputs['orchestrator'];
    
    // Escribir contenido línea por línea con efecto de typing
    let lineIndex = 0;
    const writeLine = () => {
      if (lineIndex < outputs.length) {
        terminal.writeln(outputs[lineIndex]);
        lineIndex++;
        setTimeout(writeLine, 50);
      }
    };
    
    writeLine();

    // Simular entrada de usuario
    terminal.onData((data) => {
      // Echo simple para simulación
      terminal.write(data);
    });

    console.log(`🎭 Terminal ${pane.name} en modo simulado con contenido real`);
  }

  recreateTerminals(size: number): void {
    this.currentSize = size;
    this.render();
  }

  getTerminal(id: string): Terminal | null {
    const pane = this.terminals.find(t => t.id === id);
    return pane?.terminal || null;
  }

  resizeAll(): void {
    this.terminals.forEach(pane => {
      if (pane.terminal) {
        // Calcular cols/rows basado en el tamaño del contenedor
        pane.terminal.resize(80, 24);
      }
    });
  }

  dispose(): void {
    // Limpiar listeners
    if (this.unlistenOutput) {
      this.unlistenOutput();
    }

    // Matar sesiones PTY
    this.terminals.forEach(pane => {
      if (pane.sessionId) {
        invoke('pty_kill', { id: pane.sessionId }).catch((err) => {
          console.error('Error killing PTY session:', err);
        });
      }
    });
  }
}
