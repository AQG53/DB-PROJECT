// Select the necessary elements
const loginButton = document.getElementById('submitLogin'); // Login button
const form = document.getElementById('loginForm'); // Login form
const errorMessage = document.getElementById('errorMessage'); // Error message element
const usernameInput = document.getElementById('username'); // Username input field
const passwordInput = document.getElementById('password'); // Password input field

// Focus on password input as soon as username input changes
usernameInput.addEventListener('input', function () {
    passwordInput.focus(); // Automatically focus on the password field
});
// Login function with custom error message
loginButton.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple login validation (for demonstration purposes)
    if (username === 'faculty' && password === 'fac123') {
        sessionStorage.setItem('isLoggedIn', 'true');
        // Hide login form, show faculty dashboard, and toggle button
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('facultyDashboard').style.display = 'block';
        document.getElementById('toggleSidebar').style.display = 'block';
        errorMessage.style.display = 'none'; // Hide error message

        // Start letter-by-letter animation after login
        setTimeout(() => {
            const welcomeText = document.getElementById('welcomeText');
            welcomeText.style.visibility = 'visible'; // Show welcome text
            welcomeText.classList.add('typing-finished'); // Remove the typing cursor
        }, 500); // Delay of 500ms before showing the welcome message

    } else {
        // Show custom error message
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
    }
});

// Sidebar toggle button functionality
document.getElementById('toggleSidebar').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
});

// Placeholder function for navigation
function navigateTo(section) {
    if (section === 'course-management') {
        window.location.href = 'faculty_course.html';
    } else if (section === 'marks-management') {
        window.location.href = 'faculty_marks.html';
    } else {
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
