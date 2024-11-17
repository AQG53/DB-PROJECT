document.addEventListener('DOMContentLoaded', function () {
    const attendanceDate = document.getElementById('attendanceDate');
    const courseSelect = document.getElementById('courseSelect');
    const sectionSelect = document.getElementById('sectionSelect');
    const attendanceTable = document.getElementById('attendanceTable');
    const saveButton = document.getElementById('saveAttendance');
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
        sectionSelect.innerHTML = '<option value="" disabled selected>Select a Section</option>';
        sectionSelect.disabled = false;
        const selectedCourse = courseSelect.value;

        sections[selectedCourse].forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            sectionSelect.appendChild(option);
        });

        sectionSelect.focus();
    });

    // Handle section selection
    sectionSelect.addEventListener('change', function () {
        attendanceTable.style.display = 'table';
        saveButton.style.display = 'block';
        attendanceTable.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Placeholder student data
        const students = [
            { id: 'S001', name: 'John Doe' },
            { id: 'S002', name: 'Jane Smith' }
        ];

        const tbody = attendanceTable.querySelector('tbody');
        tbody.innerHTML = '';

        // Populate the student attendance table with default 'P' for Present
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>
                    <select>
                        <option value="P" selected>P</option>
                        <option value="A">A</option>
                    </select>
                </td>
            `;
            tbody.appendChild(row);
        });
    });

    // Handle saving attendance
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
