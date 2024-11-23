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

  function showNotification1(message) {
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
  
  // Function to close notification
  function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show'); // Hide notification smoothly
  }

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePasswordIcon');
  
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Show password
        toggleIcon.src = 'view.png'; // Change icon to "hide" icon
    } else {
        passwordInput.type = 'password'; // Hide password
        toggleIcon.src = 'hide.png'; // Change icon to "view" icon
    }
  }

document.addEventListener('DOMContentLoaded', async function () {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
        alert("Student ID not found. Please log in again.");
        window.location.href = "student.html";
        return;
    }
    try {
        const { data, error } = await supabase
            .from('student_registration')
            .select(`
                course_id,
                courses(name, credit_hours)
            `)
            .eq('student_id', studentId);

        if (error) {
            console.error('Error fetching courses:', error.message);
            return;
        }

        // Populate table rows dynamically
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        if (data.length > 0) {
            data.forEach((registration) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${registration.course_id}</td>
                    <td>${registration.courses.name}</td>
                    <td>${registration.courses.credit_hours}</td>
                    <td><input type="checkbox" name="course" value="${registration.course_id}"></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4">No registered courses found.</td>
            `;
            tableBody.appendChild(row);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
});

document.getElementById('withdrawCourses').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('input[name="course"]:checked');
    const selectedCourses = Array.from(checkboxes).map((checkbox) => checkbox.value);

    if (selectedCourses.length === 0) {
        showNotification("Please select a course proceed!");
        return;
    }

    // Display the popup
    const modal = document.getElementById('withdrawPopup');
    modal.style.display = 'flex';

    // Close the popup when the close button is clicked
    document.getElementById('closePopup').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle withdrawal confirmation
    document.getElementById('confirmWithdraw').addEventListener('click', async () => {
        const reason = document.getElementById('withdrawReason').value;
        const password = document.getElementById('password').value;
        const student_id = localStorage.getItem('studentId')
        console.log(student_id, password);

        if (!reason) {
            showNotification('Please select a reason for withdrawal.');
            return;
        }

        if (!password) {
            showNotification('Please enter your password.');
            return;
        }

        // Proceed with withdrawal logic
        try {
            for (const courseId of selectedCourses) {
                // Validate password (add a Supabase function or backend API call to validate)
                const { data: studentData, error: validationError } = await supabase
                    .from('students')
                    .select('password')
                    .eq('roll_number', student_id)
                    .single();

                if (validationError || studentData.password !== password) {
                    showNotification("Invalid Password!");
                    return;
                }
                console.log(courseId, student_id);

                // Delete attendance records
                const { data: attendanceData, error: attendanceError } = await supabase
                    .from('attendance')
                    .delete()
                    .match({ student_id, course_id: courseId });
                    
                    if (attendanceError) {
                        console.error("Attendance deletion failed!", attendanceError.message);
                        return;
                    }

                // Delete grades records
                const { data: gradesData, error: gradesError } = await supabase
                    .from('marks')
                    .delete()
                    .match({ roll_number: student_id, course_code: courseId });

                    if (gradesError) {
                        console.error("marks deletion failed!", gradesError.message);
                        return;
                    }

                // Log to the audit table
                const { data: auditData, error: auditError } = await supabase
                    .from('audit_student_withdraw')
                    .insert([
                        {
                            student_id,
                            course_id: courseId,
                            reason: reason,
                        },
                    ]);

                    if (auditError) {
                        console.error("Audit insert failed!", auditError.message);
                        return;
                    }

                // Delete student registration
                const { data: studentregisData, error: studentregisError } = await supabase
                    .from('student_registration')
                    .delete()
                    .match({ student_id, course_id: courseId });

                    if (studentregisError) {
                        console.error("Student registration deletion failed!", studentregisError.message);
                        return;
                    }
            }
            showNotification1('Withdrawal successful!');
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    });
});


function goToStudentPortal() {
    window.location.href = 'student.html'; // Replace with the actual path of the student portal
}
