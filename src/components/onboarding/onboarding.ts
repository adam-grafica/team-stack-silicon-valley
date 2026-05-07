/**
 * MIDI STUDIO — Onboarding v3.0
 * 4 pasos: Proyecto → Team → Contexto → Listo
 * 
 * PIXEL territory — Onboarding flow
 */

// import { uiStore } from '../../store/ui'; // Se usará en futuras versiones

// ─── Tipos ────────────────────────────────────────────────────────
export type OnboardingStep = 'project' | 'team' | 'context' | 'ready';

export interface ProjectConfig {
  name: string;
  folder: string;
  template: string;
  contextFiles: string[];
}

// ─── Clase Onboarding ────────────────────────────────────────────
export class Onboarding {
  private container: HTMLElement;
  private currentStep: OnboardingStep = 'project';
  private config: ProjectConfig = {
    name: '',
    folder: '',
    template: 'blank',
    contextFiles: [],
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = `
      <div class="onboarding-overlay">
        <div class="onboarding-modal">
          <div class="onboarding-header">
            <h2>🎹 MIDI Studio</h2>
            <p>Build at the speed of thought</p>
          </div>
          
          <div class="onboarding-steps">
            <div class="step-indicator ${this.currentStep === 'project' ? 'active' : ''}">
              <span class="step-number">1</span>
              <span class="step-label">Proyecto</span>
            </div>
            <div class="step-indicator ${this.currentStep === 'team' ? 'active' : ''}">
              <span class="step-number">2</span>
              <span class="step-label">Team</span>
            </div>
            <div class="step-indicator ${this.currentStep === 'context' ? 'active' : ''}">
              <span class="step-number">3</span>
              <span class="step-label">Contexto</span>
            </div>
            <div class="step-indicator ${this.currentStep === 'ready' ? 'active' : ''}">
              <span class="step-number">4</span>
              <span class="step-label">Listo</span>
            </div>
          </div>
          
          <div class="onboarding-content">
            ${this.renderCurrentStep()}
          </div>
          
          <div class="onboarding-actions">
            <button class="btn-secondary" id="onboarding-prev" ${this.currentStep === 'project' ? 'disabled' : ''}>Anterior</button>
            <button class="btn-primary" id="onboarding-next">${this.currentStep === 'ready' ? 'Abrir Workspace' : 'Siguiente'}</button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private renderCurrentStep(): string {
    switch (this.currentStep) {
      case 'project':
        return this.renderProjectStep();
      case 'team':
        return this.renderTeamStep();
      case 'context':
        return this.renderContextStep();
      case 'ready':
        return this.renderReadyStep();
      default:
        return '';
    }
  }

  private renderProjectStep(): string {
    return `
      <div class="step-project">
        <h3>Crear Proyecto</h3>
        <div class="form-group">
          <label>Nombre del proyecto</label>
          <input type="text" id="project-name" placeholder="mi-proyecto" value="${this.config.name}">
        </div>
        <div class="form-group">
          <label>Carpeta de trabajo</label>
          <div class="folder-selector">
            <input type="text" id="project-folder" placeholder="C:\\Users\\Admin\\projects" value="${this.config.folder}">
            <button class="btn-secondary" id="select-folder">Seleccionar</button>
          </div>
        </div>
        <div class="recent-projects">
          <h4>Proyectos recientes</h4>
          <div class="project-list">
            <div class="project-card" data-name="super-prueba">
              <span class="project-icon">📁</span>
              <span>super prueba</span>
            </div>
            <div class="project-card" data-name="prueba-midi">
              <span class="project-icon">📁</span>
              <span>prueba midi project</span>
            </div>
            <div class="project-card" data-name="smoke-test">
              <span class="project-icon">📁</span>
              <span>SMOKE_TEST_PROJECT</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderTeamStep(): string {
    return `
      <div class="step-team">
        <h3>Seleccionar Team</h3>
        <div class="team-templates">
          <div class="team-card" data-template="blank">
            <h4>En blanco</h4>
            <p>0 agentes · 1 terminal libre</p>
          </div>
          <div class="team-card" data-template="executor">
            <h4>Solo Executor</h4>
            <p>1 agente · 1 + 1 terminal</p>
          </div>
          <div class="team-card" data-template="rust-backend">
            <h4>Rust Backend</h4>
            <p>3 agentes · 3 + 1 terminal</p>
          </div>
          <div class="team-card" data-template="frontend">
            <h4>Frontend Only</h4>
            <p>3 agentes · 3 + 1 terminal</p>
          </div>
          <div class="team-card" data-template="fullstack">
            <h4>Full Stack</h4>
            <p>5 agentes · 5 + 1 terminal</p>
          </div>
        </div>
      </div>
    `;
  }

  private renderContextStep(): string {
    return `
      <div class="step-context">
        <h3>Contexto (Opcional)</h3>
        <p>Agrega archivos de contexto para que los agentes tengan más información.</p>
        <div class="context-items">
          <div class="context-item">
            <span>📋 Arquitectura / Plano</span>
            <button class="btn-secondary">Subir archivo</button>
          </div>
          <div class="context-item">
            <span>🧱 Stack / Materiales</span>
            <button class="btn-secondary">Subir archivo</button>
          </div>
          <div class="context-item">
            <span>⚙️ Procesos / Fases</span>
            <button class="btn-secondary">Subir archivo</button>
          </div>
          <div class="context-item">
            <span>📎 Docs adicionales</span>
            <button class="btn-secondary">Subir archivo</button>
          </div>
        </div>
        <button class="btn-secondary" id="skip-context">Saltar este paso</button>
      </div>
    `;
  }

  private renderReadyStep(): string {
    return `
      <div class="step-ready">
        <h3>Resumen</h3>
        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">Proyecto:</span>
            <span class="summary-value">${this.config.name || 'Sin nombre'}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Carpeta:</span>
            <span class="summary-value">${this.config.folder || 'Sin carpeta'}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Plantilla:</span>
            <span class="summary-value">${this.config.template}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Contexto:</span>
            <span class="summary-value">${this.config.contextFiles.length} archivos</span>
          </div>
        </div>
      </div>
    `;
  }

  private attachEvents(): void {
    // Navegación
    document.getElementById('onboarding-prev')?.addEventListener('click', () => {
      this.prevStep();
    });

    document.getElementById('onboarding-next')?.addEventListener('click', () => {
      this.nextStep();
    });

    // Selección de proyecto
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.getAttribute('data-name');
        if (name) {
          this.config.name = name;
          this.nextStep();
        }
      });
    });

    // Selección de team
    document.querySelectorAll('.team-card').forEach(card => {
      card.addEventListener('click', () => {
        const template = card.getAttribute('data-template');
        if (template) {
          this.config.template = template;
          this.nextStep();
        }
      });
    });
  }

  private nextStep(): void {
    const steps: OnboardingStep[] = ['project', 'team', 'context', 'ready'];
    const currentIndex = steps.indexOf(this.currentStep);
    
    if (currentIndex < steps.length - 1) {
      this.currentStep = steps[currentIndex + 1];
      this.render();
    } else {
      this.completeOnboarding();
    }
  }

  private prevStep(): void {
    const steps: OnboardingStep[] = ['project', 'team', 'context', 'ready'];
    const currentIndex = steps.indexOf(this.currentStep);
    
    if (currentIndex > 0) {
      this.currentStep = steps[currentIndex - 1];
      this.render();
    }
  }

  private completeOnboarding(): void {
    console.log('✅ Onboarding completado:', this.config);
    
    // Crear estructura .midi/
    this.createProjectStructure();
    
    // Cerrar onboarding
    this.container.innerHTML = '';
    this.container.style.display = 'none';
  }

  private createProjectStructure(): void {
    // Crear .midi/project.json
    const projectData = {
      name: this.config.name,
      folder: this.config.folder,
      template: this.config.template,
      createdAt: new Date().toISOString(),
    };
    
    console.log('📁 Creando estructura:', projectData);
    
    // Aquí se crearía la estructura real
    // Por ahora solo logeamos
  }
}
