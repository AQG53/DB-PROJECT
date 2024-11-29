const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const preloader = document.getElementById('preloader');
preloader.style.display = 'none';

function capitalize(str) {
    if (!str) return ""; // Handle null or undefined values
    str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

document.addEventListener('DOMContentLoaded', async function () {
    const facultyId = localStorage.getItem("facultyId");
    const courseSelect = document.getElementById('courseSelect');
    const gradesTable = document.getElementById('gradesTable');
    const saveButton = document.getElementById('saveGrades');
    const upgradeButton = document.getElementById('upgradeGrades');
    let selectedCourse = null;

    if (!facultyId) {
        alert("Faculty ID not found. Please log in again.");
        window.location.href = "faculty.html";
        return;
    }
    // Fetch courses taught by the faculty
    const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('course_code, name')
        .eq('registered_by', facultyId);

    if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        return;
    }

    // Populate course dropdown
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.course_code;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });

    // Handle course selection
    courseSelect.addEventListener('change', async function () {
        preloader.style.display = 'flex';
        selectedCourse = courseSelect.value;
        gradesTable.style.display = 'table';
        saveButton.style.display = 'block';
        upgradeButton.style.display = 'block';

        const tbody = gradesTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear previous data

        // Fetch students registered for the selected course
        const { data: registrations, error: registrationsError } = await supabase
            .from('student_registration')
            .select('student_id')
            .eq('course_id', selectedCourse);

        if (registrationsError) {
            console.error('Error fetching student registrations:', registrationsError);
            return;
        }

        const studentIds = registrations.map(reg => reg.student_id);

        // Fetch student details
        const { data: students, error: studentsError } = await supabase
            .from('students')
            .select('roll_number, first_name, last_name')
            .in('roll_number', studentIds);

        if (studentsError) {
            console.error('Error fetching students:', studentsError);
            return;
        }

        // Fetch marks for the selected course
        const { data: marks, error: marksError } = await supabase
            .from('marks')
            .select('*')
            .eq('course_code', selectedCourse);

        if (marksError) {
            preloader.style.display = 'none';
            console.error('Error fetching marks:', marksError);
            return;
        }

        const marksMap = new Map(marks.map(mark => [mark.roll_number, mark]));
        preloader.style.display = 'none';
        // Populate the grades table
        students.forEach(student => {
            const existingMarks = marksMap.get(student.roll_number) || {};
            if (isEmpty(existingMarks)) {
                showNotification(`Incomplete marks for ${student.roll_number}`);
            } 
            else{
            let grade = existingMarks.grades;
            if (grade === null  || grade === undefined) {
                const total = calculateTotal(existingMarks);
                grade = assignGrade(total);
            } 
            else {
                grade= existingMarks.grades;
            }
            console.log(grade);
            console.log(existingMarks); 
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${capitalize(student.first_name)} ${capitalize(student.last_name)}</td>
            <td>${student.roll_number}</td>
            <td><input type="text" name="grade" value="${grade}" /></td>
            `;
            tbody.appendChild(row);
            preloader.style.display = 'none';
            }

        });
        function isEmpty(obj) {
            preloader.style.display = 'none';
            return Object.keys(obj).length === 0;
        }
    });

    // Save grades to the database
    saveButton.addEventListener('click', async function () {
        const rows = gradesTable.querySelectorAll('tbody tr');
        const updates = []; 
        console.log(updates);

        rows.forEach(row => {
            const grade = row.querySelector('input[name="grade"]').value || null;
            const rollNo = row.cells[1].textContent;  
            console.log(rollNo);
            updates.push({
                roll_number: rollNo,  // Potential source of error
                course_code: selectedCourse,
                grades: grade,
            });
        });

        const { error } = await supabase
            .from('marks')
            .upsert(updates, { onConflict: ['roll_number', 'course_code'] });

        if (error) {
            console.error('Error saving grades:', error);
            return;
        }

        showNotification('Grades updated successfully!');
    });
    upgradeButton.addEventListener('click', async function () {
        const rows = gradesTable.querySelectorAll('tbody tr');
        const updates = [];
    
        // Define grade levels in order
        const gradeLevels = ['F', 'D', 'C','C+','B-', 'B', 'B+', 'A-','A', 'A+'];
    
        rows.forEach(row => {
            const rollNo = row.cells[1].textContent;
    
            const currentGrade = row.querySelector('input[name="grade"]').value;
    
            // Find the current grade's index in gradeLevels
            const currentIndex = gradeLevels.indexOf(currentGrade);
    
            // Upgrade the grade to the next level if not already A+
            const upgradedGrade = currentIndex < gradeLevels.length - 1
                ? gradeLevels[currentIndex + 1]
                : currentGrade;
    
            // Update grade in the table UI
            row.querySelector('input[name="grade"]').value = upgradedGrade
        });
    
        showNotification('Grades upgraded successfully!');
    });
    
});

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

// Function to close notification
function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show'); // Hide notification smoothly
}


// Utility functions
function calculateTotal(marks) {
    const fields = ['quiz', 'assignment', 'mid1', 'mid2', 'project', 'final'];
    let total = 0;
    fields.forEach(field => {
        total += marks[field] || 0;
    });
    return total;
}

function assignGrade(total) {
    if (total >= 90) return 'A+';
    if (total >= 85) return 'A';
    if (total >= 80) return 'A-';
    if (total >= 75) return 'B+';
    if (total >= 70) return 'B';
    if (total >= 65) return 'B-';
    if (total >= 60) return 'C+';
    if (total >= 55) return 'C';
    if (total >= 50) return 'D';
    return 'F';
}

function goToFacultyPortal() {
    window.location.href = "faculty.html";
}