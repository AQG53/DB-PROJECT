// Download Fee Challan as PDF with tabular format using jsPDF and autoTable
function downloadChallan(feeId) {
    const { jsPDF } = window.jspdf;

    // Sample student details
    const studentDetails = {
        name: "John Doe",
        studentId: "22k-4328",
        program: "Computer Science",
        semester: "Fall 2024"
    };

    const feeDetails = {
        1: {
            amount: 'Rs.178,000',
            generatedOn: '01 Nov 2024',
            dueDate: '15 Nov 2024',
            status: 'Pending',
            description: 'Tuition Fee for Fall 2024'
        }
    };

    const selectedFee = feeDetails[feeId];

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set the title for the document
    doc.setFontSize(18);
    doc.text("UNIVERSITY FEE CHALLAN", 105, 20, null, null, 'center');

    // Add student details section as a table
    doc.autoTable({
        startY: 40,
        head: [['Student Details', 'Value']],
        body: [
            ['Student Name', studentDetails.name],
            ['Student ID', studentDetails.studentId],
            ['Program', studentDetails.program],
            ['Semester', studentDetails.semester],
        ],
        theme: 'grid'
    });

    // Add fee details section as a table
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10, // Add space after previous table
        head: [['Challan ID', 'Description', 'Amount', 'Generated On', 'Due Date', 'Status']],
        body: [
            [
                feeId, 
                selectedFee.description, 
                selectedFee.amount, 
                selectedFee.generatedOn, 
                selectedFee.dueDate, 
                selectedFee.status
            ]
        ],
        theme: 'grid'
    });

    // Add bank details section as a table
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Bank Details', 'Value']],
        body: [
            ['Account Name', 'University ABC'],
            ['Account Number', '123-456-789'],
            ['Bank Name', 'XYZ Bank'],
            ['IBAN', 'XYZB1234567890'],
            ['Branch', 'Main Branch, City']
        ],
        theme: 'grid'
    });

    // Add footer message
    doc.setFontSize(10);
    doc.text("Please pay before the due date to avoid penalties.", 20, doc.lastAutoTable.finalY + 20);
    doc.text("Thank you for your prompt payment!", 20, doc.lastAutoTable.finalY + 30);

    // Save the PDF with a custom file name
    doc.save(`Fee_Challan_${feeId}.pdf`);
}
// Back to Student Portal Function
function goToStudentPortal() {
    window.location.href = 'student.html'; // Update with actual portal link
}