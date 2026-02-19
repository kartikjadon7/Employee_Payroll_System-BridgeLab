**Project Overview**

The Employee Payroll System is a server-side web application built using Node.js, Express, and EJS.
It allows users to manage employee records and automatically calculate monthly payroll including tax deductions and net salary.

This project demonstrates CRUD operations, file handling, and server-side rendering.

# Features

# Dashboard displaying all employees in a table

# Add new employee records

# Edit existing employee details

# Delete employees

# Automatic payroll calculation:

Tax = 12% of salary

Net Salary = Salary − Tax

# Data stored in a JSON file (acts as database)
# Technologies Used

Node.js

Express.js

EJS Template Engine

HTML & CSS

File System Module (fs)

📁 Project Structure
payroll-app/
│
├── modules/
│   └── fileHandler.js      # Handles file read/write logic
│
├── public/
│   └── style.css           # Styling for UI
│
├── views/
│   ├── index.ejs           # Dashboard page
│   ├── add.ejs             # Add employee form
│   └── edit.ejs            # Edit employee form
│
├── employees.json          # Data storage file
└── server.js               # Main server file

# How to Run the Project
1. Install dependencies
npm install express ejs

2. Start the server
node server.js

3. Open in browser
http://localhost:8000
