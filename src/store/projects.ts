/**
 * MIDI STUDIO — Projects Store
 * Estado y datos mock de proyectos
 * 
 * FORGE territory — Projects data layer
 */

// ─── Tipos ────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'error';
  progress: number;
  agents: string[];
  lastUpdated: string;
  tags: string[];
}

// ─── Datos Mock ──────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'MIDI Studio Core',
    description: 'Plataforma de orquestación de agentes AI',
    status: 'active',
    progress: 75,
    agents: ['adam', 'atlas', 'forge', 'pixel'],
    lastUpdated: '2026-05-05T14:30:00Z',
    tags: ['core', 'tauri', 'typescript'],
  },
  {
    id: 'proj-002',
    name: 'Visual Testing Engine',
    description: 'Sistema de ojos para agentes AI',
    status: 'active',
    progress: 60,
    agents: ['pixel', 'sentinel', 'nexus'],
    lastUpdated: '2026-05-05T14:25:00Z',
    tags: ['testing', 'playwright', 'visual'],
  },
  {
    id: 'proj-003',
    name: 'Security Audit',
    description: 'Auditoría de seguridad del sistema',
    status: 'completed',
    progress: 100,
    agents: ['cipher', 'sentinel'],
    lastUpdated: '2026-05-04T10:15:00Z',
    tags: ['security', 'audit'],
  },
  {
    id: 'proj-004',
    name: 'Documentation Portal',
    description: 'Portal de documentación técnica',
    status: 'paused',
    progress: 45,
    agents: ['herald', 'pixel'],
    lastUpdated: '2026-05-03T16:20:00Z',
    tags: ['docs', 'portal'],
  },
];

// ─── Store ──────────────────────────────────────────────────────
class ProjectsStore {
  private projects: Project[] = [...MOCK_PROJECTS];
  private listeners: Set<(projects: Project[]) => void> = new Set();

  getAll(): Project[] {
    return [...this.projects];
  }

  getById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getByStatus(status: Project['status']): Project[] {
    return this.projects.filter(p => p.status === status);
  }

  getActive(): Project[] {
    return this.projects.filter(p => p.status === 'active');
  }

  updateProject(id: string, updates: Partial<Project>): void {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      this.notifyListeners();
    }
  }

  addProject(project: Project): void {
    this.projects.push(project);
    this.notifyListeners();
  }

  onChange(listener: (projects: Project[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.projects));
  }
}

export const projectsStore = new ProjectsStore();
