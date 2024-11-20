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
            .in("id", courseIds);

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

        const { data: registeredCourses } = await supabase
            .from("student_registration")
            .select("course_id")
            .eq("student_id", studentId);

        const registeredCourseIds = registeredCourses.map(course => course.course_id);

        // Populate course table
        courseTableBody.innerHTML = ""; // Clear any skeleton loading rows
        coursesData.forEach(course => {
            const isRegistered = registeredCourseIds.includes(course.id);

            const row = document.createElement("tr");
            if (course.type==="Core") {
                row.style.backgroundColor="lightgreen";
            }
            if (isRegistered) {
                row.classList.add("registered-course");
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
    const selectedCourses = [];
    const checkboxes = document.querySelectorAll('input[name="selectCourse"]:checked');
    // Collect selected courses
    checkboxes.forEach((checkbox) => {
      const row = checkbox.closest("tr");
      if(row.style.backgroundColor === "lightgreen" || row.style.backgroundColor === 'white'){
        selectedCourses.push(checkbox.value);
      }
    });
    if (!selectedCourses.length) {
        alert("You must register for at least the core courses!");
        return;
    }
    
    for (const course_id of selectedCourses) {
        console.log(course_id);
        // Fetch faculty_id for the course
        const { data: courseData1, error: coursesError1 } = await supabase
            .from("courses")
            .select('registered_by')
            .eq('course_code', course_id)
            .single();

            if (coursesError1 || !courseData1) {
                console.error("Error fetching courses:", coursesError1?.message);
                alert("Error loading courses. Please try again.");
                return;
            }
            
            console.log(studentId);
        // const { data, error } = await supabase.from('student_registration').insert({
        //     student_id: studentId,
        //     course_id,
        //     faculty_id: courseData1.registered_by,
        // });
    }
    alert("Registration successful!");
});

function goToStudentPortal() {
    window.location.href = 'student.html';
}
