# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> MIDI Studio — Smoke Visual >> 🌙 Modo oscuro aplicado correctamente
- Location: tests\visual\smoke.spec.ts:72:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('.app-shell') to be visible

```

# Page snapshot

```yaml
- button "Activar voz" [ref=e2] [cursor=pointer]:
  - generic [ref=e9]: Voice
```

# Test source

```ts
  1   | /**
  2   |  * MIDI STUDIO — Smoke Test Visual
  3   |  * Verifica que la aplicación se ve correctamente
  4   |  * 
  5   |  * SENTINEL territory — QA visual validation
  6   |  */
  7   | 
  8   | import { test, expect } from '@playwright/test';
  9   | import * as path from 'path';
  10  | 
  11  | // ─── Configuración ───────────────────────────────────────────────
  12  | const SCREENSHOTS_DIR = path.join(process.cwd(), 'tests', 'screenshots');
  13  | 
  14  | // ─── Test Principal ──────────────────────────────────────────────
  15  | 
  16  | test.describe('MIDI Studio — Smoke Visual', () => {
  17  |   
  18  |   test.beforeEach(async ({ page }) => {
  19  |     // Navegar a la aplicación antes de cada test
  20  |     await page.goto('http://127.0.0.1:5173', { 
  21  |       waitUntil: 'networkidle',
  22  |       timeout: 30000 
  23  |     });
  24  |     
  25  |     // Esperar a que la app esté lista
  26  |     await page.waitForLoadState('domcontentloaded');
  27  |     await page.waitForTimeout(3000); // Tiempo para hidratación completa
  28  |     
  29  |     // Verificar que el contenido se renderizó
> 30  |     await page.waitForSelector('.app-shell', { timeout: 10000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  31  |   });
  32  | 
  33  |   test('👁️  La aplicación carga y muestra título correcto', async ({ page }) => {
  34  |     // Verificar título del documento
  35  |     await expect(page).toHaveTitle(/MIDI Studio/);
  36  |     
  37  |     // Verificar que el body existe
  38  |     const body = page.locator('body');
  39  |     await expect(body).toBeVisible();
  40  |     
  41  |     // Capturar screenshot inicial
  42  |     await page.screenshot({ 
  43  |       path: path.join(SCREENSHOTS_DIR, '01-app-loaded.png'),
  44  |       fullPage: true 
  45  |     });
  46  |   });
  47  | 
  48  |   test('🎨 El contenedor principal #app existe', async ({ page }) => {
  49  |     const app = page.locator('#app');
  50  |     await expect(app).toBeVisible();
  51  |     
  52  |     await page.screenshot({ 
  53  |       path: path.join(SCREENSHOTS_DIR, '02-app-container.png') 
  54  |     });
  55  |   });
  56  | 
  57  |   test('📐 Verificar estructura básica de layout', async ({ page }) => {
  58  |     // Verificar que el body tiene contenido
  59  |     const bodyContent = await page.textContent('body');
  60  |     expect(bodyContent).toBeTruthy();
  61  |     
  62  |     // Verificar que no hay errores de carga visibles
  63  |     const errorElements = await page.locator('.error, [class*="error"]').count();
  64  |     expect(errorElements).toBe(0);
  65  |     
  66  |     await page.screenshot({ 
  67  |       path: path.join(SCREENSHOTS_DIR, '03-layout-structure.png'),
  68  |       fullPage: true 
  69  |     });
  70  |   });
  71  | 
  72  |   test('🌙 Modo oscuro aplicado correctamente', async ({ page }) => {
  73  |     // Verificar que el body tiene clase o estilo dark
  74  |     const bodyClass = await page.getAttribute('body', 'class');
  75  |     const htmlClass = await page.getAttribute('html', 'class');
  76  |     
  77  |     // La app debería tener modo oscuro por defecto
  78  |     const hasDarkMode = bodyClass?.includes('dark') || 
  79  |                        htmlClass?.includes('dark') ||
  80  |                        await page.evaluate(() => {
  81  |                          return window.matchMedia('(prefers-color-scheme: dark)').matches;
  82  |                        });
  83  |     
  84  |     // No es crítico, solo informativo
  85  |     console.log('🌙 Modo oscuro:', hasDarkMode ? 'Aplicado ✅' : 'No detectado ⚠️');
  86  |     
  87  |     await page.screenshot({ 
  88  |       path: path.join(SCREENSHOTS_DIR, '04-dark-mode.png'),
  89  |       fullPage: true 
  90  |     });
  91  |   });
  92  | 
  93  |   test('📊 Verificar rendimiento de carga', async ({ page }) => {
  94  |     // Medir tiempo de carga
  95  |     const timing = await page.evaluate(() => {
  96  |       return {
  97  |         loadTime: performance.now(),
  98  |         domContentLoaded: performance.timing?.domContentLoadedEventEnd,
  99  |         loadComplete: performance.timing?.loadEventEnd,
  100 |       };
  101 |     });
  102 |     
  103 |     console.log('⏱️  Performance:', timing);
  104 |     
  105 |     // La carga debería ser razonable (< 6 segundos)
  106 |     expect(timing.loadTime).toBeLessThan(6000);
  107 |     
  108 |     await page.screenshot({ 
  109 |       path: path.join(SCREENSHOTS_DIR, '05-performance-check.png'),
  110 |       fullPage: true 
  111 |     });
  112 |   });
  113 | 
  114 |   test('🔍 Verificar que no hay errores en consola', async ({ page }) => {
  115 |     const consoleErrors: string[] = [];
  116 |     
  117 |     page.on('console', (msg) => {
  118 |       if (msg.type() === 'error') {
  119 |         consoleErrors.push(msg.text());
  120 |       }
  121 |     });
  122 |     
  123 |     // Recargar para capturar errores
  124 |     await page.reload({ waitUntil: 'networkidle' });
  125 |     await page.waitForTimeout(2000);
  126 |     
  127 |     // Filtrar errores conocidos/no críticos
  128 |     const criticalErrors = consoleErrors.filter(err => 
  129 |       !err.includes('favicon') && 
  130 |       !err.includes('source map')
```