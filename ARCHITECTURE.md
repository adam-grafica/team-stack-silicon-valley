# MIDI STUDIO V3  Architecture

> Version interna V3 / Release publico v1.0

## Stack Definitivo

| Capa          | Tecnologia                    | Por que                               |
|---------------|-------------------------------|---------------------------------------|
| Shell nativo  | Tauri v2 (Rust)               | Backbone sin alternativa              |
| Frontend      | Vanilla TypeScript + Vite     | Cero overhead de framework            |
| Terminal      | xterm.js + WebGL addon        | Unica libreria aceptable              |
| Shells reales | Tauri Shell plugin v2         | Reemplaza node-pty 100% Tauri         |
| Estilos       | CSS Puro con variables        | Sin Tailwind, zero deps               |
| Estado        | Modulos TS nativos            | Sin Zustand, sin Redux                |
| Persistencia  | Tauri Store plugin            | SQLite nativo via Tauri               |
| IPC           | invoke() de Tauri             | Zero overhead incluido                |
| MCP Server    | axum (Rust) puerto 3333       | Dentro del binario Tauri              |

## Reglas de Oro
1. Una sola dep JS: xterm.js + addon WebGL. Nada mas.
2. Todo lo que pueda hacerse en Rust se hace en Rust.
3. CSS Variables nativas  cero frameworks de estilos.
4. Comunicacion unicamente via invoke().
5. Un archivo = una responsabilidad (max 150 lineas TS).
6. CERO imports duplicados.
7. CERO default exports en componentes.
8. Sin console.log en produccion.

## Agents
| Agent    | Model                                | Role              | Territory     |
|----------|--------------------------------------|-------------------|---------------|
| ADAM     | nvidia/deepseek-ai/deepseek-r1       | Orchestrator      | Transversal   |
| ATLAS    | google/gemini-3.1-pro-preview        | Architect         | Decisions     |
| FORGE    | google/gemini-3.1-flash-lite-preview | Backend Rust      | src-tauri/    |
| PIXEL    | mistral/mistral-large-latest         | Frontend TS       | src/          |
| SENTINEL | nvidia/deepseek-ai/deepseek-v4-flash | QA                | Review only   |
| HERALD   | google/gemini-3.1-flash-lite-preview | Docs              | *.md          |
| NEXUS    | mistral/mistral-small-latest         | DevOps            | Build/CI      |
| CIPHER   | nvidia/deepseek-ai/deepseek-r1       | Security          | Audit silent  |

## Decision Log
| Date       | Decision                        | Reason                        | Owner |
|------------|---------------------------------|-------------------------------|-------|
| 2026-05-02 | Tauri v2 over Electron          | 10x less RAM                  | ATLAS |
| 2026-05-02 | Vanilla TS over React 19        | Zero framework overhead       | ATLAS |
| 2026-05-02 | CSS Variables over Tailwind     | Zero deps, full control       | ATLAS |
| 2026-05-02 | Tauri Shell over node-pty       | 100% Tauri ecosystem          | ATLAS |
