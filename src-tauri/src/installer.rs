use std::{sync::Mutex, time::Duration};

use tauri::{Emitter, Window};

#[derive(Clone, serde::Serialize)]
struct Payload {
    progress: i32,
    text: String,
}
static RUNNING: Mutex<bool> = Mutex::new(false);
#[tauri::command]
pub async fn start_install(window: Window) {
    if *RUNNING.lock().unwrap() {
        return;
    }
    let messages = vec![
        "Copiando arquivo do sistema",
        "Instalando pacotes",
        "Criando usuario",
    ];
    *RUNNING.lock().unwrap() = true;
   
        for i in 0..=100 {
            window
                .emit(
                    "install_progress",
                    Payload {
                        progress: i,
                        text: messages[i as usize % messages.len()].into(),
                    },
                )
                .unwrap();
            std::thread::sleep(Duration::from_secs(1));
        }
        *RUNNING.lock().unwrap() = false;

}
