use portable_pty::{native_pty_system, CommandBuilder, MasterPty, PtySize, Child};
use crate::pty::{PtyResizer, PtyKiller, PtySession, PtyBackend};
use std::io::{Read, Write};

pub struct MasterResizer(Box<dyn MasterPty>);

impl PtyResizer for MasterResizer {
    fn resize(&self, cols: u16, rows: u16) -> Result<(), String> {
        self.0.resize(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 })
            .map_err(|e| e.to_string())
    }
}

pub struct ChildKiller(Box<dyn Child>);

impl PtyKiller for ChildKiller {
    fn kill(mut self: Box<Self>) -> Result<(), String> {
        self.0.kill().map_err(|e| e.to_string())
    }
}

pub struct PortablePtyImpl;

impl PtyBackend for PortablePtyImpl {
    fn spawn(&self, shell: &str, cols: u16, rows: u16) -> Result<PtySession, String> {
        let pty_system = native_pty_system();
        let pair = pty_system.openpty(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 })
            .map_err(|e| e.to_string())?;

        let reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
        
        let cmd = CommandBuilder::new(shell);
        let child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
        
        let writer = pair.master.take_writer().map_err(|e| e.to_string())?;

        Ok(PtySession {
            writer,
            reader,
            resizer: Box::new(MasterResizer(pair.master)),
            killer: Box::new(ChildKiller(child)),
        })
    }
}
