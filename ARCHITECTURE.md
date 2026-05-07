# MIDI STUDIO V3 — Architecture Documentation

> **Versión Interna V3** / **Release Público v1.0**
> *Documentación oficial de la arquitectura de MIDI Studio v3*

---

## 🎯 Contexto — Por qué existe V3

MIDI Studio v2 fue abandonado debido a deuda técnica irrecuperable: 6 iteraciones de parches sobre parches, imports duplicados, loops de renderizado infinitos, y una arquitectura que mezclaba React + Zustand + node-pty + Tailwind — violando el principio fundacional de **máxima natividad**.

**V3 no es un refactor. Es una reconstrucción limpia, estratégica y consensuada.**

El backend Rust (src-tauri) de v2 estaba correcto y se mantiene. Todo el frontend se borró y se reescribió desde cero.

---

## 🏗️ Stack Definitivo — Sin Debates

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Shell nativo** | Tauri v2 (Rust) | Backbone sin alternativa |
| **Frontend** | Vanilla TypeScript + Vite | Cero overhead de framework |
| **Terminal** | xterm.js + WebGL addon | Única librería aceptable para terminal real |
| **Shells reales** | Tauri Shell plugin v2 (nativo) | Reemplaza node-pty — 100% dentro del ecosistema Tauri |
| **Estilos** | CSS Puro con variables | Sin Tailwind, sin shadcn, zero deps |
| **Estado** | Módulos TS nativos | Sin Zustand, sin Redux |
| **Persistencia** | Tauri Store plugin | SQLite nativo via Tauri, sin librerías externas |
| **IPC** | `invoke()` de Tauri | Ya incluido, cero overhead |
| **MCP Server** | axum (Rust) puerto 3333 | Dentro del binario Tauri, cero Node externo |

---

## ❌ Lo que ELIMINAMOS de V2

- ❌ React 19 — no necesario
- ❌ node-pty — reemplazado por Tauri Shell API
- ❌ Zustand — reemplazado por módulos TS nativos
- ❌ shadcn/ui — CSS propio, cero dependencias visuales
- ❌ Tailwind CSS — variables CSS nativas
- ❌ portable-pty-psmux — fork de un solo mantenedor, riesgo de abandono
- ❌ Todas las `@tauri-apps/api/*` deprecadas — solo las v2 oficiales

---

## 📁 Estructura Oficial de Carpetas

```
midi-studio-v3/
├── src-tauri/                    # Rust backend (FORGE territory)
│   ├── src/
│   │   ├── main.rs               # Entry point
│   │   ├── lib.rs                # Tauri builder
│   │   ├── commands/
│   │   │   ├── terminal.rs       # Spawn/write/kill shells
│   │   │   ├── projects.rs       # CRUD proyectos
│   │   │   ├── agents.rs         # Estado agentes
│   │   │   └── fs.rs             # File explorer
│   │   ├── pty/
│   │   │   ├── mod.rs            # trait PtyBackend + struct PtyManager
│   │   │   └── portable_impl.rs  # implementación portable-pty v0.9.0
│   │   └── state.rs              # App state (Mutex)
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── src/                          # Frontend TypeScript puro (PIXEL territory)
│   ├── main.ts                   # Entry point
│   ├── app.ts                    # App shell + router
│   ├── components/
│   │   ├── terminal/
│   │   │   ├── terminal.ts       # xterm.js wrapper
│   │   │   └── terminal.css
│   │   ├── sidebar/
│   │   │   ├── sidebar.ts        # Workspaces list
│   │   │   └── sidebar.css
│   │   ├── grid/
│   │   │   ├── grid.ts           # Terminal grid 1/2/4/6/8/10
│   │   │   └── grid.css
│   │   ├── tools/
│   │   │   ├── tools.ts          # Swarm/Kanban/Editor/Browser/Graph
│   │   │   └── tools.css
│   │   └── voicebutton/
│   │       ├── voicebutton.ts    # Voice interaction
│   │       └── voicebutton.css
│   ├── store/
│   │   ├── projects.ts           # Estado proyectos
│   │   ├── agents.ts             # Estado agentes
│   │   └── ui.ts                 # Estado UI (grid size, active panel)
│   ├── styles/
│   │   ├── tokens.css            # Design tokens (colores, tipografía)
│   │   ├── base.css              # Reset + base
│   │   └── layout.css            # Grid layout principal
│   └── types/
│       └── index.ts              # Tipos globales
│
├── index.html                    # Entry HTML
├── vite.config.ts
├── tsconfig.json
└── package.json                  # Mínimo: xterm.js + @xterm/addon-webgl
```

---

## 📦 package.json — Dependencias Permitidas

```json
{
  "dependencies": {
    "@xterm/xterm": "latest",
    "@xterm/addon-webgl": "latest"
  },
  "devDependencies": {
    "vite": "latest",
    "typescript": "latest",
    "@tauri-apps/cli": "2"
  }
}
```

**NADA MÁS.** Cualquier dependencia adicional requiere aprobación explícita de Nash Adam.

---

## 🔧 Cargo.toml — Dependencias Rust

```toml
[dependencies]
tauri = { version = "2", features = ["shell-open"] }

portable-pty = "0.9"
tauri-plugin-store = "2"
axum = "0.7"
tower-http = { version = "0.5", features = ["cors"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
rusqlite = { version = "0.31", features = ["bundled"] }
chrono = { version = "0.4", features = ["serde"] }
uuid = { version = "1", features = ["v4"] }
```

---

## 🔩 Capa PTY — Decisión Arquitectónica

**Crate:** `portable-pty` upstream v0.9.0 — mantenido por Wez Furlong (autor de WezTerm). Probado en producción en Windows 11, Linux y macOS.

**Regla de aislamiento:** El resto del sistema **NUNCA** importa `portable-pty` directamente. Todo acceso es vía `PtyManager` + trait `PtyBackend` definidos en `src-tauri/src/pty/`.

```
src-tauri/src/pty/
├── mod.rs           # trait PtyBackend + struct PtyManager
└── portable_impl.rs # única implementación actual de PtyBackend
```

**Escape hatch:** Si mañana `portable-pty` queda sin mantenimiento o se necesita PTY 100% propio, FORGE reescribe solo `portable_impl.rs`. Cero impacto en commands, state, ni IPC.

**Por qué NO se hizo PTY 100% propio:** Requiere ~600-900 líneas de código unsafe con 3 backends distintos (Win32 ConPTY, POSIX forkpty, macOS launchd). El trait de abstracción da control arquitectónico equivalente sin el costo.

---

## 🧠 state.rs — Estructura de Datos

> **Una sola responsabilidad:** registro central de sesiones PTY activas. Nada más vive aquí en Fase 1.

### Estructura

```
AppState
└── sessions: Mutex<HashMap<String, PtySession>>
                   │
                   └── String = UUID generado por frontend
                   └── Mutex → acceso seguro desde múltiples comandos async

PtySession
├── writer:  Box<dyn Write + Send>   ← stdin del proceso (pty_write)
├── reader:  Box<dyn Read + Send>    ← stdout del proceso (pty-output)
├── resizer: Box<dyn PtyResizer>     ← pty_resize
└── killer:  Box<dyn PtyKiller>      ← pty_kill
```

### Decisión: Mutex global (Opción A)

Un solo `Mutex<HashMap<...>>` envuelve todas las sesiones. Para Fase 1 con máximo 16 sesiones, las operaciones PTY toman/sueltan el lock en microsegundos — sin contención real. La Opción B (un Mutex por sesión) agrega complejidad sin beneficio medible a esta escala.

### Registro en lib.rs

```rust
AppState se registra en Tauri builder con .manage(AppState::new())
Todos los comandos lo reciben como State<'_, AppState>
```

---

## 🧱 pty/mod.rs — Capa de Abstracción

> **Regla absoluta:** `mod.rs` NO importa `portable_pty`. Aislamiento total. Solo usa traits estándar de Rust (`std::io::Write`, `std::io::Read`) más traits propios.

### Arquitectura interna

```
commands/terminal.rs
        │
        ▼
   PtyManager          ← struct pública, recibe los 4 comandos
        │
        ▼
   PtyBackend (trait)  ← interfaz abstracta, solo traits estándar
        │
        ▼
   PortablePtyImpl     ← en portable_impl.rs — único archivo que importa portable-pty
```

### Traits propios en mod.rs

```rust
pub trait PtyResizer: Send + Sync {
    fn resize(&self, cols: u16, rows: u16) -> Result<(), String>;
}

pub trait PtyKiller: Send + Sync {
    fn kill(self: Box<Self>) -> Result<(), String>;
}
```

### PtySession — sin dependencia de portable_pty

```rust
pub struct PtySession {
    pub writer:  Box<dyn std::io::Write + Send>,
    pub reader:  Box<dyn std::io::Read + Send>,
    pub resizer: Box<dyn PtyResizer>,
    pub killer:  Box<dyn PtyKiller>,
}
```

`writer` y `reader` son traits estándar. `resizer` y `killer` son traits propios. `portable_impl.rs` implementa los 4 con tipos de `portable_pty`. `mod.rs` no sabe nada de `portable_pty`.

### trait PtyBackend

```rust
pub trait PtyBackend: Send + Sync {
    fn spawn(&self, shell: &str, cols: u16, rows: u16) -> Result<PtySession, String>;
}
```

Una sola operación en el trait — `spawn`. Las otras operaciones (write, read, resize, kill) van directamente sobre `PtySession` a través de sus campos. El trait no necesita más.

### PtyManager

```rust
pub struct PtyManager {
    backend: Arc<dyn PtyBackend>,
}

impl PtyManager {
    pub fn new() -> Self
    pub fn spawn(&self, shell: &str, cols: u16, rows: u16) -> Result<PtySession, String>
}
```

### AppState actualizado

```rust
pub struct AppState {
    pub sessions: Mutex<HashMap<String, PtySession>>,
    pub pty:      PtyManager,
}
```

---

## 🔧 pty/portable_impl.rs — Única Puerta a portable-pty

> **Único archivo en todo el proyecto que importa `portable_pty`.** Si se reemplaza el crate, solo este archivo cambia. Cero impacto en el resto del sistema.

### Structs wrapper

```rust
MasterResizer    → implementa PtyResizer, envuelve Box<dyn MasterPty>
ChildKiller      → implementa PtyKiller, kill via drop limpio
PortablePtyImpl  → implementa PtyBackend, método spawn()
```

### Orden crítico en spawn() — Windows 11

```rust
1. native_pty_system()
2. openpty(PtySize)
3. master.try_clone_reader()   ← PRIMERO el reader (antes del proceso)
4. slave.spawn_command(cmd)    ← LUEGO el proceso hijo
5. master.take_writer()        ← LUEGO el writer
6. PtySession { writer, reader, resizer: MasterResizer, killer: ChildKiller }
7. retornar Ok(PtySession)
```

⚠️ **Si se invierte el orden de los pasos 3 y 4, en Windows el reader bloquea indefinidamente.**

### Lo que portable_impl.rs NO hace

- No emite eventos Tauri — eso es responsabilidad de `pty_create`
- No guarda estado — sin HashMap, sin Mutex
- No conoce UUIDs ni sesiones — solo abre un PTY y lo empaqueta

---

## 🔌 Contrato IPC — PTY ↔ Frontend

> **Contrato inmutable.** FORGE expone exactamente esto. PIXEL consume exactamente esto. Nadie agrega comandos sin aprobación de Nash Adam.

### Comandos invoke() — Frontend → Rust

```typescript
pty_create(id: string, shell: string, cols: number, rows: number) → Promise<void>
pty_write(id: string, data: string)                               → Promise<void>
pty_resize(id: string, cols: number, rows: number)               → Promise<void>
pty_kill(id: string)                                             → Promise<void>
```

### Evento — Rust → Frontend

```typescript
"pty-output" → { id: string, data: string }
```

### Reglas del contrato

- `id` — UUID v4 generado en frontend. FORGE nunca genera IDs.
- `data` en `pty_write` — UTF-8 string. xterm.js `onData` lo entrega así.
- `data` en `pty-output` — UTF-8 string. FORGE convierte bytes antes de emitir.
- Errores — todos los `invoke()` retornan `Result<(), String>` en Rust. El `String` llega como `Error` al frontend.
- `pty_kill` — FORGE mata el proceso Y limpia el handle del AppState. Obligatorio al cerrar un pane.
- Evento sin listener — si el pane no está montado, el dato se descarta. Comportamiento correcto.

### Flujo de vida de una sesión

```
PIXEL                            RUST (FORGE)
  │                                 │
  ├─ invoke("pty_create", ...) ───► PtyManager::spawn()
  │                                 │  crea PtyHandle en AppState
  │                                 │  lanza thread lector stdout
  │                                 │
  ├─ listen("pty-output")  ◄─────── emit("pty-output", {id, data})
  │   xterm.write(data)             │  loop continuo mientras vivo
  │                                 │
  ├─ invoke("pty_write", ...) ───► PtyManager::write()
  │   cada tecla del usuario        │
  │                                 │
  ├─ invoke("pty_resize", ...) ──► PtyManager::resize()
  │   ResizeObserver en el pane     │
  │                                 │
  └─ invoke("pty_kill", ...) ────► PtyManager::close()
      al cerrar el pane             │  limpia AppState
```

---

## 🏛️ Arquitectura Mental — Modelo PTY

Cada proyecto es una **sesión aislada en Rust** (modelo tmux). Las terminales xterm.js son solo **viewports** — renderizan lo que el proceso Rust les manda.

```
ProjectA → pty0/orchestrator, pty1/executor, pty2/planner
ProjectB → pty0/orchestrator, pty1/tester, pty2/reviewer
ProjectC → pty0/sisyphus, pty1/executor

activeProject = ProjectA  ← única fuente de verdad

invoke() IPC
├── xterm[0] → viewport del pty0 del proyecto activo
├── xterm[1] → viewport del pty1 del proyecto activo
└── xterm[2] → viewport del pty2 del proyecto activo

Cambio de proyecto:
  detach xterm[N] del pty[N] anterior
  attach xterm[N] al pty[N] del nuevo proyecto
```

---

## 🎨 Branding & Visual

| Elemento | Valor |
|----------|-------|
| Nombre | MIDI Studio |
| Tagline | "Build at the speed of thought" |
| Modo | Dark mode nativo, terminal-first |
| Fondo | `#0D0D0B` negro profundo |
| Acento | `#6366F1` índigo |
| Terminal | `#4AF2A1` verde terminal |
| Tipografía terminal | JetBrains Mono |
| Tipografía UI | Inter |

---

## ⚖️ Reglas de Oro — NO NEGOCIABLES

1. **Una sola dependencia JS permitida:** xterm.js + su addon WebGL. Nada más.
2. **Todo lo que pueda hacerse en Rust → se hace en Rust**
3. **CSS Variables nativas** — cero frameworks de estilos
4. **Comunicación únicamente via `invoke()`** — sin fetch, sin WebSocket internos
5. **Un archivo = una responsabilidad** — máximo 150 líneas por archivo TS
6. **CERO imports duplicados** — verificar antes de guardar cada archivo
7. **CERO default exports** en componentes — solo named exports (excepción: app.ts)
8. **Sin `console.log` en producción**

---

## 📊 Estado del Proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| ✅ | Stack V3 definido y consensuado | Completo |
| ✅ | Arquitectura MCP nativa (axum) diseñada | Completo |
| ✅ | Modelo PTY por proyecto definido | Completo |
| ✅ | Branding oficial definido | Completo |
| ⏳ | Crear repo midi-studio-v3 limpio | Pendiente |
| ⏳ | Scaffolding con create-tauri-app --template vanilla-ts | Pendiente |
| ⏳ | [AGENTS.md](http://AGENTS.md) del proyecto | Pendiente |
| ⏳ | Prompt maestro Sisyphus V3 | Pendiente |
| ⏳ | Primer arranque funcional | Pendiente |

---

## 📚 Documentación Relacionada

- [AGENTS.md](AGENTS.md) — Definición del equipo de 8 agentes IA
- [ROADMAP.md](ROADMAP.md) — Visión Q1→Q3 2026
- [METRICS_DASHBOARD.md](METRICS_DASHBOARD.md) — KPIs DORA + Agent Performance
- [CIRCUIT_BREAKER.md](CIRCUIT_BREAKER.md) — Protocolos de seguridad
- [INCIDENT_LOG.md](INCIDENT_LOG.md) — Postmortems
- [CHANGELOG.md](CHANGELOG.md) — Registro de cambios y mejoras
- [ERROR-001.md](ERROR-001.md) — Documentación CSS de componentes faltante
- [ERROR-002.md](ERROR-002.md) — Tipos TypeScript `src/types/index.ts` vacío
- [ERROR-003.md](ERROR-003.md) — Archivos CSS de componentes sin documentación

---

*Última actualización: **6 Mayo 2026** — HERALD, Knowledge & Context Keeper*
*Documentación generada automáticamente por el agente HERALD según flujos de ejecución del equipo **Team Stack Silicon Valley v1.0***