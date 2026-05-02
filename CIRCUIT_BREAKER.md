# CIRCUIT BREAKER — FAILSAFE ENTERPRISE

> *Protocolos de seguridad que garantizan 99.9% reliability.*

---

## Reglas Automáticas de Activación

| Trigger | Acción Inmediata | Escalación |
|---------|-----------------|------------|
| **3 fallos consecutivos** del mismo agente | Agente suspendido | → ADAM |
| **>15min bloqueado** en misma fase | Freeze de fase | → ADAM |
| **Memory leak detectado** | Commit rechazado | CIPHER → ADAM |
| **Coverage <95%** | Deploy bloqueado | SENTINEL → ADAM |
| **Nueva dependencia** sin audit | PR bloqueado | CIPHER → ADAM |
| **Test suite falla** | Pipeline detenido | SENTINEL → ADAM |
| **Vulnerabilidad CVE** en deps | Build cancelado | CIPHER → ADAM |
| **>30min sin deploy exitoso** | Alerta crítica | NEXUS → ADAM |

---

## Protocolo de Intervención ADAM

```
Paso 1: Suspende el agente o fase problemática
Paso 2: Analiza root cause (máximo 3 minutos)
Paso 3: Reasigna tareas o pivota estrategia
Paso 4: Documenta en INCIDENT_LOG.md
Paso 5: Declara "RESUELTO" o "ESCALAR"
```

---

## Niveles de Severidad

### 🔴 CRÍTICO — Intervención ADAM inmediata
- Supply chain attack detectado
- Memory leak en producción
- SLO < 99% por >5min
- Pérdida de datos detectada

### 🟠 ALTO — ADAM en <5min
- 3 fallos consecutivos de agente
- Coverage cae a <90%
- Build falla en main branch

### 🟡 MEDIO — ADAM en <15min
- Bloqueo de fase por dependencia
- Performance degradation >20%
- Bundle size supera límite

---

## Protocolo de Rollback (NEXUS)

```bash
# Rollback automático en <30 segundos
git revert HEAD --no-edit
cargo build --release
./deploy.sh --rollback --canary=0
```

---

*HERALD actualiza este documento tras cada incident resuelto.*
