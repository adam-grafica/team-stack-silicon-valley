/**
 * MIDI STUDIO — Code Editor v3.0
 * Editor de código con syntax highlighting básico
 * 
 * PIXEL territory — Code editor
 */

import { fileIcon } from '../../icons';

// ─── Tipos ────────────────────────────────────────────────────────
export interface EditorFile {
  path: string;
  name: string;
  content: string;
  language: string;
}

// ─── Datos Mock ──────────────────────────────────────────────────
const MOCK_FILES: EditorFile[] = [
  {
    path: '/src/main.ts',
    name: 'main.ts',
    content: `import { initializeApp } from './app';

console.log('🎹 MIDI Studio v3.0');

initializeApp();`,
    language: 'typescript',
  },
  {
    path: '/src/app.ts',
    name: 'app.ts',
    content: `export function initializeApp(): void {
  console.log('Inicializando aplicación...');
}`,
    language: 'typescript',
  },
];

// ─── Clase CodeEditor ────────────────────────────────────────────
export class CodeEditor {
  private container: HTMLElement;
  private files: EditorFile[] = [...MOCK_FILES];
  private activeFile: EditorFile | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = `
      <div class="code-editor">
        <div class="editor-tabs">
          ${this.files.map(file => this.renderTab(file)).join('')}
        </div>
        <div class="editor-content">
          ${this.activeFile ? this.renderEditor(this.activeFile) : this.renderEmptyState()}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private renderTab(file: EditorFile): string {
    const isActive = this.activeFile?.path === file.path;
    return `
      <div class="editor-tab ${isActive ? 'active' : ''}" data-path="${file.path}">
        ${fileIcon({size: 14})}
        <span>${file.name}</span>
        <button class="btn-close-tab" data-path="${file.path}">×</button>
      </div>
    `;
  }

  private renderEditor(file: EditorFile): string {
    const lines = file.content.split('\n');
    const highlightedContent = this.highlightSyntax(file.content, file.language);

    return `
      <div class="editor-code">
        <div class="line-numbers">
          ${lines.map((_, index) => `<div class="line-number">${index + 1}</div>`).join('')}
        </div>
        <div class="code-content">
          ${highlightedContent}
        </div>
      </div>
    `;
  }

  private renderEmptyState(): string {
    return `
      <div class="editor-empty">
        <p>Selecciona un archivo para editar</p>
      </div>
    `;
  }

  private highlightSyntax(content: string, _language: string): string {
    // Syntax highlighting básico
    const lines = content.split('\n');
    
    return lines.map(line => {
      let highlighted = this.escapeHtml(line);
      
      // Resaltar strings
      highlighted = highlighted.replace(/(['"`])(.*?)(\1)/g, '<span class="syntax-string">$1$2$3</span>');
      
      // Resaltar keywords
      const keywords = ['import', 'export', 'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type'];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="syntax-keyword">$1</span>');
      });
      
      // Resaltar comentarios
      highlighted = highlighted.replace(/(\/\/.*$)/g, '<span class="syntax-comment">$1</span>');
      
      // Resaltar números
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>');
      
      return `<div class="code-line">${highlighted}</div>`;
    }).join('');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private attachEvents(): void {
    // Click en tabs
    this.container.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const path = (e.currentTarget as HTMLElement).getAttribute('data-path');
        if (path) this.openFile(path);
      });
    });

    // Cerrar tabs
    this.container.querySelectorAll('.btn-close-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const path = (e.target as HTMLElement).getAttribute('data-path');
        if (path) this.closeFile(path);
      });
    });
  }

  openFile(path: string): void {
    const file = this.files.find(f => f.path === path);
    if (file) {
      this.activeFile = file;
      this.render();
    }
  }

  closeFile(path: string): void {
    const index = this.files.findIndex(f => f.path === path);
    if (index > -1) {
      this.files.splice(index, 1);
      if (this.activeFile?.path === path) {
        this.activeFile = this.files.length > 0 ? this.files[0] : null;
      }
      this.render();
    }
  }

  addFile(file: EditorFile): void {
    this.files.push(file);
    this.activeFile = file;
    this.render();
  }
}
