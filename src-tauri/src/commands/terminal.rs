use crate::state::AppState;
use serde::Serialize;
use std::io::{Read, Write};
use tauri::{AppHandle, Emitter, Manager, State};

#[derive(Clone, Serialize)]
struct PtyOutputPayload {
    id: String,
    data: String,
}

#[tauri::command]
pub async fn pty_create(
    id: String,
    shell: String,
    cols: u16,
    rows: u16,
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<(), String> {
    let mut sessions = state.sessions.lock().map_err(|_| "Mutex poisoned")?;
    if sessions.contains_key(&id) {
        return Err("session already exists".to_string());
    }

    let mut session = state.pty.spawn(&shell, cols, rows)?;
    
    // Move reader to thread
    let mut reader = std::mem::replace(
        &mut session.reader,
        Box::new(std::io::empty()) as Box<dyn Read + Send>,
    );

    let id_clone = id.clone();
    tauri::async_runtime::spawn(async move {
        let mut buf = [0u8; 4096];
        loop {
            match reader.read(&mut buf) {
                Ok(n) if n > 0 => {
                    let data = String::from_utf8_lossy(&buf[..n]).to_string();
                    let _ = app.emit(
                        "pty-output",
                        PtyOutputPayload {
                            id: id_clone.clone(),
                            data,
                        },
                    );
                }
                _ => {
                    let _ = app.emit(
                        "pty-output",
                        PtyOutputPayload {
                            id: id_clone.clone(),
                            data: "\r\n[proceso terminado]\r\n".into(),
                        },
                    );
                    if let Some(state) = app.try_state::<AppState>() {
                        if let Ok(mut sessions) = state.sessions.lock() {
                            sessions.remove(&id_clone);
                        }
                    }
                    break;
                }
            }
        }
    });

    sessions.insert(id, session);
    Ok(())
}

#[tauri::command]
pub fn pty_write(id: String, data: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut sessions = state.sessions.lock().map_err(|_| "Mutex poisoned")?;
    let session = sessions.get_mut(&id).ok_or("session not found")?;
    session
        .writer
        .write_all(data.as_bytes())
        .map_err(|e| e.to_string())?;
    session.writer.flush().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn pty_resize(
    id: String,
    cols: u16,
    rows: u16,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let sessions = state.sessions.lock().map_err(|_| "Mutex poisoned")?;
    let session = sessions.get(&id).ok_or("session not found")?;
    session.resizer.resize(cols, rows)?;
    Ok(())
}

#[tauri::command]
pub fn pty_kill(id: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut sessions = state.sessions.lock().map_err(|_| "Mutex poisoned")?;
    sessions.remove(&id);
    Ok(())
}
