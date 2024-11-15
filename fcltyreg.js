//fcltyreg.js

document.addEventListener("DOMContentLoaded", () => {
  const facultyForm = document.getElementById("facultyForm");

  facultyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Faculty member registered successfully!");
    facultyForm.reset();
  });
});
