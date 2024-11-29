const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const preloader = document.getElementById('preloader');
preloader.style.display = 'none';

function formatRollNumber(input) {
  let value = input.value.toUpperCase(); // Convert input to uppercase for alphabet
  let formattedValue = '';

  // Enforce the input pattern step-by-step
  for (let i = 0; i < value.length; i++) {
      const char = value[i];

      if (i === 0 || i === 1) {
          // First two characters: Numbers only
          if (/\d/.test(char)) {
              formattedValue += char;
          } else {
              break; // Stop processing if invalid
          }
      } else if (i === 2) {
          // Third character: Alphabet only
          if (/[A-Z]/.test(char)) {
              formattedValue += char;
              formattedValue += '-';
          } else {
              break; // Stop processing if invalid
          }
      } else if (i > 3 && i < 8) {
          // Last four characters: Numbers only
          if (/\d/.test(char)) {
              formattedValue += char;
          } else {
              break; // Stop processing if invalid
          }
      }
  }

  // Limit to the correct length and set the formatted value
  input.value = formattedValue.slice(0, 8);
}

function capitalize(str) {
  if (!str) return ""; // Handle null or undefined values
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    // Simulate a click on the #fetch-courses button when Enter is pressed
    viewPaymentRecords();
  }
});

async function viewPaymentRecords() {
  const rollNumber = document.getElementById("rollNumber").value.trim();
CREDIT_HOUR_FEE=10750;
  if (!rollNumber) {
    alert("Please enter a roll number.");
    return;
  }
  
  // Function to display the "Invalid Student" message and hide it after 10 seconds
  function showInvalidStudentMessage() {
    const invalidStudentMessage = document.getElementById("invalidStudent");
    invalidStudentMessage.style.display = "block"; // Show the message
  
    // Hide it after 10 seconds
    setTimeout(() => {
      invalidStudentMessage.style.display = "none";
    }, 10000); // 10 seconds
  }
  function showNewFeeRecordMessage() {
    const newFeeRecordMessage = document.getElementById("newFeeRecord");
    newFeeRecordMessage.style.display = "block"; // Show the message
  
    // Hide it after 10 seconds
    setTimeout(() => {
      newFeeRecordMessage.style.display = "none";
    }, 10000); // 10 seconds
  }
  // Check fees table
  const { data: feeRecords, error: feeError } = await supabase
    .from('fees')
    .select('*')
    .eq('roll_number', rollNumber);

  if (feeError) {
    console.error(feeError);
    alert("Error fetching fee records.");
    return;
  }

  if (feeRecords.length > 0) {
    displayPaymentRecords(rollNumber, feeRecords);
    return;
  }

  // Check students table
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('roll_number', rollNumber)
    .single();

  if (studentError || !studentData) {
    showNotification("No student found with that roll number!");
    document.getElementById("paymentDetails").style.display = "none";
    document.getElementById("newFeeRecord").style.display = "none";
    return;
  }

  // Show new fee record option
  showNewFeeRecordMessage();
   document.getElementById("paymentDetails").style.display = "none";
}

function editFeeDetails(feeId, currentAmount, currentDueDate) {

  const editSection = document.getElementById("editFeeSection");
  editSection.style.display = "block";

  document.getElementById("editAmount").value = currentAmount;
  document.getElementById("editDueDate").value = currentDueDate;
  console.log(currentAmount, currentDueDate);

  const saveButton = document.getElementById("saveFeeDetails");
  saveButton.onclick = async () => {
    preloader.style.display = 'flex';
    const newAmount = document.getElementById("editAmount").value;
    const newDueDate = document.getElementById("editDueDate").value;

    if (newAmount !== currentAmount || newDueDate !== currentDueDate) {
        try {
            const { data, error } = await supabase
                .from('fees')
                .update({ amount: newAmount, dueOn: newDueDate })
                .eq('id', feeId)
                .select(); // Ensure to retrieve updated data

            if (error) {
              preloader.style.display = 'none';
                console.error("Error updating fee details:", error);
                alert("Failed to update fee details.");
                return;
            }

            if (!data || data.length === 0) {
              preloader.style.display = 'none';
                console.error("No record updated. Please check the fee ID.");
                alert("No record updated. Please check the fee ID.");
                return;
            }

            showNotification('Fee details updated successfully!');
            document.getElementById("editFeeSection").style.display = "none";
            viewPaymentRecords(); // Refresh the records
          } catch (err) {
            preloader.style.display = 'none';
              console.error("Error saving fee details:", err.message);
          }
      } else {
        preloader.style.display = 'none';
          alert("No changes made to the fee details.");
      }
  };
}


async function displayPaymentRecords(rollNumber, records) {
  preloader.style.display = 'flex';
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .select('first_name, last_name')
    .eq('roll_number', rollNumber)
    .single();

  if (studentError || !studentData) {
    preloader.style.display = 'none';
    console.error("Error fetching student details:", studentError);
    showNotification("Error fetching student details.");
    return;
  }

  const fullName = `${capitalize(studentData.first_name)} ${capitalize(studentData.last_name)}`;
  document.getElementById("paymentDetails").style.display = "block";
  document.getElementById("paymentRollNumber").textContent = rollNumber;
  document.getElementById("paymentStudentName").textContent = `Name: ${fullName}`;

  const paymentTable = document.getElementById("paymentTable");
  paymentTable.innerHTML = ""; // Clear previous records

  records.forEach(record => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.roll_number}</td>
      <td>Rs.${record.amount}</td>
      <td>Rs.${record.amount_paid || 0}</td>
      <td>Rs.${record.amount - (record.amount_paid || 0)}</td>
      <td>${new Date(record.generatedOn).toLocaleDateString()}</td>
      <td>${new Date(record.dueOn).toLocaleDateString()}</td>
      <td>${record.status}</td>
      <td>
        <button onclick="editFeeDetails('${record.id}', '${record.amount}', '${record.dueOn}')">Edit</button>
      </td>
    `;
    paymentTable.appendChild(row);
    preloader.style.display = 'none';
  });
}

async function calculateAndInsertFee() {
  const rollNumber = document.getElementById("rollNumber").value.trim();

  try {
    const newFee = await calculateNewFee(rollNumber);
    if (newFee) {
      document.getElementById("inserted");
      inserted.style.display = "block";
      setTimeout(() => {
        inserted.style.display = "none";
      }, 3000);
      resetForm();
    }
  } catch (error) {
    console.error(error);
    document.getElementById("notinserted");
    notinserted.style.display = "block";
    setTimeout(() => {
      notinserted.style.display = "none";
    }, 3000);

    resetForm();
  }
}
async function calculateNewFee(studentId, semester) {
  preloader.style.display = 'flex';
  try {
      // Fetch registered courses
      const { data: registrationData, error: regError } = await supabase
          .from("student_registration")
          .select("course_id")
          .eq("student_id", studentId);

          if (registrationData.length === 0) {
            preloader.style.display = 'none';
            document.getElementById("noCoursesMessage");
            showNotification("No course found for this student!");
            resetForm(); // Reset the form
            return; // Exit the function early
          }
      if (regError) {preloader.style.display = 'none'; throw regError};
      const courseIds = registrationData.map((row) => row.course_id);

      // Fetch credit hours for courses
      const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("credit_hours")
          .in("course_code", courseIds);

      if (coursesError){
        preloader.style.display = 'none';
        throw coursesError;
      } 


      const totalCreditHours = coursesData.reduce((sum, course) => {
          const [lectureHours, practicalHours] = course.credit_hours
              .split("+")
              .map((hour) => parseInt(hour, 10));
          return sum + lectureHours + practicalHours;
      }, 0);
      const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("semester")
          .eq("roll_number", studentId)
          .single(); // Fetch a single record

      if (studentError) {preloader.style.display = 'none'; throw studentError};

      const semester = studentData.semester;
      const feeAmount = totalCreditHours * CREDIT_HOUR_FEE;
      const admissionFee = semester === 1 ? 30000 : 0;
      const totalFees = feeAmount + admissionFee;

      const generatedOn = new Date();
      const dueDate = new Date();
      dueDate.setDate(generatedOn.getDate() + 45);

      // Insert new fee record
      const { data: insertedData, error: insertError } = await supabase
          .from("fees")
          .insert([
              {
                  roll_number: studentId,
                  amount: totalFees,
                  generatedOn: generatedOn.toISOString(),
                  dueOn: dueDate.toISOString(),
                  status: "Pending",
              },
          ]);

      if (insertError) {preloader.style.display = 'none'; throw insertError};
      const { data: feeRecords, error: feeError } = await supabase
          .from('fees')
          .select('*')
          .eq('roll_number', studentId);

      if (feeError) {
        preloader.style.display = 'none';
          console.error(feeError);
          alert("Error fetching fee records.");
          return;
      }
      preloader.style.display = 'none';
      showNotification("New fees record has been added successfully!");
      return {
          roll_number: studentId,
          amount: totalFees,
          generatedOn: generatedOn.toISOString(),
          dueOn: dueDate.toISOString(),
          status: "Pending",
      };
  } catch (error) {
    preloader.style.display = 'none';
      console.error("Error calculating new fee:", error.message);
  }

}

function resetForm() {
  document.getElementById("paymentDetails").style.display = "none";
  document.getElementById("newFeeRecord").style.display = "none";
  document.getElementById("invalidStudent").style.display = "none";
  document.getElementById("paymentRecordsForm").reset();
}

function goBack() {
  window.location.href = "admin.html";
}

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

// Function to close notification
function closeNotification() {
  const notification = document.getElementById('notification');
  notification.classList.remove('show'); // Hide notification smoothly
}