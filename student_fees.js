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
let admissionFee=0 ;
let feeAmount=0 ;
let totalfees=0;
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
            if (registrationData.length === 0) {
                const noCoursesMessage = document.getElementById("noCoursesMessage");
                noCoursesMessage.style.display = "block"; // Make the message visible
                return; // Exit the function early
            }

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

        feeAmount = totalCreditHours * CREDIT_HOUR_FEE;
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
        if (studentData.semester === 1) {
            admissionFee = 30000; // Add admission fee for first semester
            totalfees= feeAmount + admissionFee;
        }
        else {
            totalfees=feeAmount;
        }
        console.log("first",feeAmount);
         
        // Insert new fee record
        const { data: insertedData, error: insertError } = await supabase
            .from('fees')
            .insert([
                {
                    roll_number: studentId,
                    amount: totalfees,
                    generatedOn: generatedOn,
                    dueOn: dueDate,
                    status: 'Pending',
                },
            ]);

        if (insertError) throw insertError;

        return {
            roll_number: studentId,
            amount: totalfees,
            generatedOn: generatedOn.toISOString(),
            dueOn: dueDate.toISOString(),
            status: 'Pending',
            feeAmount,
            admissionFee,
            totalfees
        };
    } catch (error) {
        console.error('Error calculating new fee:', error.message);
    }
}  
console.log("second",feeAmount);
console.log("second add",admissionFee);

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
        generatedOn= new Date(fee.generatedOn);
        dueOn=new Date(fee.dueOn);

        downloadUpdatedChallan(
            admissionFee,
            fee.amount, // Total fee amount
            studentData,
            generatedOn,
            dueOn,
            fee.status
        );
    } catch (error) {
        console.error('Error downloading challan:', error.message);
    }
}

function downloadUpdatedChallan(admissionFee, totalfees, studentDetails, generatedOn, dueDate, status) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('FEE CHALLAN', 105, 20, null, null, 'center');

    // Add student details
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

    // Add fee details
    const feeDetails = admissionFee > 0
        ? [
              [`Rs.${totalfees}`, `Rs.${admissionFee}`,generatedOn.toDateString(), dueDate.toDateString(), status],
          ]
        : [
              [`Rs.${totalfees}`, generatedOn.toDateString(), dueDate.toDateString(), status],
          ];

    const feeHeadings = admissionFee > 0
        ? ['Total Fee','Admission Fee', 'Generated On', 'Due Date', 'Status']
        : ['Total Fee', 'Generated On', 'Due Date', 'Status'];

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [feeHeadings],
        body: feeDetails,
        theme: 'grid',
    });

    // Add bank details
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