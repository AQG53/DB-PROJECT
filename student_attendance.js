// Function to open the attendance popup and display the table for a clicked course
document.querySelectorAll('.course-box').forEach(courseBox => {
    courseBox.addEventListener('click', function() {
        const courseName = this.getAttribute('data-course');
        const attendancePopup = document.getElementById('attendancePopup');
        const courseNameElement = document.getElementById('courseName');
        
        // Update the course name in the popup
        courseNameElement.textContent = courseName;

        // Generate 40 rows for the attendance table
        const attendanceTableBody = document.querySelector('#attendanceTable tbody');
        attendanceTableBody.innerHTML = ''; // Clear existing rows

        for (let i = 1; i <= 40; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Lecture ${i}</td>
                <td></td> <!-- Date will be entered by teacher -->
                <td></td> <!-- Status will be entered by teacher -->
            `;
            attendanceTableBody.appendChild(row);
        }

        // Show the popup window
        attendancePopup.style.display = 'flex';
    });
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
