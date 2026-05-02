# WORKFLOW — NEW FEATURE

> *Flujo estándar para implementar cualquier feature nueva.*

---

## FASE 0 — PLAN (5min)

```
Responsable: ADAM
Input:       Descripción de la feature
Output:      Plan aprobado o rechazado con justificación

Checklist ADAM:
□ ¿Objetivo principal claro?
□ ¿Límites de alcance definidos?
□ ¿Sin ambigüedades críticas?
□ ¿Estrategia de tests definida?
□ ¿Dependencias identificadas?
```

## FASE 1 — DISEÑO (15min)

```
Responsable: ATLAS
Input:       Plan aprobado por ADAM
Output:      ARCHITECTURE.md actualizado

Entregables:
- Diagrama de componentes
- Flujos de datos
- Interfaces entre FORGE y PIXEL
- Estimación de performance

Validación: ADAM aprueba antes de continuar
```

## FASE 2 — EJECUCIÓN PARALELA (30min)

```
FORGE (Backend):          PIXEL (Frontend):
- Implementa Rust/Tauri    - Implementa TS/xterm.js
- Tests unitarios 100%     - TypeScript strict mode
- cargo clippy ✓           - tsc --noEmit ✓
- cargo build ✓            - eslint ✓

SENTINEL corre en paralelo:
- Backend: cargo test
- Frontend: Vitest/Jest
- E2E: Playwright
```

## FASE 3 — VALIDACIÓN (10min)

```
CIPHER  → Audit completo (memory, supply chain, secrets)
SENTINEL → 95%+ coverage confirmado
NEXUS   → Build release exitoso
ADAM    → Declara "FASE LISTA" ← ÚNICO que puede hacerlo
```

## FASE 4 — DEPLOY (5min)

```
NEXUS:
- cargo build --release
- Binary signing
- GitHub Release
- METRICS_DASHBOARD.md update
```

---

**TOTAL: ~65 minutos por feature completa**
