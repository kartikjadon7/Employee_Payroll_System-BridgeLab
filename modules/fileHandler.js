const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../employees.json');

async function read() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}

async function write(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

module.exports = { read, write };