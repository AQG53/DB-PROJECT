// Function to open the marks popup and display marks for a clicked course
document.querySelectorAll('.course-box').forEach(courseBox => {
    courseBox.addEventListener('click', function() {
        const courseName = this.getAttribute('data-course');
        const marksPopup = document.getElementById('marksPopup');
        const courseNameElement = document.getElementById('courseName');
        
        // Update the course name in the popup
        courseNameElement.textContent = courseName;

        // Show the popup window
        marksPopup.style.display = 'flex';
    });
});

// Function to close the marks popup
document.getElementById('closePopup').addEventListener('click', function() {
    const marksPopup = document.getElementById('marksPopup');
    marksPopup.style.display = 'none';
});
// Existing code for handling the popup (if any) goes here

// Function to redirect to the student portal
function goToStudentPortal() {
    // Replace 'student_portal.html' with the actual URL or path of the student portal page
    window.location.href = 'student.html';
};
document.getElementById('downloadPdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set the PDF title
    doc.setFontSize(18);
    doc.text('Student Marks Report', 10, 10);

    let yPosition = 20; // Initialize the starting y position in the PDF

    // Loop through each course box and get the related marks
    document.querySelectorAll('.course-box').forEach((courseBox, index) => {
        const courseName = courseBox.getAttribute('data-course');

        // Add the course name to the PDF
        doc.setFontSize(16);
        yPosition += 10;
        doc.text(`Course: ${courseName}`, 10, yPosition);

        // Add table headers for marks (Assessment, Obtained Marks, Total Marks)
        yPosition += 10;
        doc.setFontSize(14);
        doc.text('Assessment', 10, yPosition);
        doc.text('Obtained Marks', 70, yPosition);
        doc.text('Total Marks', 130, yPosition);

        // Simulating marks for each course (you will need to replace this part with actual dynamic data)
        const marks = [
            { assessment: 'Midterm 1', obtained: 8, total: 15 },
            { assessment: 'Midterm 2', obtained: 9, total: 15 },
            { assessment: 'Assignments', obtained: 8, total: 10 },
            { assessment: 'Quizzes', obtained: 3, total: 10 },
            { assessment: 'Final', obtained: 90, total: 100 }
        ];

        // Add each row of the marks table to the PDF
        marks.forEach((mark) => {
            yPosition += 10;
            doc.text(mark.assessment, 10, yPosition);
            doc.text(mark.obtained.toString(), 70, yPosition);
            doc.text(mark.total.toString(), 130, yPosition);
        });

        // Add some spacing between courses for readability
        yPosition += 20;

        // Check if the content is going to the next page, then add a new page
        if (yPosition >= 280) {
            doc.addPage();
            yPosition = 10; // Reset yPosition for the new page
        }
    });

    // Save the PDF with a custom filename
    doc.save('Student_Marks_Report.pdf');
});

