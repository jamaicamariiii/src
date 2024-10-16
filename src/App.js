import React from "react";
import AddStudentData from "./Components/AddStudentData"; // Updated component name
import StudentDataList from "./Components/StudentDataList"; // Updated component name
import CsvUploader from "./Components/CsvUploader"; // Assuming the CSV uploader handles student data
import './App.css'; // Ensure the correct path to your CSS file

function App() {
  return (
    <div className="App">
      {/* Main Content */}
      <div className="content">
        <header className="App-header">
          <h1 className="app-title">STUDENT DATA MANAGEMENT</h1>
        </header>
        <div className="container">
          <div className="form-section">
            <AddStudentData /> {/* Replaced AddDengueData with AddStudentData */}
            <CsvUploader /> {/* Assuming CsvUploader is ready for student data */}
          </div>
          <div className="list-section">
            <StudentDataList /> {/* Replaced DengueDataList with StudentDataList */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
