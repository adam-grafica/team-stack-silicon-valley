// FORGE territory  entry point Tauri
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
fn main() {
    midi_studio_lib::run();
}
