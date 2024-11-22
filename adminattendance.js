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
  }, 3000);
}

  // Search Student
  async function searchStudent() {
    const rollNumber = document.getElementById("rollNumber").value.trim();

    if (!rollNumber) {
        showNotification("Please enter a roll number.");
        return;
    }

    try {
      // Fetch courses registered by the student
      const { data: courses, error } = await supabase
          .from('student_registration')
          .select('course_id')
          .eq('student_id', rollNumber);

      if (error) {
          console.error("Error fetching registered courses:", error);
          showNotification("Unable to fetch registered courses. Please try again.");
          return;
      }

      if (!courses || courses.length === 0) {
          showNotification("No student or courses found for this roll number.");
          document.getElementById("registeredCourses").style.display = "none";
          document.getElementById("courseAttendance").style.display = "none";
          return;
      }

      // Display the student's roll number and courses
      document.getElementById("registeredCourses").style.display = "block";
      document.getElementById("studentRollNumber").textContent = rollNumber;

      const coursesList = document.getElementById("coursesList");
      coursesList.innerHTML = ""; // Clear previous list

      // Fetch course names based on course_id
      const courseIds = courses.map(course => course.course_id);
      const { data: courseDetails, error: courseError } = await supabase
          .from('courses')
          .select('course_code, name')
          .in('course_code', courseIds);

      if (courseError) {
          console.error("Error fetching course details:", courseError);
          showNotification("Unable to fetch course details. Please try again.");
          return;
      }

      courseDetails.forEach(course => {
          const courseItem = document.createElement("li");
          const courseButton = document.createElement("button");
          courseButton.textContent = course.name;
          courseButton.onclick = () => viewAttendance(rollNumber, course.course_code, course.name);
          courseItem.appendChild(courseButton);
          coursesList.appendChild(courseItem);
      });

    } catch (err) {
        console.error("Error during student search:", err);
        showNotification("An unexpected error occurred. Please try again.");
    }
  }

  function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show'); // Hide notification smoothly
  }

  
  // View Attendance
  async function viewAttendance(studentId, courseId, courseName) {
    document.getElementById("courseAttendance").style.display = "block";
    document.getElementById("courseName").textContent = courseName;

    try {
        // Fetch attendance records for the student in the selected course
        const { data: attendanceRecords, error } = await supabase
            .from('attendance')
            .select('date, status')
            .eq('student_id', studentId)
            .eq('course_id', courseId)
            .order('date', { ascending: true });

        if (error) {
            console.error("Error fetching attendance records:", error);
            showNotification("Error fetching attendance records.");
            return;
        }

        const attendanceTable = document.getElementById("attendanceTable");
        attendanceTable.innerHTML = ""; // Clear previous records

        if (!attendanceRecords.length) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.textContent = "No attendance records found.";
            cell.colSpan = 3;
            row.appendChild(cell);
            attendanceTable.appendChild(row);
            return;
        }

        // Populate the table with attendance records
        attendanceRecords.forEach(record => {
          const row = document.createElement("tr");

          // Date Column
          const dateCell = document.createElement("td");
          dateCell.textContent = new Date(record.date).toLocaleDateString();
          row.appendChild(dateCell);

          // Status Column
          const statusCell = document.createElement("td");
          const statusButtons = createStatusButtons(record.status, record.date, studentId, courseId);
          statusCell.appendChild(statusButtons);
          row.appendChild(statusCell);

          // Actions Column
          const actionCell = document.createElement("td");
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.onclick = () => deleteAttendance(studentId, courseId, record.date);
          actionCell.appendChild(deleteButton);
          row.appendChild(actionCell);

          attendanceTable.appendChild(row);
      });
  } catch (err) {
      console.error("Error viewing attendance:", err);
      showNotification("An unexpected error occurred. Please try again.");
  }
  }

  function createStatusButtons(currentStatus, date, studentId, courseId) {
    const statusContainer = document.createElement("div");
    statusContainer.classList.add("status-buttons");

    const statuses = ["P", "A", "L"];
    statuses.forEach(status => {
        const button = document.createElement("button");
        button.textContent = status;
        button.classList.add("status-button");
        if (status === currentStatus) {
            button.classList.add("highlighted");
        }

        button.onclick = async () => {
            const confirmDelete = confirm(
                `Are you sure you want to update attendance record of ${studentId} for ${date}?`
            );
            if (!confirmDelete) return;
            // Update the status in the database
            try {
                const { error } = await supabase
                    .from('attendance')
                    .update({ status })
                    .eq('date', date)
                    .eq('student_id', studentId)
                    .eq('course_id', courseId);

                if (error) {
                    console.error("Error updating attendance:", error);
                    showNotification("Error updating attendance status.");
                    return;
                }

                // Highlight the updated button
                Array.from(statusContainer.children).forEach(btn => btn.classList.remove("highlighted"));
                button.classList.add("highlighted");
                showNotification(`Attendance updated to ${status} for ${date}`);
            } catch (err) {
                console.error("Error updating attendance:", err);
                showNotification("An unexpected error occurred. Please try again.");
            }
        };

        statusContainer.appendChild(button);
    });

    return statusContainer;
}
  
  // Delete Attendance
  async function deleteAttendance(studentId, courseId, date) {
    const confirmDelete = confirm(
        `Are you sure you want to delete attendance record of ${studentId} for ${date}?`
    );
    if (!confirmDelete) return;
    try {
      const { error } = await supabase
          .from('attendance')
          .delete()
          .eq('student_id', studentId)
          .eq('course_id', courseId)
          .eq('date', date);

      if (error) {
          console.error("Error deleting attendance record:", error);
          showNotification("Failed to delete attendance record.");
          return;
      }

      showNotification(`Attendance record for ${date} deleted successfully!`);
      viewAttendance(studentId, courseId, document.getElementById("courseName").textContent);
  } catch (err) {
      console.error("Error deleting attendance:", err);
      showNotification("An unexpected error occurred. Please try again.");
  }
  }
  
  // Back to portal button
  function goBack() {
    window.location.href = "admin.html"; // Update with actual portal URL
  }
  