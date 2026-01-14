# PSA Tasklist Generator

## Overview

PSA Tasklist Generator is a Tauri-based application that helps generate structured tasklists for integration projects. The app allows you to input project details, adjust task percentages, and export professional Excel spreadsheets with formatted tasklists for both Assessment and Development phases.

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Rust, Tauri 2
- **Excel Export**: rust_xlsxwriter
- **File Dialog**: tauri-plugin-dialog

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://www.rust-lang.org/) (latest stable)

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd psa-tasklist-gen
```

### Install Dependencies

```bash
npm install
```

### Install Rust Dependencies

Rust dependencies are automatically installed during the first build.

## Development

### Run in Development Mode

```bash
npm run tauri dev
```

This will:
1. Start the Vite development server (React frontend)
2. Launch the Tauri application window with hot-reload enabled

### Project Structure

```
psa-tasklist-gen/
├── src/                          # React frontend source
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # Application styles
│   └── assets/                   # Frontend assets
├── src-tauri/                    # Tauri/Rust backend
│   ├── src/
│   │   ├── lib.rs               # Rust commands and business logic
│   │   └── main.rs              # Tauri entry point
│   ├── assets/                   # Bundled resources
│   │   └── psa_tasklist_template.json  # Task template data
│   ├── Cargo.toml               # Rust dependencies
│   └── tauri.conf.json          # Tauri configuration
├── package.json                  # Node dependencies
└── README.md                     # This file
```

## Building for Production

### Build for Current Platform

```bash
npm run tauri build
```

### Build Outputs

**macOS:**
- DMG installer: `src-tauri/target/release/bundle/dmg/`
- App bundle: `src-tauri/target/release/bundle/macos/`

**Windows:**
- MSI installer: `src-tauri/target/release/bundle/msi/`
- EXE: `src-tauri/target/release/`

**Linux:**
- AppImage: `src-tauri/target/release/bundle/appimage/`
- DEB package: `src-tauri/target/release/bundle/deb/`

## Usage

1. **Launch the Application**
   - Run in dev mode with `npm run tauri dev` or open the built app

2. **Enter Project Details** (right panel)
   - Client Name
   - Integration Number
   - Integration Name
   - ERP System
   - Directionality (Inbound/Outbound/Bi-Directional)
   - Total Hours
   - Hours Split (Assessment/Development/Both)

3. **Adjust Task Percentages** (left panel)
   - Modify percentage allocations for assessment roles
   - Modify percentage allocations for development roles
   - Percentages update the hours calculation in real-time

4. **Preview Tasklist** (bottom panel)
   - View generated tasklist with all substitutions applied
   - See calculated hours per task based on your inputs
   - Toggle between Assessment and Development views based on Hours Split selection

5. **Export to Excel**
   - Click "Export to Excel" button
   - Select save location via native file dialog
   - Excel file will contain formatted tasklist(s) with:
     - Bold headers
     - Proper column widths
     - All project details substituted
     - Calculated hours per task

## Customizing Templates

The task template is located at `src-tauri/assets/psa_tasklist_template.json`. This JSON file defines the structure of assessment and development tasks.

### Template Structure

```json
{
  "assessment": [
    {
      "rr": "Value",
      "product_name": "Task name with <INSTITUTION NAME> placeholder",
      "role": "Role name",
      "milestone": "Milestone",
      "region": "Region",
      "skills": "Required skills",
      "assignment_tasks": "Task description with <INTEGRATION NAME>, <INTG-NUMBER>, etc.",
      "hours_per_role_per_milestone": 0.15,
      "duration": "Duration"
    }
  ],
  "development": [
    // Similar structure
  ]
}
```

### Available Placeholders

Placeholders in the template are automatically replaced with form values:
- `<INSTITUTION NAME>` → Client Name
- `<INTEGRATION NAME>` → Integration Name
- `<INTG-NUMBER>` → Integration Number
- `<ERP>` → ERP System
- `<Bidirectional or Uni>` → Directionality

## Configuration

### Tauri Configuration

Edit `src-tauri/tauri.conf.json` to modify:
- Application identifier
- Window dimensions
- Bundle settings
- Icon paths
- Security policies

### Bundled Resources

To add additional resources to the bundle, update the `resources` array in `tauri.conf.json`:

```json
{
  "bundle": {
    "resources": [
      "assets/psa_tasklist_template.json",
      "assets/other_file.json"
    ]
  }
}
```

## Troubleshooting

### Build Fails with "resource path doesn't exist"

Ensure `src-tauri/assets/psa_tasklist_template.json` exists. If your JSON is in `src/assets/`, copy it to `src-tauri/assets/`.

### Excel Export Fails

Make sure:
1. You selected a valid save location
3. You have write permissions to the selected directory

### Development Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run tauri dev
```

## License
MIT License

## Author
Sydney Mason (smason1995)
