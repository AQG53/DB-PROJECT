const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const preloader = document.getElementById('preloader');


function capitalize(str) {
    if (!str) return ""; // Handle null or undefined values
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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
        preloader.style.display = 'none';
        alert('Student ID not found. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    const transcriptContainer = document.getElementById('transcriptContainer');
    transcriptContainer.innerHTML = ''; // Clear any existing content

    try {
        // Fetch data
        const { data: registrations, error: registrationError } = await supabase
            .from('student_registration')
            .select('course_id')
            .eq('student_id', studentId);

        const { data: withdrawals, error: withdrawalError } = await supabase
            .from('audit_student_withdraw')
            .select('course_id, semester')
            .eq('student_id', studentId);

        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('course_code, name, credit_hours, type, semester');

        const { data: marks, error: marksError } = await supabase
            .from('marks')
            .select('roll_number, course_code, grades')
            .eq('roll_number', studentId);

        if (registrationError || withdrawalError || coursesError || marksError) {
            console.error('Error fetching data:', registrationError, withdrawalError, coursesError, marksError);
            return;
        }

        const allCourses = [...registrations, ...withdrawals];

        // Group courses by semester and prepare a 2D array for calculations
        const semesterData = {};
        const semesterPointsArray = {}; // To store points and credits for each semester

        allCourses.forEach((courseEntry) => {
            const course = courses.find((c) => c.course_code === courseEntry.course_id);
            if (!course) return;

            if (!semesterData[course.semester]) {
                semesterData[course.semester] = [];
                semesterPointsArray[course.semester] = { points: 0, credits: 0 }; // Initialize array
            }

            const mark = marks.find((m) => m.course_code === course.course_code);
            const isWithdrawn = withdrawals.some((w) => w.course_id === course.course_code);

            // Extract total credit hours from the "X+X" format
            const creditHours = course.credit_hours
                ? course.credit_hours.split('+').reduce((sum, part) => sum + parseInt(part.trim(), 10), 0)
                : 0;

            const grade = mark?.grades || null;
            const gradePoints = calculatePoints(grade); // Grade points for the course
            const weightedPoints = !isWithdrawn && grade && creditHours
                ? gradePoints * creditHours // Weighted points for SGPA/CGPA
                : 0;

            semesterData[course.semester].push({
                code: course.course_code,
                name: course.name,
                creditHours: creditHours,
                type: course.type,
                grade: isWithdrawn ? '-' : grade || '-',
                points: gradePoints, // Display grade points in table
                weightedPoints: weightedPoints, // Used for SGPA/CGPA calculations
                remarks: isWithdrawn ? 'Withdrawn' : grade ? 'Passed' : '',
            });

            // Add valid courses to SGPA/CGPA calculations
            if (!isWithdrawn && grade && creditHours) {
                semesterPointsArray[course.semester].points += weightedPoints;
                semesterPointsArray[course.semester].credits += creditHours;
            }
        });

        // Process each semester and calculate SGPA and CGPA
        let totalPoints = 0;
        let totalCredits = 0;

        Object.entries(semesterData).forEach(([semester, courses]) => {
            const semesterBox = document.createElement('div');
            semesterBox.classList.add('semester-box');

            const sgpaCgpaContainer = document.createElement('div');
            sgpaCgpaContainer.classList.add('sgpa-cgpa');

            const courseList = document.createElement('div');
            courseList.classList.add('course-list');
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Course Name</th>
                        <th>Credit Hours</th>
                        <th>Grade</th>
                        <th>Points</th>
                        <th>Type</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    ${courses.map((course) => `
                        <tr>
                            <td>${course.code}</td>
                            <td>${course.name}</td>
                            <td>${course.creditHours}</td>
                            <td>${course.grade}</td>
                            <td>${course.points.toFixed(2)}</td> <!-- Display grade points -->
                            <td>${course.type}</td>
                            <td>${course.remarks}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            courseList.appendChild(table);

            // Calculate SGPA
            const semesterPoints = semesterPointsArray[semester].points;
            const semesterCredits = semesterPointsArray[semester].credits;
            const sgpa = semesterCredits > 0 ? (semesterPoints / semesterCredits).toFixed(2) : '0.00';

            // Update cumulative totals for CGPA
            totalPoints += semesterPoints;
            totalCredits += semesterCredits;
            const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

            sgpaCgpaContainer.innerHTML = `
                <span>SGPA: ${sgpa}</span>
                <span>CGPA: ${cgpa}</span>
            `;

            semesterBox.appendChild(sgpaCgpaContainer);
            semesterBox.innerHTML += `<h2>Semester ${semester}</h2>`;
            semesterBox.appendChild(courseList);

            transcriptContainer.appendChild(semesterBox);
            preloader.style.display = 'none';
        });

        document.getElementById('downloadTranscript').addEventListener('click', async () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const dateGenerated = new Date().toLocaleDateString();

            const { data: student, error: studentError } = await supabase
            .from('students')
            .select('first_name, last_name, phone')
            .eq('roll_number', studentId)
            .single(); // Ensure only one record is returned

            if (!student, studentError) {
                console.error('Error fetching data:', studentError);
                return;
            }
            console.log(studentId, student.first_name, student.last_name);

            doc.setFontSize(20);
        doc.text('Student Transcript', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Student ID: ${studentId}`, 15, 30);
        doc.text(`Full Name: ${capitalize(student.first_name)} ${capitalize(student.last_name)}`, 15, 40);
        doc.text(`Phone: ${student.phone}`, 15, 50);
        doc.text(`Date Generated: ${dateGenerated}`, 15, 60);

        let yPosition = 70;

        // Initialize cumulative totals for CGPA
        let cumulativePoints = 0;
        let cumulativeCredits = 0;

        Object.entries(semesterData).forEach(([semester, courses]) => {
            const semesterPoints = semesterPointsArray[semester].points;
            const semesterCredits = semesterPointsArray[semester].credits;

            // Calculate SGPA for this semester
            const sgpa = semesterCredits > 0 ? (semesterPoints / semesterCredits).toFixed(2) : '0.00';

            // Update cumulative totals for CGPA
            cumulativePoints += semesterPoints;
            cumulativeCredits += semesterCredits;

            // Calculate CGPA using cumulative totals
            const cgpa = cumulativeCredits > 0 ? (cumulativePoints / cumulativeCredits).toFixed(2) : '0.00';

            // Add semester header with SGPA and CGPA
            doc.setFontSize(16);
            doc.setTextColor(40, 116, 240); // Blue color for semester title
            doc.text(`Semester ${semester}`, 15, yPosition);

            doc.setFontSize(12);
            doc.setTextColor(0); // Black for SGPA/CGPA
            doc.text(`SGPA: ${sgpa}`, 150, yPosition);
            doc.text(`CGPA: ${cgpa}`, 180, yPosition);

            yPosition += 10;

            // Add courses table
            const tableData = courses.map((course) => [
                course.code,
                course.name,
                course.creditHours,
                course.grade,
                course.points.toFixed(2),
                course.type,
                course.remarks,
            ]);

            doc.autoTable({
                head: [['Code', 'Course Name', 'Credit Hours', 'Grade', 'Points', 'Type', 'Remarks']],
                body: tableData,
                startY: yPosition,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185] },
            });

            yPosition = doc.lastAutoTable.finalY + 10;
        });

        doc.save(`Student_Transcript_${studentId}.pdf`);
    });

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

    return gradeMap[grade] !== undefined ? gradeMap[grade] : 0;
}


// Scroll to the student portal page (this function will need to be defined based on your page logic)
function goToStudentPortal() {
    window.location.href = "student.html";  // Modify the path based on your portal page
}
