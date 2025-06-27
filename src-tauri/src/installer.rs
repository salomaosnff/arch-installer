use std::{process::Stdio};

use tauri::ipc::Channel;
use tokio::io::AsyncBufReadExt;

#[derive(Clone, serde::Serialize)]
pub enum CommandOutput {
    StdOut(String),
    StdErr(String),
}

#[tauri::command]
pub async fn exec_sh(command: String, channel: Channel<CommandOutput>)-> i32 {
    let mut command = tokio::process::Command::new("sh")
        .args(vec!["-c".to_owned(), command])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Falha ao executar o comando.");
    if let Some(stdout) = command.stdout.take() {
        let channel = channel.clone();
        tokio::spawn(async move {
            let mut reader = tokio::io::BufReader::new(stdout).lines();
            while let Ok(Some(line)) = reader.next_line().await {
                channel.send(CommandOutput::StdOut(line)).unwrap();
            }
        });
    }
    if let Some(stderr) = command.stderr.take() {
        tokio::spawn(async move {
            let mut reader = tokio::io::BufReader::new(stderr).lines();
            while let Ok(Some(line)) = reader.next_line().await {
                channel.send(CommandOutput::StdErr(line)).unwrap();
            }
        });
    }
    let status = command.wait().await.expect("Falha ao esperar o comando terminar.");
    return  status.code().unwrap_or_default();
}
