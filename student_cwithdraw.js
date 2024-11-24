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
        const comment = document.getElementById('withdrawComments').value;
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
            const { data: studentData, error: validationError } = await supabase
                    .from('students')
                    .select('password')
                    .eq('roll_number', student_id)
                    .single();

                if (validationError || studentData.password !== password) {
                    showNotification("Invalid Password!");
                    return;
                }

                for (const courseId of selectedCourses) {
                    console.log(courseId, student_id);
                    const { error: withdrawalError } = await supabase.rpc('withdraw_student_course', {
                        param_student_id: student_id,
                        param_course_id: courseId,
                        param_reason: reason,
                        param_comment: comment,
                    });

                if (withdrawalError) {
                    console.error(`Error withdrawing course ${courseId}:`, withdrawalError.message);
                    showNotification(`Failed to withdraw course ${courseId}`);
                    return;
                }
            }

            showNotification1('Courses withdrawn successfully!');
        } catch (error) {
            console.error('Unexpected error during withdrawal:', error.message);
            showNotification('An unexpected error occurred. Please try again.');
        }
     
    });
});


function goToStudentPortal() {
    window.location.href = 'student.html'; // Replace with the actual path of the student portal
}
