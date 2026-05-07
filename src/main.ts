/**
 * MIDI STUDIO — Entry Point
 * Punto de entrada principal de la aplicación
 * 
 * PIXEL territory — Application bootstrap
 */

import { initializeApp } from './app';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/voicebutton.css';

// ─── Inicialización ─────────────────────────────────────────────
console.log('🎹 MIDI Studio v1.0 — Bootstrapping...');

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 DOM cargado, inicializando aplicación...');
  
  try {
    initializeApp();
    console.log('✅ MIDI Studio v1.0 — Listo');
  } catch (error) {
    console.error('❌ Error al inicializar MIDI Studio:', error);
    
    // Mostrar error en la UI
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="error-screen">
          <h1>❌ Error de Inicialización</h1>
          <p>No se pudo cargar MIDI Studio. Por favor, recarga la página.</p>
          <pre>${error instanceof Error ? error.message : String(error)}</pre>
        </div>
      `;
    }
  }
});

// ─── Manejo de errores globales ─────────────────────────────────
window.addEventListener('error', (event) => {
  console.error('💥 Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Promesa rechazada:', event.reason);
});
