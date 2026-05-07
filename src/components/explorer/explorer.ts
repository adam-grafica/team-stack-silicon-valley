/**
 * MIDI STUDIO — File Explorer v3.0
 * Explorador de archivos tipo VS Code
 * 
 * PIXEL territory — File explorer
 */

import { fileIcon, folderIcon, folderOpenIcon } from '../../icons';

// ─── Tipos ────────────────────────────────────────────────────────
export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
  isOpen?: boolean;
}

// ─── Datos Mock ──────────────────────────────────────────────────
const MOCK_FILE_TREE: FileNode[] = [
  {
    name: 'smoke_test',
    type: 'directory',
    path: '/smoke_test',
    isOpen: true,
    children: [
      {
        name: 'src',
        type: 'directory',
        path: '/smoke_test/src',
        isOpen: false,
        children: [
          { name: 'index.ts', type: 'file', path: '/smoke_test/src/index.ts' },
          { name: 'app.ts', type: 'file', path: '/smoke_test/src/app.ts' },
        ],
      },
      { name: 'package.json', type: 'file', path: '/smoke_test/package.json' },
      { name: 'README.md', type: 'file', path: '/smoke_test/README.md' },
    ],
  },
];

// ─── Clase FileExplorer ──────────────────────────────────────────
export class FileExplorer {
  private container: HTMLElement;
  private fileTree: FileNode[] = [...MOCK_FILE_TREE];
  private onFileSelect: ((path: string) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = `
      <div class="explorer-header">
        <span>EXPLORER</span>
        <div class="explorer-actions">
          <button class="btn-icon" title="Nuevo archivo">+</button>
          <button class="btn-icon" title="Nueva carpeta">📁</button>
          <button class="btn-icon" title="Refrescar">↻</button>
        </div>
      </div>
      <div class="explorer-tree">
        ${this.renderNodes(this.fileTree, 0)}
      </div>
    `;

    this.attachEvents();
  }

  private renderNodes(nodes: FileNode[], depth: number): string {
    return nodes.map(node => this.renderNode(node, depth)).join('');
  }

  private renderNode(node: FileNode, depth: number): string {
    const indent = depth * 12;
    const isDirectory = node.type === 'directory';
    const hasChildren = isDirectory && node.children && node.children.length > 0;

    return `
      <div class="file-node ${isDirectory ? 'directory' : 'file'}" data-path="${node.path}">
        <div class="file-node-content" style="padding-left: ${indent}px;">
          ${isDirectory ? `<span class="toggle-icon ${node.isOpen ? 'open' : ''}">▶</span>` : '<span class="toggle-icon"></span>'}
          <span class="file-icon">
            ${isDirectory ? (node.isOpen ? folderOpenIcon({size: 14}) : folderIcon({size: 14})) : fileIcon({size: 14})}
          </span>
          <span class="file-name">${node.name}</span>
        </div>
        ${hasChildren && node.isOpen ? `
          <div class="file-children">
            ${this.renderNodes(node.children!, depth + 1)}
          </div>
        ` : ''}
      </div>
    `;
  }

  private attachEvents(): void {
    this.container.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.file-node');
      if (!target) return;

      const path = target.getAttribute('data-path');
      if (!path) return;

      const node = this.findNode(this.fileTree, path);
      if (!node) return;

      if (node.type === 'directory') {
        // Toggle directorio
        node.isOpen = !node.isOpen;
        this.render();
      } else {
        // Seleccionar archivo
        this.selectFile(path);
      }
    });
  }

  private findNode(nodes: FileNode[], path: string): FileNode | null {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const found = this.findNode(node.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  private selectFile(path: string): void {
    console.log('📄 Archivo seleccionado:', path);
    if (this.onFileSelect) {
      this.onFileSelect(path);
    }
  }

  setOnFileSelect(callback: (path: string) => void): void {
    this.onFileSelect = callback;
  }

  refresh(): void {
    // Refrescar árbol de archivos
    this.render();
  }
}
