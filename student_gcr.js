document.getElementById('sendRequest').addEventListener('click', () => {
    const errorMessageDiv = document.getElementById('errorMessage');
    const messageDiv = document.getElementById('requestMessage');

    // Clear any previous error or success messages
    errorMessageDiv.style.display = 'none';
    messageDiv.textContent = '';

    const course = document.getElementById('courseDropdown').value;
    const originalGrade = document.getElementById('originalGrade').value;
    const requestedGrade = document.getElementById('requestedGrade').value;
    const reason = document.getElementById('reason').value;

    // Check if all fields are filled
    if (!course || !originalGrade || !requestedGrade || !reason) {
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.textContent = 'Please fill in all fields!';
    } else {
        // Display success message
        messageDiv.textContent = 'Request sent!';
        messageDiv.style.color = 'green';
    }
});

function goToStudentPortal() {
    window.location.href = 'student.html';
}
