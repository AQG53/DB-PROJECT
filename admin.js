(function () {
    // Supabase client initialization
    const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Select necessary elements
    const loginButton = document.getElementById('submitLogin'); // Login button
    const form = document.getElementById('loginForm'); // Login form
    const errorMessage = document.getElementById('errorMessage'); // Error message element
    const forgotPasswordLink = document.getElementById('forgotPasswordLink'); // Forgot password link
    const passwordRecoveryForm = document.getElementById('passwordRecoveryForm'); // Password recovery form
    const recoveryEmailInput = document.getElementById('recoveryEmail'); // Recovery email input
    const submitRecoveryButton = document.getElementById('submitRecovery'); // Submit recovery button
    const recoveryMessage = document.getElementById('recoveryMessage'); // Recovery message element

    form.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { // Check if the pressed key is Enter
            event.preventDefault(); // Prevent default form submission behavior
            loginButton.click(); // Trigger the login button click action
        }
    });
    
    const sidebar = document.querySelector('.sidebar'); // Sidebar element
    const toggleSidebarButton = document.getElementById('toggleSidebar'); // Sidebar toggle button

    // Show password recovery form when "Forgot Password" is clicked
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        passwordRecoveryForm.style.display = 'block';
    });

    // Handle password recovery submission
    submitRecoveryButton.addEventListener('click', async function() {
        const email = recoveryEmailInput.value;
 
        // Use Supabase to send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            recoveryMessage.textContent = 'Error sending reset email: ' + error.message;
            recoveryMessage.style.color = 'red';
        } else {
            recoveryMessage.textContent = 'Password reset email sent! Check your inbox.';
            recoveryMessage.style.color = 'green';
        }
    });

    // Login function with Supabase authentication
    loginButton.addEventListener('click', async function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Use Supabase to authenticate user with email and password
            const { data: user, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Show custom error message if authentication fails
                errorMessage.textContent = 'Login failed: ' + error.message;
                errorMessage.style.display = 'block';
                return;
            }

            // Check if user has an admin role
            const { data: profile, error: roleError } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('user_id', user.user.id)
                .single();

            if (roleError || !profile || profile.role !== 'admin') {
                await supabase.auth.signOut();
                errorMessage.textContent = 'Access denied: Not an admin';
                errorMessage.style.display = 'block';
                return;
            }

            // Save login state in session storage
            sessionStorage.setItem('isLoggedIn', 'true');

            // Hide login form, show dashboard, and toggle button
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            toggleSidebarButton.style.display = 'block';
            errorMessage.style.display = 'none'; // Hide error message

            // Start letter-by-letter animation after login
            setTimeout(() => {
                const welcomeText = document.getElementById('welcomeText');
                welcomeText.style.visibility = 'visible'; // Show welcome text
            }, 500);

        } catch (error) {
            // Show error message if something went wrong
            errorMessage.textContent = 'An error occurred: ' + error.message;
            errorMessage.style.display = 'block';
        }
    });

    // Sidebar toggle button functionality
    toggleSidebarButton.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });

    // Persist login state on page load
    window.addEventListener('load', () => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            toggleSidebarButton.style.display = 'block';
        }
    });

    // Logout function with Supabase sign-out
    async function logout() {
        sessionStorage.removeItem('isLoggedIn'); // Clear login state
        const { error } = await supabase.auth.signOut(); // Sign out from Supabase

        if (error) {
            console.error("Error signing out from Supabase:", error.message);
            return;
        }

        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        toggleSidebarButton.style.display = 'none';
        window.location.href = 'mainpage.html';
    }

    window.logout = logout; // Attach logout function globally
    function navigateTo(page) {
        switch (page) {
          case 'student-management':
            window.location.href = 'stdreg.html';
            break;
          case 'faculty-management':
            // Add navigation link for faculty management
            window.location.href = 'facultyreg.html'; // Example page for faculty registration
            break;
          case 'course-management':
            // Add navigation link for course management
            window.location.href = 'coursereg.html'; // Example page for course registration
            break;
          case 'fee-management':
            alert("Fee management is not implemented yet.");
            break;
          case 'GPA-management':
            alert("GPA management is not implemented yet.");
            break;
          case 'attendance-management':
            alert("Attendance management is not implemented yet.");
            break;
          case 'notification-management':
            alert("Notification management is not implemented yet.");
            break;
          default:
            alert("Page not found.");
        }
      }
      window.navigateTo = navigateTo; 
})();
