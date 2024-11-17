const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

// Select the necessary elements
const loginButton = document.getElementById('submitLogin'); // Login button
const form = document.getElementById('loginForm'); // Login form
const errorMessage = document.getElementById('errorMessage'); // Error message element
const rollnumberInput = document.getElementById('rollnumber'); // Username input field
const passwordInput = document.getElementById('password'); // Password input field

// Login function with custom error message
loginButton.addEventListener('click', async function() {
    const rollnumber = document.getElementById('rollnumber').value;
    const password = document.getElementById('password').value;
    console.log(rollnumber, password);
    try {
        const { data, error } = await supabase
            .from('students') // Replace 'students' with the name of your table
            .select('*')
            .eq('roll_number', rollnumber)
            .eq('password', password)
            .single();

        if (error || !data) {
            // Show custom error message if credentials do not match
            errorMessage.style.display = 'block';
        } else {
            // Successful login
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('studentId', data.id); // Optionally store student ID

            // Hide login form, show student dashboard, and toggle button
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('studentDashboard').style.display = 'block';
            document.getElementById('toggleSidebar').style.display = 'block';
            errorMessage.style.display = 'none';

            // Show welcome text
            setTimeout(() => {
                const welcomeText = document.getElementById('welcomeText');
                welcomeText.style.visibility = 'visible';
            }, 500);
        }
    } catch (err) {
        console.error('Error logging in:', err);
        errorMessage.style.display = 'block';
    }
});
 
window.addEventListener('load', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('studentDashboard').style.display = 'block';
        document.getElementById('toggleSidebar').style.display = 'block';
    }
});

// Handle the Enter key press inside the form (Submit with Enter)
form.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Check if the pressed key is Enter
        event.preventDefault(); // Prevent default form submission behavior
        loginButton.click(); // Trigger the login button click action
    }
});

// Sidebar toggle button functionality
document.getElementById('toggleSidebar').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
});

// Placeholder function for navigation
function navigateTo(section) {
    alert('Navigating to ' + section);
}

// Logout function
function logout() {
    sessionStorage.removeItem('isLoggedIn'); // Clear login state
    document.getElementById('studentDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('toggleSidebar').style.display = 'none';
    window.location.href = 'mainpage.html';
}

 // Start letter-by-letter animation after login
 setTimeout(() => {
    const welcomeText = document.getElementById('welcomeText');
    welcomeText.style.visibility = 'visible'; // Show welcome text
    welcomeText.classList.add('typing-finished'); // Stop typing cursor
}, 500);

// Placeholder function for navigation
function navigateTo(section) {
    if (section === 'course-management') {
        window.location.href = 'student_course.html'; // Redirect to course registration page
    }
    else if (section === 'marks-management') {
        window.location.href = 'student_marks.html'; // Redirect to course registration page
    }
    else if (section === 'attendance-management') {
        window.location.href = 'student_attendance.html'; // Redirect to course registration page
    }
    else if (section === 'transcript-management') {
        window.location.href = 'student_transcript.html'; // Redirect to course registration page
    }
    else if (section === 'coursewithdraw-management') {
        window.location.href = 'student_cwithdraw.html'; // Redirect to course registration page
    }
    else if (section === 'fee-management') {
        window.location.href = 'student_fees.html'; // Redirect to course registration page
    }
    else if (section === 'grade change request') {
        window.location.href = 'student_gcr.html'; // Redirect to course registration page
    }
     else {
        alert('Navigating to ' + section); // Keep other navigations as alerts for now
    }
}
