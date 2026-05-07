# 🎛️ MIDI Studio V3 — Arquitectura Técnica Definitiva OFICIAL

> ⚠️ **DOCUMENTO OFICIAL** — Esta es la arquitectura canónica de MIDI Studio v3. Cualquier decisión técnica que contradiga este documento debe ser revisada y aprobada por Nash Adam antes de implementarse.
> 

---

# 🎯 Contexto — Por qué existe V3

midi-studio-v2 fue abandonado por deuda técnica irrecuperable: 6 iteraciones de parches encima de parches, imports duplicados, loops de render infinitos, y una arquitectura que mezclaba React + Zustand + node-pty + Tailwind — violando el principio fundacional de máxima natividad.

**V3 no es un refactor. Es una reconstrucción limpia, estratégica, consensuada.**

El src-tauri (Rust backend) de v2 estaba correcto — no se toca. Todo el frontend se borra y se reescribe desde cero.

---

# 🏗️ Stack Definitivo — Sin Debates

| Capa | Tecnología | Por qué |
| --- | --- | --- |
| Shell nativo | Tauri v2 (Rust) | El backbone, sin alternativa |
| Frontend | Vanilla TypeScript + Vite | Cero overhead de framework |
| Terminal | xterm.js + WebGL addon | La única librería aceptable para terminal real |
| Shells reales | Tauri Shell plugin v2 (nativo) | Reemplaza node-pty — 100% dentro del ecosistema Tauri |
| Estilos | CSS Puro con variables | Sin Tailwind, sin shadcn, zero deps |
| Estado | Módulos TS nativos | Sin Zustand, sin Redux |
| Persistencia | Tauri Store plugin | SQLite nativo via Tauri, sin librerías externas |
| IPC | invoke() de Tauri | Ya incluido, cero overhead |
| MCP Server | axum (Rust) puerto 3333 | Dentro del binario Tauri, cero Node externo |

---

# ❌ Lo que ELIMINAMOS de V2

- ❌ React 19 — no necesario
- ❌ node-pty — reemplazado por Tauri Shell API
- ❌ Zustand — reemplazado por módulos TS nativos
- ❌ shadcn/ui — CSS propio, cero dependencias visuales
- ❌ Tailwind CSS — variables CSS nativas
- ❌ tauri-plugin-shell — reemplazado por portable-pty upstream v0.9.0 con trait PtyBackend propio
- ❌ portable-pty-psmux — fork de un solo mantenedor, riesgo de abandono
- ❌ Todas las @tauri-apps/api/* deprecadas — solo las v2 oficiales

---

# 📁 Estructura Oficial de Carpetas

```jsx
midi-studio-v3/
├── src-tauri/                    # Rust backend
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
├── src/                          # Frontend TypeScript puro
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
│   │   └── tools/
│   │       ├── tools.ts          # Swarm/Kanban/Editor/Browser/Graph
│   │       └── tools.css
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

# 📦 package.json — Dependencias Permitidas

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

**NADA MÁS.** Cualquier dependencia adicional requiere aprobación explícita de Nash.

---

# 🔧 Cargo.toml — Dependencias Rust

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

# 🔩 Capa PTY — Decisión Arquitectónica

**Crate:** `portable-pty` upstream v0.9.0 — mantenido por Wez Furlong (autor de WezTerm). Probado en producción en Windows 11, Linux y macOS.

**Regla de aislamiento:** El resto del sistema NUNCA importa `portable-pty` directamente. Todo acceso es via `PtyManager` + trait `PtyBackend` definidos en `src-tauri/src/pty/`.

```
src-tauri/src/pty/
├── mod.rs           # trait PtyBackend + struct PtyManager
└── portable_impl.rs # única implementación actual de PtyBackend
```

**Escape hatch:** Si mañana `portable-pty` queda sin mantenimiento o se necesita PTY 100% propio, FORGE reescribe solo `portable_impl.rs`. Cero impacto en commands, state, ni IPC.

**Por qué NO se hizo PTY 100% propio:** Requiere ~600-900 líneas de código unsafe con 3 backends distintos (Win32 ConPTY, POSIX forkpty, macOS launchd). El trait de abstracción da control arquitectónico equivalente sin el costo.

---

# 🧠 [state.rs](http://state.rs) — Estructura de Datos

> Una sola responsabilidad: registro central de sesiones PTY activas. Nada más vive aquí en Fase 1.
> 

## Estructura

```
AppState
└── sessions: Mutex<HashMap<String, PtyHandle>>
               │                    │
               │                    └── String = UUID generado por frontend
               └── Mutex → acceso seguro desde múltiples comandos async

PtyHandle
├── writer:  Box<dyn Write + Send>   ← stdin del proceso (pty_write)
├── master:  Box<dyn MasterPty>      ← handle master PTY (pty_resize)
└── child:   Box<dyn Child + Send>   ← handle proceso hijo (pty_kill)
```

## Decisión: Mutex global (Opción A)

Un solo `Mutex<HashMap<...>>` envuelve todas las sesiones. Para Fase 1 con máximo 16 sesiones, las operaciones PTY toman/sueltan el lock en microsegundos — sin contención real. La Opción B (un Mutex por sesión) agrega complejidad sin beneficio medible a esta escala.

## Registro en [lib.rs](http://lib.rs)

```
AppState se registra en Tauri builder con .manage(AppState::new())
Todos los comandos lo reciben como State<'_, AppState>
```

---

# 🧱 pty/[mod.rs](http://mod.rs) — Capa de Abstracción

> Regla absoluta: `mod.rs` NO importa `portable_pty`. Aislamiento total. Solo usa traits estándar de Rust (`std::io::Write`, `std::io::Read`) más traits propios.
> 

## Arquitectura interna

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

## Traits propios en [mod.rs](http://mod.rs)

```
pub trait PtyResizer: Send + Sync {
    fn resize(&self, cols: u16, rows: u16) -> Result<(), String>;
}

pub trait PtyKiller: Send + Sync {
    fn kill(self: Box<Self>) -> Result<(), String>;
}
```

## PtySession — sin dependencia de portable_pty

```
pub struct PtySession {
    pub writer:  Box<dyn std::io::Write + Send>,
    pub reader:  Box<dyn std::io::Read + Send>,
    pub resizer: Box<dyn PtyResizer>,
    pub killer:  Box<dyn PtyKiller>,
}
```

`writer` y `reader` son traits estándar. `resizer` y `killer` son traits propios. `portable_impl.rs` implementa los 4 con tipos de `portable_pty`. `mod.rs` no sabe nada de `portable_pty`.

## trait PtyBackend

```
pub trait PtyBackend: Send + Sync {
    fn spawn(&self, shell: &str, cols: u16, rows: u16) -> Result<PtySession, String>;
}
```

Una sola operación en el trait — `spawn`. Las otras operaciones (write, read, resize, kill) van directamente sobre `PtySession` a través de sus campos. El trait no necesita más.

## PtyManager

```
pub struct PtyManager {
    backend: Arc<dyn PtyBackend>,
}

impl PtyManager {
    pub fn new() -> Self
    pub fn spawn(&self, shell: &str, cols: u16, rows: u16) -> Result<PtySession, String>
}
```

## AppState actualizado

```
pub struct AppState {
    pub sessions: Mutex<HashMap<String, PtySession>>,
    pub pty:      PtyManager,
}
```

---

# 🔧 pty/portable_[impl.rs](http://impl.rs) — Única Puerta a portable-pty

> Único archivo en todo el proyecto que importa `portable_pty`. Si se reemplaza el crate, solo este archivo cambia. Cero impacto en el resto del sistema.
> 

## Structs wrapper

```
MasterResizer    → implementa PtyResizer, envuelve Box<dyn MasterPty>
ChildKiller      → implementa PtyKiller, kill via drop limpio
PortablePtyImpl  → implementa PtyBackend, método spawn()
```

## Orden crítico en spawn() — Windows 11

```
1. native_pty_system()
2. openpty(PtySize)
3. master.try_clone_reader()   ← PRIMERO el reader (antes del proceso)
4. slave.spawn_command(cmd)    ← LUEGO el proceso hijo
5. master.take_writer()        ← LUEGO el writer
6. PtySession { writer, reader, resizer: MasterResizer, killer: ChildKiller }
7. retornar Ok(PtySession)
```

⚠️ Si se invierte el orden de los pasos 3 y 4, en Windows el reader bloquea indefinidamente.

## Lo que portable_[impl.rs](http://impl.rs) NO hace

- No emite eventos Tauri — eso es responsabilidad de `pty_create`
- No guarda estado — sin HashMap, sin Mutex
- No conoce UUIDs ni sesiones — solo abre un PTY y lo empaqueta

---

# 🔌 Contrato IPC — PTY ↔ Frontend

> Contrato inmutable. FORGE expone exactamente esto. PIXEL consume exactamente esto. Nadie agrega comandos sin aprobación de Nash.
> 

## Comandos invoke() — Frontend → Rust

```
pty_create(id: string, shell: string, cols: number, rows: number) → Promise<void>
pty_write(id: string, data: string)                               → Promise<void>
pty_resize(id: string, cols: number, rows: number)               → Promise<void>
pty_kill(id: string)                                             → Promise<void>
```

## Evento — Rust → Frontend

```
"pty-output" → { id: string, data: string }
```

## Reglas del contrato

- `id` — UUID v4 generado en frontend. FORGE nunca genera IDs.
- `data` en `pty_write` — UTF-8 string. xterm.js `onData` lo entrega así.
- `data` en `pty-output` — UTF-8 string. FORGE convierte bytes antes de emitir.
- Errores — todos los `invoke()` retornan `Result<(), String>` en Rust. El `String` llega como `Error` al frontend.
- `pty_kill` — FORGE mata el proceso Y limpia el handle del AppState. Obligatorio al cerrar un pane.
- Evento sin listener — si el pane no está montado, el dato se descarta. Comportamiento correcto.

## Flujo de vida de una sesión

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

# 🏛️ Arquitectura Mental — Modelo PTY

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

# 🎨 Branding & Visual

| Elemento | Valor |
| --- | --- |
| Nombre | MIDI Studio |
| Tagline | "Build at the speed of thought" |
| Modo | Dark mode nativo, terminal-first |
| Fondo | `#0D0D0B` negro profundo |
| Acento | `#6366F1` índigo |
| Terminal | `#4AF2A1` verde terminal |
| Tipografía terminal | JetBrains Mono |
| Tipografía UI | Inter |

---

# ⚖️ Reglas de Oro — NO NEGOCIABLES

1. **Una sola dependencia JS permitida:** xterm.js + su addon WebGL. Nada más.
2. **Todo lo que pueda hacerse en Rust → se hace en Rust**
3. **CSS Variables nativas** — cero frameworks de estilos
4. **Comunicación únicamente via `invoke()`** — sin fetch, sin WebSocket internos
5. **Un archivo = una responsabilidad** — máximo 150 líneas por archivo TS
6. **CERO imports duplicados** — verificar antes de guardar cada archivo
7. **CERO default exports** en componentes — solo named exports (excepción: app.ts)
8. **Sin `console.log` en producción**

---

# 📊 Estado del Proyecto

| Fase | Descripción | Estado |
| --- | --- | --- |
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

---

# 👥 Team Stack Silicon Valley — Repositorio Live

> ✅ **IMPLEMENTADO Y DEPLOYADO** — 2 Mayo 2026
> 

El equipo de agentes está 100% operativo en GitHub como stack reutilizable para todos los proyectos de AdamGráfica.

**Repositorio:** [adam-grafica/team-stack-silicon-valley](https://github.com/adam-grafica/team-stack-silicon-valley)

## Estructura del repositorio

```
team-stack-silicon-valley/
├── AGENTS.md                          # Definición YAML de los 8 agentes
├── .opencode.json                     # Config OpenCode con modelos por agente
├── prompts/instructions/              # 8 Prompts elite
│   ├── adam.md                        # Orquestador Supremo
│   ├── atlas.md                       # Arquitecto Estratégico
│   ├── forge.md                       # Executor Rust/Backend
│   ├── pixel.md                       # Executor Frontend
│   ├── sentinel.md                    # QA Battle-Tested
│   ├── herald.md                      # Knowledge Keeper
│   ├── nexus.md                       # DevOps Production-Ready
│   └── cipher.md                      # Security Hardened
├── super-skills/                      # 8 Power Skills + sprints quincenales
├── ROADMAP.md                         # Visión Q1→Q3 2026
├── CIRCUIT_BREAKER.md                 # Failsafe 8 reglas + protocolos severidad
├── METRICS_DASHBOARD.md               # DORA metrics + Agent Performance
├── INCIDENT_LOG.md                    # Template postmortems
├── .github/workflows/agent-ci.yml     # CI: valida 8 prompts + 8 skills + config
├── docker-compose.yml                 # Entorno reproducible
├── workflows/
│   ├── new-feature.md
│   ├── hotfix.md
│   └── refactoring.md
├── .env.example
├── .gitignore
└── LICENSE (MIT)
```

## Cómo usar en cualquier proyecto nuevo

```bash
git clone https://github.com/adam-grafica/team-stack-silicon-valley.git mi-proyecto
cd mi-proyecto && cp .env.example .env
# Agrega tus API keys y arranca:
opencode start
```

## Framework de cada prompt: ROLE-GOAL-CONTEXT-CONSTRAINTS-VALIDATION-REWARD

Cada agente fue construido con este framework de nivel Silicon Valley ($10B+ valuation). Los prompts son el corazón del stack.

## Métricas objetivo del equipo

| Métrica | Target |
| --- | --- |
| Deployment Frequency | Diario |
| Lead Time por feature | <2 horas |
| MTTR | <30 minutos |
| Reliability | 99.9% |
| Change Failure Rate | <15% |

## Matriz de Sinergia

```
ADAM (Decisión Clara) + ATLAS (Diseño Épico) = 2x velocidad
ATLAS (Specs Perfectas) + FORGE (Implementación 0-bug) = 0 iterations
FORGE + PIXEL (Paralelo) = 50% menos tiempo
SENTINEL (Rigor) + CIPHER (Security) = 0 production incidents
HERALD (Docs) × TODO = Onboarding 80% más rápido
```

---

# 🏷️ Versionado Oficial

| Contexto | Versión |
| --- | --- |
| Uso interno / demos | V3 (midi-studio-v3) |
| Release público | **v1.0** |
| Directorio de trabajo | `C:/Users/Admin/midi-studio` |

> Esta es la versión 1.0 para el público. Internamente la llamamos V3 porque es la tercera iteración de desarrollo. El producto que verán los usuarios es MIDI Studio v1.0.
> 

---

---

# 👥 Equipo de Agentes — MIDI Studio v3

> Cada agente tiene un área exclusiva. Nadie se cruza. ADAM es la única autoridad transversal.
> 

| # | Nombre | Rol | Responsabilidad exclusiva | Temperatura |
| --- | --- | --- | --- | --- |
| 1 | **ADAM** | Orquestador Supremo | Decisiones graves, circuit breaker, valida fases completas, resuelve conflictos entre agentes | 0.2 |
| 2 | **ATLAS** | Planner / Arquitecto | Diseño de sistemas, estructura de archivos, roadmap técnico, decisiones de arquitectura | 0.3 |
| 3 | **FORGE** | Executor Rust / Backend | Tauri commands, PTY sessions, MCP server axum, [state.rs](http://state.rs), Cargo.toml | 0.1 |
| 4 | **PIXEL** | Executor Frontend | Vanilla TypeScript, xterm.js, CSS variables, DOM nativo, components/ | 0.1 |
| 5 | **SENTINEL** | Tester / QA | TypeScript strict, cargo check, diff-based review, cero regresiones | 0.1 |
| 6 | **HERALD** | Contexto / Documentación | [AGENTS.md](http://AGENTS.md), comentarios de código, contexto compartido entre agentes, changelog | 0.2 |
| 7 | **NEXUS** | Build & DevOps | cargo build, firma de binario, empaquetado Windows/Mac/Linux, CI, releases | 0.1 |
| 8 | **CIPHER** | Seguridad & Sistemas | Memory leaks, IPC seguro, PTY cleanup, puertos expuestos, integridad del binario | 0.1 |

## Jerarquía de autoridad

```
ADAM (Orquestador)
├── ATLAS    → define CÓMO antes de que alguien ejecute
├── FORGE    → ejecuta solo backend Rust
├── PIXEL    → ejecuta solo frontend TS
├── SENTINEL → valida antes de declarar fase completa
├── HERALD   → documenta después de cada fase
├── NEXUS    → empaqueta cuando SENTINEL aprueba
└── CIPHER   → audita en paralelo, reporta solo a ADAM
```

## Reglas del equipo

1. **ADAM decide** — ningún agente cambia arquitectura sin su aprobación
2. **FORGE no toca src/** — solo src-tauri/
3. **PIXEL no toca src-tauri/** — solo src/
4. **SENTINEL no implementa** — solo revisa y reporta
5. **Circuit breaker** — si un agente falla 3 veces en la misma tarea, ADAM interviene y reasigna
6. **NEXUS solo actúa** cuando SENTINEL confirma 0 errores
7. **CIPHER audita en silencio** — no bloquea, solo reporta riesgos a ADAM

---

# 🗂️ Directorios de Trabajo

| Entorno | Path |
| --- | --- |
| Proyecto activo | `C:/Users/Admin/midi-studio` |
| Carpeta anterior (abandonada) | `C:/Users/Admin/midi-studio-v2` — NO TOCAR |
| OS | Windows 11 + PowerShell |
| OpenCode config | `~/.config/opencode/` |

---

---

# 🖥️ PIXEL — Instrucciones Frontend (Fase 1)

> Una sola tarea: un pane de terminal funcional conectado al IPC de FORGE. Sin improvisar nada fuera de este plano.
> 

## Orden de construcción — estricto

**1. `types/index.ts`**

```
interface PtySession        → id, cols, rows, shell
interface PtyOutputPayload  → id, data
interface TerminalConfig    → theme, fontFamily, fontSize, cursorStyle
interface TerminalTheme     → background, foreground, cursor, selection
```

Colores base: background #0D0D0B · foreground #F8F8F2 · cursor #4AF2A1 · selection #6366F140

**2. `store/projects.ts`**

```
Variable privada: Map<string, PtySession>
export function addSession(session: PtySession): void
export function removeSession(id: string): void
export function getSession(id: string): PtySession | undefined
```

Sin clases. Sin Zustand. Módulo TS nativo.

**3. `components/terminal/terminal.ts`**

```
export class TerminalPane {
  constructor(container: HTMLElement, sessionId: string, config: TerminalConfig)
  // 1. new Terminal({ ...config })
  // 2. new WebglAddon() → term.loadAddon()
  // 3. term.open(container)
  // 4. term.onData → invoke('pty_write', { id, data })
  // 5. listen('pty-output') → if payload.id === sessionId → term.write(data)
  // 6. ResizeObserver en container → invoke('pty_resize', { id, cols, rows })

  dispose(): void
  // 1. unlisten()      → limpia listener de eventos Tauri
  // 2. term.dispose()  → limpia xterm.js
  // 3. invoke('pty_kill', { id: sessionId })
}
```

Resize: calcular cols/rows con Math.floor(width / charWidth). Sin FitAddon externo.

**4. `app.ts` — bootstrap mínimo**

```
1. Crear container DOM
2. id = crypto.randomUUID()
3. invoke('pty_create', { id, shell: 'powershell.exe', cols: 80, rows: 24 })
4. new TerminalPane(container, id, defaultConfig)
5. Montar en DOM
```

## Reglas PIXEL (Fase 1)

- Máx 150 líneas por archivo TS
- Sin console.log
- Sin default exports (excepción: app.ts)
- Sin imports de portable_pty ni de src-tauri — solo invoke() y listen() de @tauri-apps/api

---

# 📋 Resumen Fase 1 — Plano Completo

```
FORGE (Rust)                        PIXEL (TypeScript)
─────────────────────────           ──────────────────────────
state.rs                            types/index.ts
pty/mod.rs                          store/projects.ts
pty/portable_impl.rs                components/terminal/terminal.ts
commands/terminal.rs                app.ts (bootstrap)
lib.rs (registro)
```

Definición de DONE — Fase 1:

- npm run tauri dev sin errores
- Un pane visible con xterm.js WebGL
- PowerShell real responde al usuario
- Colores ANSI funcionando
- Resize del pane actualiza cols/rows en el PTY
- Cero unwrap() en Rust
- Cero console.log en TypeScript

---

---

# 🎨 UX/UI — Diseño de Interfaz

## Branding

- Nombre: MIDI Studio
- Tagline: "Build at the speed of thought"
- Modo: Dark nativo, terminal-first, minimalista denso
- Paleta base: #0D0D0B fondo · #F8F8F2 texto · #4AF2A1 cursor · #6366F1 acento índigo
- Tipografía: JetBrains Mono (terminal) + Inter (UI)

## Sistema de Themes

MIDI Studio soporta themes intercambiables al estilo del usuario. El theme activo se guarda en `.midi/project.json` y se aplica en tiempo real sin reiniciar.

### Themes incluidos en Fase 1

```
Nombre           Fondo       Texto     Cursor    Acento
───────────────────────────────────────────────────────────────
MIDI Dark        #0D0D0B     #F8F8F2   #4AF2A1   #6366F1  (default)
MIDI Midnight    #060610     #E2E8F0   #818CF8   #6366F1
MIDI Forest      #0A0F0A     #D4EDDA   #4AF2A1   #22C55E
MIDI Ember       #0F0A06     #F5E6D3   #FB923C   #F97316
MIDI Arctic      #0A0D12     #E8EEF4   #67E8F9   #06B6D4
```

### Arquitectura del sistema de themes

```
src/
└── themes/
    ├── index.ts          ← lista de themes + tipo ThemeConfig
    ├── apply.ts          ← aplica theme vía CSS variables en :root
    └── store.ts          ← persiste theme activo en .midi/project.json
```

Todos los colores del UI se definen como CSS variables. Cambiar el theme = actualizar las variables en `:root`. xterm.js recibe el theme como objeto `ITheme` directamente.

### Themes de usuario (Fase 2)

El usuario puede crear themes personalizados desde Settings. Se guardan en `.midi/themes/` como archivos `.json`. Pendiente Fase 2.

## Layouts del Workspace

Tres layouts predefinidos accesibles desde la titlebar:

- FOCUS — 1 pane fullwidth. Concentración máxima.
- SWARM — Grid dinámico N+1 terminales. Un agente por pane + 1 libre.
- KANBAN — Grid 2×2 + panel Kanban lado a lado.

## Estructura del Workspace

```
┌──────────────────────────────────────────────┐
│ titlebar: [●●●] MIDI Studio [proyecto▼] [F|S|K] [···] │
├──────┬───────────────────────────────────────┤
│      │                                       │
│ side │         ÁREA DE TERMINALES            │
│ bar  │         (grid dinámico)               │
│      │                                       │
├──────┴───────────────────────────────────────┤
│ statusbar: [git] [agente activo] [sesiones: N] [errores: 0] [hora] │
└──────────────────────────────────────────────┘
```

Sidebar 80px colapsada (solo íconos) · 240px expandida (íconos + nombres).

Íconos: proyectos · agentes activos · kanban · settings · nuevo proyecto.

---

# 🚀 Onboarding — Flujo Completo

> Referencia estudiada: BridgeMind (3 pasos). MIDI Studio supera con 4 pasos + contexto inteligente.
> 

## Splash Screen

```
🎛️ MIDI Studio
"Build at the speed of thought"
[barra de carga sutil]
```

1.5s — Tauri inicializa, MCP Server arranca en puerto 3333.

## Paso 1 — Proyecto

- Campo: nombre del proyecto
- Campo: carpeta de trabajo (selector nativo de carpetas)
- Sección: proyectos recientes (cards clicables)
- Click en proyecto reciente → salta directo a Paso 4 (resumen)

## Paso 2 — Team (plantilla de agentes)

El usuario elige UNA tarjeta. El grid de terminales se calcula automáticamente.

```
Plantilla          Agentes    Terminales
────────────────────────────────────────
📄 En blanco       0          1 libre
⚡ Solo Executor   1          1 + 1 libre
🦀 Rust Backend    3          3 + 1 libre
🎨 Frontend Only   3          3 + 1 libre
🏗️ Full Stack      5          5 + 1 libre
```

Regla: siempre 1 terminal libre para el usuario.

Preview: al seleccionar tarjeta, muestra grid real con nombres de agentes por pane.

### Plantillas de usuario (Fase 2)

El usuario puede guardar su configuración como plantilla propia con nombre personalizado. Estas aparecen al inicio de la lista de plantillas. Expandible sin límite. Pendiente Fase 2.

## Paso 3 — Contexto (el corazón)

Cada item tiene dos modos: subir archivo O escribir/pegar texto inline.

Al continuar, MIDI Studio crea los archivos `.md` automáticamente.

```
📋 Arquitectura / Plano   → .midi/context/architecture.md
🧱 Stack / Materiales     → .midi/context/stack.md
⚙️  Procesos / Fases       → .midi/context/processes.md
📎 Docs adicionales       → .midi/context/docs/
```

Formatos aceptados: .md · .txt · .pdf · .json

Este paso es OPCIONAL — tiene botón [Saltar].

Si eligió "En blanco" en Paso 2 → este paso se omite automáticamente.

## Paso 4 — Listo

Resumen completo antes de abrir:

- Nombre del proyecto
- Carpeta
- Layout (terminales calculadas)
- Team elegido
- Contexto: N archivos cargados
- Campo: guardar como preset con nombre personalizado

Al click "Abrir workspace":

1. Crea `.midi/project.json` con toda la configuración
2. Crea `.midi/agents.md` con equipo seleccionado
3. MCP Server indexa `.midi/context/` — disponible para agentes
4. Abre workspace con grid calculado
5. Agentes arrancan con contexto completo — sin prompts manuales

## Flujos posibles

```
Completo      → P1 → P2 → P3 → P4 → workspace
Sin contexto  → P1 → P2 → [skip P3] → P4 → workspace
En blanco     → P1 → P2(blanco) → P4 → workspace
Reciente      → click reciente → P4 → workspace
```

## Estructura .midi/ generada

```
[carpeta-proyecto]/
└── .midi/
    ├── project.json          ← metadata completa
    ├── agents.md             ← equipo + configuración
    └── context/
        ├── architecture.md
        ├── stack.md
        ├── processes.md
        └── docs/             ← archivos adicionales
```

Todo versionable con git. Todo legible por humanos. Todo servible por MCP Server (axum puerto 3333).

---

*Última actualización: 3 Mayo 2026 — Nash Adam, CEO AdamGráfica*