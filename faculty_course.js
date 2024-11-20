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

document.addEventListener("DOMContentLoaded", async function () {
    const facultyId = localStorage.getItem("facultyId"); // Replace with actual faculty ID retrieval logic
    const facultyNameElement = document.getElementById("facultyName");
    const facultyDepartmentElement = document.getElementById("facultyDepartment");
    const registeredCoursesCountElement = document.getElementById("registeredCoursesCount");
    const courseTableBody = document.querySelector("#courseSelectionTable tbody");
   
    if (!facultyId) {
        alert("Faculty ID not found. Please log in again.");
        window.location.href = "faculty.html";
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
        localStorage.setItem('totalregistered', registeredCourses.length);
        //console.log(registeredCourses.length);

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
                if(course.department_id === facultyDepartmentId)
                {
                  row.style.backgroundColor = "lightpink"; // Make the row gray for registered courses
                  row.style.color = "gray";
                }
                else{
                    row.style.backgroundColor = "lightpink"; // Make the row gray for registered courses
                    row.style.color = "gray"; // Change text color for better readability
                }
    
            } else if (course.department_id === facultyDepartmentId) {
                row.style.backgroundColor = "lightgreen"; // Highlight department courses
            }
            else {
              row.style.backgroundColor = "white";
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
                <td>
                    ${isFacultyRegistered ? `<button class="drop-btn" data-course-code="${course.course_code}">Drop</button>` : ""}
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
    const totalregistered = parseInt(localStorage.getItem('totalregistered'), 10);
    
    const selectedCourses = [];
    const departmentCourses = [];
    const facultyId = localStorage.getItem("facultyId");
    const courseTableBody = document.querySelector("#courseSelectionTable tbody");
    const checkboxes = document.querySelectorAll('input[name="course"]:checked');
    // Collect selected courses
    checkboxes.forEach((checkbox) => {
      const row = checkbox.closest("tr");
      if(row.style.backgroundColor === "lightgreen" || row.style.backgroundColor === 'white'){
        selectedCourses.push(checkbox.value);
      }
      if (row.style.backgroundColor === "lightgreen" || row.style.backgroundColor === "lightpink") {
        departmentCourses.push(checkbox.value);
      }
    });
    console.log(departmentCourses.length);
    const total=totalregistered+selectedCourses.length;
    // Validation
    console.log(totalregistered);
    if(selectedCourses.length===0)
    {
      showNotification1(`Please select a course to register!`);
      return;
    }
    if(totalregistered===3)
    {
      showNotification1(`Maximum courses already registered!`);
      return;
    }
    if(total>3)
    {
      showNotification1(`Too many courses selected!`);
      return;
    }
    if (total>0 && departmentCourses.length==0) {
      showNotification1("Choose at least 1 course from your department.");
      return;
    }
    // Register the selected courses
    registerCourses(facultyId, selectedCourses);
  });
  
  async function registerCourses(facultyId, selectedCourses) {
    const confirmation = confirm(`Are you sure you want to register the course(s)?`);
        if (!confirmation) {
            console.log("Course registration canceled by user.");
            return; // Exit if the user cancels
        }
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
      showNotification(`Course has been assigned to you successfully!`);
      console.log("Updated registered_by field for courses:", selectedCourses);
    } catch (error) {
      console.error("Unexpected error:", error.message);
      alert("An unexpected error occurred. Please try again.");
    }
}

document.addEventListener("click", async function (event) {
  // Check if the clicked element is a drop button
  if (event.target && event.target.classList.contains("drop-btn")) {
      const courseCode = event.target.getAttribute("data-course-code");
      const facultyId = localStorage.getItem("facultyId");

      if (!courseCode || !facultyId) {
          console.error("Missing course code or faculty ID.");
          return;
      }
      const confirmation = confirm(`Are you sure you want to drop the course "${courseCode}"?`);
        if (!confirmation) {
            console.log("Course drop canceled by user.");
            return; // Exit if the user cancels
        }

      console.log(`Attempting to drop course: ${courseCode} for faculty ID: ${facultyId}`);

      try {
          // Reset the registered_by field in the database
          const { error } = await supabase
              .from("courses")
              .update({ registered_by: null })
              .eq("course_code", courseCode)
              .eq("registered_by", facultyId); // Ensure only the correct faculty can drop

          if (error) {
              console.error(`Error dropping course ${courseCode}:`, error.message);
              alert(`Failed to drop course: ${courseCode}`);
              return;
          }

          showNotification("Course has been successfully dropped!");
          console.log(`Course ${courseCode} dropped successfully.`);
      } catch (error) {
          console.error("Unexpected error during course drop:", error.message);
          alert("An unexpected error occurred. Please try again.");
      }
  }
});


  

function goToFacultyPortal() {
    window.location.href = 'faculty.html';
}
