// Select the necessary elements
const loginButton = document.getElementById('submitLogin'); // Login button
const form = document.getElementById('loginForm'); // Login form
const errorMessage = document.getElementById('errorMessage'); // Error message element

// Login function with custom error message
loginButton.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple login validation (for demonstration purposes)
    if (username === 'faculty' && password === 'fac123') {
        sessionStorage.setItem('isLoggedIn', 'true');
        // Hide login form, show student dashboard, and toggle button
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('facultyDashboard').style.display = 'block';
        document.getElementById('toggleSidebar').style.display = 'block';
        errorMessage.style.display = 'none'; // Hide error message

        // Start letter-by-letter animation after login
        setTimeout(() => {
            const welcomeText = document.getElementById('welcomeText');
            welcomeText.style.visibility = 'visible'; // Show welcome text
        }, 500);

    } else {
        // Show custom error message
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
    document.getElementById('facultyDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('toggleSidebar').style.display = 'none';
    window.location.href = 'mainpage.html';
}
