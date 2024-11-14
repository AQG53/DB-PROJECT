// script.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("studentForm");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Student registered successfully!");
      form.reset();
    });
  });
  