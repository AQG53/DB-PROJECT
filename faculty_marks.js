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
  
  // Function to close notification
  function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show'); // Hide notification smoothly
  }

let selectedCourse = null; // Declare as global
document.addEventListener('DOMContentLoaded', async function () {
    const facultyId = localStorage.getItem("facultyId"); 
    const courseSelect = document.getElementById('courseSelect');
    const marksTable = document.getElementById('marksTable');
    const saveButton = document.getElementById('saveMarks');
    const successMessage = document.getElementById('successMessage');
    document.getElementById('statsBlock').style.display = 'none'; 
    // Check if a value exists in sessionStorage
    if (!facultyId) {
        alert("Faculty ID not found. Please log in again.");
        window.location.href = "faculty.html";
        return;
    }

    const facultyInternalId = facultyId;
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
        selectedCourse = courseSelect.value;
        console.log(selectedCourse)
        marksTable.style.display = 'table';
        saveButton.style.display = 'block';

        const tbody = marksTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear previous data

        // Fetch student roll numbers registered for the selected course
        const { data: registrations, error: registrationsError } = await supabase
            .from('student_registration')
            .select('student_id')
            .eq('course_id', selectedCourse);

        if (registrationsError) {
            console.error('Error fetching student registrations:', registrationsError);
            return;
        }

        const studentIds = registrations.map(reg => reg.student_id);

        // Fetch student details from the students table
        const { data: students, error: studentsError } = await supabase
            .from('students')
            .select('roll_number, first_name')
            .in('roll_number', studentIds);

        if (studentsError) {
            console.error('Error fetching students:', studentsError);
            return;
        }

        const { data: marks, error: marksError } = await supabase
        .from('marks')
        .select('*')
        .eq('course_code', selectedCourse);

    if (marksError) {
        console.error('Error fetching marks:', marksError);
        return;
    }

    const marksMap = new Map(marks.map(mark => [mark.roll_number, mark]));

    // Populate the marks table with existing marks
    students.forEach(student => {
        const existingMarks = marksMap.get(student.roll_number) || {};
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.first_name} ${student.last_name || ''}</td>
            <td>${student.roll_number}</td>
            <td><input type="number" name="quiz" min="0" max="5" value="${existingMarks.quiz || ''}" placeholder="-"></td>
            <td><input type="number" name="assignment" min="0" max="5" value="${existingMarks.assignment || ''}" placeholder="-"></td>
            <td><input type="number" name="mid1" min="0" max="15" value="${existingMarks.mid1 || ''}" placeholder="-"></td>
            <td><input type="number" name="mid2" min="0" max="15" value="${existingMarks.mid2 || ''}" placeholder="-"></td>
            <td><input type="number" name="project" min="0" max="10" value="${existingMarks.project || ''}" placeholder="-"></td>
            <td><input type="number" name="final" min="0" max="50" value="${existingMarks.final || ''}" placeholder="-"></td>
        `;
        tbody.appendChild(row);
    });
    displayStats();
});

    // Handle saving marks
    saveButton.addEventListener('click', async function () {
        const rows = marksTable.querySelectorAll('tbody tr');
        const updates = [];
    
        rows.forEach(row => {
            const rollNo = row.cells[1].textContent;
            const quiz = row.querySelector('input[name="quiz"]').value || null;
            const assignment = row.querySelector('input[name="assignment"]').value || null;
            const project = row.querySelector('input[name="project"]').value || null;
            const mid1 = row.querySelector('input[name="mid1"]').value || null;
            const mid2 = row.querySelector('input[name="mid2"]').value || null;
            const final = row.querySelector('input[name="final"]').value || null;
            console.log(`Roll No: ${rollNo}, Project: ${project}`)
            
    
            // Treat empty or dash as null
            updates.push({
                roll_number: rollNo,
                course_code: courseSelect.value,
                quiz: quiz === '-' ? null : parseFloat(quiz),
                assignment: assignment === '-' ? null : parseFloat(assignment),
                project: project === '-' ? null : parseInt(project),
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
    
        showNotification('Marks Updated Successfully!');

        displayStats();
    });
    async function displayStats() {
        try {
            // Fetch marks data from the 'marks' table
            const { data: marks, error } = await supabase
                .from('marks')
                .select('quiz, assignment, project, mid1, mid2, final') // Select the columns you need
                .eq('course_code', selectedCourse);
            
            if (error) {
                console.error('Error fetching marks:', error);
                return;
            }
            if (!marks || marks.length === 0) {
                console.log("No marks data found.");
                document.getElementById("maxQuiz").textContent = "0";
                document.getElementById("minQuiz").textContent = "0";
                document.getElementById("avgQuiz").textContent = "0";
                document.getElementById("stdQuiz").textContent = "0";
        
                document.getElementById("maxAssignment").textContent = "0";
                document.getElementById("minAssignment").textContent = "0";
                document.getElementById("avgAssignment").textContent = "0";
                document.getElementById("stdAssignment").textContent = "0";

                document.getElementById("maxMid1").textContent = "0";
                document.getElementById("minMid1").textContent = "0";
                document.getElementById("avgMid1").textContent = "0";
                document.getElementById("stdMid1").textContent = "0";

                document.getElementById("maxMid2").textContent = "0";
                document.getElementById("minMid2").textContent = "0";
                document.getElementById("avgMid2").textContent = "0";
                document.getElementById("stdMid2").textContent = "0";

                document.getElementById("maxProject").textContent = "0";
                document.getElementById("minProject").textContent = "0";
                document.getElementById("avgProject").textContent = "0";
                document.getElementById("stdProject").textContent = "0";

                document.getElementById("maxFinal").textContent = "0";
                document.getElementById("minFinal").textContent = "0";
                document.getElementById("avgFinal").textContent = "0";
                document.getElementById("stdFinal").textContent = "0";
                return;
            
            }
    
            const columns = ['quiz', 'assignment','project', 'mid1', 'mid2', 'final'];
            const stats = {};
    
            // Calculate statistics for each column (max, min, avg, std)
            columns.forEach(column => {
                const values = marks.map(mark => mark[column] || 0); // Handle null values
    
                // Calculate max, min, average, and standard deviation
                const max = Math.max(...values);
                const min = Math.min(...values);
                const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
                const std = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length);
    
                stats[column] = { max, min, avg, std };
            });
    
            // Now update the HTML stats block with the calculated values
            document.getElementById('statsBlock').style.display = 'block'; // Make statsBlock visible
            // Max values
            document.getElementById('maxQuiz').textContent = stats.quiz.max.toFixed(2);
            document.getElementById('maxAssignment').textContent = stats.assignment.max.toFixed(2);
            document.getElementById('maxMid1').textContent = stats.mid1.max.toFixed(2);
            document.getElementById('maxMid2').textContent = stats.mid2.max.toFixed(2);
            document.getElementById('maxProject').textContent = stats.project.max.toFixed(2);
            document.getElementById('maxFinal').textContent = stats.final.max.toFixed(2);
    
            // Min values
            document.getElementById('minQuiz').textContent = stats.quiz.min.toFixed(2);
            document.getElementById('minAssignment').textContent = stats.assignment.min.toFixed(2);
            document.getElementById('minMid1').textContent = stats.mid1.min.toFixed(2);
            document.getElementById('minMid2').textContent = stats.mid2.min.toFixed(2);
            document.getElementById('minProject').textContent = stats.project.min.toFixed(2);
            document.getElementById('minFinal').textContent = stats.final.min.toFixed(2);
    
            // Average values
            document.getElementById('avgQuiz').textContent = stats.quiz.avg.toFixed(2);
            document.getElementById('avgAssignment').textContent = stats.assignment.avg.toFixed(2);
            document.getElementById('avgMid1').textContent = stats.mid1.avg.toFixed(2);
            document.getElementById('avgMid2').textContent = stats.mid2.avg.toFixed(2);
            document.getElementById('avgProject').textContent = stats.project.avg.toFixed(2);
            document.getElementById('avgFinal').textContent = stats.final.avg.toFixed(2);
    
            // Std Dev values
            document.getElementById('stdQuiz').textContent = stats.quiz.std.toFixed(2);
            document.getElementById('stdAssignment').textContent = stats.assignment.std.toFixed(2);
            document.getElementById('stdMid1').textContent = stats.mid1.std.toFixed(2);
            document.getElementById('stdMid2').textContent = stats.mid2.std.toFixed(2);
            document.getElementById('stdProject').textContent = stats.project.std.toFixed(2);
            document.getElementById('stdFinal').textContent = stats.final.std.toFixed(2);
    
        } catch (error) {
            console.error('Error in fetching or processing marks data:', error);
        }
    }
});

function goToFacultyPortal() {
    window.location.href = "faculty.html";
}