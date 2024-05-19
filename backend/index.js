import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "cms_user",
  password: "password",
  database: "rudimentary_cms"
});

app.use(express.json());
app.use(cors());

const dataTypeMapping = {
  string: 'VARCHAR(255)',
  integer: 'INT',
  date: 'DATE',
};

const generateRandomId = () => Math.floor(Math.random() * 90) + 10;

app.get("/tables", (req, res) => {
  const q = `SHOW TABLES`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    const tables = data.map(row => Object.values(row)[0]);
    return res.json(tables);
  });
});

app.get("/tableAttributes/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  const q = `SHOW COLUMNS FROM ??`;
  db.query(q, [tableName], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.get("/tableData/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  const q = `SELECT * FROM ??`;
  db.query(q, [tableName], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/createTable", (req, res) => {
  const { tableName, attributes } = req.body;
  if (!tableName || !attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return res.status(400).json({ error: "Invalid request data" });
  }
  const columnDefinitions = Object.entries(attributes).map(([name, type]) => {
    const mysqlType = dataTypeMapping[type.toLowerCase()] || type;
    return `\`${name}\` ${mysqlType}`;
  }).join(', ');
  const q = `CREATE TABLE \`${tableName}\` (
    \`id\` INT NOT NULL DEFAULT ${generateRandomId()}, 
    ${columnDefinitions}, 
    PRIMARY KEY (\`id\`)
  )`;
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error creating table:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.json("Table has been created successfully.");
  });
});

app.post("/tableDatas", (req, res) => {
  const { tableName, attributes } = req.body;
  if (!tableName || !attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return res.status(400).json({ error: "Invalid request data" });
  }
  const columns = Object.keys(attributes).map(col => `\`${col}\``).join(', ');
  const values = Object.values(attributes);
  const placeholders = values.map(() => '?').join(', ');
  const q = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.json("Values Have Been Assigned Successfully.");
  });
});

app.delete("/deleteRow/:tableName/:id", (req, res) => {
  const { tableName, id } = req.params;
  const q = `DELETE FROM \`${tableName}\` WHERE \`id\` = ?`;
  db.query(q, [id], (err, data) => {
    if (err) {
      console.error("Error deleting row:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.json("Row has been deleted successfully.");
  });
});

app.put("/updateRow/:tableName/:id", (req, res) => {
  const { tableName, id } = req.params;
  const attributes = req.body;
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return res.status(400).json({ error: "Invalid request data" });
  }
  const setClause = Object.entries(attributes).map(([key, value]) => `\`${key}\` = ?`).join(', ');
  const values = Object.values(attributes);
  const q = `UPDATE \`${tableName}\` SET ${setClause} WHERE \`id\` = ?`;
  db.query(q, [...values, id], (err, data) => {
    if (err) {
      console.error("Error updating row:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.json("Row has been updated successfully.");
  });
});

app.listen(8800, () => {
  console.log('Server is running on port 8800');
});
