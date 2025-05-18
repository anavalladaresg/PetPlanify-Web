// server.js: Backend Express para registro e inicio de sesión de usuarios
const express = require('express');
const { db, initDB } = require('./database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3001;

initDB();

app.use(cors());
app.use(express.json());

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { nombre, email, password, photo_url } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, row) => {
    if (row) {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    db.run(
      'INSERT INTO usuarios (id, nombre, email, password, photo_url) VALUES (?, ?, ?, ?, ?)',
      [id, nombre, email, hashedPassword, photo_url || null],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Error al registrar usuario.' });
        }
        res.status(201).json({ id, nombre, email, photo_url });
      }
    );
  });
});

// Login de usuario
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, user) => {
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    res.json({ id: user.id, nombre: user.nombre, email: user.email, photo_url: user.photo_url });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
