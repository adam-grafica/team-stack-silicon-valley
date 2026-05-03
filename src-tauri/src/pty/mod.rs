pub mod portable_impl;

pub trait PtyResizer: Send {
    fn resize(&self, cols: u16, rows: u16) -> Result<(), String>;
}

pub trait PtyKiller: Send {
    fn kill(self: Box<Self>) -> Result<(), String>;
}

pub struct PtySession {
    pub writer:  Box<dyn std::io::Write + Send>,
    pub reader:  Box<dyn std::io::Read + Send>,
    pub resizer: Box<dyn PtyResizer>,
    pub killer:  Box<dyn PtyKiller>,
}

pub trait PtyBackend: Send + Sync {
    fn spawn(&self, shell: &str, cols: u16, rows: u16) -> Result<PtySession, String>;
}

pub struct PtyManager {
    backend: std::sync::Arc<dyn PtyBackend>,
}

impl PtyManager {
    pub fn new() -> Self {
        Self {
            backend: std::sync::Arc::new(portable_impl::PortablePtyImpl),
        }
    }

    pub fn spawn(&self, shell: &str, cols: u16, rows: u16) -> Result<PtySession, String> {
        self.backend.spawn(shell, cols, rows)
    }
}
