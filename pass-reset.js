// Initialize Supabase client directly with your project’s URL and API key
const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Extract the access token from the URL (needed for password reset)
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token'); // This token is part of the reset link

document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const resetMessage = document.getElementById('resetMessage');

    if (newPassword !== confirmPassword) {
        resetMessage.textContent = 'Passwords do not match. Please try again.';
        resetMessage.style.color = 'red';
        return;
    }

    // Perform password update with access token and new password
    const { error } = await supabase.auth.updateUser({
        access_token: accessToken,
        password: newPassword
    });

    if (error) {
        resetMessage.textContent = 'Error resetting password: ' + error.message;
        resetMessage.style.color = 'red';
    } else {
        resetMessage.textContent = 'Password reset successfully! You can now log in with your new password.';
        resetMessage.style.color = 'green';
    }
});
