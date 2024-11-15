//fcltyreg.js

document.addEventListener("DOMContentLoaded", () => {
  const facultyForm = document.getElementById("facultyForm");

  facultyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Faculty member registered successfully!");
    facultyForm.reset();
  });
});
 // Function to navigate back to the Admin Dashboard 
 function goToAdminDashboard() {
  window.location.href = 'admin.html';
}
// Define specializations for each department
const specializationOptions = {
  "Computer Science": [
    "Data Science",
    "Cybersecurity",
    "Networking and Cloud Computing",
    "Game Development",
    "Human-Computer Interaction"
  ],
  "Electrical Engineering": [
    "Power Systems",
    "Control Systems",
    "Electronics",
    "Telecommunication Engineering",
    "Signal Processing"
  ],
  "Business Analytics": [
    "Data Analysis",
    "Financial Modeling",
    "Predictive Analytics",
    "Operations Research",
    "Business Intelligence"
  ],
  "Software Engineering": [
    "Agile Development",
    "Software Testing and Quality Assurance",
    "Full Stack Development",
    "Microservices Architecture",
    "DevOps"
  ],
  "Artificial Intelligence": [
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Reinforcement Learning",
    "Robotics"
  ]
};

// Handle department change to populate specializations
const departmentSelect = document.getElementById("department");
const specializationSelect = document.getElementById("specialization");

departmentSelect.addEventListener("change", function () {
  const selectedDepartment = departmentSelect.value;
  
  // Clear existing specialization options
  specializationSelect.innerHTML = '<option value="">Select Specialization</option>';

  // Populate specialization options based on department
  if (specializationOptions[selectedDepartment]) {
    specializationOptions[selectedDepartment].forEach(specialization => {
      const option = document.createElement("option");
      option.value = specialization;
      option.textContent = specialization;
      specializationSelect.appendChild(option);
    });
  }
});
