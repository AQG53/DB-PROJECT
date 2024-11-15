
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("studentForm");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Student registered successfully!");
      form.reset();
    });
  });
   // Function to navigate back to the Admin Dashboard 
function goToAdminDashboard() {
  window.location.href = 'admin.html';
}