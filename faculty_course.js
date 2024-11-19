const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function () {
    const facultyId = localStorage.getItem("facultyId"); // Replace with actual faculty ID retrieval logic
    const facultyNameElement = document.getElementById("facultyName");
    const facultyDepartmentElement = document.getElementById("facultyDepartment");
    const registeredCoursesCountElement = document.getElementById("registeredCoursesCount");
    const courseTableBody = document.querySelector("#courseSelectionTable tbody");
   
    if (!facultyId) {
        alert("Faculty ID not found. Please log in again.");
        window.location.href = "faculty_login.html";
        return;
    }
    
    try {
    const { data: facultyData, error: facultyError } = await supabase
            .from("faculty")
            .select("title, first_name, last_name, department_id, department")
            .eq("id", facultyId)
            .single();

        if (facultyError || !facultyData) {
            console.error("Error fetching faculty data:", facultyError?.message);
            facultyNameElement.textContent = "Error loading data";
            facultyDepartmentElement.textContent = "Error loading data";
            return;
        }

        const fullName = `${facultyData.title} ${capitalize(facultyData.first_name)} ${capitalize(facultyData.last_name)}`;
        facultyNameElement.textContent = fullName;
        facultyDepartmentElement.textContent = facultyData.department;
    
    
            courseTableBody.innerHTML = `
            <tr class="skeleton-row"><td colspan="4"></td></tr>
            <tr class="skeleton-row"><td colspan="4"></td></tr>
            <tr class="skeleton-row"><td colspan="4"></td></tr>
        `;
        
        // Fetch all courses
        const { data: courses, error: coursesError } = await supabase
            .from("courses")
            .select("*");

        if (coursesError || !courses) {
            console.error("Error fetching courses:", coursesError?.message);
            registeredCoursesCountElement.textContent = "Error loading data";
            return;
        }

        const registeredCourses = courses.filter(course => String(course.registered_by) === String(facultyId));
        registeredCoursesCountElement.textContent = registeredCourses.length;
        console.log(registeredCourses.length);

        if (registeredCourses.length >= 3) {
            document.getElementById("submitSelection").disabled = true;
            alert("You have already registered for the maximum number of courses.");
        }

        const facultyDepartmentId = facultyData.department_id;
        courses.sort((a, b) => {
            if (a.department_id === facultyDepartmentId && b.department_id !== facultyDepartmentId) return -1;
            if (a.department_id !== facultyDepartmentId && b.department_id === facultyDepartmentId) return 1;
            return 0;
          });

          courseTableBody.innerHTML = ""; // Clear existing table rows

          courses.forEach((course) => {
            const isRegistered = course.registered_by !== null; // Check if course is already registered
            const isFacultyRegistered = String(course.registered_by) === String(facultyId);

            const row = document.createElement("tr");

            // Style row for registered courses
            if (isRegistered) {
                row.style.backgroundColor = "#d3d3d3"; // Make the row gray for registered courses
                row.style.color = "gray"; // Change text color for better readability
            } else if (course.department_id === facultyDepartmentId) {
                row.style.backgroundColor = "lightgreen"; // Highlight department courses
            }

            // Render the row
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.course_code}</td>
                <td>${course.credit_hours}</td>
                <td>
                <input 
                    type="checkbox" 
                    name="course" 
                    value="${course.course_code}" 
                    ${isRegistered ? "checked disabled" : ""}
                    ${isFacultyRegistered ? "checked" : ""}
                >
                </td>
            `;

            courseTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Unexpected error during data retrieval:", error.message);
            facultyNameElement.textContent = "Error loading data";
            facultyDepartmentElement.textContent = "Error loading data";
            registeredCoursesCountElement.textContent = "Error loading data";
        }
});

function capitalize(str) {
    if (!str) return ""; // Handle null or undefined values
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

document.getElementById("submitSelection").addEventListener("click", function () {
    const selectedCourses = [];
    const departmentCourses = [];
    const facultyId = localStorage.getItem("facultyId");
    const courseTableBody = document.querySelector("#courseSelectionTable tbody");
    const checkboxes = document.querySelectorAll('input[name="course"]:checked');
  
    // Collect selected courses
    checkboxes.forEach((checkbox) => {
      selectedCourses.push(checkbox.value);
      const row = checkbox.closest("tr");
      if (row.style.backgroundColor === "lightgreen") {
        departmentCourses.push(checkbox.value); // Track department-specific courses
      }
    });
  
    // Validation
    if (selectedCourses.length < 2) {
      alert("You must select at least 2 courses.");
      return;
    }
  
    if (selectedCourses.length > 3) {
      alert("You can select a maximum of 3 courses.");
      return;
    }
  
    if (departmentCourses.length === 0) {
      alert("At least 1 course must be from your department.");
      return;
    }
    
    // Register the selected courses
    registerCourses(facultyId, selectedCourses);
  });
  
  async function registerCourses(facultyId, selectedCourses) {
    try {
        for (const courseCode of selectedCourses) {
            console.log(courseCode);
            const { error } = await supabase
              .from("courses")
              .update({ registered_by: facultyId }) // Set the faculty_id
              .eq('course_code', courseCode); // Match by course_code
      
            if (error) {
              console.error(`Error updating course ${courseCode}:`, error.message);
              alert(`Failed to register course: ${courseCode}`);
              return;
            }
          }
  
      alert("Courses registered successfully!");
      console.log("Updated registered_by field for courses:", selectedCourses);
    } catch (error) {
      console.error("Unexpected error:", error.message);
      alert("An unexpected error occurred. Please try again.");
    }
  }
  

function goToFacultyPortal() {
    window.location.href = 'faculty.html';
}
