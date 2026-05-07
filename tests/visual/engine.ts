/**
 * MIDI STUDIO — Visual Testing Engine
 * Core de Playwright para "ojos" de los agentes
 * 
 * FORGE territory — Backend testing infrastructure
 */

import { chromium, Browser, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ─── Configuración ───────────────────────────────────────────────
const SCREENSHOTS_DIR = path.join(process.cwd(), 'tests', 'screenshots');
const VIDEOS_DIR = path.join(process.cwd(), 'tests', 'videos');
const REPORTS_DIR = path.join(process.cwd(), 'tests', 'reports');

// Asegurar directorios existen
[SCREENSHOTS_DIR, VIDEOS_DIR, REPORTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Estado Global ────────────────────────────────────────────────
let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;

// ─── Funciones Core ──────────────────────────────────────────────

/**
 * Inicializa el navegador y abre la aplicación
 */
export async function initializeEyes(url: string = 'http://127.0.0.1:5173'): Promise<Page> {
  console.log('👁️  [ENGINE] Inicializando ojos visuales...');
  
  browser = await chromium.launch({
    headless: true, // Modo headless para CI, false para debug visual
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: 1400, height: 900 },
    },
  });

  page = await context.newPage();
  
  console.log(`👁️  [ENGINE] Navegando a ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  
  // Esperar a que la app esté lista
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000); // Dar tiempo a Vite para hidratar
  
  console.log('✅ [ENGINE] Ojos visuales listos — aplicación cargada');
  return page;
}

/**
 * Captura screenshot y lo guarda
 */
export async function captureScreenshot(name: string, fullPage: boolean = false): Promise<string> {
  if (!page) throw new Error('Engine no inicializado. Llama a initializeEyes() primero.');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}_${timestamp}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  
  await page.screenshot({ 
    path: filepath, 
    fullPage,
    type: 'png',
  });
  
  console.log(`📸 [ENGINE] Screenshot capturado: ${filepath}`);
  return filepath;
}

/**
 * Simula un click en un elemento
 */
export async function clickElement(selector: string): Promise<void> {
  if (!page) throw new Error('Engine no inicializado.');
  
  console.log(`🖱️  [ENGINE] Click en: ${selector}`);
  await page.click(selector, { timeout: 5000 });
  await page.waitForTimeout(500); // Esperar animaciones
}

/**
 * Escribe texto en un input
 */
export async function typeText(selector: string, text: string): Promise<void> {
  if (!page) throw new Error('Engine no inicializado.');
  
  console.log(`⌨️  [ENGINE] Escribiendo "${text}" en: ${selector}`);
  await page.fill(selector, text);
}

/**
 * Verifica que un elemento sea visible
 */
export async function assertVisible(selector: string): Promise<boolean> {
  if (!page) throw new Error('Engine no inicializado.');
  
  const visible = await page.isVisible(selector, { timeout: 5000 });
  console.log(`👁️  [ENGINE] assertVisible("${selector}"): ${visible ? '✅ VISIBLE' : '❌ NO VISIBLE'}`);
  return visible;
}

/**
 * Obtiene el texto de un elemento
 */
export async function getElementText(selector: string): Promise<string> {
  if (!page) throw new Error('Engine no inicializado.');
  
  const text = await page.textContent(selector);
  console.log(`📝 [ENGINE] Texto en "${selector}": "${text?.substring(0, 50)}..."`);
  return text || '';
}

/**
 * Espera a que un elemento aparezca
 */
export async function waitForElement(selector: string, timeout: number = 5000): Promise<void> {
  if (!page) throw new Error('Engine no inicializado.');
  
  console.log(`⏳ [ENGINE] Esperando elemento: ${selector}`);
  await page.waitForSelector(selector, { timeout });
  console.log(`✅ [ENGINE] Elemento encontrado: ${selector}`);
}

/**
 * Ejecuta JavaScript en el contexto de la página
 */
export async function evaluateInPage<T>(fn: () => T): Promise<T> {
  if (!page) throw new Error('Engine no inicializado.');
  return await page.evaluate(fn);
}

/**
 * Cierra el navegador y guarda el video
 */
export async function closeEyes(): Promise<void> {
  console.log('👁️  [ENGINE] Cerrando ojos visuales...');
  
  if (context) {
    await context.close();
    context = null;
  }
  
  if (browser) {
    await browser.close();
    browser = null;
  }
  
  page = null;
  console.log('✅ [ENGINE] Ojos cerrados.');
}

/**
 * Genera reporte HTML de los resultados
 */
export async function generateVisualReport(testName: string, results: any[]): Promise<string> {
  const timestamp = new Date().toISOString();
  const reportPath = path.join(REPORTS_DIR, `report_${testName}_${Date.now()}.html`);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MIDI Studio Visual Report — ${testName}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #e0e0e0; padding: 2rem; }
    h1 { color: #00ff88; }
    .timestamp { color: #888; font-size: 0.9rem; }
    .result { background: #1a1a1a; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
    .pass { border-left: 4px solid #00ff88; }
    .fail { border-left: 4px solid #ff4444; }
    img { max-width: 100%; border-radius: 4px; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <h1>👁️ Visual Report — ${testName}</h1>
  <p class="timestamp">${timestamp}</p>
  ${results.map(r => `
    <div class="result ${r.pass ? 'pass' : 'fail'}">
      <h3>${r.name}</h3>
      <p>${r.message}</p>
      ${r.screenshot ? `<img src="${r.screenshot}" alt="screenshot"/>` : ''}
    </div>
  `).join('')}
</body>
</html>
  `;
  
  fs.writeFileSync(reportPath, html);
  console.log(`📊 [ENGINE] Reporte generado: ${reportPath}`);
  return reportPath;
}

// Exportar estado para debugging
export function getEngineState() {
  return { browser: !!browser, context: !!context, page: !!page };
}
