/**
 * MIDI STUDIO — Diagnostic Test
 * Captura HTML y console logs para debugging
 * 
 * SENTINEL territory — Diagnostic tooling
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('MIDI Studio — Diagnostic', () => {
  
  test('🔍 Capturar HTML y diagnóstico', async ({ page }) => {
    // Navegar a la aplicación
    await page.goto('http://127.0.0.1:5173', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Esperar hidratación
    
    // Capturar HTML
    const html = await page.content();
    const htmlPath = path.join(process.cwd(), 'tests', 'reports', 'diagnostic.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`📄 HTML guardado en: ${htmlPath}`);
    
    // Capturar console logs
    const logs: string[] = [];
    page.on('console', (msg) => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    // Esperar un poco para capturar logs
    await page.waitForTimeout(2000);
    
    // Guardar logs
    const logsPath = path.join(process.cwd(), 'tests', 'reports', 'console-logs.txt');
    fs.writeFileSync(logsPath, logs.join('\n'));
    console.log(`📝 Logs guardados en: ${logsPath}`);
    
    // Verificar estructura básica
    const app = page.locator('#app');
    await expect(app).toBeVisible();
    
    // Verificar si hay contenido dentro de #app
    const appContent = await page.textContent('#app');
    console.log('📦 Contenido de #app:', appContent?.substring(0, 200));
    
    // Verificar si hay errores visibles
    const errorElements = await page.locator('.error, [class*="error"]').count();
    console.log(`❌ Elementos de error: ${errorElements}`);
    
    // Capturar screenshot
    await page.screenshot({ 
      path: path.join(process.cwd(), 'tests', 'screenshots', 'diagnostic-full.png'),
      fullPage: true 
    });
  });
});
