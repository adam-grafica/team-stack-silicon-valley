/**
 * MIDI STUDIO — Voice Button v3.1 BRIDGEMIND
 * Botón floating con equalizer animado
 * 
 * PIXEL territory — Voice interaction
 */

// ─── Clase VoiceButton ───────────────────────────────────────────
export class VoiceButton {
  private container: HTMLElement;
  private isListening: boolean = false;
  private animationFrame: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = '';

    const button = document.createElement('button');
    button.className = 'voice-button';
    button.setAttribute('aria-label', 'Activar voz');
    button.innerHTML = `
      <div class="voice-equalizer">
        <div class="voice-bar" style="--bar-height: 20%;"></div>
        <div class="voice-bar" style="--bar-height: 40%;"></div>
        <div class="voice-bar" style="--bar-height: 60%;"></div>
        <div class="voice-bar" style="--bar-height: 40%;"></div>
        <div class="voice-bar" style="--bar-height: 20%;"></div>
      </div>
      <span class="voice-label">Voice</span>
    `;

    button.addEventListener('click', () => this.toggleListening());
    this.container.appendChild(button);
  }

  private toggleListening(): void {
    this.isListening = !this.isListening;
    const button = this.container.querySelector('.voice-button');
    
    if (this.isListening) {
      button?.classList.add('listening');
      this.startAnimation();
    } else {
      button?.classList.remove('listening');
      this.stopAnimation();
    }
  }

  private startAnimation(): void {
    const bars = this.container.querySelectorAll('.voice-bar');
    
    const animate = () => {
      bars.forEach((bar) => {
        const height = Math.random() * 80 + 20;
        (bar as HTMLElement).style.setProperty('--bar-height', `${height}%`);
      });
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }

  private stopAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    const bars = this.container.querySelectorAll('.voice-bar');
    bars.forEach((bar) => {
      (bar as HTMLElement).style.setProperty('--bar-height', '20%');
    });
  }
}
