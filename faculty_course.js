document.getElementById('submitSelection').addEventListener('click', () => {
    const selectedCourses = [];
    const checkboxes = document.querySelectorAll('input[name="course"]:checked');
    const errorMessageDiv = document.getElementById('errorMessage');
    const successMessageDiv = document.getElementById('selectionMessage');
    
    // Clear any previous error or success messages
    errorMessageDiv.style.display = 'none';
    successMessageDiv.style.display = 'none';  // Hide the success message initially

    // Collect selected courses
    checkboxes.forEach((checkbox) => {
        selectedCourses.push(checkbox.value);
    });

    // Check if any courses are selected
    if (selectedCourses.length === 0) {
        errorMessageDiv.textContent = 'Select at least one course!';
        errorMessageDiv.style.display = 'block';
    } else {
        // Show success message
        successMessageDiv.style.display = 'block';

        // Show the new course information table below the old one
        const courseInfoContainer = document.querySelector('.course-info-container');
        const courseInfoTable = document.getElementById('courseInfoTable');
        
        courseInfoContainer.style.display = 'block'; // Show the course info container
        courseInfoTable.style.display = 'table'; // Display the new table

        // Clear the table before inserting new content
        courseInfoTable.querySelector('tbody').innerHTML = '';

        // Add selected courses to the new table
        selectedCourses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = ` 
                <td>${course}</td>
                <td>${course}</td> <!-- Use actual course code here -->
                <td>3</td> <!-- Customize with actual credit hours -->
                <td><a href="#" download>Download Syllabus</a></td>
                <td>-</td>
            `;
            courseInfoTable.querySelector('tbody').appendChild(row);
        });
    }
});
function goToFacultyPortal() {
    window.location.href = 'faculty.html';
}
