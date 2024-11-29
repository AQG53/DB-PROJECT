const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const preloader = document.getElementById('preloader');
preloader.style.display = 'none';

// Select the necessary elements
const loginButton = document.getElementById('submitLogin'); // Login button
const form = document.getElementById('loginForm'); // Login form
const errorMessage = document.getElementById('errorMessage'); // Error message element
const usernameInput = document.getElementById('username'); // Username input field
const passwordInput = document.getElementById('password'); // Password input field
const forgotPasswordLink = document.getElementById('forgotPasswordLink'); // Forgot password link
const passwordRecoveryForm = document.getElementById('passwordRecoveryForm'); // Password recovery form
const recoveryEmailInput = document.getElementById('recoveryEmail'); // Recovery email input
const submitRecoveryButton = document.getElementById('submitRecovery'); // Submit recovery button
const recoveryMessage = document.getElementById('recoveryMessage'); // Recovery message element
const otpVerificationForm = document.getElementById('otpVerificationForm');
const otpInput = document.getElementById('otpInput');
const submitOTPButton = document.getElementById('submitOTP');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const newPasswordInput = document.getElementById('newPassword');
const submitNewPasswordButton = document.getElementById('submitNewPassword');

// Login function with custom error message
loginButton.addEventListener('click', async function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username, password);
    try {
        const { data, error } = await supabase
            .from('faculty') // Replace 'students' with the name of your table
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !data) {
            // Show custom error message if credentials do not match
            errorMessage.style.display = 'block';
        } else {
            sessionStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('facultyId', data.id);
            populateFacultyDashboard(data);
            
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('facultyDashboard').style.display = 'block';

            const sidebar = document.querySelector('.sidebar');
            const toggleButton = document.getElementById('toggleSidebar');
            sidebar.classList.add('show'); // Open the sidebar
            toggleButton.classList.toggle('move-right');
            toggleButton.style.display = 'block'; 
            errorMessage.style.display = 'none';
            
        }
    } catch (err) {
        console.error('Error logging in:', err);
        errorMessage.style.display = 'block';
    }
});

forgotPasswordLink.addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    passwordRecoveryForm.style.display = 'block';
});

// Handle password recovery submission
submitRecoveryButton.addEventListener('click', async function() {
    const email = recoveryEmailInput.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        showNotification("Please enter a valid email address.");
        return;
    }
    console.log(email);

    try {
        const { data, error } = await supabase
            .from('faculty')  // Check the 'faculty' table
            .select('email')  // Select the email column
            .eq('email', email) // Match email with the entered one
            .single(); // Get only one row

        if (error || !data) {
            // If email doesn't exist or there was an error
            showNotification("No faculty account found with this email.");
            return;
        }
        const response = await fetch('http://localhost:3000/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            alert(errorMessage);
            return;
        }
        showNotification('OPT has been sent on your registered email. Its valid only for 5 minutes.')
        passwordRecoveryForm.style.display = 'none';
        otpVerificationForm.style.display = 'block';
    } catch (error) {
        console.error('Error sending OTP:', error);
    }

});

submitOTPButton.addEventListener('click', async function() {
    preloader.style.display='flex';
    const otpEntered = otpInput.value;
    const email = recoveryEmailInput.value;
    try {
        const response = await fetch('http://localhost:3000/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otpEntered})
        });

        if (!response.ok) {
            preloader.style.display='none';
            showNotification('Invalid or Expired OTP!');
            return;
        }
        preloader.style.display='none';
        otpVerificationForm.style.display = 'none';
        resetPasswordForm.style.display = 'block';
    } catch (error) {
        console.error('Error verifying OTP or resetting password:', error);
    }
});

submitNewPasswordButton.addEventListener('click', async function() {
    preloader.style.display='flex';
    const email = recoveryEmailInput.value;
    const newPassword = newPasswordInput.value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    console.log(email, newPassword, confirmNewPassword);
    if (newPassword !== confirmNewPassword) {
        preloader.style.display='none';
        showNotification("Passwords do not match. Please try again.");
        return;
    }

    try {
        const { data, error } = await supabase
            .from('faculty') // The table name
            .update({ password: newPassword }) // Update the password column
            .eq('email', email); // Match by email

        if (error) {
            console.error('Error updating password:', error.message);
            return res.status(500).send('Failed to update password');
        }
        preloader.style.display='none';
        showNotification('Password Reset Successfully!')
        resetPasswordForm.style.display = 'none';
        form.style.display = 'block';
    } catch (error) {
        console.error('Error resetting password:', error);
    }
})

window.addEventListener('load', async () => {
    preloader.style.display='flex';
    const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // Check login state
    const facultyId = localStorage.getItem('facultyId'); // Get stored faculty ID

    if (isLoggedIn && facultyId) {
        try {
            // Fetch faculty data based on stored faculty ID
            const { data, error } = await supabase
                .from('faculty')
                .select('*')
                .eq('id', facultyId)
                .single();

            if (!error && data) {
                // Populate the dashboard with faculty data
                populateFacultyDashboard(data);

                // Show the dashboard
                preloader.style.display='none';
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('facultyDashboard').style.display = 'block';
                const sidebar = document.querySelector('.sidebar');
                const toggleButton = document.getElementById('toggleSidebar');
                sidebar.classList.add('show'); // Open the sidebar
                toggleButton.classList.toggle('move-right');
                toggleButton.style.display = 'block';
            } else {
                preloader.style.display='none';
                // If data fetch fails, show the login form
                document.getElementById('facultyDashboard').style.display = 'none';
                document.getElementById('loginForm').style.display = 'block';
            }
        } catch (err) {
            preloader.style.display='none';
            console.error('Error fetching faculty data on reload:', err);
        }
    } else {
        preloader.style.display='none';
        // Redirect to login form if not logged in
        document.getElementById('facultyDashboard').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    }

    // Hide the preloader after loading
    preloader.style.display = 'none';
});


function populateFacultyDashboard(data) {
    // Format and Display Welcome Message
    const firstName = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1).toLowerCase();
    const lastName = data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1).toLowerCase();
    const fullName = `${data.title} ${firstName} ${lastName}`;
    document.getElementById('welcomeMessage').textContent = `Welcome! ${fullName}`;

    // Populate Personal Information
    document.getElementById('fullName').textContent = fullName;
    document.getElementById('email').textContent = data.email;
    document.getElementById('phone').textContent = data.phone;

    // Populate Professional Information
    document.getElementById('department').textContent = data.department;
    document.getElementById('specialization').textContent = data.specialization;
    document.getElementById('designation').textContent = data.designation;
    document.getElementById('role').textContent = data.role;

    // Populate Employment Details
    document.getElementById('employmentType').textContent = data.employment_type;
}


// Sidebar toggle button functionality
document.getElementById('toggleSidebar').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('toggleSidebar');

    sidebar.classList.toggle('show');
    toggleButton.classList.toggle('move-right'); // Move the button to the right
})

// Placeholder function for navigation
function navigateTo(section) {
    if (section === 'course-management') {
        window.location.href = 'faculty_course.html';
    } else if (section === 'marks-management') {
        window.location.href = 'faculty_marks.html';
    }
    else if (section === 'grades-management') {
        window.location.href = 'faculty_grades.html';
    }
    else if (section === 'attendance-management') {
        window.location.href = 'faculty_attendance.html';
    }
     else {
        alert('Navigating to ' + section);
    }
}
form.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Check if the pressed key is Enter
        event.preventDefault(); // Prevent default form submission behavior
        loginButton.click(); // Trigger the login button click action
    }
});
// Logout function
function logout() {
    sessionStorage.removeItem('isLoggedIn'); // Clear login state
    localStorage.removeItem('facultyId'); // Clear faculty ID
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('show'); // Close the sidebar
    document.getElementById('facultyDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('toggleSidebar').style.display = 'none';
    window.location.href = 'mainpage.html';
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
