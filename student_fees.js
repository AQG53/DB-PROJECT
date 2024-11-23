const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const studentId = localStorage.getItem('studentId');
if (!studentId) {
    alert('Student is not logged in.');
    window.location.href = 'login.html';
}
const CREDIT_HOUR_FEE = 10750;
const tableBody = document.querySelector('tbody');

async function calculateAndInsertFee() {
    try {
        // Fetch existing fee record
        const { data: feeData, error: feeError } = await supabase
            .from('fees')
            .select('*')
            .eq('roll_number', studentId);

        if (feeError) throw feeError;

        if (feeData && feeData.length > 0) {
            // Display existing fee records
            displayFeeData(feeData);
        } 
        else {
            // Calculate and insert new fee record
            const newFee = await calculateNewFee();
            if (newFee) {
                displayFeeData([newFee]); // Display the newly inserted fee
            }
        }
    } catch (error) {
        console.error('Error calculating or inserting fee:', error.message);
    }
}
async function calculateNewFee() {
    try {
        // Fetch registered courses
        const { data: registrationData, error: regError } = await supabase
            .from('student_registration')
            .select('course_id')
            .eq('student_id', studentId);

        if (regError) throw regError;

        const courseIds = registrationData.map(row => row.course_id);
        console.log('Course IDs:', courseIds); // Log to inspect courseIds
        // Fetch credit hours for courses
        const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('course_code, credit_hours')
            .in('course_code', courseIds);

        if (coursesError) throw coursesError;
        console.log(coursesData);
        const totalCreditHours = coursesData.reduce((sum, course) => {
            // Split the 'credit_hours' string by '+' to get both parts
            const [lectureHours, practicalHours] = course.credit_hours.split('+').map(hour => parseInt(hour, 10));
        
            // Sum both lecture and practical hours
            return sum + lectureHours + practicalHours;
        }, 0);
        
        console.log(totalCreditHours);

        const feeAmount = totalCreditHours * CREDIT_HOUR_FEE;
        console.log(feeAmount);

        // Get student details
        const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('created_at, first_name, last_name, department, semester')
            .eq('roll_number', studentId)
            .single();

        if (studentError) throw studentError;

        const generatedOn = new Date(studentData.created_at);
        const dueDate = new Date(generatedOn);
        dueDate.setDate(generatedOn.getDate() + 45);

        // Insert new fee record
        const { data: insertedData, error: insertError } = await supabase
            .from('fees')
            .insert([
                {
                    roll_number: studentId,
                    amount: feeAmount,
                    generatedOn: generatedOn,
                    dueOn: dueDate,
                    status: 'Pending',
                },
            ]);

        if (insertError) throw insertError;

        return {
            roll_number: studentId,
            amount: feeAmount,
            generatedOn: generatedOn.toISOString(),
            dueOn: dueDate.toISOString(),
            status: 'Pending',
        };
    } catch (error) {
        console.error('Error calculating new fee:', error.message);
    }
}

function displayFeeData(feeDataArray) {
    tableBody.innerHTML = '';

    feeDataArray.forEach((fee, index) => {
        const generatedOnDate = new Date(fee.generatedOn).toLocaleDateString();
        const dueDate = new Date(fee.dueOn).toLocaleDateString();

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>Rs.${fee.amount}</td>
                <td>${generatedOnDate}</td>
                <td>${dueDate}</td>
                <td>${fee.status}</td>
                <td><button class="download-btn" onclick="downloadChallan(${index})">Download</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

async function downloadChallan(index) {
    try {
        // Fetch fee record for the given index
        const { data: feeData, error } = await supabase
            .from('fees')
            .select('*')
            .eq('roll_number', studentId);

        if (error) throw error;

        const fee = feeData[index];
        if (!fee) throw new Error('Fee record not found.');

        // Fetch student details
        const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('first_name, last_name, department, semester')
            .eq('roll_number', studentId)
            .single();

        if (studentError) throw studentError;

        downloadUpdatedChallan(
            fee.amount,
            studentData,
            new Date(fee.generatedOn),
            new Date(fee.dueOn),
            fee.status
        );
    } catch (error) {
        console.error('Error downloading challan:', error.message);
    }
}

function downloadUpdatedChallan(amount, studentDetails, generatedOn, dueDate, status) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('FEE CHALLAN', 105, 20, null, null, 'center');

    doc.autoTable({
        startY: 40,
        head: [['Student Details', 'Value']],
        body: [
            ['First Name', studentDetails.first_name],
            ['Last Name', studentDetails.last_name],
            ['Department', studentDetails.department],
            ['Semester', studentDetails.semester],
        ],
        theme: 'grid',
    });

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Amount', 'Generated On', 'Due Date', 'Status']],
        body: [
            [
                `Rs.${amount}`,
                generatedOn.toLocaleDateString(),
                dueDate.toLocaleDateString(),
                status,
            ],
        ],
        theme: 'grid',
    });
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Bank Details', 'Value']],
        body: [
            ['Account Name', 'FAST NUCES'],
            ['Account Number', '123-456-789'],
            ['Bank Name', 'JS Bank'],
            ['IBAN', 'XYZB1234567890'],
            ['Branch', 'Main Branch, City'],
        ],
        theme: 'grid',
    });
    doc.save(`Fee_Challan_${studentId}.pdf`);
}

// Trigger fee calculation on page load
calculateAndInsertFee();

// Back to Student Portal Function
function goToStudentPortal() {
    window.location.href = 'student.html'; // Update with actual portal link
}