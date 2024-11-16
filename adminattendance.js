// Sample data (replace with backend integration)
const studentData = {
    "22k-4286": {
      name: "John Doe",
      courses: ["CS101 - Introduction to Programming", "MTH102 - Calculus", "PHY103 - Physics"]
    },
    "22k-1234": {
      name: "Jane Smith",
      courses: ["CS101 - Introduction to Programming", "ENG104 - English Composition", "HIS105 - History"]
    }
  };
  
  const attendanceData = {
    "CS101 - Introduction to Programming": [
      { date: "2024-11-01", status: "Present" },
      { date: "2024-11-08", status: "Absent" },
    ],
    "MTH102 - Calculus": [
      { date: "2024-11-02", status: "Present" },
      { date: "2024-11-09", status: "Present" },
    ],
    // Add more course attendance data as required
  };
  
  // Search Student
  function searchStudent() {
    const rollNumber = document.getElementById("rollNumber").value;
    const student = studentData[rollNumber];
    
    if (student) {
      document.getElementById("registeredCourses").style.display = "block";
      document.getElementById("studentRollNumber").textContent = rollNumber;
  
      const coursesList = document.getElementById("coursesList");
      coursesList.innerHTML = ""; // Clear previous list
      student.courses.forEach(course => {
        const courseItem = document.createElement("li");
        const courseButton = document.createElement("button");
        courseButton.textContent = course;
        courseButton.onclick = () => viewAttendance(course);
        courseItem.appendChild(courseButton);
        coursesList.appendChild(courseItem);
      });
    } else {
      alert("No student found with this roll number.");
      document.getElementById("registeredCourses").style.display = "none";
      document.getElementById("courseAttendance").style.display = "none";
    }
  }
  
  // View Attendance
  function viewAttendance(course) {
    document.getElementById("courseAttendance").style.display = "block";
    document.getElementById("courseName").textContent = course;
  
    const attendanceTable = document.getElementById("attendanceTable");
    attendanceTable.innerHTML = ""; // Clear previous records
  
    const attendanceRecords = attendanceData[course] || [];
    attendanceRecords.forEach((record, index) => {
      const row = document.createElement("tr");
  
      const dateCell = document.createElement("td");
      dateCell.textContent = record.date;
      row.appendChild(dateCell);
  
      const statusCell = document.createElement("td");
      const statusSelect = document.createElement("select");
      statusSelect.innerHTML = `
        <option value="Present" ${record.status === "Present" ? "selected" : ""}>Present</option>
        <option value="Absent" ${record.status === "Absent" ? "selected" : ""}>Absent</option>
      `;
      statusSelect.setAttribute("data-index", index);
      statusCell.appendChild(statusSelect);
      row.appendChild(statusCell);
  
      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => deleteAttendance(course, index);
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);
  
      attendanceTable.appendChild(row);
    });
  }
  
  // Save Attendance
  function saveAttendance() {
    const course = document.getElementById("courseName").textContent;
    const rows = document.querySelectorAll("#attendanceTable tr");
  
    const updatedAttendance = [];
    rows.forEach(row => {
      const date = row.cells[0].textContent;
      const status = row.cells[1].querySelector("select").value;
      updatedAttendance.push({ date, status });
    });
  
    attendanceData[course] = updatedAttendance;
    alert("Attendance updated successfully!");
  }
  
  // Delete Attendance
  function deleteAttendance(course, index) {
    attendanceData[course].splice(index, 1);
    viewAttendance(course);
  }
  
  // Back to portal button
  function goBack() {
    window.location.href = "admin.html"; // Update with actual portal URL
  }
  