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

window.addEventListener('load', async () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // Check login state
    const facultyId = localStorage.getItem('facultyId'); // Get stored faculty ID
    const preloader = document.getElementById('preloader'); // Preloader element

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
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('facultyDashboard').style.display = 'block';
                const sidebar = document.querySelector('.sidebar');
                const toggleButton = document.getElementById('toggleSidebar');
                sidebar.classList.add('show'); // Open the sidebar
                toggleButton.classList.toggle('move-right');
                toggleButton.style.display = 'block';
            } else {
                // If data fetch fails, show the login form
                document.getElementById('facultyDashboard').style.display = 'none';
                document.getElementById('loginForm').style.display = 'block';
            }
        } catch (err) {
            console.error('Error fetching faculty data on reload:', err);
        }
    } else {
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
