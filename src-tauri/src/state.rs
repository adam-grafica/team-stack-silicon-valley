use std::sync::Mutex;
use std::collections::HashMap;
use crate::pty::{PtySession, PtyManager};

pub struct AppState {
    pub active_project: Mutex<Option<String>>,
    pub sessions: Mutex<HashMap<String, PtySession>>,
    pub pty: PtyManager,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            active_project: Mutex::new(None),
            sessions: Mutex::new(HashMap::new()),
            pty: PtyManager::new(),
        }
    }
}

