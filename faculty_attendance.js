const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
  
    // Set message and show the notification
    notificationMessage.textContent = message;
    notification.classList.add('show');
  
    // Hide notification after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 3000);
  }

  function showNotification1(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
  
    // Set message and show the notification
    notificationMessage.textContent = message;
    notification.classList.add('show');
  
    // Hide notification after 5 seconds
    setTimeout(() => {
        closeNotification();
        location.reload();
    }, 3000);
  }
  
  // Function to close notification
  function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show'); // Hide notification smoothly
  }

  function capitalize(str) {
    if (!str) return ""; // Handle null or undefined values
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

document.addEventListener('DOMContentLoaded', async function () {
    const facultyId = localStorage.getItem("facultyId");
    const facultyNameElement = document.getElementById('facultyName');
    const facultyDepartmentElement = document.getElementById('facultyDepartment');
    const currentDateElement = document.getElementById('currentDate');
    const currentMonthElement = document.getElementById('currentMonth');
    
    console.log(facultyId);

    if (!facultyId) {
        alert("Faculty ID not found. Please log in again.");
        window.location.href = "faculty.html";
        return;
    }

    const { data: faculty, error } = await supabase
        .from('faculty') // Replace with your Supabase table
        .select('title, first_name, last_name, department')
        .eq('id', facultyId) // Replace '1' with the actual faculty ID (use authentication or session ID)
        .single();

    if (error) {
        console.error('Error fetching faculty data:', error);
        return;
    }

    // Populate the fields dynamically
    facultyNameElement.textContent = `${faculty.title} ${capitalize(faculty.first_name)} ${capitalize(faculty.last_name)}`;
    facultyDepartmentElement.textContent = faculty.department;

    // Populate the current date and month
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedMonth = today.toLocaleDateString('en-US', { month: 'long' });

    currentDateElement.textContent = formattedDate;
    currentMonthElement.textContent = formattedMonth;
    const courseSelect = document.getElementById('courseSelect');
    try {
        // Fetch courses registered by the faculty
        const { data: courses, error } = await supabase
            .from('courses') // Replace with your courses table name
            .select('course_code, name')
            .eq('registered_by', facultyId);

        if (error) {
            console.error('Error fetching courses:', error);
            return;
        }

        // Populate the course dropdown
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.course_code;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });

        if (courses.length === 0) {
            const noCourseOption = document.createElement('option');
            noCourseOption.value = "";
            noCourseOption.textContent = "No courses registered.";
            noCourseOption.disabled = true;
            noCourseOption.selected = true;
            courseSelect.appendChild(noCourseOption);
        }
    } catch (error) {
        console.error('Error populating course dropdown:', error);
    }

    const monthSelect = document.getElementById('monthSelect');
    const attendanceTable = document.getElementById('attendanceTable');
    const attendanceTableBody = attendanceTable.querySelector('tbody');

    monthSelect.addEventListener('change', async function () {
        // Get the selected month and course
        const selectedMonth = parseInt(monthSelect.value);
        const selectedCourse = courseSelect.value;

        console.log(selectedCourse, selectedMonth);

        // Clear the table body
        attendanceTable.innerHTML = '';

        if (!selectedCourse || isNaN(selectedMonth)) {
            showNotification('Please select a course and a valid month.');
            return;
        }

        try {
            // Fetch attendance records for the selected course and month
            const { data: attendanceRecords, error } = await supabase
                .from('attendance')
                .select('date, day, status, student_id')
                .eq('course_id', selectedCourse)
                .eq('month', selectedMonth); // Filter by month

            if (error) {
                console.error('Error fetching attendance records:', error);
                return;
            }

            if (attendanceRecords.length === 0) {
                showNotification('No attendance records found for this month.');
                return;
            }

            const uniqueDates = Array.from(
                new Set(attendanceRecords.map(record => record.date))
            ).sort((a, b) => new Date(a) - new Date(b));

            // Fetch student names
            const rollNumbers = Array.from(new Set(attendanceRecords.map(record => record.student_id)));
            const { data: students, error: studentError } = await supabase
                .from('students') // Replace with your students table
                .select('roll_number, first_name, last_name')
                .in('roll_number', rollNumbers);

            if (studentError) {
                console.error('Error fetching student details:', studentError);
                return;
            }

            // Create a map of student names
            const studentMap = students.reduce((acc, student) => {
                acc[student.roll_number] = `${capitalize(student.first_name)} ${capitalize(student.last_name)}`;
                return acc;
            }, {});

            const updates = {};

            const tableHead = document.createElement('thead');
            const tableBody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            headerRow.innerHTML = '<th>Student Name</th>'; // First column for student names
            uniqueDates.forEach(date => {
                const th = document.createElement('th');
                th.textContent = new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                headerRow.appendChild(th);
            });
            tableHead.appendChild(headerRow);

            // Create rows for each student
            students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${capitalize(student.first_name)} ${capitalize(student.last_name)}</td>`;

                // Add attendance statuses for each date
                uniqueDates.forEach(date => {
                    const td = document.createElement('td');
                    const record = attendanceRecords.find(
                        r => r.student_id === student.roll_number && new Date(r.date).toISOString() === new Date(date).toISOString()
                    );
                    const statuses = ['P', 'A', 'L'];
                statuses.forEach(status => {
                    const button = document.createElement('button');
                    button.textContent = status;
                    button.classList.add('status-button');
                    if (record && record.status === status) {
                        button.classList.add('highlighted');
                    }

                    button.addEventListener('click', () => {
                        // Highlight the clicked button and remove highlights from others
                        Array.from(td.children).forEach(btn => btn.classList.remove('highlighted'));
                        button.classList.add('highlighted');

                        // Track the update
                        if (!updates[student.roll_number]) updates[student.roll_number] = {};
                        updates[student.roll_number][date] = status;
                    });

                    td.appendChild(button);
                });

                row.appendChild(td);
            });

                tableBody.appendChild(row);
            });

            // Append the table head and body
            attendanceTable.appendChild(tableHead);
            attendanceTable.appendChild(tableBody);

            // Show the table
            attendanceTable.style.display = 'table';
            const saveButton = document.getElementById('saveAttendance');

            saveButton.addEventListener('click', async function () {
                if (Object.keys(updates).length === 0) {
                    showNotification('No changes were made.');
                    return; // Stop further execution
                }
                const updatePayload = [];
                for (const rollNumber in updates) {
                    for (const date in updates[rollNumber]) {
                        updatePayload.push({
                            student_id: rollNumber,
                            course_id: selectedCourse,
                            date,
                            status: updates[rollNumber][date],
                        });
                    }
                }
    
                // Update records in the database
                try {
                    for (const record of updatePayload) {
                        const { error } = await supabase
                            .from('attendance')
                            .update({ status: record.status }) // Update only the status
                            .eq('student_id', record.student_id)
                            .eq('course_id', record.course_id)
                            .eq('date', record.date); // Match existing records by these conditions
            
                        if (error) {
                            console.error('Error updating record:', error);
                            showNotification('Failed to update some attendance records.');
                            return;
                        }
                    }
            
                    showNotification1('Attendance records updated successfully!');
                } catch (error) {
                    console.error('Error saving attendance records:', error);
                    showNotification('An error occurred while updating attendance records.');
                }
            });

        } catch (error) {
            console.error('Error displaying attendance records:', error);
        }
    });

    const addRecordPopup = document.getElementById('addRecordPopup');
    const popupMonthSelect = document.getElementById('popupMonthSelect');
    const popupDate = document.getElementById('popupDate');
    const popupDefaultValue = document.getElementById('popupDefaultValue');
    const savePopupRecord = document.getElementById('savePopupRecord');
    const closePopup = document.getElementById('closePopup');
    const plusButton = document.getElementById('addAttendance');

    plusButton.addEventListener('click', () => {
        const selectedCourse = courseSelect.value; // Get the selected course
        const selectedMonth = parseInt(monthSelect.value);
        if (!selectedCourse) {
            showNotification('Please select a course before adding a new attendance record.');
            return; // Prevent the popup from opening
        }
        else if (isNaN(selectedMonth)) {
            showNotification('Please select a month before adding a new attendance record.');
            return;
        }
        // If course is selected, open the popup
        addRecordPopup.style.display = 'flex';
        document.body.classList.add('modal-open');
    });
    
    closePopup.addEventListener('click', () => {
        addRecordPopup.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    popupMonthSelect.addEventListener('change', () => {
        const selectedMonth = parseInt(popupMonthSelect.value);
        const today = new Date();
        const year = today.getFullYear();
    
        // Set the date picker to the selected month
        popupDate.min = `${year}-${String(selectedMonth).padStart(2, '0')}-01`;
        const daysInMonth = new Date(year, selectedMonth, 0).getDate();
        popupDate.max = `${year}-${String(selectedMonth).padStart(2, '0')}-${daysInMonth}`;
    });

    savePopupRecord.addEventListener('click', async () => {
        const selectedMonth = parseInt(popupMonthSelect.value);
        const selectedDate = new Date(popupDate.value);
        const defaultValue = popupDefaultValue.value;
        const selectedCourse = courseSelect.value;
    
        if (!selectedMonth || !selectedDate || !defaultValue) {
            showNotification('Please fill in all fields.');
            return;
        }
    
        const day = selectedDate.getDate();
    
        try {
            // Check if the record already exists
            const { data: existingRecords, error: fetchError } = await supabase
                .from('attendance')
                .select('id')
                .eq('day', day)
                .eq('month', selectedMonth)
                .eq('course_id', selectedCourse);
    
            if (fetchError) {
                console.error('Error checking existing records:', fetchError);
                return;
            }
    
            if (existingRecords.length > 0) {
                showNotification('Attendance record for this date already exists.');
                return;
            }
    
            // Insert the new attendance record
            const { data: registeredStudents, error: fetchStudentsError } = await supabase
            .from('student_registration')
            .select('student_id')
            .eq('course_id', selectedCourse);

        if (fetchStudentsError) {
            console.error('Error fetching registered students:', fetchStudentsError);
            return;
        }

        if (registeredStudents.length === 0) {
            showNotification('No students are registered for this course.');
            return;
        }

        // Prepare insert data for all students
        const attendanceRecords = registeredStudents.map(student => ({
            student_id: student.student_id,
            course_id: selectedCourse,
            date: selectedDate.toISOString().split('T')[0],
            status: defaultValue,
        }));

        // Insert attendance records for all students
        const { error: insertError } = await supabase
            .from('attendance')
            .insert(attendanceRecords);

        if (insertError) {
            console.error('Error inserting attendance records:', insertError);
            showNotification('Failed to add attendance records.');
            return;
        }

        showNotification1('Attendance records added successfully!');
        addRecordPopup.style.display = 'none';
        document.body.classList.remove('modal-open');
        } catch (error) {
            console.error('Error saving attendance records:', error);
            showNotification('An error occurred while saving the attendance records.');
        }
    });
});

// Function to navigate back to the faculty portal
function goToFacultyPortal() {
    window.location.href = "faculty.html";
}
