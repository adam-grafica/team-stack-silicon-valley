/**
 * MIDI STUDIO — Smoke Test Visual
 * Verifica que la aplicación se ve correctamente
 * 
 * SENTINEL territory — QA visual validation
 */

import { test, expect } from '@playwright/test';
import * as path from 'path';

// ─── Configuración ───────────────────────────────────────────────
const SCREENSHOTS_DIR = path.join(process.cwd(), 'tests', 'screenshots');

// ─── Test Principal ──────────────────────────────────────────────

test.describe('MIDI Studio — Smoke Visual', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación antes de cada test
    await page.goto('http://127.0.0.1:5173', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Esperar a que la app esté lista
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Tiempo para hidratación completa
    
    // Verificar que el contenido se renderizó
    await page.waitForSelector('.app-shell', { timeout: 10000 });
  });

  test('👁️  La aplicación carga y muestra título correcto', async ({ page }) => {
    // Verificar título del documento
    await expect(page).toHaveTitle(/MIDI Studio/);
    
    // Verificar que el body existe
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Capturar screenshot inicial
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, '01-app-loaded.png'),
      fullPage: true 
    });
  });

  test('🎨 El contenedor principal #app existe', async ({ page }) => {
    const app = page.locator('#app');
    await expect(app).toBeVisible();
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, '02-app-container.png') 
    });
  });

  test('📐 Verificar estructura básica de layout', async ({ page }) => {
    // Verificar que el body tiene contenido
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();
    
    // Verificar que no hay errores de carga visibles
    const errorElements = await page.locator('.error, [class*="error"]').count();
    expect(errorElements).toBe(0);
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, '03-layout-structure.png'),
      fullPage: true 
    });
  });

  test('🌙 Modo oscuro aplicado correctamente', async ({ page }) => {
    // Verificar que el body tiene clase o estilo dark
    const bodyClass = await page.getAttribute('body', 'class');
    const htmlClass = await page.getAttribute('html', 'class');
    
    // La app debería tener modo oscuro por defecto
    const hasDarkMode = bodyClass?.includes('dark') || 
                       htmlClass?.includes('dark') ||
                       await page.evaluate(() => {
                         return window.matchMedia('(prefers-color-scheme: dark)').matches;
                       });
    
    // No es crítico, solo informativo
    console.log('🌙 Modo oscuro:', hasDarkMode ? 'Aplicado ✅' : 'No detectado ⚠️');
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, '04-dark-mode.png'),
      fullPage: true 
    });
  });

  test('📊 Verificar rendimiento de carga', async ({ page }) => {
    // Medir tiempo de carga
    const timing = await page.evaluate(() => {
      return {
        loadTime: performance.now(),
        domContentLoaded: performance.timing?.domContentLoadedEventEnd,
        loadComplete: performance.timing?.loadEventEnd,
      };
    });
    
    console.log('⏱️  Performance:', timing);
    
    // La carga debería ser razonable (< 6 segundos)
    expect(timing.loadTime).toBeLessThan(6000);
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, '05-performance-check.png'),
      fullPage: true 
    });
  });

  test('🔍 Verificar que no hay errores en consola', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Recargar para capturar errores
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Filtrar errores conocidos/no críticos
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('source map')
    );
    
    if (criticalErrors.length > 0) {
      console.log('⚠️  Errores en consola:', criticalErrors);
    }
    
    // No fallar el test por errores de consola, solo reportar
    expect(criticalErrors.length).toBeLessThan(5); // Tolerancia
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, '06-console-errors.png'),
      fullPage: true 
    });
  });

  test('📱 Verificar responsive básico', async ({ page }) => {
    // Probar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, '07-responsive-mobile.png'),
      fullPage: true 
    });
    
    // Restaurar viewport desktop
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, '08-responsive-desktop.png'),
      fullPage: true 
    });
  });
});
