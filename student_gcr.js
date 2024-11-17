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
    } 
    else if (originalGrade === requestedGrade) {
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.textContent = 'Invalid request: Requested grade is the same as the original grade!';
    }
    else {
        // Display success message
        messageDiv.textContent = 'Request sent!';
        messageDiv.style.color = 'green';
    }
});

// Automatically focus on the first empty field
document.getElementById('courseDropdown').addEventListener('change', function () {
    const originalGrade = document.getElementById('originalGrade');
    if (this.value && !originalGrade.value) {
        originalGrade.focus();
    }
});

// Focus on the next field when the original grade is filled
document.getElementById('originalGrade').addEventListener('input', function () {
    const requestedGrade = document.getElementById('requestedGrade');
    if (this.value && !requestedGrade.value) {
        requestedGrade.focus();
    }
});

// Focus on the next field when the requested grade is filled
document.getElementById('requestedGrade').addEventListener('input', function () {
    const reason = document.getElementById('reason');
    if (this.value && !reason.value) {
        reason.focus();
    }
});

// Optional: After the reason field is filled, auto-submit or move focus as needed
document.getElementById('reason').addEventListener('input', function () {
    const sendButton = document.getElementById('sendRequest');
    if (this.value) {
        // Optionally, automatically trigger the send button if needed
        sendButton.focus(); // You could also trigger form submission here
    }
});

function goToStudentPortal() {
    window.location.href = 'student.html';
}
