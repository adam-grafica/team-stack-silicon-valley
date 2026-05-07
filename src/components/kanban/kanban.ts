/**
 * MIDI STUDIO — Kanban Board v3.0
 * Tablero Kanban interactivo con drag & drop
 * 
 * PIXEL territory — Kanban board
 */

import { plusIcon, closeIcon } from '../../icons';

// ─── Tipos ────────────────────────────────────────────────────────
export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  column: 'todo' | 'inprogress' | 'done';
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

// ─── Datos Mock ──────────────────────────────────────────────────
const MOCK_COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      {
        id: 'card-1',
        title: 'Implementar PTY real',
        description: 'Conectar xterm.js con backend Rust',
        assignee: 'FORGE',
        priority: 'high',
        tags: ['backend', 'rust'],
        column: 'todo',
      },
      {
        id: 'card-2',
        title: 'Crear onboarding',
        description: 'Flujo de 4 pasos para nuevos proyectos',
        assignee: 'PIXEL',
        priority: 'medium',
        tags: ['frontend', 'ux'],
        column: 'todo',
      },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    cards: [
      {
        id: 'card-3',
        title: 'Diseñar UI profesional',
        description: 'Crear interfaz tipo VS Code con temas',
        assignee: 'PIXEL',
        priority: 'high',
        tags: ['frontend', 'design'],
        column: 'inprogress',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      {
        id: 'card-4',
        title: 'Setup proyecto',
        description: 'Configurar Tauri + Vite + TypeScript',
        assignee: 'NEXUS',
        priority: 'low',
        tags: ['devops', 'setup'],
        column: 'done',
      },
    ],
  },
];

// ─── Clase KanbanBoard ───────────────────────────────────────────
export class KanbanBoard {
  private container: HTMLElement;
  private columns: KanbanColumn[] = [...MOCK_COLUMNS];
  private draggedCard: KanbanCard | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = `
      <div class="kanban-board">
        <div class="kanban-header">
          <h3>Kanban Board</h3>
          <button class="btn-primary" id="add-card-btn">
            ${plusIcon({size: 14})} Nueva tarea
          </button>
        </div>
        <div class="kanban-columns">
          ${this.columns.map(col => this.renderColumn(col)).join('')}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private renderColumn(column: KanbanColumn): string {
    return `
      <div class="kanban-column" data-column-id="${column.id}">
        <div class="kanban-column-header">
          <h4>${column.title}</h4>
          <span class="card-count">${column.cards.length}</span>
        </div>
        <div class="kanban-column-content" data-column="${column.id}">
          ${column.cards.map(card => this.renderCard(card)).join('')}
        </div>
        <button class="btn-add-card" data-column="${column.id}">
          ${plusIcon({size: 12})} Agregar tarjeta
        </button>
      </div>
    `;
  }

  private renderCard(card: KanbanCard): string {
    const priorityColors: Record<string, string> = {
      low: '#22C55E',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626',
    };

    return `
      <div class="kanban-card" draggable="true" data-card-id="${card.id}">
        <div class="kanban-card-header">
          <span class="card-priority" style="background: ${priorityColors[card.priority]}"></span>
          <button class="btn-icon btn-delete-card" data-card-id="${card.id}">
            ${closeIcon({size: 12})}
          </button>
        </div>
        <h5 class="kanban-card-title">${card.title}</h5>
        <p class="kanban-card-description">${card.description}</p>
        <div class="kanban-card-footer">
          <span class="card-assignee">${card.assignee}</span>
          <div class="card-tags">
            ${card.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private attachEvents(): void {
    // Drag & Drop
    this.container.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', (e: Event) => this.handleDragStart(e as DragEvent));
      card.addEventListener('dragend', (e: Event) => this.handleDragEnd(e));
    });

    this.container.querySelectorAll('.kanban-column-content').forEach(column => {
      column.addEventListener('dragover', (e) => this.handleDragOver(e));
      column.addEventListener('drop', (e) => this.handleDrop(e));
    });

    // Agregar tarjeta
    this.container.querySelectorAll('.btn-add-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const columnId = (e.target as HTMLElement).getAttribute('data-column');
        if (columnId) this.addCard(columnId as 'todo' | 'inprogress' | 'done');
      });
    });

    // Eliminar tarjeta
    this.container.querySelectorAll('.btn-delete-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardId = (e.target as HTMLElement).getAttribute('data-card-id');
        if (cardId) this.deleteCard(cardId);
      });
    });
  }

  private handleDragStart(e: DragEvent): void {
    const card = (e.target as HTMLElement).closest('.kanban-card');
    if (!card) return;

    const cardId = card.getAttribute('data-card-id');
    this.draggedCard = this.findCard(cardId!);

    card.classList.add('dragging');
    e.dataTransfer?.setData('text/plain', cardId!);
  }

  private handleDragEnd(e: Event): void {
    const card = (e.target as HTMLElement).closest('.kanban-card');
    if (card) card.classList.remove('dragging');
    this.draggedCard = null;
  }

  private handleDragOver(e: Event): void {
    e.preventDefault();
    const column = (e.target as HTMLElement).closest('.kanban-column-content');
    if (column) column.classList.add('drag-over');
  }

  private handleDrop(e: Event): void {
    e.preventDefault();
    const column = (e.target as HTMLElement).closest('.kanban-column-content');
    if (!column) return;

    column.classList.remove('drag-over');

    const columnId = column.getAttribute('data-column');
    if (!columnId || !this.draggedCard) return;

    // Mover tarjeta a nueva columna
    this.moveCard(this.draggedCard.id, columnId as 'todo' | 'inprogress' | 'done');
  }

  private findCard(cardId: string): KanbanCard | null {
    for (const column of this.columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) return card;
    }
    return null;
  }

  private moveCard(cardId: string, newColumn: 'todo' | 'inprogress' | 'done'): void {
    const card = this.findCard(cardId);
    if (!card) return;

    // Eliminar de columna anterior
    for (const column of this.columns) {
      column.cards = column.cards.filter(c => c.id !== cardId);
    }

    // Agregar a nueva columna
    const targetColumn = this.columns.find(c => c.id === newColumn);
    if (targetColumn) {
      card.column = newColumn;
      targetColumn.cards.push(card);
    }

    this.render();
  }

  private addCard(columnId: 'todo' | 'inprogress' | 'done'): void {
    const newCard: KanbanCard = {
      id: `card-${Date.now()}`,
      title: 'Nueva tarea',
      description: 'Descripción de la tarea',
      assignee: 'ADAM',
      priority: 'medium',
      tags: [],
      column: columnId,
    };

    const column = this.columns.find(c => c.id === columnId);
    if (column) {
      column.cards.push(newCard);
      this.render();
    }
  }

  private deleteCard(cardId: string): void {
    for (const column of this.columns) {
      column.cards = column.cards.filter(c => c.id !== cardId);
    }
    this.render();
  }
}
