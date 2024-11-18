
// Sample student data (replace with API/database integration)
const studentData = {
    "22K-4286": [
      { course: "Mathematics", gpa: 3.5 },
      { course: "Physics", gpa: 3.8 },
      { course: "Chemistry", gpa: 3.6 },
    ],
    "22K-4287": [
      { course: "Biology", gpa: 3.2 },
      { course: "English", gpa: 3.7 },
      { course: "History", gpa: 3.4 },
    ],
  };
  
  // Fetch courses for the given roll number
  document.getElementById("fetch-courses").addEventListener("click", function () {
    const rollNumber = document.getElementById("roll-number").value.trim();
    const errorElement = document.getElementById("roll-error");
    const coursesTableBody = document.getElementById("courses-table-body");
    const gpaUpdateBox = document.getElementById("gpa-update-box");
  
    // Clear previous data
    coursesTableBody.innerHTML = "";
  
    // Validate roll number
    const rollRegex = /^[0-9]{2}K-\d{4}$/;
    if (!rollRegex.test(rollNumber)) {
      alert("Invalid Roll Number format (e.g., 22K-4286)");
      return;
    }
  
    // Fetch courses
    const courses = studentData[rollNumber];
    if (!courses) {
      alert("No records found for this roll number.");
      return;
    }
  
    // Display courses in table
    courses.forEach((courseData, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${courseData.course}</td>
        <td>${courseData.gpa}</td>
        <td>
          <input type="number" 
                 class="gpa-input" 
                 data-index="${index}" 
                 placeholder="Update GPA" 
                 step="0.01" min="0" max="4">
        </td>
      `;
      coursesTableBody.appendChild(row);
    });
  
    // Show GPA update box
    gpaUpdateBox.style.display = "block";
  });
  
  // Update CGPA after modifying GPAs
  document.getElementById("update-cgpa").addEventListener("click", function () {
    const rollNumber = document.getElementById("roll-number").value.trim();
    const courses = studentData[rollNumber];
    const gpaInputs = document.querySelectorAll(".gpa-input");
  
    // Update GPA values
    gpaInputs.forEach((input) => {
      const index = input.getAttribute("data-index");
      const newGpa = parseFloat(input.value);
      if (!isNaN(newGpa) && newGpa >= 0 && newGpa <= 4) {
        courses[index].gpa = newGpa;
      }
    });
  
    // Calculate CGPA
    const totalGpa = courses.reduce((sum, course) => sum + course.gpa, 0);
    const cgpa = (totalGpa / courses.length).toFixed(2);
  
    // Display updated CGPA
    document.getElementById("cgpa-value").textContent = cgpa;
  
    // Show notification
    showNotification("GPA updated and CGPA recalculated successfully!");
  });
  
  function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");
  
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
  
  // Function to navigate back to the Admin Dashboard 
  function goToAdminDashboard() {
    window.location.href = 'admin.html';
  };
  