function login(role) {
    if (role === 'admin') {
        window.location.href = 'admin.html';  // Redirect to admin dashboard
    } else {
        alert(role + ' login button clicked.');
        // Add logic for student and faculty login
    }
}
