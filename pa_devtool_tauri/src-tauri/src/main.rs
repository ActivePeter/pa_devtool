#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fmt;
use std::io::Read;
use std::io::{BufRead, BufReader};
use std::process::{self, Command, Stdio};
use std::string::String;
use tauri;
// use async_process::{Command, Stdio};
// use futures_lite::{future, io::BufReader, prelude::*};
// use expectrl::{interact::InteractOptions, spawn, Regex};

// // the payload type must implement `Serialize` and `Clone`.
// #[derive(Clone, serde::Serialize)]
// struct Payload {
//     message: String,
// }

// init a background process on the command, and emit periodic events only to the window that used the command
#[tauri::command]
fn open_dir(dir: String) {
    match std::env::consts::OS {
        "windows" => {
            Command::new("explorer")
                .arg(dir) // <- Specify the directory you'd like to open.
                .spawn()
                .unwrap();
        }
        "macos" => {
            Command::new("open")
                .arg(dir) // <- Specify the directory you'd like to open.
                .spawn()
                .unwrap();
        }
        "linux" => {
            Command::new("xdg-open")
                .arg(dir) // <- Specify the directory you'd like to open.
                .spawn()
                .unwrap();
        }
        &_=>{}
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
