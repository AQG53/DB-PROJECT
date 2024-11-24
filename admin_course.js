const SUPABASE_URL = 'https://ynwjgmkbbyepuausjcdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2pnbWtiYnllcHVhdXNqY2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDcwMjcsImV4cCI6MjA0NzA4MzAyN30.RBCkr5OCoY7vqxOc_ZFSRf4DNdTPPx8rvAlRUDpesrY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const courseData = {
    // Course data for BS Computer Science
    "Computer Science": {
      1: [
        { name: "Introduction to Information and Communication Technology", code: "CL1000", creditHours: "0+1", prerequisites: "None" },
        { name: "Programming Fundamentals", code: "CS1002", creditHours: "3+1", prerequisites: "None" },
        { name: "Applied Physics", code: "NS1001", creditHours: "3+0", prerequisites: "None" },
        { name: "Calculus and Analytical Geometry", code: "MT1003", creditHours: "3+0", prerequisites: "None" },
        { name: "Functional English", code: "SS1012", creditHours: "2+1", prerequisites: "None" },
        { name: "Ideology and Constitution of Pakistan", code: "SS1013", creditHours: "2+0", prerequisites: "None" },
      ],
      2: [
        { name: "Object Oriented Programming", code: "CS1004", creditHours: "3+1", prerequisites: "Programming Fundamentals" },
        { name: "Digital Logic Design", code: "EE1005", creditHours: "3+1", prerequisites: "None" },
        { name: "Multivariable Calculus", code: "MT1006", creditHours: "3+0", prerequisites: "Calculus and Analytical Geometry" },
        { name: "Islamic Studies/Ethics", code: "SS1007", creditHours: "2+0", prerequisites: "None" },
        { name: "Expository Writing", code: "SS1014", creditHours: "2+1", prerequisites: "Functional English" },
      ],
      3: [
        { name: "Data Structures", code: "CS2001", creditHours: "3+1", prerequisites: "Programming Fundamentals" },
        { name: "Computer Organization and Assembly Language", code: "EE2003", creditHours: "3+1", prerequisites: "Digital Logic Design" },
        { name: "Discrete Structures", code: "CS1005", creditHours: "3+0", prerequisites: "None" },
        { name: "Linear Algebra", code: "MT1004", creditHours: "3+0", prerequisites: "Calculus and Analytical Geometry" },
        { name: "SS/MG Elective - I", code: "SS/MGxxxx", creditHours: "2+0", prerequisites: "None" },
        { name: "Civics and Community Engagement", code: "SS3002", creditHours: "2+0", prerequisites: "None" },
      ],
      4: [
        { name: "Database Systems", code: "CS2005", creditHours: "3+1", prerequisites: "Data Structures" },
        { name: "Operating Systems", code: "CS2006", creditHours: "3+1", prerequisites: "Data Structures" },
        { name: "Technical and Business Writing", code: "S2007", creditHours: "3+0", prerequisites: "Expository Writing" },
        { name: "Probability and Statistics", code: "MT2005", creditHours: "3+0", prerequisites: "Multivariable Calculus" },
        { name: "SS/MG Elective - II", code: "SS/MGxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "Computing Internship", code: "CSxxxx", creditHours: "0+1", prerequisites: "None" },
      ],
      5: [
        { name: "Theory of Automata", code: "CS3005", creditHours: "3+0", prerequisites: "Discrete Structures" },
        { name: "Computer Networks", code: "CS3001", creditHours: "3+1", prerequisites: "Operating Systems" },
        { name: "CS Elective - I", code: "CS3004", creditHours: "3+0", prerequisites: "None" },
        { name: "Design and Analysis of Algorithms", code: "CS2009", creditHours: "3+0", prerequisites: "Data Structures" },
        { name: "CS Elective - II", code: "CSxxxx", creditHours: "3+0", prerequisites: "None" },
      ],
      6: [
        { name: "Software Engineering", code: "CS3009", creditHours: "3+0", prerequisites: "Design and Analysis of Algorithms" },
        { name: "Computer Architecture", code: "EE2013", creditHours: "3+0", prerequisites: "Computer Organization and Assembly Language" },
        { name: "CS Elective - III", code: "CSxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "Artificial Intelligence", code: "AI2002", creditHours: "3+1", prerequisites: "Data Structures" },
        { name: "Applied Human Computer Interaction", code: "CS3014", creditHours: "3+0", prerequisites: "None" },
      ],
      7: [
        { name: "Final Year Project-I", code: "CS4091", creditHours: "0+3", prerequisites: "None" },
        { name: "Information Security", code: "CS3002", creditHours: "3+0", prerequisites: "Computer Networks" },
        { name: "CS Elective - IV", code: "CSxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "Professional Practices", code: "CS4001", creditHours: "3+0", prerequisites: "None" },
        { name: "Compiler Construction", code: "CS4031", creditHours: "3+0", prerequisites: "Theory of Automata" },
        { name: "Parallel and Distributed Computing", code: "CS4081", creditHours: "3+0", prerequisites: "Operating Systems" },
      ],
      8: [
        { name: "Final Year Project-II", code: "CS4092", creditHours: "0+3", prerequisites: "Final Year Project-I" },
        { name: "Entrepreneurship", code: "CS3002", creditHours: "3+0", prerequisites: "None" },
        { name: "CS Elective - V", code: "CSxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "CS Elective - VI", code: "CSxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "Advanced Database Management System", code: "CS4087", creditHours: "3+0", prerequisites: "Database Systems" },
      ],
    },
    // Course data for Software Engineering
    "Software Engineering": {
      1: [
        { name: "Introduction to Information and Communication Technology", code: "CL1000", creditHours: "0+1", prerequisites: "None" },
        { name: "Programming Fundamentals", code: "CS1002", creditHours: "3+1", prerequisites: "None" },
        { name: "Applied Physics", code: "NS1001", creditHours: "3+0", prerequisites: "None" },
        { name: "Calculus and Analytical Geometry", code: "MT1003", creditHours: "3+0", prerequisites: "None" },
        { name: "Ideology and Constitution of Pakistan", code: "SS1013", creditHours: "2+0", prerequisites: "None" },
        { name: "Functional English", code: "SS1012", creditHours: "2+1", prerequisites: "None" },
      ],
      2: [
        { name: "Object Oriented Programming", code: "CS1004", creditHours: "3+1", prerequisites: "Programming Fundamentals" },
        { name: "Introduction to Software Engineering", code: "SE1001", creditHours: "3+0", prerequisites: "None" },
        { name: "Discrete Structures", code: "CS1005", creditHours: "3+0", prerequisites: "Calculus and Analytical Geometry" },
        { name: "Digital Logic Design", code: "EE1005", creditHours: "3+1", prerequisites: "None" },
        { name: "Multi Variable Calculus", code: "MT1008", creditHours: "3+0", prerequisites: "Calculus and Analytical Geometry" },
      ],
      3: [
        { name: "Data Structures", code: "CS2001", creditHours: "3+1", prerequisites: "Object Oriented Programming" },
        { name: "Software Requirements Engineering", code: "SE2001", creditHours: "3+0", prerequisites: "Introduction to Software Engineering" },
        { name: "Computer Organization and Assembly Language", code: "EE2003", creditHours: "3+1", prerequisites: "Digital Logic Design" },
        { name: "Linear Algebra", code: "MT1004", creditHours: "3+0", prerequisites: "Multi Variable Calculus" },
        { name: "Islamic Studies/Ethics", code: "SS1007", creditHours: "2+0", prerequisites: "None" },
        { name: "Elective-I (SS/MG)", code: "SS/MG", creditHours: "2+0", prerequisites: "None" },
      ],
      4: [
        { name: "Database Systems", code: "CS2005", creditHours: "3+1", prerequisites: "Data Structures" },
        { name: "Probability and Statistics", code: "MT2005", creditHours: "3+0", prerequisites: "Linear Algebra" },
        { name: "Software Design and Architecture", code: "SE2002", creditHours: "3+0", prerequisites: "Software Requirements Engineering" },
        { name: "Operating Systems", code: "CS2006", creditHours: "3+1", prerequisites: "Data Structures" },
        { name: "Expository Writing / Communication & Presentation Skills", code: "SS1014", creditHours: "2+1", prerequisites: "Functional English" },
        { name: "Computing Internship", code: "CSxxxx", creditHours: "0+1", prerequisites: "None" },
      ],
      5: [
        { name: "Software Construction & Development", code: "SE3004", creditHours: "3+0", prerequisites: "Software Design and Architecture" },
        { name: "Software Quality Engineering", code: "SE3002", creditHours: "3+0", prerequisites: "Software Design and Architecture" },
        { name: "Design and Analysis of Algorithms", code: "CS2009", creditHours: "3+0", prerequisites: "Data Structures" },
        { name: "Technical and Business Writing", code: "SS2007", creditHours: "3+0", prerequisites: "Expository Writing" },
        { name: "SE Elective – I", code: "SExxxx", creditHours: "3+0", prerequisites: "None" },
      ],
      6: [
        { name: "Computer Networks", code: "CS3001", creditHours: "3+1", prerequisites: "Operating Systems" },
        { name: "Fundamentals of Software Project Management", code: "SE4002", creditHours: "3+0", prerequisites: "Software Quality Engineering" },
        { name: "Artificial Intelligence", code: "AI2002", creditHours: "3+1", prerequisites: "Design and Analysis of Algorithms" },
        { name: "SE Elective – II", code: "SExxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "SE Elective – III", code: "SExxxx", creditHours: "3+0", prerequisites: "None" },
      ],
      7: [
        { name: "Final Year Project - I", code: "SE4091", creditHours: "0+3", prerequisites: "Completion of 95 credit hours" },
        { name: "Information Security", code: "CS3002", creditHours: "3+0", prerequisites: "Computer Networks" },
        { name: "Parallel and Distributed Computing", code: "CS3006", creditHours: "3+0", prerequisites: "Operating Systems" },
        { name: "Civics and Community Engagement", code: "SS3002", creditHours: "2+0", prerequisites: "None" },
        { name: "SE Elective – IV", code: "SExxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "SE Elective – V", code: "SExxxx", creditHours: "3+0", prerequisites: "None" },
      ],
      8: [
        { name: "Final Year Project - II", code: "SE4092", creditHours: "0+3", prerequisites: "Final Year Project - I" },
        { name: "Professional Practices", code: "CS4001", creditHours: "3+0", prerequisites: "None" },
        { name: "Elective-II (SS/MG)", code: "SS/MG", creditHours: "3+0", prerequisites: "None" },
        { name: "SE Elective – VI", code: "SExxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "Entrepreneurship", code: "MG4011", creditHours: "3+0", prerequisites: "None" },
      ],
    },
    // Course data for Electrical Engineering
    "Electrical Engineering": {
      1: [
        { name: "Applications of ICT", code: "CS1009", creditHours: "2+1", prerequisites: "None" },
        { name: "Applied Calculus", code: "MT1001", creditHours: "3+0", prerequisites: "None" },
        { name: "Applied Physics", code: "NS1007", creditHours: "2+1", prerequisites: "None" },
        { name: "Engineering Drawing", code: "ME1001", creditHours: "0+1", prerequisites: "None" },
        { name: "Islamic Studies/Ethics", code: "SS1007", creditHours: "2+0", prerequisites: "None" },
        { name: "English Language Skills", code: "SS1005", creditHours: "3+0", prerequisites: "None" },
        { name: "Civics and Community Engagement", code: "SS2043", creditHours: "2+0", prerequisites: "None" },
      ],
      2: [
        { name: "Linear Circuit Analysis", code: "EE1001", creditHours: "3+1", prerequisites: "Applied Calculus" },
        { name: "Programming Fundamentals", code: "CS1002", creditHours: "3+1", prerequisites: "None" },
        { name: "Engineering Workshop", code: "EE1006", creditHours: "0+1", prerequisites: "None" },
        { name: "Linear Algebra and Differential Equations", code: "MT1009", creditHours: "4+0", prerequisites: "Applied Calculus" },
        { name: "Ideology and Constitution of Pakistan", code: "SS1013", creditHours: "2+0", prerequisites: "None" },
        { name: "Occupational Health and Safety", code: "MG1008", creditHours: "1+0", prerequisites: "None" },
      ],
      3: [
        { name: "Data Structures and Algorithms", code: "CS2002", creditHours: "3+1", prerequisites: "Programming Fundamentals" },
        { name: "Electronic Devices and Circuits", code: "EE1004", creditHours: "3+1", prerequisites: "Linear Circuit Analysis" },
        { name: "Electrical Network Analysis", code: "EE2004", creditHours: "3+1", prerequisites: "Linear Circuit Analysis" },
        { name: "Multivariable Calculus", code: "MT2008", creditHours: "3+0", prerequisites: "Linear Algebra and Differential Equations" },
        { name: "Complex Variables and Transform", code: "MT2003", creditHours: "3+0", prerequisites: "Multivariable Calculus" },
      ],
      4: [
        { name: "Signals and Systems", code: "EE2008", creditHours: "3+1", prerequisites: "Electrical Network Analysis" },
        { name: "Digital Logic Design", code: "EE1005", creditHours: "3+1", prerequisites: "None" },
        { name: "Probability and Random Processes", code: "EE2011", creditHours: "3+0", prerequisites: "Complex Variables and Transform" },
        { name: "Multi-Disciplinary Engineering Elective", code: "xxxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "Electro Mechanical Systems", code: "EE2010", creditHours: "3+1", prerequisites: "Electronic Devices and Circuits" },
      ],
      5: [
        { name: "Microprocessor Interfacing and Programming", code: "EE3002", creditHours: "3+1", prerequisites: "Digital Logic Design" },
        { name: "Analogue and Digital Communication", code: "EE3003", creditHours: "3+1", prerequisites: "Signals and Systems" },
        { name: "Electromagnetic Theory", code: "EE3005", creditHours: "3+0", prerequisites: "Multivariable Calculus" },
        { name: "Technical Communication Skills", code: "SS2001", creditHours: "2+0", prerequisites: "English Language Skills" },
        { name: "Depth Core I", code: "EExxxx", creditHours: "3+1", prerequisites: "None" },
      ],
      6: [
        { name: "Power Distribution and Utilization", code: "EE2038", creditHours: "3+1", prerequisites: "Electromagnetic Theory" },
        { name: "Feedback Control Systems", code: "EE3004", creditHours: "3+1", prerequisites: "Signals and Systems" },
        { name: "Engineering Economics", code: "MG2002", creditHours: "2+0", prerequisites: "None" },
        { name: "Depth Core II", code: "EExxxx", creditHours: "3+1", prerequisites: "Depth Core I" },
        { name: "Depth Elective III", code: "EExxxx", creditHours: "3+0", prerequisites: "None" },
      ],
      7: [
        { name: "Final Year Project - I", code: "EE4091", creditHours: "3+0", prerequisites: "Completion of 95 credit hours" },
        { name: "Depth Elective IV", code: "EExxxx", creditHours: "3+1", prerequisites: "None" },
        { name: "Flexible Elective I", code: "EExxxx", creditHours: "3+1", prerequisites: "None" },
        { name: "Engineering Management", code: "MG3036", creditHours: "2+0", prerequisites: "Engineering Economics" },
        { name: "Technical and Business Writing", code: "SS2007", creditHours: "3+0", prerequisites: "Technical Communication Skills" },
      ],
      8: [
        { name: "Final Year Project - II", code: "EE4092", creditHours: "3+0", prerequisites: "Final Year Project - I" },
        { name: "Entrepreneurship", code: "SS2013", creditHours: "2+0", prerequisites: "None" },
        { name: "Depth Elective V", code: "EExxxx", creditHours: "3+1", prerequisites: "None" },
        { name: "Flexible Elective II", code: "EExxxx", creditHours: "3+1", prerequisites: "None" },
        { name: "Flexible Elective III", code: "EExxxx", creditHours: "3+0", prerequisites: "None" },
      ],
    },
    // Course data for Business Analytics
    "Business Analytics": {
      1: [
        { name: "IT in Business", code: "CS1001", creditHours: "2+1", prerequisites: "None" },
        { name: "Fundamentals of Accounting", code: "AF1001", creditHours: "3+0", prerequisites: "None" },
        { name: "Business Math – I", code: "MT1002", creditHours: "3+0", prerequisites: "None" },
        { name: "Fundamentals of Management", code: "MG1001", creditHours: "3+0", prerequisites: "None" },
        { name: "English – I", code: "SS1016", creditHours: "2+1", prerequisites: "None" },
        { name: "Ideology and Constitution of Pakistan", code: "SS1013", creditHours: "2+0", prerequisites: "None" },
      ],
      2: [
        { name: "Financial Accounting", code: "AF1002", creditHours: "3+1", prerequisites: "Fundamentals of Accounting" },
        { name: "Data Analysis for Business I", code: "MG2008", creditHours: "3+0", prerequisites: "Business Math – I" },
        { name: "Marketing Management", code: "MG1002", creditHours: "3+0", prerequisites: "None" },
        { name: "Psychology/Sociology", code: "SS2019/SS2018", creditHours: "2+0", prerequisites: "None" },
        { name: "English – II", code: "SS1006", creditHours: "3+1", prerequisites: "English – I" },
        { name: "Islamic Studies/Ethics", code: "SS1007", creditHours: "2+0", prerequisites: "None" },
      ],
      3: [
        { name: "Microeconomics", code: "SS2002", creditHours: "3+0", prerequisites: "None" },
        { name: "Critical Thinking", code: "SS2041", creditHours: "2+0", prerequisites: "None" },
        { name: "Data Analysis for Business II", code: "MG2009", creditHours: "3+1", prerequisites: "Data Analysis for Business I" },
        { name: "Programming for Business", code: "CS2016", creditHours: "3+1", prerequisites: "IT in Business" },
        { name: "Business Math - II", code: "MT2004", creditHours: "3+0", prerequisites: "Business Math – I" },
      ],
      4: [
        { name: "Business Finance", code: "AF2004", creditHours: "3+0", prerequisites: "Financial Accounting" },
        { name: "Community Services", code: "SS2042", creditHours: "2+0", prerequisites: "None" },
        { name: "Psychology/Sociology", code: "SS2019/SS2018", creditHours: "3+0", prerequisites: "None" },
        { name: "Macroeconomics", code: "SS2006", creditHours: "3+0", prerequisites: "Microeconomics" },
        { name: "Fundamentals of Business Analytics", code: "BA2006", creditHours: "3+0", prerequisites: "None" },
      ],
      5: [
        { name: "Consumer Behaviour", code: "MG2003", creditHours: "3+0", prerequisites: "Marketing Management" },
        { name: "Financial Management", code: "AF3001", creditHours: "3+1", prerequisites: "Business Finance" },
        { name: "Basic Econometrics", code: "MG3003", creditHours: "3+1", prerequisites: "Data Analysis for Business II" },
        { name: "Human Resource Management", code: "MG3004", creditHours: "3+0", prerequisites: "Fundamentals of Management" },
        { name: "Data Structures & Business Applications", code: "CS2003", creditHours: "3+1", prerequisites: "Programming for Business" },
      ],
      6: [
        { name: "Machine Learning for Business Analytics", code: "BA3001", creditHours: "3+1", prerequisites: "Fundamentals of Business Analytics" },
        { name: "Methods in Business Research", code: "MG3005", creditHours: "3+1", prerequisites: "Basic Econometrics" },
        { name: "Business Communication", code: "MG2010", creditHours: "3+0", prerequisites: "English – II" },
        { name: "Database Systems for Business", code: "BA3004", creditHours: "3+1", prerequisites: "Data Structures & Business Applications" },
        { name: "MG/AF/BA Elective - I", code: "MGxxxx", creditHours: "3+0", prerequisites: "None" },
      ],
      7: [
        { name: "Business Data and Text Mining", code: "BA3002", creditHours: "3+0", prerequisites: "Machine Learning for Business Analytics" },
        { name: "Entrepreneurship", code: "MG4011", creditHours: "3+0", prerequisites: "None" },
        { name: "Final Year Project – I", code: "BA4091", creditHours: "0+3", prerequisites: "None" },
        { name: "MG/AF/BA Elective – II", code: "MGxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "Internship", code: "MG4052", creditHours: "3+0", prerequisites: "None" },
      ],
      8: [
        { name: "Decision Science for Business", code: "BA4001", creditHours: "3+0", prerequisites: "Machine Learning for Business Analytics" },
        { name: "Legal and Ethical Issues in Business Analytics", code: "MG3001", creditHours: "3+0", prerequisites: "None" },
        { name: "Business Strategy", code: "MG4013", creditHours: "3+0", prerequisites: "None" },
        { name: "Final Year Project – II", code: "BA4092", creditHours: "0+3", prerequisites: "Final Year Project – I" },
        { name: "MG/AF/BA Elective – III", code: "MGxxxx", creditHours: "3+0", prerequisites: "None" },
      ],
    },
    // Course data for Artificial Intelligence
    "Artificial Intelligence": {
      1: [
        { name: "Introduction to Information and Communication Technology", code: "CL1001", creditHours: "0+1", prerequisites: "None" },
        { name: "Programming Fundamentals", code: "CS1002", creditHours: "3+1", prerequisites: "None" },
        { name: "Applied Physics", code: "NS1001", creditHours: "3+0", prerequisites: "None" },
        { name: "Calculus and Analytical Geometry", code: "MT1003", creditHours: "3+0", prerequisites: "None" },
        { name: "Functional English", code: "SS1012", creditHours: "2+1", prerequisites: "None" },
        { name: "Ideology and Constitution of Pakistan", code: "SS1013", creditHours: "2+0", prerequisites: "None" },
      ],
      2: [
        { name: "Object Oriented Programming", code: "CS1004", creditHours: "3+1", prerequisites: "Programming Fundamentals" },
        { name: "Digital Logic Design", code: "EE1005", creditHours: "3+1", prerequisites: "None" },
        { name: "Multivariable Calculus", code: "MT1006", creditHours: "3+0", prerequisites: "Calculus and Analytical Geometry" },
        { name: "Islamic Studies/Ethics", code: "SS1007", creditHours: "2+0", prerequisites: "None" },
        { name: "Expository Writing", code: "SS1014", creditHours: "2+1", prerequisites: "Functional English" },
      ],
      3: [
        { name: "Data Structures", code: "CS2001", creditHours: "3+1", prerequisites: "Object Oriented Programming" },
        { name: "Linear Algebra", code: "MT1004", creditHours: "3+0", prerequisites: "None" },
        { name: "Programming for Artificial Intelligence", code: "AI2001", creditHours: "3+1", prerequisites: "Programming Fundamentals" },
        { name: "Discrete Structures", code: "CS1005", creditHours: "3+0", prerequisites: "None" },
        { name: "Probability and Statistics", code: "MT2005", creditHours: "3+0", prerequisites: "None" },
        { name: "Computing Internship", code: "SSxxxx", creditHours: "0+1", prerequisites: "None" },
      ],
      4: [
        { name: "Database Systems", code: "CS2005", creditHours: "3+1", prerequisites: "Data Structures" },
        { name: "Artificial Intelligence", code: "AI2002", creditHours: "3+1", prerequisites: "Programming for Artificial Intelligence" },
        { name: "Computer Organization and Assembly Language", code: "EE2003", creditHours: "3+1", prerequisites: "Digital Logic Design" },
        { name: "Fundamentals of Software Engineering", code: "CS2004", creditHours: "3+0", prerequisites: "None" },
        { name: "SS/MG Elective - I", code: "SS/MGxxxx", creditHours: "2+0", prerequisites: "None" },
        { name: "Civics and Community Engagement", code: "SS3002", creditHours: "2+0", prerequisites: "None" },
      ],
      5: [
        { name: "Machine Learning", code: "AI3002", creditHours: "3+1", prerequisites: "Artificial Intelligence" },
        { name: "Knowledge Representation & Reasoning", code: "AI3001", creditHours: "3+0", prerequisites: "Artificial Intelligence" },
        { name: "Operating Systems", code: "CS2006", creditHours: "3+1", prerequisites: "None" },
        { name: "Design and Analysis of Algorithms", code: "CS2004", creditHours: "3+0", prerequisites: "Data Structures" },
        { name: "Technical and Business Writing", code: "SS2007", creditHours: "3+0", prerequisites: "Expository Writing" },
      ],
      6: [
        { name: "Artificial Neural Networks", code: "AI3003", creditHours: "3+0", prerequisites: "Machine Learning" },
        { name: "Parallel & Distributed Computing", code: "AI3001", creditHours: "3+0", prerequisites: "None" },
        { name: "Computer Networks", code: "CS3001", creditHours: "3+1", prerequisites: "Operating Systems" },
        { name: "AI Elective - I", code: "AIxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "AI Elective - II", code: "AIxxxx", creditHours: "3+0", prerequisites: "None" },
      ],
      7: [
        { name: "Final Year Project – I", code: "AI4091", creditHours: "0+3", prerequisites: "None" },
        { name: "Computer Vision", code: "AI4002", creditHours: "3+1", prerequisites: "Artificial Neural Networks" },
        { name: "AI Elective - III", code: "AIxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "AI Elective - IV", code: "AIxxxx", creditHours: "3+0", prerequisites: "None" },
        { name: "SS/MG Elective - II", code: "SS/MGxxxx", creditHours: "3+0", prerequisites: "None" },
      ],
      8: [
        { name: "Final Year Project – II", code: "AI4092", creditHours: "0+3", prerequisites: "Final Year Project – I" },
        { name: "Information Security", code: "CS3002", creditHours: "3+0", prerequisites: "Operating Systems" },
        { name: "Entrepreneurship", code: "CS3002", creditHours: "3+0", prerequisites: "None" },
        { name: "Professional Practices", code: "CS4001", creditHours: "3+0", prerequisites: "None" },
        { name: "AI Elective - V", code: "AIxxxx", creditHours: "3+0", prerequisites: "None" },
      ],
    },
  };

  function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
  
    // Set message and show the notification
    notificationMessage.textContent = message;
    notification.classList.add('show');
  
    // Hide notification after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 3000);
  }
  
  // Function to close notification
  function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show'); // Hide notification smoothly
  }

  function extractNumber(input) {
  return parseInt(input.split(" ")[1], 10); // Splits the text and extracts the second part as a number
}
  
  const departmentSelect = document.getElementById('departmentSelect');
  const semesterSelect = document.getElementById('semesterSelect');
  const courseSelect = document.getElementById('courseSelect');
  const courseCode = document.getElementById('courseCode');
  const creditHours = document.getElementById('creditHours');
  const prerequisites = document.getElementById('prerequisites');
  
  // Populate course dropdown based on selected department and semester
  departmentSelect.addEventListener('change', updateCourseOptions);
  semesterSelect.addEventListener('change', updateCourseOptions);
  
  function updateCourseOptions() {
    const department = departmentSelect.value;
    const semester = semesterSelect.value;
  
    // Clear previous options
    courseSelect.innerHTML = '<option value="">Choose Course</option>';
    courseCode.textContent = "";
    creditHours.textContent = "";
    prerequisites.textContent = "";
  
    if (department && semester) {
      const courses = courseData[department]?.[semester];
      if (courses) {
        courses.forEach(course => {
          const option = document.createElement('option');
          option.value = course.code;
          option.textContent = course.name;
          courseSelect.appendChild(option);
        });
      }
    }
  }

  let selectedCourseDetails = {};
  // Display course details when a course is selected
  courseSelect.addEventListener('change', function () {
    const department = departmentSelect.value;
    const semester = semesterSelect.value;
    const selectedCourseCode = courseSelect.value;
  
    if (department && semester && selectedCourseCode) {
      const courses = courseData[department]?.[semester];
      const selectedCourse = courses.find(course => course.code === selectedCourseCode);
  
      if (selectedCourse) {
        courseCode.textContent = selectedCourse.code;
        creditHours.textContent = selectedCourse.creditHours;
        prerequisites.textContent = selectedCourse.prerequisites;
        selectedCourseDetails = selectedCourse;
      }
    }
  });

  document.getElementById('courseRegistrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const type = document.getElementById('typeSelect').value;
    const department_name = document.getElementById('departmentSelect').value;
    const semester = document.getElementById('semesterSelect').value;
    const { code, name, creditHours, prerequisites } = selectedCourseDetails;
    console.log(department_name, semester, code, name, creditHours, prerequisites);
    try {
      const { data: departmentData, error: departmentError } = await supabase
        .from('departments')
        .select('id, name')
        .eq('name', department_name)
        .single();
  
      const department_id = departmentData.id;
      
      // Proceed to insert the faculty member with the valid department ID
      const { data, error } = await supabase.from('courses').insert([
        {
          course_code: code,
          name: name,
          type,
          semester,
          department_id: department_id,
          prerequisites,
          credit_hours: creditHours,
        }
      ]);
  
      if (error) {
        console.error('Supabase insertion error:', error.message);
        alert('Error: ' + error.message);
        return;
      }

  
      console.log('Course registered successfully:', data);
      showNotification(`Course registered successfully!`);
      document.getElementById('courseRegistrationForm').reset();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  });

  // Function to navigate back to the Admin Dashboard 
function goToAdminDashboard() {
    window.location.href = 'admin.html';
}
 