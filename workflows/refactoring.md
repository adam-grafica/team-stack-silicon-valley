# WORKFLOW — REFACTORING

> *Mejora estructural sin romper funcionalidad. Cero regresiones.*

---

## PRE-CONDICIÓN

```
□ Autorización explícita de ADAM
□ Tests existentes al 95%+ antes de empezar
□ Branch separado (refactor/nombre-descriptivo)
□ ARCHITECTURE.md revisado por ATLAS
```

## FASE 1 — ANÁLISIS (15min)

```
ATLAS:
- Identifica deuda técnica exacta
- Diseña arquitectura objetivo
- Define métricas de mejora (performance, legibilidad)
- ADAM aprueba antes de continuar
```

## FASE 2 — EJECUCIÓN (variable)

```
FORGE / PIXEL (según área):
- Refactor en commits atómicos pequeños
- Tests deben pasar en CADA commit
- Sin nuevas features — solo estructura
- cargo clippy debe estar verde siempre
```

## FASE 3 — VALIDACIÓN RIGUROSA

```
SENTINEL:
- Coverage antes ≥ Coverage después
- 0 regresiones funcionales
- Performance: igual o mejor

CIPHER:
- No se introdujeron nuevas vulnerabilidades

ADAM:
- Valida que mejora real vs. objetivo declarado
```

## FASE 4 — MERGE & DEPLOY

```
NEXUS:
- Merge a main (squash)
- Deploy con canary
- Benchmark comparison pre/post
```

---

**REGLA DE ORO: Si los tests no pasan, el refactor no existe.**
