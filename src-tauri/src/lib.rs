// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;
use std::fs;
use serde::{Deserialize, Serialize};
use rust_xlsxwriter::{Workbook, Format};

// Define the Task struct to represent each task item
#[derive(Debug, Serialize, Deserialize)]
struct Task {
    rr: String,
    product_name: String,
    role: String,
    milestone: String,
    region: String,
    skills: String,
    assignment_tasks: String,
    hours_per_role_per_milestone: String,
    duration: String,
    hours: i64
}


// Command to read the template JSON file from the resources directory
#[tauri::command]
fn read_template_json(app: tauri::AppHandle) -> Result<String, String> {
    let res_path = app.path().resource_dir().map_err(|e| e.to_string())?;
    let json_path = res_path.join("assets/psa_tasklist_template.json");
    fs::read_to_string(json_path).map_err(|e| e.to_string())
}

// Command to export tasklists to an Excel file
#[tauri::command]
fn export_excel(
    _app:tauri::AppHandle, 
    assessment_tasklist: Vec<Task>, 
    development_tasklist: Vec<Task>,
    file_path: String
) -> Result<(), String> {
    
    // Initialize buffer start row
    let mut buffer_start_row = 0;

    // Create bold format
    let bold_format = Format::new().set_bold();

    // Create a new workbook and worksheet
    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();
    worksheet.set_name("Tasklist").map_err(|e| e.to_string())?;

    // Write headers
    let headers = vec![
        "RR", "Product Name", "Role", "Milestone", "Region", 
        "Skills", "Assignment Tasks", "Hours per Role per Milestone", 
        "Duration", "Hours"
    ];

    // Write assessment tasks if present
    if !assessment_tasklist.is_empty() {
        // Write header row
        for (col, &header) in headers.iter().enumerate() {
            worksheet.write_string_with_format(0, col as u16, header, &bold_format).map_err(|e| e.to_string())?;
        }

        // Write detail rows
        for (row, task) in assessment_tasklist.iter().enumerate() {
            let r = (row + 1) as u32; // +1 to account for header row
            worksheet.write_string(r, 0, &task.rr).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 1, &task.product_name).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 2, &task.role).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 3, &task.milestone).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 4, &task.region).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 5, &task.skills).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 6, &task.assignment_tasks).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 7, &task.hours_per_role_per_milestone).map_err(|e| e.to_string())?;
            if &task.duration == "Total" {
                worksheet.write_string_with_format(r, 8, &task.duration, &bold_format).map_err(|e| e.to_string())?;
            }
            else {
                worksheet.write_string(r, 8, &task.duration).map_err(|e| e.to_string())?;
            }
            worksheet.write_number(r, 9, task.hours as f64).map_err(|e| e.to_string())?;
        }

        // Write 3 buffer lines to separate from development tasks
        buffer_start_row = (assessment_tasklist.len() + 1) as u32;
        for i in 0..3 {
            let r = buffer_start_row + i as u32;
            for col in 0..10 {
                worksheet.write_string(r, col as u16, "").map_err(|e| e.to_string())?;
            }
        }
    }

    // Write development tasks if present
    if !development_tasklist.is_empty() {
        // Write header row
        for (col, &header) in headers.iter().enumerate() {
            if buffer_start_row == 0 { // Writes to Row 1 if assessment tasks are absent
                worksheet.write_string_with_format(0, col as u16, header, &bold_format).map_err(|e| e.to_string())?;
            }
            else { // Writes after buffer rows if assessment tasks are present
                worksheet.write_string_with_format(buffer_start_row + 3, col as u16, header, &bold_format).map_err(|e| e.to_string())?;
            }
        }

        // Write detail rows
        let offset = if buffer_start_row == 0 { 1 } else { buffer_start_row + 4 };
        for (row, task) in development_tasklist.iter().enumerate() {
            let r = (offset + row as u32) as u32;
            worksheet.write_string(r, 0, &task.rr).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 1, &task.product_name).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 2, &task.role).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 3, &task.milestone).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 4, &task.region).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 5, &task.skills).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 6, &task.assignment_tasks).map_err(|e| e.to_string())?;
            worksheet.write_string(r, 7, &task.hours_per_role_per_milestone).map_err(|e| e.to_string())?;
            if &task.duration == "Total" {
                worksheet.write_string_with_format(r, 8, &task.duration, &bold_format).map_err(|e| e.to_string())?;
            }
            else {
                worksheet.write_string(r, 8, &task.duration).map_err(|e| e.to_string())?;
            }
            worksheet.write_number(r, 9, task.hours as f64).map_err(|e| e.to_string())?;
        }
    }

    // Save the workbook to the specified file path
    workbook.save(&file_path).map_err(|e| e.to_string())?;

    // Return success
    Ok(())
}

// Tauri application entry point
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![read_template_json, export_excel])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
