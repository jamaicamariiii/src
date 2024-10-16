import React, { useState } from 'react';
import { db } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import './StudentDataList.css'; // Import the CSS file

function CsvUploader() {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      // Parse CSV rows assuming columns: Respondent, Age, Sex, Ethnic, Academic Performance, Academic Description, IQ, Type of School, Socio-Economic Status, Study Habit, NAT Results
      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 11 && index > 0) { // Skip header row
          data.push({
            respondent: columns[0].trim(),
            age: Number(columns[1].trim()),
            sex: columns[2].trim(),
            ethnic: columns[3].trim(),
            academicPerformance: Number(columns[4].trim()),
            academicDescription: columns[5].trim(),
            iq: columns[6].trim(),
            typeOfSchool: columns[7].trim(),
            socioEconomicStatus: columns[8].trim(),
            studyHabit: columns[9].trim(),
            natResults: Number(columns[10].trim()),
          });
        }
      });

      try {
        const batch = data.map(async (item) => {
          await addDoc(collection(db, 'studentData'), item); // Update the Firestore collection to 'studentData'
        });

        await Promise.all(batch);
        alert('CSV data uploaded successfully!');
      } catch (error) {
        console.error('Error uploading CSV data:', error);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="CsvUploader">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button className="upload" onClick={handleFileUpload}>Upload CSV</button>
    </div>
  );
}

export default CsvUploader;
