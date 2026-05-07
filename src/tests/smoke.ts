/**
 * Smoke test for MIDI Studio Frontend
 */

declare global {
  interface Window {
    xterm?: any;
  }
}

export function runSmokeTest(): void {
  console.log('[SMOKE TEST] Starting...');

  // 1. Verify terminal-container exists
  const container = document.getElementById('terminal-container');
  if (!container) {
    throw new Error('SMOKE TEST FAILED: #terminal-container not found in DOM');
  }
  console.log('[SMOKE TEST] #terminal-container found');

  // 2. Verify window.xterm is defined
  // We expect this to be set after bootstrap
  if (!window.xterm) {
    throw new Error('SMOKE TEST FAILED: window.xterm is not defined');
  }
  console.log('[SMOKE TEST] window.xterm is defined');

  console.log('SMOKE TEST PASSED');
}

// Allow invocation from browser console
(window as any).runSmokeTest = runSmokeTest;
