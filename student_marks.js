const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const preloader = document.getElementById('preloader');


// Fetch logged-in student ID from local storage
const studentId = localStorage.getItem('studentId');
console.log(studentId);
// Ensure studentId exists
if (!studentId) {
    preloader.style.display = 'none';
    alert('Student is not logged in.');
    window.location.href = 'login.html'; // Redirect to login if not logged in
}
let courses = []; 
// Function to load registered courses and marks
async function loadCoursesAndMarks() {
    try {
        const courseBoxesContainer = document.querySelector('.course-boxes');
        const loadingIndicator = courseBoxesContainer.querySelector('.loading-indicator');
        
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        // Get registered courses for the logged-in student
        const { data: registrationData, error: regError } = await supabase
            .from('student_registration')
            .select('course_id')
            .eq('student_id', studentId);

        if (regError) throw regError;

        // Get course names for the registered courses
        const courseIds = registrationData.map(row => row.course_id);
        if (registrationData.length === 0) {
            loadingIndicator.style.display = 'none';
            document.getElementById("noCoursesMessage");
            noCoursesMessage.style.display = "block"; // Make the message visible
            return; // Exit the function early
          }
        const { data: coursesData, error: courseError } = await supabase
            .from('courses')
            .select('course_code, name')
            .in('course_code', courseIds);

        if (courseError) throw courseError;
        courses = coursesData;

        // Display the courses dynamically
        courseBoxesContainer.innerHTML = ''; // Clear existing content

        courses.forEach(course => {
            const courseBox = document.createElement('div');
            courseBox.classList.add('course-box');
            courseBox.setAttribute('data-course-id', course.course_code);
            courseBox.textContent = course.name;
            courseBoxesContainer.appendChild(courseBox);

            // Add click event to fetch and display marks for the course
            courseBox.addEventListener('click', () => showMarksPopup(course.course_code, course.name));
        });
    } catch (error) {
        console.error('Error loading courses or marks:', error.message);
    }
}

// Function to show marks in a popup
async function showMarksPopup(courseId, courseName) {
    try {
        // Fetch marks for the selected course and student
        const { data: marks, error: marksError } = await supabase
            .from('marks')
            .select('quiz, assignment, mid1, mid2, project, final')
            .eq('roll_number', studentId)
            .eq('course_code', courseId);

        if (marksError) throw marksError;

        // Populate marks in the popup
        const marksPopup = document.getElementById('marksPopup');
        const courseNameElement = document.getElementById('courseName');
        const marksTableBody = document.querySelector('#marksTable tbody');

        courseNameElement.textContent = courseName;
        marksTableBody.innerHTML = ''; // Clear existing marks

        if (marks.length > 0) {
            const assessments = [
                { name: 'Quiz', value: marks[0].quiz ?? '-', total: 5 },
                { name: 'Assignment', value: marks[0].assignment ?? '-', total: 5 },
                { name: 'Midterm 1', value: marks[0].mid1 ?? '-', total: 15 },
                { name: 'Midterm 2', value: marks[0].mid2 ?? '-', total: 15 },
                { name: 'Project', value: marks[0].project ?? '-', total: 10 },
                { name: 'Final', value: marks[0].final ?? '-', total: 50 }
            ];

            assessments.forEach(assessment => {
                const displayedValue = assessment.value === '-' ? '-' : `${assessment.value}/${assessment.total}`;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${assessment.name}</td>
                    <td>${displayedValue === '-' ? '-' : assessment.value}</td>
                    <td>${assessment.total}</td>
                `;
                marksTableBody.appendChild(row);
            });
        } else {
            const noMarksRow = document.createElement('tr');
            noMarksRow.innerHTML = `
                <td colspan="3">No marks available</td>
            `;
            marksTableBody.appendChild(noMarksRow);
        }

        marksPopup.style.display = 'flex'; // Show the popup
    } catch (error) {
        console.error('Error fetching marks:', error.message);
    }
}
// Event listener to close the marks popup
document.getElementById('closePopup').addEventListener('click', function () {
    const marksPopup = document.getElementById('marksPopup');
    marksPopup.style.display = 'none';
});

// Generate a PDF report with accurate marks
document.getElementById('downloadPdf').addEventListener('click', async function () {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Set the PDF title
        doc.setFontSize(18);
        doc.text('Student Marks Report', 10, 10);

        let yPosition = 20; // Initialize the starting y position

        // Get courses and marks dynamically
        const { data: marksData, error } = await supabase
            .from('marks')
            .select('course_code, quiz, assignment, mid1, mid2, project, final')
            .eq('roll_number', studentId);

        if (error) throw error;

        for (const mark of marksData) {
            const courseName = courses.find(c => c.course_code === mark.course_code)?.name || 'Unknown Course';

            // Add course details
            doc.setFontSize(16);
            doc.text(`Course: ${courseName}`, 10, yPosition);
            yPosition += 10;

            // Add marks table
            // Add marks table
            const assessments = [
                { name: 'Quiz', value: mark.quiz ?? '-', total: 5 },
                { name: 'Assignment', value: mark.assignment ?? '-', total: 5 },
                { name: 'Midterm 1', value: mark.mid1 ?? '-', total: 15 },
                { name: 'Midterm 2', value: mark.mid2 ?? '-', total: 15 },
                { name: 'Project', value: mark.project ?? '-', total: 10 },
                { name: 'Final', value: mark.final ?? '-', total: 50 }
            ];

            assessments.forEach(assessment => {
                yPosition += 10;
                const displayedValue = assessment.value === '-' ? '-' : assessment.value;
                doc.text(`${assessment.name}: ${displayedValue}`, 10, yPosition);
            });

            yPosition += 20;

            // Add new page if needed
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
        }

        // Save the PDF
        doc.save('Student_Marks_Report.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error.message);
    }
});

// Load courses and marks when the page is loaded
window.onload = loadCoursesAndMarks;
function goToStudentPortal() {
    // Replace 'student_portal.html' with the actual URL or path of the student portal page
    window.location.href = 'student.html';
};