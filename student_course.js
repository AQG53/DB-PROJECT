document.getElementById('registerCourses').addEventListener('click', () => {
    const selectedCourses = [];
    const checkboxes = document.querySelectorAll('input[name="course"]:checked');
    const errorMessageDiv = document.getElementById('errorMessage');
    const messageDiv = document.getElementById('registrationMessage');

    // Clear any previous error or success messages
    errorMessageDiv.style.display = 'none';
    messageDiv.textContent = '';

    let totalCreditHours = 0;
    const courseCredits = {
        'CS107': 3, // Statistics
        'MT106': 3, // Numerical Computing
        'CS101': 3, // Introduction to Programming
        'MATH202': 4, // Calculus II
        'PHYS301': 13  // Physics III
    };

    checkboxes.forEach((checkbox) => {
        const courseCode = checkbox.value;
        selectedCourses.push(courseCode);
        totalCreditHours += courseCredits[courseCode]; // Sum up the credit hours
    });

    // Check if any courses are selected
    if (selectedCourses.length === 0) {
        errorMessageDiv.textContent = 'Select at least one course!';
        errorMessageDiv.style.display = 'block';
    }
    // Check if total credit hours exceed 17
    else if (totalCreditHours > 17) {
        errorMessageDiv.textContent = 'Total credit hours exceed the limit of 17!';
        errorMessageDiv.style.display = 'block';
    } else {
        // Display success message if the conditions are met
        messageDiv.textContent = 'Registration successful!';
        messageDiv.style.color = 'green';
    }
});

function goToStudentPortal() {
    window.location.href = 'student.html';
}
