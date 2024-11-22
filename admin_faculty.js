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

document.getElementById('facultyRegistrationForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("Form submitted");
  const title = document.getElementById('title').value;
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const department_name = document.getElementById('department').value;
  const specialization = document.getElementById('specialization').value;
  const qualification = document.getElementById('qualification').value;
  const employmentType = document.getElementById('employmentType').value;
  const countryCode = document.getElementById('countryCode').value;
  const phone = document.getElementById('phone').value.trim();
  const salary = document.getElementById('salary').value;
  const designation = document.getElementById('designation').value;
  const role = document.getElementById('role').value;
  const password = document.getElementById('password').value;
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;

  try {
    const { data: departmentData, error: departmentError } = await supabase
      .from('departments')
      .select('id, name')
      .eq('name', department_name)
      .single();

    const department_id = departmentData.id;

    // Proceed to insert the faculty member with the valid department ID
    const { data, error } = await supabase.from('faculty').insert([
      {
        title,
        first_name: firstName,
        last_name: lastName,
        email,
        department_id, // Use valid department ID
        department_name, // Optional: Save name for reference
        specialization,
        qualification,
        employment_type: employmentType,
        phone: `${countryCode}${phone}`,
        salary,
        designation,
        role,
        username,
        password,
      }
    ]);

    if (error) {
      console.error('Supabase insertion error:', error.message);
      alert('Error: ' + error.message);
      return;
    }

    // Send email via backend
    await fetch('http://localhost:3000/send-email-faculty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });

    console.log('Faculty registered successfully:', data);
    showNotification(`Faculty registered successfully!`);
    document.getElementById('facultyRegistrationForm').reset();
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred.");
  }
});

 // Function to navigate back to the Admin Dashboard 
 function goToAdminDashboard() {
  window.location.href = 'admin.html';
}
// Define specializations for each department
const specializationOptions = {
  "Computer Science": [
    "Data Science",
    "Cybersecurity",
    "Networking and Cloud Computing",
    "Game Development",
    "Human-Computer Interaction"
  ],
  "Electrical Engineering": [
    "Power Systems",
    "Control Systems",
    "Electronics",
    "Telecommunication Engineering",
    "Signal Processing"
  ],
  "Business Analytics": [
    "Data Analysis",
    "Financial Modeling",
    "Predictive Analytics",
    "Operations Research",
    "Business Intelligence"
  ],
  "Software Engineering": [
    "Agile Development",
    "Software Testing and Quality Assurance",
    "Full Stack Development",
    "Microservices Architecture",
    "DevOps"
  ],
  "Artificial Intelligence": [
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Reinforcement Learning",
    "Robotics"
  ]
};

// Handle department change to populate specializations
const departmentSelect = document.getElementById("department");
const specializationSelect = document.getElementById("specialization");

departmentSelect.addEventListener("change", function () {
  const selectedDepartment = departmentSelect.value;
  
  // Clear existing specialization options
  specializationSelect.innerHTML = '<option value="">Select Specialization</option>';

  // Populate specialization options based on department
  if (specializationOptions[selectedDepartment]) {
    specializationOptions[selectedDepartment].forEach(specialization => {
      const option = document.createElement("option");
      option.value = specialization;
      option.textContent = specialization;
      specializationSelect.appendChild(option);
    });
  }
});
