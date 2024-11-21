const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const username = sessionStorage.getItem('username');

// If the value exists, log it; if not, show a message
if (username) {
    console.log('Username from session storage:', username);
} else {
    console.log('No username found in session storage.');
}

document.addEventListener('DOMContentLoaded', async function () {
    const facultyId = sessionStorage.getItem('username'); // Faculty ID from login session
    const courseSelect = document.getElementById('courseSelect');
    const marksTable = document.getElementById('marksTable');
    const saveButton = document.getElementById('saveMarks');
    const successMessage = document.getElementById('successMessage');
    // Check if a value exists in sessionStorage

    // Fetch faculty `id` using the session's facultyId
    const { data: facultyData, error: facultyError } = await supabase
        .from('faculty')
        .select('id')
        .eq('username', facultyId)
        .single(); // Assuming faculty_id is unique

    if (facultyError || !facultyData) {
        console.error('Error fetching faculty details:', facultyError);
        return;
    }

    const facultyInternalId = facultyData.id;
    console.log(facultyInternalId)

    // Fetch courses registered by the faculty (using the internal `id`)
    const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('course_code, name')
        .eq('registered_by', facultyInternalId);

    if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        return;
    }

    // Populate courses dropdown
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.course_code;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });

    // Handle course selection
    courseSelect.addEventListener('change', async function () {
        const selectedCourse = courseSelect.value;
        marksTable.style.display = 'table';
        saveButton.style.display = 'block';

        const tbody = marksTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear previous data

        // Fetch student roll numbers registered for the selected course
        const { data: registrations, error: registrationsError } = await supabase
            .from('student_registration')
            .select('student_id')
            .eq('course_code', selectedCourse);

        if (registrationsError) {
            console.error('Error fetching student registrations:', registrationsError);
            return;
        }

        const studentIds = registrations.map(reg => reg.student_id);

        // Fetch student details from the students table
        const { data: students, error: studentsError } = await supabase
            .from('students')
            .select('roll_no, first_name')
            .in('roll_no', studentIds);

        if (studentsError) {
            console.error('Error fetching students:', studentsError);
            return;
        }

        // Fetch existing marks for the selected course
        const { data: marks, error: marksError } = await supabase
            .from('marks')
            .select('*')
            .eq('course_code', selectedCourse);

        if (marksError) {
            console.error('Error fetching marks:', marksError);
            return;
        }

        const marksMap = new Map(marks.map(mark => [mark.roll_number, mark]));

        // Populate the marks table
        students.forEach(student => {
            const existingMarks = marksMap.get(student.roll_no) || {};
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.roll_no}</td>
                <td><input type="number" name="quiz" min="0" max="5" value="${existingMarks.quiz || ''}" placeholder="-"></td>
                <td><input type="number" name="assignment" min="0" max="5" value="${existingMarks.assignment || ''}" placeholder="-"></td>
                <td><input type="number" name="mid1" min="0" max="15" value="${existingMarks.mid1 || ''}" placeholder="-"></td>
                <td><input type="number" name="mid2" min="0" max="15" value="${existingMarks.mid2 || ''}" placeholder="-"></td>
                <td><input type="number" name="final" min="0" max="50" value="${existingMarks.final || ''}" placeholder="-"></td>
            `;
            tbody.appendChild(row);
        });
    });

    // Handle saving marks
    saveButton.addEventListener('click', async function () {
        const rows = marksTable.querySelectorAll('tbody tr');
        const updates = [];
    
        rows.forEach(row => {
            const rollNo = row.cells[1].textContent;
            const quiz = row.querySelector('input[name="quiz"]').value || null;
            const assignment = row.querySelector('input[name="assignment"]').value || null;
            const mid1 = row.querySelector('input[name="mid1"]').value || null;
            const mid2 = row.querySelector('input[name="mid2"]').value || null;
            const final = row.querySelector('input[name="final"]').value || null;
    
            // Treat empty or dash as null
            updates.push({
                roll_number: rollNo,
                course_code: courseSelect.value,
                quiz: quiz === '-' ? null : parseFloat(quiz),
                assignment: assignment === '-' ? null : parseFloat(assignment),
                mid1: mid1 === '-' ? null : parseFloat(mid1),
                mid2: mid2 === '-' ? null : parseFloat(mid2),
                final: final === '-' ? null : parseFloat(final),
            });
        });
    
        // Insert or update marks in the database
        const { error } = await supabase
            .from('marks')
            .upsert(updates, { onConflict: ['roll_number', 'course_code'] });
    
        if (error) {
            console.error('Error saving marks:', error);
            return;
        }
    
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    });
});

// Function to navigate back to the faculty portal
function goToFacultyPortal() {
    window.location.href = "faculty.html";
}