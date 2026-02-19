const express = require('express');
const fileHandler = require('./modules/fileHandler');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Log employee data when server starts (Step 1 goal)
fileHandler.read().then(data => {
  console.log('✅ Server started. Employee Data loaded:');
  console.table(data);
}).catch(err => {
  console.error('Failed to load employee data:', err.message);
});

// ─────────────────────────────────────────────
// DASHBOARD - GET /
// ─────────────────────────────────────────────
app.get('/', async (req, res) => {
  try {
    const employees = await fileHandler.read();
    res.render('index', { employees, error: null });
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// ─────────────────────────────────────────────
// ADD EMPLOYEE - GET /add  (show form)
// ─────────────────────────────────────────────
app.get('/add', (req, res) => {
  res.render('add', { error: null });
});

// ─────────────────────────────────────────────
// ADD EMPLOYEE - POST /add  (process form)
// ─────────────────────────────────────────────
app.post('/add', async (req, res) => {
  const { name, department, basicSalary } = req.body;

  // Validation
  if (!name || name.trim() === '') {
    return res.render('add', { error: 'Employee name cannot be empty.' });
  }
  if (!basicSalary || Number(basicSalary) < 0) {
    return res.render('add', { error: 'Basic salary must be a non-negative number.' });
  }

  try {
    const employees = await fileHandler.read();
    const newEmployee = {
      id: Date.now(),
      name: name.trim(),
      department: department.trim() || 'General',
      basicSalary: Number(basicSalary)
    };
    employees.push(newEmployee);
    await fileHandler.write(employees);
    res.redirect('/');
  } catch (err) {
    res.render('add', { error: 'Failed to save employee: ' + err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE EMPLOYEE - GET /delete/:id
// ─────────────────────────────────────────────
app.get('/delete/:id', async (req, res) => {
  try {
    const employees = await fileHandler.read();
    const filtered = employees.filter(emp => String(emp.id) !== String(req.params.id));
    await fileHandler.write(filtered);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Delete failed: ' + err.message);
  }
});

// ─────────────────────────────────────────────
// EDIT EMPLOYEE - GET /edit/:id  (show form)
// ─────────────────────────────────────────────
app.get('/edit/:id', async (req, res) => {
  try {
    const employees = await fileHandler.read();
    const employee = employees.find(emp => String(emp.id) === String(req.params.id));
    if (!employee) {
      return res.status(404).send('Employee not found.');
    }
    res.render('edit', { employee, error: null });
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// ─────────────────────────────────────────────
// EDIT EMPLOYEE - POST /edit/:id  (process form)
// ─────────────────────────────────────────────
app.post('/edit/:id', async (req, res) => {
  const { name, department, basicSalary } = req.body;

  // Validation
  if (!name || name.trim() === '') {
    const employees = await fileHandler.read();
    const employee = employees.find(emp => String(emp.id) === String(req.params.id));
    return res.render('edit', { employee, error: 'Employee name cannot be empty.' });
  }
  if (!basicSalary || Number(basicSalary) < 0) {
    const employees = await fileHandler.read();
    const employee = employees.find(emp => String(emp.id) === String(req.params.id));
    return res.render('edit', { employee, error: 'Basic salary must be a non-negative number.' });
  }

  try {
    const employees = await fileHandler.read();
    const index = employees.findIndex(emp => String(emp.id) === String(req.params.id));
    if (index === -1) {
      return res.status(404).send('Employee not found.');
    }
    employees[index] = {
      ...employees[index],
      name: name.trim(),
      department: department.trim() || 'General',
      basicSalary: Number(basicSalary)
    };
    await fileHandler.write(employees);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Update failed: ' + err.message);
  }
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Payroll App running at http://localhost:${PORT}`);
});