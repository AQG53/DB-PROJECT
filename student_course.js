document.getElementById('registerCourses').addEventListener('click', () => {
    const selectedCourses = [];
    const checkboxes = document.querySelectorAll('input[name="course"]:checked');
    const errorMessageDiv = document.getElementById('errorMessage'); // Get the error message div
    const messageDiv = document.getElementById('registrationMessage');

    // Clear any previous error message
    errorMessageDiv.style.display = 'none';

    checkboxes.forEach((checkbox) => {
        selectedCourses.push(checkbox.value);
    });

    if (selectedCourses.length > 0) {
        // Update the success message
        messageDiv.textContent = "Registration successful!";
        messageDiv.style.color = 'green';

        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'student.html'; // Adjust URL as needed
        }, 2000);
    } else {
        // Show error message if no courses are selected
        errorMessageDiv.style.display = 'block';
        messageDiv.textContent = ''; // Clear any success message
    }
});
