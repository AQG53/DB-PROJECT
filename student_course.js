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

async function calculateRegisteredCHCount(studentId) {
    try {
        // Step 1: Fetch registered courses for the student
        const { data: registeredCourses, error: registrationError } = await supabase
            .from("student_registration")
            .select("course_id")
            .eq("student_id", studentId);

        if (registrationError) {
            console.error("Error fetching registrations:", registrationError.message);
            return 0;
        }

        if (!registeredCourses || registeredCourses.length === 0) {
            console.warn("No registered courses found for this student.");
            return 0;
        }

        // Extract course IDs
        const courseIds = registeredCourses.map(registration => registration.course_id);

        // Step 2: Fetch credit hours for registered courses
        const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select("credit_hours")
            .in("course_code", courseIds);

        if (coursesError) {
            console.error("Error fetching courses:", coursesError.message);
            return 0;
        }

        // Step 3: Calculate total credit hours
        let totalCreditHours = 0;

        coursesData.forEach(course => {
            const [theory, lab] = course.credit_hours.split("+").map(Number); // Split and convert to numbers
            totalCreditHours += theory + lab; // Sum both components
        });

        return totalCreditHours;
    } catch (error) {
        console.error("Unexpected error while calculating credit hours:", error.message);
        return 0;
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
        alert("Student ID not found. Please log in again.");
        window.location.href = "student.html";
        return;
    }

    // Declare `courseTableBody` at the beginning
    const courseTableBody = document.querySelector("#courseSelectionTable tbody");
    
    try {
        // Fetch student data
        const { data: studentData, error: studentError } = await supabase
            .from("students")
            .select("roll_number, first_name, last_name, semester, department")
            .eq("roll_number", studentId)
            .single();

        if (studentError || !studentData) {
            console.error("Error fetching student data:", studentError?.message);
            alert("Error loading student data. Please try again.");
            return;
        }

        // Display student info
        const fullName = `${capitalize(studentData.first_name)} ${capitalize(studentData.last_name)}`;
        document.getElementById("studentRollNumber").textContent = studentId;
        document.getElementById("studentName").textContent = fullName;
        document.getElementById("studentSemester").textContent = studentData.semester;
        document.getElementById("studentDepartment").textContent = studentData.department;
        const registeredCHCount = await calculateRegisteredCHCount(studentId);
        const registeredCHCountElement = document.getElementById("registeredCHCount");
        registeredCHCountElement.textContent = registeredCHCount;

        // Fetch and display courses
        const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select("*")
            .eq("semester", studentData.semester);

        if (coursesError || !coursesData) {
            console.error("Error fetching courses:", coursesError?.message);
            alert("Error loading courses. Please try again.");
            return;
        }

        const { data: registeredCourses, error: registeredError} = await supabase
            .from("student_registration")
            .select("course_id")
            .eq("student_id", studentId);
        
        if (registeredError) {
            console.error("Error fetching registered courses:", registeredError.message);
            alert("Error loading registered courses. Please try again.");
            return;
        }

        const registeredCourseIds = registeredCourses.map(course => course.course_id);

        // Populate course table
        courseTableBody.innerHTML = ""; // Clear any skeleton loading rows
        coursesData.forEach(course => {
            const isRegistered = registeredCourseIds.includes(course.course_code);

            const row = document.createElement("tr");
            if (course.type==="Core") {
                row.style.backgroundColor="lightgreen";
            }
            if (isRegistered) {
                row.style.backgroundColor="lightpink";
            }

            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.course_code}</td>
                <td>${course.credit_hours}</td>
                <td>${course.type}</td>
                <td>${course.prerequisites || "None"}</td>
                <td>
                    <input 
                        type="checkbox" 
                        name="selectCourse" 
                        value=" ${course.course_code}"
                        ${isRegistered ? "checked disabled" : ""} 
                </td>
                <td>
                    ${isRegistered ? `<button class="drop-btn" data-course-code="${course.course_code}">Drop</button>` : ""}
                </td>
            `;
            courseTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Unexpected error:", error.message);
        alert("An unexpected error occurred. Please try again.");
    }
});

document.getElementById("submitSelection").addEventListener("click", async function () {
    const confirmation = confirm(`Are you sure you want to register the course(s)?`);
        if (!confirmation) {
            return; // Exit if the user cancels
        }
    const studentId = localStorage.getItem("studentId");
    const selectedCourses = [];
    const checkboxes = document.querySelectorAll('input[name="selectCourse"]:checked');

    // Collect selected courses
    checkboxes.forEach((checkbox) => {
        selectedCourses.push(checkbox.value.trim());
    });

    if (!selectedCourses.length) {
        alert("You must register for at least one course!");
        return;
    }

    try {
        for (const course_id of selectedCourses) {
            // Fetch faculty_id for the course
            const { data: courseData, error: courseError } = await supabase
                .from("courses")
                .select("registered_by")
                .eq("course_code", course_id)
                .single();

            if (courseError || !courseData) {
                console.error("Error fetching course data:", courseError?.message);
                alert("Error loading course information. Please try again.");
                return;
            }

            // Insert into course_registration
            const { error: insertError } = await supabase
                .from("student_registration")
                .insert({
                    student_id: studentId,
                    course_id,
                    faculty_id: courseData.registered_by,
                });

            if (insertError) {
                console.error("Error during registration:", insertError.message);
                alert(`Failed to register for course ${course_id}. Please try again.`);
                return;
            }
        }
        showNotification("Courses registered successfully!");
        window.location.reload(); // Reload to reflect changes
    } catch (error) {
        console.error("Unexpected error during registration:", error.message);
        alert("An unexpected error occurred. Please try again.");
    }
});

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

function goToStudentPortal() {
    window.location.href = 'student.html';
}
