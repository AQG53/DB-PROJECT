// Login function
document.getElementById('submitLogin').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple login validation (replace with real authentication)
    if (username === 'admin' && password === 'password123') {
        // Hide login form and show dashboard
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        document.getElementById('toggleSidebar').style.display = 'block'; // Show the toggle button
    } else {
        alert('Invalid username or password!');
    }
});

// Logout function
function logout() {
    // Hide dashboard and show login form on logout
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('toggleSidebar').style.display = 'none'; // Hide toggle button
}

// Function to navigate to different dashboard sections
function navigateTo(section) {
    alert('Navigating to ' + section);
    // Add logic for dynamic section loading if needed
}

// Sidebar toggle function
document.getElementById('toggleSidebar').addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar');
    
    // Toggle the sidebar visibility
    sidebar.classList.toggle('show');
    
    // Optional: If needed, you can handle sidebar movement via the 'left' property
    if (sidebar.classList.contains('show')) {
        sidebar.style.left = '0'; // Show sidebar
    } else {
        sidebar.style.left = '-250px'; // Hide sidebar
    }
});
