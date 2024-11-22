
// Sample data (replace with backend integration)
const feeStructures = {
    1: 50000,
    2: 52000,
    3: 54000,
    4: 56000,
    5: 58000,
    6: 60000,
    7: 62000,
    8: 64000
  };
  
  const paymentRecords = {
    "22k-4286": [
      { semester: 1, totalFees: 50000, amountPaid: 25000, dueDate: "2024-12-01", status: "Partial" },
      { semester: 2, totalFees: 52000, amountPaid: 52000, dueDate: "2024-12-15", status: "Paid" },
    ],
  };
  
  // Update Fee Structure
  function updateFeeStructure() {
    const semester = document.getElementById("semester").value;
    const semesterFees = document.getElementById("semesterFees").value;
  
    if (semester && semesterFees) {
      feeStructures[semester] = parseInt(semesterFees);
      alert(`Fee structure updated for Semester ${semester}.`);
    } else {
      alert("Please fill in all fields.");
    }
  }
  
  // View Payment Records
  function viewPaymentRecords() {
    const rollNumber = document.getElementById("rollNumber").value;
    const records = paymentRecords[rollNumber];
  
    if (records) {
      document.getElementById("paymentDetails").style.display = "block";
      document.getElementById("paymentRollNumber").textContent = rollNumber;
  
      const paymentTable = document.getElementById("paymentTable");
      paymentTable.innerHTML = ""; // Clear previous records
  
      records.forEach(record => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${record.semester}</td>
          <td>${record.totalFees}</td>
          <td>${record.amountPaid}</td>
          <td>${record.totalFees - record.amountPaid}</td>
          <td>${record.dueDate}</td>
          <td>${record.status}</td>
        `;
        paymentTable.appendChild(row);
      });
    } else {
      alert("No payment records found for this roll number.");
      document.getElementById("paymentDetails").style.display = "none";
    }
  }
  
  // Generate Invoice
  function generateInvoice() {
    const rollNumber = document.getElementById("paymentRollNumber").textContent;
    const records = paymentRecords[rollNumber];
  
    if (records) {
      let invoice = `Invoice for Roll Number: ${rollNumber}\n\n`;
  
      records.forEach(record => {
        invoice += `Semester: ${record.semester}\n`;
        invoice += `Total Fees: PKR ${record.totalFees}\n`;
        invoice += `Amount Paid: PKR ${record.amountPaid}\n`;
        invoice += `Amount Due: PKR ${record.totalFees - record.amountPaid}\n`;
        invoice += `Due Date: ${record.dueDate}\n`;
        invoice += `Payment Status: ${record.status}\n\n`;
      });
  
      alert(invoice); // Replace with actual invoice generation logic
    } else {
      alert("No payment records available to generate an invoice.");
    }
  }
  
  // Back to Admin Portal
  function goBack() {
    window.location.href = "admin.html"; 
  }
  