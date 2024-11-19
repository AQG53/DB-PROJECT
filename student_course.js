const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
  
    // Set message and show the notification
    notificationMessage.textContent = message;
    notification.classList.add('show');
  
    // Hide notification after 5 seconds
    setTimeout(() => {
        closeNotification();
        location.reload();
    }, 3000);
  }
  
  function showNotification1(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
  
    // Set message and show the notification
    notificationMessage.textContent = message;
    notification.classList.add('show');
  
    // Hide notification after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 3000);
  }
  
  // Function to close notification
  function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show'); // Hide notification smoothly
  }

  function capitalize(str) {
    if (!str) return ""; // Handle null or undefined values
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

  document.addEventListener("DOMContentLoaded", async function () {
    const studentId = localStorage.getItem("studentId"); // Replace with actual faculty ID retrieval logic
    const studentNameElement = document.getElementById("studentName");
    const studentSemesterElement = document.getElementById("studentSemester");
    const studentDepartmentElement = document.getElementById("studentDepartment");
    const registeredCoursesCountElement = document.getElementById("registeredCHCount");
    const courseTableBody = document.querySelector("#courseSelectionTable tbody");
   
    if (!studentId) {
        alert("Student ID not found. Please log in again.");
        window.location.href = "student.html";
        return;
    }
    
    try {
    const { data: studentData, error: studentError } = await supabase
            .from("students")
            .select("roll_number, first_name, last_name, semester, department")
            .eq("roll_number", studentId)
            .single();

        if (studentError || !studentData) {
            console.error("Error fetching faculty data:", studentError?.message);
            studentNameElement.textContent = "Error loading data";
            studentSemesterElement.textContent = "Error loading data";
            studentDepartmentElement.textContent = "Error loading data";
            return;
        }

        const fullName = `${capitalize(studentData.first_name)} ${capitalize(studentData.last_name)}`;
        studentNameElement.textContent = fullName;
        studentSemesterElement.textContent = studentData.semester;
        studentDepartmentElement.textContent = studentData.department;
    
    
            courseTableBody.innerHTML = `
            <tr class="skeleton-row"><td colspan="4"></td></tr>
            <tr class="skeleton-row"><td colspan="4"></td></tr>
            <tr class="skeleton-row"><td colspan="4"></td></tr>
        `;
    } catch (error) {
        console.error("Unexpected error:", error.message);
        alert("An unexpected error occurred. Please try again.");
    }
});

function goToStudentPortal() {
    window.location.href = 'student.html';
}
