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

document.addEventListener('DOMContentLoaded', async () => {
    const studentId = localStorage.getItem('studentId'); // Replace with actual student ID retrieval logic
    if (!studentId) {
        alert('Student ID not found. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    const transcriptTableBody = document.querySelector('#transcriptTable tbody');
    transcriptTableBody.innerHTML = ''; // Clear any existing rows

    try {
        // Fetch registered courses
        const { data: registrations, error: registrationError } = await supabase
            .from('student_registration')
            .select('course_id')
            .eq('student_id', studentId);

        if (registrationError) {
            console.error('Error fetching student registrations:', registrationError.message);
            return;
        }

        const { data: withdrawals, error: withdrawalError } = await supabase
            .from('audit_student_withdraw')
            .select('course_id, semester')
            .eq('student_id', studentId);

        if (withdrawalError) {
            console.error('Error fetching withdrawn courses:', withdrawalError.message);
            return;
        }

        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('course_code, name, credit_hours, type, semester');

        if (coursesError) {
            console.error('Error fetching courses:', coursesError.message);
            return;
        }

        const { data: marks, error: marksError } = await supabase
        .from('marks')
        .select('roll_number, course_code, grades')
        .eq('roll_number', studentId);

        if (marksError) {
            console.error('Error fetching marks:', marksError.message);
            return;
        }

        const allCourses = [...registrations, ...withdrawals];

        // Group courses by semester
        const semesterData = {};
        allCourses.forEach((courseEntry) => {
            const course = courses.find((c) => c.course_code === courseEntry.course_id);
            if (!course) return; // Skip if course data is missing

            if (!semesterData[course.semester]) {
                semesterData[course.semester] = [];
            }

            const mark = marks.find((m) => m.roll_number === studentId && m.course_code === course.course_code);
            const isWithdrawn = withdrawals.some((w) => w.course_id === course.course_code);

            semesterData[course.semester].push({
                code: course.course_code,
                name: course.name,
                creditHours: course.credit_hours,
                type: course.type,
                grade: isWithdrawn ? '-' : mark?.grades !== undefined && mark?.grades !== null ? mark.grades : '', 
                points: isWithdrawn ? '-' : mark?.grades !== undefined && mark?.grades !== null ? calculatePoints(mark.grades) : '', 
                remarks: isWithdrawn ? 'Withdrawn' : mark ? 'Passed' : '', // Withdrawn or Passed based on status
            });
        });

        for (const [semester, courses] of Object.entries(semesterData)) {
            // Add semester header
            const semesterRow = document.createElement('tr');
            semesterRow.classList.add('semester-header');
            semesterRow.innerHTML = `<td colspan="7">Semester ${semester}</td>`;
            transcriptTableBody.appendChild(semesterRow);

            // Add courses for this semester
            courses.forEach((course) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${course.code}</td>
                    <td>${course.name}</td>
                    <td>${course.creditHours}</td>
                    <td>${course.grade}</td>
                    <td>${course.points}</td>
                    <td>${course.type}</td>
                    <td>${course.remarks}</td>
                `;
                transcriptTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Unexpected error:', error.message);
        alert('An unexpected error occurred. Please try again.');
    }
});

// Function to calculate grade points
function calculatePoints(grade) {
    const gradeMap = {
        'A+': 4.0,
        A: 4.0,
        'A-': 3.67,
        'B+': 3.33,
        B: 3.0,
        'B-': 2.67,
        'C+': 2.33,
        C: 2.0,
        'C-': 1.67,
        D: 1.0,
        F: 0.0, // Grade F should map to 0.0
    };

    const points = gradeMap[grade];
    if (points === undefined) {
        console.warn('Unhandled grade:', grade);
    }
    return points !== undefined ? points : '';
}


// Scroll to the student portal page (this function will need to be defined based on your page logic)
function goToStudentPortal() {
    window.location.href = "student.html";  // Modify the path based on your portal page
}
