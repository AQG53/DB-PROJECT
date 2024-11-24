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

async function calculateSelectedCHCount(courseId) {
    console.log(`Selected Course ID: ${courseId}`);
    try {
        // Step 1: Fetch the credit hours for the selected course
        const { data: selectedCourse, error: selectedError } = await supabase
            .from("courses")
            .select("credit_hours")
            .eq("course_code", courseId)
            .single(); // Use .single() since you expect only one course

        if (selectedError) {
            console.error("Error fetching credit hours:", selectedError.message);
            return 0;
        }

        if (!selectedCourse) {
            console.warn(`No course found for course_id: ${courseId}`);
            return 0;
        }

        // Step 2: Calculate total credit hours
        const [theory, lab] = selectedCourse.credit_hours.split("+").map(Number); // Split and convert to numbers
        const totalCreditHours = theory + lab; // Sum both components
        console.log(`Total Credit Hours: ${totalCreditHours}`);

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

        const { data: withdrawnCourses, error: withdrawnError } = await supabase
            .from("audit_student_withdraw")
            .select("course_id")
            .eq("student_id", studentId);

        if (withdrawnError) {
            console.error("Error fetching withdrawn courses:", withdrawnError.message);
            return;
        }

        const withdrawnCourseIds = withdrawnCourses.map(course => course.course_id);

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
            const isWithdrawn = withdrawnCourseIds.includes(course.course_code);

            const row = document.createElement("tr");
            
            if (course.type==="Core") {
                row.style.backgroundColor="lightgreen";
            }
            else{
                row.style.backgroundColor="white";
            }
            if (isRegistered) {
                row.style.backgroundColor="lightpink";
            }
            if(isWithdrawn) {
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
                        ${isWithdrawn ? "checked disabled" : ""}> 
                </td>
                <td>
                    ${isRegistered ? `
                            <button class="drop-btn" 
                            data-course-code="${course.course_code}"
                            ${course.type === "Core" ? "disabled" : ""}>
                        Drop
                        </button>`
                    : ""}
                    ${isWithdrawn ? `<span style="color: red; font-weight: bold;">Withdrawn</span>` : ""}
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
    const studentId = localStorage.getItem("studentId");
    const checkboxes = document.querySelectorAll('input[name="selectCourse"]:checked');

    let selectedCourses = [];
    let selectedCH = 0;

    // Calculate total credit hours for selected courses
    for (const checkbox of checkboxes) {
        const courseId = checkbox.value.trim();
        const row = checkbox.closest("tr");

        if (row.style.backgroundColor === 'lightgreen' || row.style.backgroundColor === 'white') {
            selectedCourses.push(courseId);
            const ch = await calculateSelectedCHCount(courseId); // Await the asynchronous function
            selectedCH += ch;
        }
    }

    // Get total credit hours for already registered courses
    const registeredCH = await calculateRegisteredCHCount(studentId);
    console.log("Total Registered CH = ", registeredCH+selectedCH);
    if (selectedCH === 0) {
        showNotification1("You must select at least one course!");
        return;
    }

    if (selectedCH > 7) {
        showNotification1("You are selecting too many courses!");
        return;
    }`g`

    if ((registeredCH + selectedCH) > 10) {
        showNotification1("You are exceeding your total credit hour limit!");
        return;
    }

    const confirmation = confirm(`Are you sure you want to register the course(s)?`);
    if (!confirmation) {
        return; // Exit if the user cancels
    }

    try {
        for (const courseId of selectedCourses) {
            // Fetch faculty_id for the course
            const { data: courseData, error: courseError } = await supabase
                .from("courses")
                .select("registered_by")
                .eq("course_code", courseId)
                .single();

            if (courseError || !courseData) {
                console.error("Error fetching course data:", courseError?.message);
                alert("Error loading course information. Please try again.");
                return;
            }

            // Insert into student_registration
            const { error: insertError } = await supabase
                .from("student_registration")
                .insert({
                    student_id: studentId,
                    course_id: courseId,
                    faculty_id: courseData.registered_by,
                });

            if (insertError) {
                console.error("Error during registration:", insertError.message);
                alert(`Failed to register for course ${courseId}. Please try again.`);
                return;
            }
        }

        showNotification("Courses registered successfully!");
    } catch (error) {
        console.error("Unexpected error during registration:", error.message);
        alert("An unexpected error occurred. Please try again.");
    }
});


document.addEventListener("click", async function (event) {
    // Check if the clicked element is a drop button
    if (event.target && event.target.classList.contains("drop-btn")) {
        const courseCode = event.target.getAttribute("data-course-code");
        const studentId = localStorage.getItem("studentId");
  
        if (!courseCode || !studentId) {
            console.error("Missing course code or student ID.");
            return;
        }
        const confirmation = confirm(`Are you sure you want to drop the course "${courseCode}"?`);
          if (!confirmation) {
              console.log("Course drop canceled by user.");
              return; // Exit if the user cancels
          }
  
        console.log(`Attempting to drop course: ${courseCode} for faculty ID: ${studentId}`);
  
        try {
            // Reset the registered_by field in the database
            const { error } = await supabase
                .from("student_registration")
                .delete()
                .eq("student_id", studentId)
                .eq("course_id", courseCode);
  
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
