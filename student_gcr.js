document.getElementById('sendRequest').addEventListener('click', () => {
    const errorMessageDiv = document.getElementById('errorMessage');
    const messageDiv = document.getElementById('requestMessage');

    // Clear any previous error or success messages
    errorMessageDiv.style.display = 'none';
    messageDiv.textContent = '';

    const courses = [
        'CS107', 'MT106', 'CS101', 'MATH202', 'PHYS301'
    ];

    let atLeastOneRequestFilled = false;
    let allFieldsFilled = true;

    // Check if at least one request is completely filled
    courses.forEach((course) => {
        const originalGrade = document.querySelector(`input[name="originalGrade${course}"]`).value;
        const requestedGrade = document.querySelector(`input[name="requestedGrade${course}"]`).value;
        const reason = document.querySelector(`input[name="reason${course}"]`).value;

        if (originalGrade && requestedGrade && reason) {
            atLeastOneRequestFilled = true; // Mark as filled if all fields are filled for a course
        }

        // Check if all fields are filled for each course
        if (!originalGrade || !requestedGrade || !reason) {
            allFieldsFilled = false;
        }
    });

    if (!atLeastOneRequestFilled) {
        errorMessageDiv.textContent = 'Fill in all fields for at least one course!';
        errorMessageDiv.style.display = 'block';
    } else if (allFieldsFilled) {
        // If all fields are filled, display error that it's too late to submit requests for changes
        messageDiv.textContent = 'All fields are filled. Request sent successfully!';
        messageDiv.style.color = 'green';
    } else {
        // If at least one field is filled entirely, display a message saying the request was sent.
        messageDiv.textContent = 'Request sent!';
        messageDiv.style.color = 'green';
    }
});

function goToStudentPortal() {
    window.location.href = 'student.html';
}
