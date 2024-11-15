// Initialize Supabase client
const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to generate a unique roll number
function generateRollNumber(batchInitial) {
    const currentYear = new Date().getFullYear().toString().slice(-2); // Last two digits of the current year
    const randomFourDigit = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${currentYear}${batchInitial}-${randomFourDigit}`; // Format: YYX-XXXX
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

// Event listener for the form submission
document.getElementById('studentRegistrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form values
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const bloodGroup = document.getElementById('blood_group').value;
    const cnic = document.getElementById('cnic').value;
    const countryCode = document.getElementById('country_code').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const campus = document.getElementById('campus').value;
    const degreeType = document.getElementById('degree_type').value;
    const department = document.getElementById('department').value;
    const batchYear = parseInt(document.getElementById('batch_year').value, 10);
    const enrollmentDate = document.getElementById('enrollment_date').value;
    const status = document.getElementById('status').value;
    const section = document.getElementById('section').value;
    const nationality = document.getElementById('nationality').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;

    // Generate roll number with campus initial (e.g., 'K' for Karachi, 'L' for Lahore)
    const batchInitial = campus[0].toUpperCase(); // First letter of campus name
    const rollNumber = generateRollNumber(batchInitial);

    // Create student data object
    const studentData = {
        roll_number: rollNumber,
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        gender: gender,
        blood_group: bloodGroup,
        cnic: cnic,
        country_code: countryCode,
        phone: phone,
        email: email,
        address: address,
        campus: campus,
        degree_type: degreeType,
        department: department,
        batch_year: batchYear,
        enrollment_date: enrollmentDate,
        status: status,
        section: section,
        nationality: nationality,
        country: country,
        city: city
    };

    // Insert student data into Supabase
    try {
        const { data, error } = await supabase.from('students').insert([studentData]);

        if (error) {
            console.error('Error inserting student:', error.message);
            alert('Error: ' + error.message);
            return;
        }

        // Show success notification
        showNotification(`Student registered successfully with Roll Number: ${rollNumber}`);
        document.getElementById('studentRegistrationForm').reset(); // Reset form after successful submission

    } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred.');
    }
});

   // Function to navigate back to the Admin Dashboard 
function goToAdminDashboard() {
  window.location.href = 'admin.html';
}