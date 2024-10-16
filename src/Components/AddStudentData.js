import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // Firebase configuration

const AddStudentData = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // Added last name field
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [academicPerformance, setAcademicPerformance] = useState("");
  const [academicDescription, setAcademicDescription] = useState("");
  const [iq, setIq] = useState("");
  const [typeOfSchool, setTypeOfSchool] = useState("");
  const [socioEconomicStatus, setSocioEconomicStatus] = useState("");
  const [studyHabit, setStudyHabit] = useState("");
  const [natResults, setNatResults] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "studentData"), {
        firstName, // Added first name field
        lastName,  // Added last name field
        age: Number(age),
        sex,
        ethnic,
        academicPerformance: Number(academicPerformance),
        academicDescription,
        iq,
        typeOfSchool,
        socioEconomicStatus,
        studyHabit,
        natResults: Number(natResults),
      });

      // Clear the form fields after submission
      setFirstName("");
      setLastName(""); // Clear last name field
      setAge("");
      setSex("");
      setEthnic("");
      setAcademicPerformance("");
      setAcademicDescription("");
      setIq("");
      setTypeOfSchool("");
      setSocioEconomicStatus("");
      setStudyHabit("");
      setNatResults("");
      alert("Student data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const formStyle = {
    backgroundColor: "#e0f7fa",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "auto",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #0288d1",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    backgroundColor: "#0288d1",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0277bd",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#1e88e5",
    marginBottom: "20px",
    fontSize: "24px",
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2 style={headingStyle}>Enter Student Information</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Input for First Name */}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
          />
          {/* Input for Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Ethnicity"
            value={ethnic}
            onChange={(e) => setEthnic(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Academic Performance"
            value={academicPerformance}
            onChange={(e) => setAcademicPerformance(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Academic Description"
            value={academicDescription}
            onChange={(e) => setAcademicDescription(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="IQ"
            value={iq}
            onChange={(e) => setIq(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Type of School"
            value={typeOfSchool}
            onChange={(e) => setTypeOfSchool(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Socio-economic Status"
            value={socioEconomicStatus}
            onChange={(e) => setSocioEconomicStatus(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Study Habit"
            value={studyHabit}
            onChange={(e) => setStudyHabit(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="NAT Results"
            value={natResults}
            onChange={(e) => setNatResults(e.target.value)}
            style={inputStyle}
            required
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = buttonStyle.backgroundColor)
            }
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentData;