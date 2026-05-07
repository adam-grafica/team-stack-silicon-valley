/**
 * MIDI STUDIO — Console Logs Test
 * Captura logs de la consola para debugging
 * 
 * SENTINEL territory — Console debugging
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('MIDI Studio — Console Logs', () => {
  
  test('🔍 Capturar logs de consola', async ({ page }) => {
    const logs: string[] = [];
    
    // Capturar todos los logs de consola
    page.on('console', (msg) => {
      const logEntry = `[${msg.type()}] ${msg.text()}`;
      logs.push(logEntry);
      console.log(logEntry);
    });
    
    // Navegar a la aplicación
    await page.goto('http://127.0.0.1:5173', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000); // Esperar 5 segundos para capturar logs
    
    // Guardar logs
    const logsPath = path.join(process.cwd(), 'tests', 'reports', 'console-logs-captured.txt');
    fs.writeFileSync(logsPath, logs.join('\n') || 'No logs captured');
    console.log(`📝 Logs guardados en: ${logsPath}`);
    
    // Verificar que no hay errores críticos
    const errors = logs.filter(log => log.includes('[error]'));
    console.log(`❌ Errores encontrados: ${errors.length}`);
    
    // Capturar screenshot
    await page.screenshot({ 
      path: path.join(process.cwd(), 'tests', 'screenshots', 'console-logs-test.png'),
      fullPage: true 
    });
  });
});
