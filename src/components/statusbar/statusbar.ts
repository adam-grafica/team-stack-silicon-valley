/**
 * MIDI STUDIO — Status Bar v3.0
 * Git + Agente + Sesiones + Errores + Hora
 * 
 * PIXEL territory — Status UI
 */

export class StatusBar {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    // El statusbar ya está renderizado en app.ts
    // Esta clase maneja actualizaciones dinámicas
  }

  updateGitBranch(branch: string): void {
    const gitEl = this.container.querySelector('.git-branch');
    if (gitEl) gitEl.textContent = branch;
  }

  updateAgent(agent: string): void {
    const agentEl = this.container.querySelector('.active-agent');
    if (agentEl) agentEl.textContent = agent;
  }

  updateSessionCount(count: number): void {
    const sessionsEl = this.container.querySelector('.session-count');
    if (sessionsEl) sessionsEl.textContent = `${count} sesiones`;
  }

  updateErrors(count: number): void {
    const errorsEl = this.container.querySelector('.error-count');
    if (errorsEl) errorsEl.textContent = `${count} errores`;
  }

  updateTime(): void {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const timeEl = this.container.querySelector('.time');
    if (timeEl) timeEl.textContent = timeString;
  }
}
