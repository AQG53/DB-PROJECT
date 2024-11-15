document.getElementById('withdrawCourses').addEventListener('click', () => {
    const selectedCourses = [];
    const checkboxes = document.querySelectorAll('input[name="course"]:checked');
    const errorMessageDiv = document.getElementById('errorMessage'); // Get the error message div
    const messageDiv = document.getElementById('withdrawalMessage');

    // Clear any previous error message
    errorMessageDiv.style.display = 'none';

    checkboxes.forEach((checkbox) => {
        selectedCourses.push(checkbox.value);
    });

    if (selectedCourses.length > 0) {
        // Update the success message
        messageDiv.textContent = "Withdrawal successful!";
        messageDiv.style.color = 'green';

    } else {
        // Show error message if no courses are selected
        errorMessageDiv.style.display = 'block';
        messageDiv.textContent = ''; // Clear any success message
    }
});

function goToStudentPortal() {
    window.location.href = 'student.html'; // Replace with the actual path of the student portal
}
