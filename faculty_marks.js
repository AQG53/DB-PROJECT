document.addEventListener('DOMContentLoaded', function () {
    const courseSelect = document.getElementById('courseSelect');
    const sectionSelect = document.getElementById('sectionSelect');
    const marksTable = document.getElementById('marksTable');
    const saveButton = document.getElementById('saveMarks');
    const successMessage = document.getElementById('successMessage');

    // Placeholder data for courses and sections
    const courses = [
        { id: 'CS101', name: 'Data Structures' },
        { id: 'CS102', name: 'Database Management' }
    ];

    const sections = {
        'CS101': ['Section A', 'Section B'],
        'CS102': ['Section C', 'Section D']
    };

    // Populate courses in the dropdown
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });

    // Handle course selection
    courseSelect.addEventListener('change', function () {
        // Reset and enable section select
        sectionSelect.innerHTML = '<option value="" disabled selected>Select a Section</option>';
        sectionSelect.disabled = false;
        const selectedCourse = courseSelect.value;

        // Populate the section dropdown based on the selected course
        sections[selectedCourse].forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            sectionSelect.appendChild(option);
        });

        // Automatically focus on the section dropdown
        sectionSelect.focus();
    });

    // Handle section selection
    sectionSelect.addEventListener('change', function () {
        marksTable.style.display = 'table';
        saveButton.style.display = 'block';

        // Automatically scroll to the marks table
        marksTable.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Placeholder student data
        const students = [
            { id: 'S001', name: 'John Doe' },
            { id: 'S002', name: 'Jane Smith' },
            { id: 'S001', name: 'John Doe' },
            { id: 'S002', name: 'Jane Smith' },
            { id: 'S001', name: 'John Doe' },
            { id: 'S002', name: 'Jane Smith' },
            { id: 'S001', name: 'John Doe' },
            { id: 'S002', name: 'Jane Smith' },
            { id: 'S001', name: 'John Doe' },
            { id: 'S002', name: 'Jane Smith' }
        ];

        const tbody = marksTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear any previous rows

        // Populate the student marks table
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td><input type="number" name="quiz" min="0" max="10"></td>
                <td><input type="number" name="assignment" min="0" max="10"></td>
                <td><input type="number" name="mid1" min="0" max="15"></td>
                <td><input type="number" name="mid2" min="0" max="15"></td>
                <td><input type="number" name="final" min="0" max="50"></td>
                <td><input type="number" name="project" min="0" max="10"></td>
            `;
            tbody.appendChild(row);
        });
    });

    // Handle saving marks
    saveButton.addEventListener('click', function () {
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    });
});

// Function to navigate back to the faculty portal
function goToFacultyPortal() {
    window.location.href = "faculty.html";
}
