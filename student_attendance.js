const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const preloader = document.getElementById('preloader');


document.addEventListener('DOMContentLoaded', async function () {
    preloader.style.display = 'flex';
    const studentId = localStorage.getItem('studentId'); // Assuming studentId is stored in localStorage after login
    const courseBoxesContainer = document.querySelector('.course-boxes');
    const popup = document.getElementById('attendancePopup');
    const popupContent = document.querySelector('.popup-content');
    const closePopupButton = document.getElementById('closePopup');

    if (!studentId) {
        preloader.style.display = 'none';
        alert('Student is not logged in. Redirecting to login page.');
        window.location.href = 'login.html'; // Redirect to login page if studentId is missing
        return;
    }

    try {
        // Fetch the courses the student has registered for
        const { data: courses, error } = await supabase
            .from('student_registration')
            .select('course_id')
            .eq('student_id', studentId);

        if (error) {
            preloader.style.display = 'none';
            console.error('Error fetching registered courses:', error);
            return;
        }

        if (courses.length === 0) {
            preloader.style.display = 'none';
            courseBoxesContainer.innerHTML = '<p>No registered courses found.</p>';
            return;
        }

        // Clear any existing dummy data
        courseBoxesContainer.innerHTML = '';

        // Fetch course names (assuming course names are stored in the courses table)
        const courseIds = courses.map(course => course.course_id);
        const { data: courseDetails, error: courseDetailsError } = await supabase
            .from('courses')
            .select('course_code, name')
            .in('course_code', courseIds);

        if (courseDetailsError) {
            preloader.style.display = 'none';
            console.error('Error fetching course details:', courseDetailsError);
            return;
        }

        // Dynamically generate course boxes
        courseDetails.forEach(course => {
            const courseBox = document.createElement('div');
            courseBox.classList.add('course-box');
            courseBox.setAttribute('data-course', course.course_code); // Store course_code for further actions
            courseBox.textContent = course.name; // Display course name
            courseBoxesContainer.appendChild(courseBox);
        });
        preloader.style.display = 'none';
        // Add event listener to course boxes
        courseBoxesContainer.addEventListener('click', async function (event) {
            const courseBox = event.target;
            if (!courseBox.classList.contains('course-box')) return;

            const selectedCourse = courseBox.getAttribute('data-course'); // Get the course_id
            popupContent.innerHTML = ''; // Clear previous content

            try {
                // Fetch attendance records for the selected course and student
                const { data: attendanceRecords, error } = await supabase
                    .from('attendance')
                    .select('date, status')
                    .eq('student_id', studentId)
                    .eq('course_id', selectedCourse)
                    .order('month', { ascending: true }) // Sort by month first
                    .order('day', { ascending: true });

                if (error) {
                    console.error('Error fetching attendance records:', error);
                    return;
                }

                if (attendanceRecords.length === 0) {
                    popupContent.innerHTML = '<p>No attendance records found for this course.</p>';
                    popup.style.display = 'flex';
                    return;
                }

                // Calculate attendance percentage
                const totalRecords = attendanceRecords.length;
                const presentCount = attendanceRecords.filter(record => record.status === 'P').length;
                const attendancePercentage = Math.round((presentCount / totalRecords) * 100);

                const sliderColor = attendancePercentage < 80 ? '#ff9999' : '#99ff99'; // Light red for <80%, light green otherwise
                // Build popup content
                const slidingBar = `
                <div class="sliding-bar-container">
                    <div class="sliding-bar" style="width: ${attendancePercentage}%; background-color: ${sliderColor};"></div>
                    <p>${attendancePercentage}% Attendance</p>
                    </div>
                `;

                const tableRows = attendanceRecords
                .map(record => `
                    <tr>
                        <td>${new Date(record.date).toLocaleDateString()}</td>
                        <td>${record.status}</td>
                    </tr>
                `)
                .join('');

                const attendanceTable = `
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                `;

                popupContent.innerHTML = slidingBar + attendanceTable;
                popup.style.display = 'flex'; // Show the popup

            } catch (err) {
                console.error('Error displaying attendance details:', err);
            }
        });

        // Close popup logic
        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none';
        });

    } catch (err) {
        console.error('Error setting up courses:', err);
    }
});

// Function to close the attendance popup
document.getElementById('closePopup').addEventListener('click', function() {
    const attendancePopup = document.getElementById('attendancePopup');
    attendancePopup.style.display = 'none';
});

// Function to navigate back to the student portal
function goToStudentPortal() {
    window.location.href = 'student.html';
}
