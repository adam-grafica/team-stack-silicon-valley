pub mod commands;
pub mod pty;
pub mod state;

pub fn run() {
    tauri::Builder::default()
        .manage(state::AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::terminal::pty_create,
            commands::terminal::pty_write,
            commands::terminal::pty_resize,
            commands::terminal::pty_kill
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
