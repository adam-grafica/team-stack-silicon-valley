# WORKFLOW — HOTFIX

> *Protocolo de emergencia. Velocidad máxima sin sacrificar seguridad.*

---

## PROTOCOLO DE EMERGENCIA

```
Trigger: Bug crítico en producción
MTTR Target: <30 minutos
Autoridad máxima: ADAM
```

## PASO 1 — TRIAGE (2min)

```
ADAM evalúa:
- Severidad del impacto (usuarios afectados)
- ¿Rollback inmediato o fix forward?
- Asignación del agente más apropiado
```

## PASO 2 — ROLLBACK INMEDIATO (si aplica)

```
NEXUS ejecuta:
git revert HEAD --no-edit
cargo build --release
./deploy.sh --rollback

Tiempo máximo: 30 segundos
```

## PASO 3 — ROOT CAUSE (5min)

```
FORGE / PIXEL (según área):
- Identifica causa raíz exacta
- Propone fix mínimo invasivo
- Reporta a ADAM
```

## PASO 4 — FIX & VALIDATE (15min)

```
FORGE/PIXEL implementan
SENTINEL: test rápido del fix específico
CIPHER: audit express (supply chain + memory)
ADAM: aprueba el fix
```

## PASO 5 — DEPLOY HOTFIX (5min)

```
NEXUS:
- Hotfix branch → merge a main
- Build release
- Deploy con canary 10% primero
- Full rollout si métricas verdes
```

## PASO 6 — POSTMORTEM (mismo día)

```
HERALD documenta en INCIDENT_LOG.md:
- Root cause
- Timeline
- Fix aplicado
- Prevención futura
```

---

**TOTAL: <30 minutos · MTTR Silicon Valley standard**
