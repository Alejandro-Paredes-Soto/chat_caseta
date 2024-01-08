// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use relative_path::RelativePath;
use rodio::{source::Source, Decoder, OutputStream};
use std::env::current_dir;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn play_audio() {
    // Llama a la lógica de reproducción de audio en Rust
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    // Load a sound from a file, using a path relative to Cargo.toml

    let file = BufReader::new(
        File::open("c:\\Users\\adv\\Desktop\\chat_caseta_ts\\public\\sound\\notification.mp3")
            .unwrap(),
    );
    // Decode that sound file into a source
    let source = Decoder::new(file).unwrap();
    // Play the sound directly on the device
    stream_handle.play_raw(source.convert_samples());

    // The sound plays in a separate audio thread,
    // so we need to keep the main thread alive while it's playing.
    std::thread::sleep(std::time::Duration::from_secs(5));
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, play_audio])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
