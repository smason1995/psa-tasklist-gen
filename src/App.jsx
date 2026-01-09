import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { save } from '@tauri-apps/plugin-dialog';
import "./App.css";

// Percent Form Component
// This component renders a form to input percentage values for assessment and development tasks.
function PercentForm({ templateData, setTemplateData }) {
  const [assessmentPcts, setAssessmentPcts] = useState([]); // State for assessment percentages
  const [developmentPcts, setDevelopmentPcts] = useState([]); // State for development percentages

  // Initialize state when templateData changes
  useEffect(() => {
    if (templateData && templateData.assessment && templateData.development) {
      setAssessmentPcts(templateData.assessment);
      setDevelopmentPcts(templateData.development);
    }
  }, [templateData]);

  // Function to update percentage values in both state and templateData
  function updatePctValues(roleType, index, newValue) {
    if (roleType === "assessment") {
      const updatedAssessment = [...assessmentPcts];
      updatedAssessment[index].hours_per_role_per_milestone = parseFloat(newValue);
      setAssessmentPcts(updatedAssessment);
      setTemplateData({
        assessment: updatedAssessment,
        development: developmentPcts
      });
    } else if (roleType === "development") {
      const updatedDevelopment = [...developmentPcts];
      updatedDevelopment[index].hours_per_role_per_milestone = parseFloat(newValue);
      setDevelopmentPcts(updatedDevelopment);
      setTemplateData({
        assessment: assessmentPcts,
        development: updatedDevelopment
      });
    }
  }

  // Function to generate the assessment form table
  function generateAssessmentForm() {
    return (
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {assessmentPcts.map((item, index) => (
            <tr key={index}>
              <td>{item.role}</td>
              <td>
                <input
                  type="number"
                  name={`assessmentPct_${index}`}
                  value={item.hours_per_role_per_milestone}
                  onChange={(e) => updatePctValues("assessment", index, e.target.value)}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td>
              {assessmentPcts.reduce((total, item) => total + item.hours_per_role_per_milestone, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  // Function to generate the development form table
  function generateDevelopmentForm() {
    return (
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {developmentPcts.map((item, index) => (
            <tr key={index}>
              <td>{item.role}</td>
              <td>
                <input
                  type="number"
                  name={`developmentPct_${index}`}
                  value={item.hours_per_role_per_milestone}
                  onChange={(e) => updatePctValues("development", index, e.target.value)}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td>
              {developmentPcts.reduce((total, item) => total + item.hours_per_role_per_milestone, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  // Render the percent form
  return (
    <div className="pctForm">
      <h2>Percent Form</h2>
      <h4>Assessment</h4>
      {generateAssessmentForm()}
      <h4>Development</h4>
      {generateDevelopmentForm()}
    </div>
  );
}

// Data Input Form Component
// This component renders a form to input various data fields required for tasklist generation.
function DataInputForm({
  clientName, setClientName,
  intgNumber, setIntgNumber,
  intgName, setIntgName,
  erpSystem, setErpSystem,
  directionality, setDirectionality,
  totalHours, setTotalHours,
  hoursSplit, setHoursSplit
}) {
  // Render the data input form
  return (
    <div className="dataForm">
      <h2>Data Input Form</h2>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Input</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Client Name Input */}
            <td>Client Name</td>
            <td><input type="text" name="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} /></td>
          </tr>
          <tr>
            {/* Integration Number Input */}
            <td>Integration Number</td>
            <td><input type="text" name="intgNumber" value={intgNumber} onChange={(e) => setIntgNumber(e.target.value)} /></td>
          </tr>
          <tr>
            {/* Integration Name Input */}
            <td>Integration Name</td>
            <td><input type="text" name="intgName" value={intgName} onChange={(e) => setIntgName(e.target.value)} /></td>
          </tr>
          <tr>
            {/* ERP System Input */}
            <td>ERP System</td>
            <td><input type="text" name="erpSystem" value={erpSystem} onChange={(e) => setErpSystem(e.target.value)} /></td>
          </tr>
          <tr>
            {/* Directionality Dropdown */}
            <td>Directionality</td>
            <td>
              <select value={directionality} onChange={(e) => setDirectionality(e.target.value)}>
                <option>Inbound</option>
                <option>Outbound</option>
                <option>Bi-Directional</option>
              </select>
            </td>
          </tr>
          <tr>
            {/* Total Hours Input */}
            <td>Total Hours</td>
            <td><input type="number" name="totalHours" value={totalHours} onChange={(e) => setTotalHours(e.target.value)} /></td>
          </tr>
          <tr>
            {/* Hours Split Radio Buttons */}
            <td>Hours Split</td>
            <td align="left">
              <label>
                <input type="radio" name="hoursSplit" value="Assessment" checked={hoursSplit === "Assessment"} onChange={(e) => setHoursSplit(e.target.value)} />
                Assessment
              </label>
              <br />
              <label>
                <input type="radio" name="hoursSplit" value="Development" checked={hoursSplit === "Development"} onChange={(e) => setHoursSplit(e.target.value)} />
                Development
              </label>
              <br />
              <label>
                <input type="radio" name="hoursSplit" value="Both" checked={hoursSplit === "Both"} onChange={(e) => setHoursSplit(e.target.value)} />
                Both (30/70 split)
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TasklistPreview({
  templateData,
  clientName,
  intgNumber,
  intgName,
  erpSystem,
  directionality,
  totalHours,
  hoursSplit
}) {
  const [assessmentTasks, setAssessmentTasks] = useState([]); // State for processed assessment tasks
  const [developmentTasks, setDevelopmentTasks] = useState([]); // State for processed development tasks

  // Process template data whenever relevant inputs change
  useEffect(() => {
    // Initialize total line objects
    let assessmentTotalLine = {};
    let developmentTotalLine = {};

    if (templateData && templateData.assessment && templateData.development) {
      // Replace placeholders in assessment tasks for client-specific data
      let processedAssessment = templateData.assessment.map(task => {
        return {
          ...task,
          product_name: task.product_name.replace("<INSTITUTION NAME>", clientName),
          assignment_tasks: task.assignment_tasks.replace("<INTEGRATION NAME>", intgName)
            .replace("<INTG-NUMBER>", intgNumber)
            .replace("<ERP>", erpSystem)
            .replace("<Bidirectional or Uni>", directionality)
        };
      });
      delete processedAssessment[0].section; // Remove section property from first task

      // Replace placeholders in development tasks for client-specific data
      let processedDevelopment = templateData.development.map(task => {
        return {
          ...task,
          product_name: task.product_name.replace("<INSTITUTION NAME>", clientName)
            .replace("<INTG-NUMBER>", intgNumber)
            .replace("<INTEGRATION NAME>", intgName)
            .replace("<ERP>", erpSystem),
          assignment_tasks: task.assignment_tasks.replace("<INSTITUTION NAME>", clientName)
            .replace("<INTG-NUMBER>", intgNumber)
            .replace("<ERP>", erpSystem)
            .replace("<Bidirectional or Uni>", directionality)
        };
      });
      delete processedDevelopment[0].section; // Remove section property from first task

      // Calculate hours based on hoursSplit selection
      switch (hoursSplit) {
        case "Assessment":
          processedAssessment = processedAssessment.map(task => {
            const hourPct = parseFloat(task.hours_per_role_per_milestone); // Stores percentage as decimal
            return {
              ...task, // Retain existing task properties
              hours_per_role_per_milestone: `${(task.hours_per_role_per_milestone > 0) ? String(task.hours_per_role_per_milestone * 100) : '0'}%`, // Convert to percentage string
              hours: Math.ceil(totalHours * hourPct) // Calculate hours
            };
          });
          assessmentTotalLine = { // Create total line for assessment tasks
            "section": "",
            "rr": "",
            "product_name": "",
            "role": "",
            "milestone": "",
            "region": "",
            "skills": "",
            "assignment_tasks": "",
            "hours_per_role_per_milestone": "",
            "duration": "Total",
            "hours": processedAssessment.reduce((total, task) => total + task.hours, 0)
          };
          processedAssessment.push(assessmentTotalLine); // Append total line to assessment tasks
          setAssessmentTasks(processedAssessment); // Update state with processed assessment tasks
          setDevelopmentTasks([]); // Clear development tasks
          break;
        case "Development":
          processedDevelopment = processedDevelopment.map(task => {
            const hourPct = parseFloat(task.hours_per_role_per_milestone); // Stores percentage as decimal
            return {
              ...task, // Retain existing task properties
              hours_per_role_per_milestone: `${(task.hours_per_role_per_milestone > 0) ? String(task.hours_per_role_per_milestone * 100) : '0'}%`, // Convert to percentage string
              hours: Math.ceil(totalHours * hourPct) // Calculate hours
            };
          });
          developmentTotalLine = { // Create total line for development tasks
            "section": "",
            "rr": "",
            "product_name": "",
            "role": "",
            "milestone": "",
            "region": "",
            "skills": "",
            "assignment_tasks": "",
            "hours_per_role_per_milestone": "",
            "duration": "Total",
            "hours": processedDevelopment.reduce((total, task) => total + task.hours, 0)
          };
          processedDevelopment.push(developmentTotalLine); // Append total line to development tasks
          setAssessmentTasks([]); // Clear assessment tasks
          setDevelopmentTasks(processedDevelopment); // Update state with processed development tasks
          break;
        case "Both":
          const splitTotalAssessment = Math.ceil(totalHours * 0.3); // 30% for assessment
          const splitTotalDevelopment = Math.ceil(totalHours * 0.7); // 70% for development
          processedAssessment = processedAssessment.map(task => {
            const hourPct = parseFloat(task.hours_per_role_per_milestone); // Stores percentage as decimal
            return {
              ...task, // Retain existing task properties
              hours_per_role_per_milestone: `${(task.hours_per_role_per_milestone > 0) ? String(task.hours_per_role_per_milestone * 100) : '0'}%`, // Convert to percentage string
              hours: Math.ceil(splitTotalAssessment * hourPct) // Calculate hours
            };
          });
          assessmentTotalLine = { // Create total line for assessment tasks
            "section": "",
            "rr": "",
            "product_name": "",
            "role": "",
            "milestone": "",
            "region": "",
            "skills": "",
            "assignment_tasks": "",
            "hours_per_role_per_milestone": "",
            "duration": "Total",
            "hours": processedAssessment.reduce((total, task) => total + task.hours, 0)
          };
          processedAssessment.push(assessmentTotalLine); // Append total line to assessment tasks
          processedDevelopment = processedDevelopment.map(task => {
            const hourPct = parseFloat(task.hours_per_role_per_milestone); // Stores percentage as decimal
            return {
              ...task, // Retain existing task properties
              hours_per_role_per_milestone: `${(task.hours_per_role_per_milestone > 0) ? String(task.hours_per_role_per_milestone * 100) : '0'}%`, // Convert to percentage string
              hours: Math.ceil(splitTotalDevelopment * hourPct) // Calculate hours
            };
          });
          developmentTotalLine = { // Create total line for development tasks
            "section": "",
            "rr": "",
            "product_name": "",
            "role": "",
            "milestone": "",
            "region": "",
            "skills": "",
            "assignment_tasks": "",
            "hours_per_role_per_milestone": "",
            "duration": "Total",
            "hours": processedDevelopment.reduce((total, task) => total + task.hours, 0)
          };
          processedDevelopment.push(developmentTotalLine); // Append total line to development tasks
          setAssessmentTasks(processedAssessment); // Update state with processed assessment tasks
          setDevelopmentTasks(processedDevelopment); // Update state with processed development tasks
          break;
      }
    }
  }, [templateData, hoursSplit, clientName, intgNumber, intgName, erpSystem, directionality, totalHours]);

  // Function to generate HTML table for tasks
  function generateTable(tasks) {
    // Handle case with no tasks
    if (!tasks || tasks.length === 0) {
      return <div>No tasks available.</div>;
    }

    // Get table columns from task keys
    const columns = Object.keys(tasks[0]);

    return (
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            {/* Render table headers */}
            {columns.map((col) => (
              <th key={col}>{col.replace(/_/g, " ")}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Render table rows */}
          {tasks.map((task, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col}>{(task[col] === 'Total' ? <strong>{task[col]}</strong> : task[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Function to handle exporting tasklists to Excel
  async function exportToExcel() {
    try {
      // Open save dialog to get file path
      const filePath = await save({
        defaultPath: `${clientName}_${intgName}_${intgNumber}_${directionality}_Tasklist.xlsx`, // Default filename
        filters: [{ // File type filter
          name: 'Excel Files',
          extensions: ['xlsx']
        }]
      });

      // If a file path was selected, invoke the export_excel command
      if (filePath) {
        const result = await invoke("export_excel", { // Invoke Tauri command
          assessmentTasklist: assessmentTasks,
          developmentTasklist: developmentTasks,
          filePath: filePath
        });
        alert("Excel exported successfully!"); // Success alert
      }
    } catch (error) { // Alerts and logs any errors
      alert("Error exporting Excel. See devtools console for details.");
      console.error("Error exporting Excel:", error);
    }
  }

  return (
    <div className="previewContainer">
      <h2>Tasklist Preview</h2>
      {/* Export to Excel Button */}
      <div className="buttonContainer">
        <button
          onClick={exportToExcel}
          disabled={
            clientName === "" ||
            intgNumber === "" ||
            intgName === "" ||
            erpSystem === "" ||
            totalHours <= 0
          }>
          Export to Excel
        </button>
      </div>
      {/* Render assessment and development tasklists based on hoursSplit selection */}
      {(hoursSplit === "Assessment" || hoursSplit === "Both") && (
        <>
          <h4>Assessment Tasklist</h4>
          {generateTable(assessmentTasks)}
        </>
      )}
      {(hoursSplit === "Development" || hoursSplit === "Both") && (
        <>
          <h4>Development Tasklist</h4>
          {generateTable(developmentTasks)}
        </>
      )}
    </div>
  )
}

function App() {
  // State variables for template data and data form inputs
  const [templateData, setTemplateData] = useState([]);
  const [clientName, setClientName] = useState("");
  const [intgNumber, setIntgNumber] = useState("");
  const [intgName, setIntgName] = useState("");
  const [erpSystem, setErpSystem] = useState("");
  const [directionality, setDirectionality] = useState("Bi-Directional");
  const [totalHours, setTotalHours] = useState(0);
  const [hoursSplit, setHoursSplit] = useState("Both");

  // Load template JSON data on component mount
  useEffect(() => {
    invoke("read_template_json") // Invoke Tauri command to read template JSON
      .then((jsonString) => {
        const data = JSON.parse(jsonString);
        setTemplateData(data || []);
      })
      .catch((error) => {
        alert("Error reading template JSON. See devtools console for details.");
        console.error("Error reading template JSON:", error);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  // Show loading message while template data is being fetched
  if (!templateData) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container">
      <h1>PSA Tasklist Generator</h1>
      <div className="formContainer">
        {/* Percent Form Component */}
        <PercentForm
          templateData={templateData}
          setTemplateData={setTemplateData} />
        {/* Data Input Form Component */}
        <DataInputForm
          clientName={clientName} setClientName={setClientName}
          intgNumber={intgNumber} setIntgNumber={setIntgNumber}
          intgName={intgName} setIntgName={setIntgName}
          erpSystem={erpSystem} setErpSystem={setErpSystem}
          directionality={directionality} setDirectionality={setDirectionality}
          totalHours={totalHours} setTotalHours={setTotalHours}
          hoursSplit={hoursSplit} setHoursSplit={setHoursSplit}
        />
      </div>
      {/* Tasklist Preview Component */}
      <TasklistPreview
        templateData={templateData}
        clientName={clientName}
        intgNumber={intgNumber}
        intgName={intgName}
        erpSystem={erpSystem}
        directionality={directionality}
        totalHours={totalHours}
        hoursSplit={hoursSplit}
      />
    </main>
  );
}

export default App; // Export the App component as default
