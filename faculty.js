const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Select the necessary elements
const loginButton = document.getElementById('submitLogin'); // Login button
const form = document.getElementById('loginForm'); // Login form
const errorMessage = document.getElementById('errorMessage'); // Error message element
const usernameInput = document.getElementById('username'); // Username input field
const passwordInput = document.getElementById('password'); // Password input field

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
            // Successful login
            sessionStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('facultyId', data.id); // Optionally store student ID

            // Hide login form, show student dashboard, and toggle button
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('facultyDashboard').style.display = 'block';
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
        // Ensure the dashboard and sidebar are shown after a refresh
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('facultyDashboard').style.display = 'block';
        document.getElementById('toggleSidebar').style.display = 'block';

        // Start letter-by-letter animation after page load
        const welcomeText = document.getElementById('welcomeText');
        setTimeout(() => {
            welcomeText.style.visibility = 'visible'; // Show welcome text
            welcomeText.classList.add('typing-finished'); // Finish the typing animation
        }, 500); // Delay of 500ms after login state is validated
    } else {
        // If not logged in, show the login form and hide the dashboard
        document.getElementById('facultyDashboard').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('toggleSidebar').style.display = 'none';
        document.querySelector('.sidebar').style.display = 'block';
    }
});

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
    document.getElementById('facultyDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('toggleSidebar').style.display = 'none';
    window.location.href = 'mainpage.html';
}
