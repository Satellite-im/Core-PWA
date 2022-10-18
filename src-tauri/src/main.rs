#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;
// #[macro_use]
// extern crate lazy_static;

#[cfg(target_os = "macos")]
// use tauri::Menu;
use tauri::{
    generate_handler,
};

use handler::*;

mod handler;

fn main() {
  tauri::Builder::default()
    .invoke_handler(generate_handler![set_badge])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}