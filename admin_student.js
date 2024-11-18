// Initialize Supabase client
const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePasswordIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Show password
        toggleIcon.src = 'view.png'; // Change icon to "hide" icon
    } else {
        passwordInput.type = 'password'; // Hide password
        toggleIcon.src = 'hide.png'; // Change icon to "view" icon
    }
}

function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
  }
  document.getElementById('password').value = password; // Set the generated password
}

async function getNextRollNumber(batchInitial) {
  const currentYear = new Date().getFullYear().toString().slice(-2); // Last two digits of the year
  // Fetch the most recent roll number
  const { data, error } = await supabase
      .from('students')
      .select('roll_number')
      .order('roll_number', { ascending: false })
      .limit(1);

  if (error) {
      console.error('Error fetching last roll number:', error.message);
      return `${currentYear}${batchInitial}-1001`; // Default to the first roll number
  }

  if (data.length === 0) {
      return `${currentYear}${batchInitial}-1001`; // No existing roll numbers
  }

  // Extract the numeric part of the last roll number
  const lastRollNumber = data[0].roll_number;
  const numericPart = parseInt(lastRollNumber.split('-')[1], 10);
  const nextNumericPart = numericPart + 1;

  
  return `${currentYear}${batchInitial}-${nextNumericPart}`; // Format: YYX-1001
}

// Function to show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    // Set message and show the notification
    notificationMessage.textContent = message;
    notification.classList.add('show');

    // Hide notification after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

// Function to close notification
function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show'); // Hide notification smoothly
}


document.getElementById('studentRegistrationForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent page refresh
  console.log("Form submitted");

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const bloodGroup = document.getElementById('blood-group').value;
  const cnic = document.getElementById('cnic').value;
  const countryCode = document.getElementById('countryCode').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const campus = document.getElementById('campus').value;
  const degreeType = document.getElementById('degree').value;
  const department = document.getElementById('department').value;
  const batchYear = parseInt(document.getElementById('batchYear').value, 10);
  const enrollmentDate = document.getElementById('enrollmentDate').value;
  const status = document.getElementById('status').value;
  const section = document.getElementById('section').value;
  const nationality = document.getElementById('nationality').value;
  const country = document.getElementById('country').value;
  const city = document.getElementById('city').value;
  const password = document.getElementById('password').value;

  const batchInitial = campus[0].toUpperCase();
  const rollNumber = await getNextRollNumber(batchInitial);

  console.log("Generated roll number:", rollNumber);

  const studentData = {
      roll_number: rollNumber,
      first_name: firstName,
      last_name: lastName,
      dob,
      gender,
      blood_group: bloodGroup,
      cnic,
      phone: '${countryCode}${phone}',
      email,
      address,
      campus,
      degree_type: degreeType,
      department,
      batch_year: batchYear,
      enrollment_date: enrollmentDate,
      status,
      section,
      nationality,
      country,
      city,
      password,
  };

  try {
      const { data, error } = await supabase.from('students').insert([studentData]);
      if (error) {
          console.error('Supabase insertion error:', error.message);
          alert('Error: ' + error.message);
          return;
      }
      
      // Send email via backend
      await fetch('http://localhost:3000/send-email-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            username: rollNumber,
            password,
        }),
    });

      console.log('Student registered successfully:', data);
      showNotification(`Student registered successfully! Roll Number: ${rollNumber}`);
      document.getElementById('studentRegistrationForm').reset();
  } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
  }
});

   // Function to navigate back to the Admin Dashboard 
function goToAdminDashboard() {
  window.location.href = 'admin.html';
}