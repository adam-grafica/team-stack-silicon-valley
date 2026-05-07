/**
 * MIDI STUDIO — Visual Testing Helpers
 * API simplificada para que los agentes usen los "ojos"
 * 
 * PIXEL territory — Frontend testing utilities
 */

import * as engine from './engine';

// ─── Tipos ────────────────────────────────────────────────────────
export interface VisualTestResult {
  name: string;
  pass: boolean;
  message: string;
  screenshot?: string;
  timestamp: string;
}

// ─── Estado de Tests ─────────────────────────────────────────────
const testResults: VisualTestResult[] = [];

// ─── API Simplificada para Agentes ──────────────────────────────

/**
 * Inicializa los ojos y abre la aplicación
 * Uso: await openEyes();
 */
export async function openEyes(): Promise<void> {
  await engine.initializeEyes();
  testResults.length = 0; // Limpiar resultados previos
}

/**
 * Cierra los ojos y genera reporte
 * Uso: await closeEyes();
 */
export async function closeEyes(): Promise<void> {
  await engine.closeEyes();
}

/**
 * Toma screenshot y lo guarda
 * Uso: await see('nombre-screenshot');
 */
export async function see(name: string, fullPage: boolean = false): Promise<string> {
  return await engine.captureScreenshot(name, fullPage);
}

/**
 * Simula un click
 * Uso: await click('#boton-guardar');
 */
export async function click(selector: string): Promise<void> {
  return await engine.clickElement(selector);
}

/**
 * Escribe texto
 * Uso: await type('#input-nombre', 'MIDI Studio');
 */
export async function type(selector: string, text: string): Promise<void> {
  return await engine.typeText(selector, text);
}

/**
 * Verifica que elemento sea visible
 * Uso: await shouldSee('#sidebar');
 */
export async function shouldSee(selector: string): Promise<boolean> {
  return await engine.assertVisible(selector);
}

/**
 * Verifica que elemento NO sea visible
 * Uso: await shouldNotSee('#error-message');
 */
export async function shouldNotSee(selector: string): Promise<boolean> {
  const visible = await engine.assertVisible(selector);
  return !visible;
}

/**
 * Obtiene texto de elemento
 * Uso: const titulo = await readText('h1');
 */
export async function readText(selector: string): Promise<string> {
  return await engine.getElementText(selector);
}

/**
 * Espera a que elemento aparezca
 * Uso: await waitFor('#modal');
 */
export async function waitFor(selector: string, timeout: number = 5000): Promise<void> {
  return await engine.waitForElement(selector, timeout);
}

/**
 * Ejecuta JavaScript en la página
 * Uso: const data = await runInPage(() => window.myData);
 */
export async function runInPage<T>(fn: () => T): Promise<T> {
  return await engine.evaluateInPage(fn);
}

/**
 * Registra resultado de test
 */
export function recordResult(name: string, pass: boolean, message: string, screenshot?: string): void {
  testResults.push({
    name,
    pass,
    message,
    screenshot,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Genera reporte de todos los tests
 */
export async function generateReport(testName: string): Promise<string> {
  return await engine.generateVisualReport(testName, testResults);
}

/**
 * Obtiene todos los resultados
 */
export function getResults(): VisualTestResult[] {
  return [...testResults];
}

/**
 * Limpia resultados previos
 */
export function clearResults(): void {
  testResults.length = 0;
}

// ─── Helpers de Debugging ────────────────────────────────────────

/**
 * Log del estado del engine
 */
export function logState(): void {
  const state = engine.getEngineState();
  console.log('🔍 [HELPERS] Estado del engine:', state);
}
