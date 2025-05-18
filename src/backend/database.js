// database.js: Inicializa y conecta con SQLite, ejecuta el schema
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'petplanify.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

const db = new sqlite3.Database(DB_PATH);

function initDB() {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error al inicializar la base de datos:', err.message);
    } else {
      console.log('Base de datos inicializada correctamente.');
    }
  });
}

module.exports = { db, initDB };
