function login(role) {
    if (role === 'admin') {
        window.location.href = 'admin.html';  // Redirect to admin dashboard
    } 
    else if(role === 'student') {
        window.location.href = 'student.html';  
    }
    else if(role === 'faculty') {
        window.location.href = 'faculty.html';  
    }
}
