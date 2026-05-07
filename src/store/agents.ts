/**
 * MIDI STUDIO — Agents Store
 * Estado y datos mock de los agentes del equipo
 * 
 * FORGE territory — Data layer
 */

// ─── Tipos ────────────────────────────────────────────────────────
export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline' | 'error';
  tasksCompleted: number;
  efficiency: number;
  description: string;
  stack: string[];
  lastActive: string;
}

// ─── Datos Mock ──────────────────────────────────────────────────
const MOCK_AGENTS: Agent[] = [
  {
    id: 'adam',
    name: 'ADAM',
    role: 'Orquestador Supremo',
    model: 'nvidia/deepseek-ai/deepseek-r1',
    avatar: '👑',
    status: 'online',
    tasksCompleted: 142,
    efficiency: 98,
    description: 'Decisiones graves, circuit breaker, validación final',
    stack: ['Orquestación', 'Circuit Breaker', 'Validación'],
    lastActive: '2026-05-05T14:30:00Z',
  },
  {
    id: 'atlas',
    name: 'ATLAS',
    role: 'Arquitecto Estratégico',
    model: 'google/gemini-3.1-pro-preview',
    avatar: '🏛️',
    status: 'online',
    tasksCompleted: 89,
    efficiency: 96,
    description: 'Diseño de sistemas, roadmap técnico',
    stack: ['Arquitectura', 'Roadmap', 'Escalabilidad'],
    lastActive: '2026-05-05T14:25:00Z',
  },
  {
    id: 'forge',
    name: 'FORGE',
    role: 'Executor Backend Elite',
    model: 'google/gemini-3.1-flash-lite-preview',
    avatar: '⚒️',
    status: 'busy',
    tasksCompleted: 256,
    efficiency: 94,
    description: 'Rust, Tauri commands, PTY, MCP Axum',
    stack: ['Rust', 'Tauri', 'Axum', 'Tokio'],
    lastActive: '2026-05-05T14:28:00Z',
  },
  {
    id: 'pixel',
    name: 'PIXEL',
    role: 'Executor Frontend Precision',
    model: 'mistral/mistral-large-latest',
    avatar: '🎨',
    status: 'online',
    tasksCompleted: 198,
    efficiency: 97,
    description: 'Vanilla TS, xterm.js, CSS nativo',
    stack: ['TypeScript', 'xterm.js', 'CSS', 'Vite'],
    lastActive: '2026-05-05T14:32:00Z',
  },
  {
    id: 'sentinel',
    name: 'SENTINEL',
    role: 'QA Battle-Tested',
    model: 'nvidia/deepseek-ai/deepseek-v4-flash',
    avatar: '🛡️',
    status: 'online',
    tasksCompleted: 312,
    efficiency: 99,
    description: 'TypeScript strict, cargo check, regresiones',
    stack: ['Testing', 'QA', 'Regresiones', 'CI/CD'],
    lastActive: '2026-05-05T14:35:00Z',
  },
  {
    id: 'herald',
    name: 'HERALD',
    role: 'Knowledge & Context Keeper',
    model: 'google/gemini-3.1-flash-lite-preview',
    avatar: '📜',
    status: 'online',
    tasksCompleted: 67,
    efficiency: 95,
    description: 'AGENTS.md, ARCHITECTURE.md, ROADMAP.md',
    stack: ['Documentación', 'Contexto', 'Knowledge Base'],
    lastActive: '2026-05-05T14:20:00Z',
  },
  {
    id: 'nexus',
    name: 'NEXUS',
    role: 'DevOps Production-Ready',
    model: 'mistral/mistral-small-latest',
    avatar: '🔧',
    status: 'busy',
    tasksCompleted: 178,
    efficiency: 93,
    description: 'Cargo build, firma binario, CI/CD, releases',
    stack: ['DevOps', 'CI/CD', 'Build', 'Release'],
    lastActive: '2026-05-05T14:29:00Z',
  },
  {
    id: 'cipher',
    name: 'CIPHER',
    role: 'Security Hardened',
    model: 'nvidia/deepseek-ai/deepseek-r1',
    avatar: '🔒',
    status: 'online',
    tasksCompleted: 145,
    efficiency: 98,
    description: 'Memory leaks, IPC seguro, PTY cleanup, supply chain',
    stack: ['Seguridad', 'Auditoría', 'Memory', 'IPC'],
    lastActive: '2026-05-05T14:31:00Z',
  },
];

// ─── Store ──────────────────────────────────────────────────────
class AgentsStore {
  private agents: Agent[] = [...MOCK_AGENTS];
  private listeners: Set<(agents: Agent[]) => void> = new Set();

  getAll(): Agent[] {
    return [...this.agents];
  }

  getById(id: string): Agent | undefined {
    return this.agents.find(a => a.id === id);
  }

  getOnline(): Agent[] {
    return this.agents.filter(a => a.status === 'online');
  }

  getByStatus(status: Agent['status']): Agent[] {
    return this.agents.filter(a => a.status === status);
  }

  updateAgent(id: string, updates: Partial<Agent>): void {
    const index = this.agents.findIndex(a => a.id === id);
    if (index !== -1) {
      this.agents[index] = { ...this.agents[index], ...updates };
      this.notifyListeners();
    }
  }

  addAgent(agent: Agent): void {
    this.agents.push(agent);
    this.notifyListeners();
  }

  onChange(listener: (agents: Agent[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.agents));
  }
}

export const agentsStore = new AgentsStore();
