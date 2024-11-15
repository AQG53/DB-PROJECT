// Select the necessary elements
const loginButton = document.getElementById('submitLogin'); // Login button
const form = document.getElementById('loginForm'); // Login form
const errorMessage = document.getElementById('errorMessage'); // Error message element

// Login function with custom error message
loginButton.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple login validation (for demonstration purposes)
    if (username === 'student' && password === 'student123') {
        sessionStorage.setItem('isLoggedIn', 'true');

        // Hide login form, show student dashboard, and toggle button
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('studentDashboard').style.display = 'block';
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
    document.getElementById('studentDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('toggleSidebar').style.display = 'none';
    window.location.href = 'mainpage.html';
}
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
