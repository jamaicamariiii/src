import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './StudentDataList.css'; // Import the CSS file
import RadialBarChart from "./RadialBarChart";
import ScatterPlot from "./ScatterPlot"; // Import ScatterPlot component

const ITEMS_PER_PAGE = 20;

const StudentDataList = () => {
  const [studentData, setStudentData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "", // Separate first name field
    lastName: "",  // Separate last name field (where respondent data will go)
    age: "",
    sex: "",
    ethnic: "",
    academicPerformance: "",
    academicDescription: "",
    iq: "",
    typeOfSchool: "",
    socioEconomicStatus: "",
    studyHabit: "",
    natResults: "",
  });

  // State for filters
  const [nameFilter, setNameFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const studentCollection = collection(db, "studentData");
      const studentSnapshot = await getDocs(studentCollection);
      const dataList = studentSnapshot.docs.map((doc) => {
        const data = doc.data();
        
        // If `respondent` exists and `lastName` is empty, transfer the data
        if (!data.lastName && data.respondent) {
          data.lastName = data.respondent;
        }

        return {
          id: doc.id,
          ...data,
        };
      });
      setStudentData(dataList);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const studentDocRef = doc(db, "studentData", id);
    try {
      await deleteDoc(studentDocRef);
      setStudentData(studentData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      firstName: data.firstName || "", // Ensure it doesn't break if firstName is missing
      lastName: data.lastName || data.respondent || "",  // Move respondent to lastName
      age: data.age,
      sex: data.sex,
      ethnic: data.ethnic,
      academicPerformance: data.academicPerformance,
      academicDescription: data.academicDescription,
      iq: data.iq,
      typeOfSchool: data.typeOfSchool,
      socioEconomicStatus: data.socioEconomicStatus,
      studyHabit: data.studyHabit,
      natResults: data.natResults,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const studentDocRef = doc(db, "studentData", editingId);
    try {
      await updateDoc(studentDocRef, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        age: Number(editForm.age),
        sex: editForm.sex,
        ethnic: editForm.ethnic,
        academicPerformance: Number(editForm.academicPerformance),
        academicDescription: editForm.academicDescription,
        iq: editForm.iq,
        typeOfSchool: editForm.typeOfSchool,
        socioEconomicStatus: editForm.socioEconomicStatus,
        studyHabit: editForm.studyHabit,
        natResults: Number(editForm.natResults),
      });
      setStudentData(studentData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Filter data based on name input (first or last name) and age
  const filteredData = studentData.filter((data) => {
    return (
      (nameFilter === "" || `${data.firstName} ${data.lastName}`.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (ageFilter === "" || String(data.age) === ageFilter)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="student-data-container">
      <h2 className="student-data-title">Student Data List</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Filter by Age"
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Ethnic</th>
            <th>Academic Performance</th>
            <th>Academic Description</th>
            <th>IQ</th>
            <th>Type of School</th>
            <th>Socio-Economic Status</th>
            <th>Study Habit</th>
            <th>NAT Results</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((data) => (
            <React.Fragment key={data.id}>
              <tr>
                <td>{data.firstName}</td>
                <td>{data.lastName}</td> {/* lastName now shows the respondent value if available */}
                <td>{data.age}</td>
                <td>{data.sex}</td>
                <td>{data.ethnic}</td>
                <td>{data.academicPerformance}</td>
                <td>{data.academicDescription}</td>
                <td>{data.iq}</td>
                <td>{data.typeOfSchool}</td>
                <td>{data.socioEconomicStatus}</td>
                <td>{data.studyHabit}</td>
                <td>{data.natResults}</td>
                <td>
                  <button onClick={() => handleEdit(data)} className="blue-button">Edit</button>
                  <button onClick={() => handleDelete(data.id)} className="blue-button delete">Delete</button>
                </td>
              </tr>
              {editingId === data.id && (
                <tr>
                  <td colSpan="12">
                    <form onSubmit={handleUpdate} className="edit-form">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Age"
                        value={editForm.age}
                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Sex"
                        value={editForm.sex}
                        onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Ethnic"
                        value={editForm.ethnic}
                        onChange={(e) => setEditForm({ ...editForm, ethnic: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Academic Performance"
                        value={editForm.academicPerformance}
                        onChange={(e) => setEditForm({ ...editForm, academicPerformance: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                      placeholder="Academic Description"
                      value={editForm.academicDescription}
                      onChange={(e) => setEditForm({ ...editForm, academicDescription: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="IQ"
                      value={editForm.iq}
                      onChange={(e) => setEditForm({ ...editForm, iq: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Type of School"
                      value={editForm.typeOfSchool}
                      onChange={(e) => setEditForm({ ...editForm, typeOfSchool: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Socio-Economic Status"
                      value={editForm.socioEconomicStatus}
                      onChange={(e) => setEditForm({ ...editForm, socioEconomicStatus: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Study Habit"
                      value={editForm.studyHabit}
                      onChange={(e) => setEditForm({ ...editForm, studyHabit: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="NAT Results"
                      value={editForm.natResults}
                      onChange={(e) => setEditForm({ ...editForm, natResults: e.target.value })}
                      required
                    />
                    <button type="submit" className="blue-button">Update Data</button>
                    <button type="button" onClick={() => setEditingId(null)} className="blue-button cancel">Cancel</button>
                  </form>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>

    <div className="pagination">
      <button className="pagination-button" onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
        Previous
      </button>
      <span className="pagination-info">Page {currentPage} of {totalPages}</span>
      <button className="pagination-button" onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>

    <div className="chart-container">
      {/* Assuming RadialBarChart and ScatterPlot components accept "academicPerformance" and "natResults" as relevant fields */}
      <RadialBarChart data={filteredData.map(item => ({ key: item.firstName + ' ' + item.lastName, value: item.academicPerformance }))} />
      <ScatterPlot data={filteredData.map(item => ({ x: item.academicPerformance, y: item.natResults }))} />
    </div>
  </div>
  );
};

export default StudentDataList;

