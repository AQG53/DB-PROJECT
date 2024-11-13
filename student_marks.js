// Function to open the marks popup and display marks for a clicked course
document.querySelectorAll('.course-box').forEach(courseBox => {
    courseBox.addEventListener('click', function() {
        const courseName = this.getAttribute('data-course');
        const marksPopup = document.getElementById('marksPopup');
        const courseNameElement = document.getElementById('courseName');
        
        // Update the course name in the popup
        courseNameElement.textContent = courseName;

        // Show the popup window
        marksPopup.style.display = 'flex';
    });
});

// Function to close the marks popup
document.getElementById('closePopup').addEventListener('click', function() {
    const marksPopup = document.getElementById('marksPopup');
    marksPopup.style.display = 'none';
});
// Existing code for handling the popup (if any) goes here

// Function to redirect to the student portal
function goToStudentPortal() {
    // Replace 'student_portal.html' with the actual URL or path of the student portal page
    window.location.href = 'student.html';
};
