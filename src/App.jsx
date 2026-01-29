import { useState, useEffect, use } from "react";
import { invoke } from "@tauri-apps/api/core";
import { save } from '@tauri-apps/plugin-dialog';
import "./App.css";

/**
 * Percent Form Component
 * Props:
 * - templateData: The template data containing assessment and development percentages
 * - setTemplateData: Function to update the template data
 * - assessmentTotal: Total percentage for assessment tasks
 * - setAssessmentTotal: Function to update the assessment total
 * - developmentTotal: Total percentage for development tasks
 * - setDevelopmentTotal: Function to update the development total
 * 
 * @returns JSX.Element
 */
function PercentForm({
  templateData, setTemplateData,
  assessmentTotal, setAssessmentTotal,
  developmentTotal, setDevelopmentTotal,
  hoursSplit
}) {
  const [assessmentPcts, setAssessmentPcts] = useState([]); // State for assessment percentages
  const [developmentPcts, setDevelopmentPcts] = useState([]); // State for development percentages

  // Initialize assessment and development percentages from template data
  useEffect(() => {
    if (templateData && templateData.assessment && templateData.development) {
      setAssessmentPcts(templateData.assessment);
      setDevelopmentPcts(templateData.development);
    }
  }, [templateData]);

  //
  useEffect(() => {
    setAssessmentTotal(Number(assessmentPcts.reduce((total, item) => total + item.hours_per_role_per_milestone, 0).toFixed(2)));
  }, [assessmentPcts]);

  // Update development total when development percentages change
  useEffect(() => {
    setDevelopmentTotal(Number(developmentPcts.reduce((total, item) => total + item.hours_per_role_per_milestone, 0).toFixed(2)));
  }, [developmentPcts]);

  // Function to update percentage values
  function updatePctValues(roleType, index, newValue) {
    // Update the appropriate percentage array based on roleType
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

  // Function to generate assessment form
  function generateAssessmentForm() {
    return (
      <table>
        {/* Table header */}
        <thead>
          <tr>
            <th>Task</th>
            <th>Percentage</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {/* Render assessment percentage rows */}
          {assessmentPcts.map((item, index) => (
            <tr key={index}>
              <td align="left">{item.role} - {item.milestone}</td>
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
            {/* Total row */}
            <td>Total</td>
            <td>
              {assessmentTotal}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  // Function to generate development form
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
          {/* Render development percentage rows */}
          {developmentPcts.map((item, index) => (
            <tr key={index}>
              <td align="left">{item.role} - {item.milestone}</td>
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
            {/* Total row */}
            <td>Total</td>
            <td>
              {developmentTotal}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  // Render the Percent Form component
  return (
    <div className="pctForm">
      <h2>Percent Form</h2>
      {(hoursSplit === "Assessment" || hoursSplit === "Both") && <>
        <h4>Assessment</h4>
        {generateAssessmentForm()}
      </>}
      {(hoursSplit === "Development" || hoursSplit === "Both") && <>
        <h4>Development</h4>
        {generateDevelopmentForm()}
      </>}
    </div>
  );
}

/**
 * Data Input Form Component
 * Props:
 * - clientName, setClientName: Client name state and setter
 * - intgNumber, setIntgNumber: Integration number state and setter
 * - intgName, setIntgName: Integration name state and setter
 * - erpSystem, setErpSystem: ERP system state and setter
 * - directionality, setDirectionality: Directionality state and setter
 * - assessmentHours, setAssessmentHours: Assessment hours state and setter
 * - developmentHours, setDevelopmentHours: Development hours state and setter
 * - hoursSplit, setHoursSplit: Hours split state and setter
 * - erpConsultant, setErpConsultant: ERP consultant state and setter
 * 
 * @returns JSX.Element
 */
function DataInputForm({
  clientName, setClientName,
  intgNumber, setIntgNumber,
  intgName, setIntgName,
  erpSystem, setErpSystem,
  directionality, setDirectionality,
  assessmentHours, setAssessmentHours,
  developmentHours, setDevelopmentHours,
  hoursSplit, setHoursSplit,
  erpConsultant, setErpConsultant
}) {

  useEffect(() => {
    // Reset hours when hoursSplit changes
    if (hoursSplit === "Assessment") {
      setDevelopmentHours(0);
    }
    else if (hoursSplit === "Development") {
      setAssessmentHours(0);
    }
  }, [hoursSplit]);

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
            <td align="left">Client Name</td>
            <td><input type="text" name="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} /></td>
          </tr>
          <tr>
            {/* Integration Number Input */}
            <td align="left">Integration Number</td>
            <td><input type="text" name="intgNumber" value={intgNumber} onChange={(e) => setIntgNumber(e.target.value)} /></td>
          </tr>
          <tr>
            {/* Integration Name Input */}
            <td align="left">Integration Name</td>
            <td><input type="text" name="intgName" value={intgName} onChange={(e) => setIntgName(e.target.value)} /></td>
          </tr>
          <tr>
            {/* ERP System Input */}
            <td align="left">ERP System</td>
            <td><input type="text" name="erpSystem" value={erpSystem} onChange={(e) => setErpSystem(e.target.value)} /></td>
          </tr>
          <tr>
            {/* ERP Consultant Input */}
            <td align="left">ERP Consultant</td>
            <td><input type="text" name="erpConsultant" value={erpConsultant} onChange={(e) => setErpConsultant(e.target.value)} /></td>
          </tr>
          <tr>
            {/* Directionality Dropdown */}
            <td align="left">Directionality</td>
            <td>
              <select value={directionality} onChange={(e) => setDirectionality(e.target.value)}>
                <option>Inbound</option>
                <option>Outbound</option>
                <option>Bi-Directional</option>
              </select>
            </td>
          </tr>
          <tr>
            {/* Hours Split Radio Buttons */}
            <td align="left">Hours Split</td>
            <td align="left">
              {/* Radio Button Option: Assessment */}
              <label>
                <input type="radio" name="hoursSplit" value="Assessment" checked={hoursSplit === "Assessment"} onChange={(e) => setHoursSplit(e.target.value)} />
                Assessment
              </label>
              <br />
              {/* Radio Button Option: Development */}
              <label>
                <input type="radio" name="hoursSplit" value="Development" checked={hoursSplit === "Development"} onChange={(e) => setHoursSplit(e.target.value)} />
                Development
              </label>
              <br />
              {/* Radio Button Option: Both */}
              <label>
                <input type="radio" name="hoursSplit" value="Both" checked={hoursSplit === "Both"} onChange={(e) => setHoursSplit(e.target.value)} />
                Both
              </label>
            </td>
          </tr>
          <tr>
            {/* Assessment Hours Input */}
            <td align="left">Assessment Hours</td>
            <td>
              <input
                type="number"
                name="assessmentHours"
                value={assessmentHours} onChange={(e) => setAssessmentHours(e.target.value)}
                disabled={hoursSplit !== "Assessment" && hoursSplit !== "Both"} />
            </td>
          </tr>
          <tr>
            {/* Development hours Input */}
            <td align="left">Development Hours</td>
            <td>
              <input
                type="number"
                name="developmentHours"
                value={developmentHours} onChange={(e) => setDevelopmentHours(e.target.value)}
                disabled={hoursSplit !== "Development" && hoursSplit !== "Both"} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/**
 * Tasklist Preview Component
 * Props:
 * - templateData: The template data containing assessment and development tasks
 * - clientName: Client name
 * - intgNumber: Integration number
 * - intgName: Integration name
 * - erpSystem: ERP system
 * - directionality: Directionality
 * - assessmentHours: Total assessment hours
 * - developmentHours: Total development hours
 * - hoursSplit: Hours split selection
 * - erpConsultant: ERP consultant name
 * - assessmentTotal: Total percentage for assessment tasks
 * - developmentTotal: Total percentage for development tasks
 * 
 * @returns JSX.Element
 */
function TasklistPreview({
  templateData,
  clientName,
  intgNumber,
  intgName,
  erpSystem,
  directionality,
  assessmentHours,
  developmentHours,
  hoursSplit,
  erpConsultant,
  assessmentTotal,
  developmentTotal
}) {
  const [assessmentTasks, setAssessmentTasks] = useState([]); // State for assessment tasks
  const [developmentTasks, setDevelopmentTasks] = useState([]); // State for development tasks

  // Update Assessment Tasks when necessary
  useEffect(() => {
    // Process assessment tasks if hoursSplit includes Assessment
    if (hoursSplit === "Assessment" || hoursSplit === "Both") {
      let assessmentTotalLine = {}; // Initialize total line object

      // Replace placeholders in assessment tasks for client-specific data and remove section
      if (templateData && templateData.assessment) {
        let processedAssessment = templateData.assessment.map(task => {
          delete task.section;
          return {
            ...task,
            product_name: task.product_name.replace("<INSTITUTION NAME>", clientName),
            assignment_tasks: task.assignment_tasks.replace("<INTEGRATION NAME>", intgName)
              .replace("<INTG-NUMBER>", intgNumber)
              .replace("<ERP>", erpSystem)
              .replace("<Bidirectional or Uni>", directionality),
            role: (erpConsultant && task.role === "ERP Functional Consultant") ? `${erpConsultant} Consultant` : task.role,
            skills: (erpConsultant && task.role === "ERP Functional Consultant") ? erpConsultant : task.skills
          };
        });

        // Calculate hours and convert percentage to string
        processedAssessment = processedAssessment.map(task => {
          const hourPct = parseFloat(task.hours_per_role_per_milestone); // Stores percentage as decimal
          return {
            ...task, // Retain existing task properties
            hours_per_role_per_milestone: `${(task.hours_per_role_per_milestone > 0) ? String(task.hours_per_role_per_milestone * 100) : '0'}%`, // Convert to percentage string
            hours: Math.ceil(assessmentHours * hourPct) // Calculate hours
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

        // If only Assessment is selected, clear development tasks and hours
        if (hoursSplit === "Assessment") {
          setDevelopmentTasks([]); // Clear development tasks
        }
      }
    }
  }, [templateData, hoursSplit, clientName, intgNumber, intgName, erpSystem, directionality, assessmentHours, erpConsultant])

  // Update Development Tasks when necessary
  useEffect(() => {
    if (hoursSplit === "Development" || hoursSplit === "Both") {
      // Initialize total line objects
      let developmentTotalLine = {};

      if (templateData && templateData.assessment && templateData.development) {
        // Replace placeholders in development tasks for client-specific data and remove section
        let processedDevelopment = templateData.development.map(task => {
          delete task.section;
          return {
            ...task,
            product_name: task.product_name.replace("<INSTITUTION NAME>", clientName)
              .replace("<INTG-NUMBER>", intgNumber)
              .replace("<INTEGRATION NAME>", intgName)
              .replace("<ERP>", erpSystem),
            assignment_tasks: task.assignment_tasks.replace("<INSTITUTION NAME>", clientName)
              .replace("<INTG-NUMBER>", intgNumber)
              .replace("<ERP>", erpSystem)
              .replace("<Bidirectional or Uni>", directionality),
            role: (erpConsultant && task.role === "ERP Functional Consultant") ? `${erpConsultant} Consultant` : task.role,
            skills: (erpConsultant && task.role === "ERP Functional Consultant") ? erpConsultant : task.skills
          };
        });

        // Calculate hours and convert percentage to string
        processedDevelopment = processedDevelopment.map(task => {
          const hourPct = parseFloat(task.hours_per_role_per_milestone); // Stores percentage as decimal
          return {
            ...task, // Retain existing task properties
            hours_per_role_per_milestone: `${(task.hours_per_role_per_milestone > 0) ? String(task.hours_per_role_per_milestone * 100) : '0'}%`,
            hours: Math.ceil(developmentHours * hourPct) // Calculate hours
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
        setDevelopmentTasks(processedDevelopment); // Update state with processed development tasks

        // Calculate hours based on hoursSplit selection
        if (hoursSplit === "Development") {
          setAssessmentTasks([]); // Clear assessment tasks
        }
      }
    }
  }, [templateData, hoursSplit, clientName, intgNumber, intgName, erpSystem, directionality, developmentHours, erpConsultant]);

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
            totalHours <= 0 ||
            (hoursSplit === "Assessment" && assessmentTotal != 1.00) ||
            (hoursSplit === "Development" && developmentTotal != 1.00) ||
            (hoursSplit === "Both" && (assessmentTotal != 1.00 || developmentTotal != 1.00))
          }>
          Export to Excel
        </button>
      </div>
      <div className="infoMessage">
        {/* Display validation message if totals do not equal 100% */}
        {((hoursSplit === "Assessment" || hoursSplit === "Both") && assessmentTotal !== 1.00) && (
          <div className="validationMessage">Assessment total must equal 100%</div>
        )}
        {((hoursSplit === "Development" || hoursSplit === "Both") && developmentTotal !== 1.00) && (
          <div className="validationMessage">Development total must equal 100%</div>
        )}
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

/**
 * Main App Component
 * 
 * @returns JSX.Element
 */
function App() {
  // State variables for template data and data form inputs
  const [templateData, setTemplateData] = useState([]);
  const [clientName, setClientName] = useState("");
  const [intgNumber, setIntgNumber] = useState("");
  const [intgName, setIntgName] = useState("");
  const [erpSystem, setErpSystem] = useState("");
  const [directionality, setDirectionality] = useState("Bi-Directional");
  const [assessmentHours, setAssessmentHours] = useState(0);
  const [developmentHours, setDevelopmentHours] = useState(0);
  const [hoursSplit, setHoursSplit] = useState("Both");
  const [erpConsultant, setErpConsultant] = useState("");
  const [assessmentTotal, setAssessmentTotal] = useState(0);
  const [developmentTotal, setDevelopmentTotal] = useState(0);

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
          setTemplateData={setTemplateData}
          assessmentTotal={assessmentTotal} setAssessmentTotal={setAssessmentTotal}
          developmentTotal={developmentTotal} setDevelopmentTotal={setDevelopmentTotal}
          hoursSplit={hoursSplit}
        />
        {/* Data Input Form Component */}
        <DataInputForm
          clientName={clientName} setClientName={setClientName}
          intgNumber={intgNumber} setIntgNumber={setIntgNumber}
          intgName={intgName} setIntgName={setIntgName}
          erpSystem={erpSystem} setErpSystem={setErpSystem}
          directionality={directionality} setDirectionality={setDirectionality}
          assessmentHours={assessmentHours} setAssessmentHours={setAssessmentHours}
          developmentHours={developmentHours} setDevelopmentHours={setDevelopmentHours}
          hoursSplit={hoursSplit} setHoursSplit={setHoursSplit}
          erpConsultant={erpConsultant} setErpConsultant={setErpConsultant}
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
        assessmentHours={assessmentHours}
        developmentHours={developmentHours}
        hoursSplit={hoursSplit}
        erpConsultant={erpConsultant}
        assessmentTotal={assessmentTotal}
        developmentTotal={developmentTotal}
      />
    </main>
  );
}

export default App; // Export the App component as default
