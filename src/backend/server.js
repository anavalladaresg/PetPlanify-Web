// server.js: Backend Express para registro e inicio de sesión de usuarios
const express = require('express');
const { db, initDB } = require('./database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3001;

initDB();

app.use(cors());
app.use(express.json());

// Configuración de almacenamiento para fotos de mascotas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Guardar en src/assets para que Angular pueda servir las imágenes
    cb(null, path.join(__dirname, '../assets'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pet_' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

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

// Guardar mascota para usuario (con foto)
app.post('/api/pets', upload.single('foto'), async (req, res) => {
  const { userId, nombre, tipo, raza, fechaNacimiento, peso } = req.body;
  const foto = req.file ? req.file.filename : null;
  if (!userId || !nombre || !tipo || !raza || !fechaNacimiento || !peso) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  const id = uuidv4();
  db.run(
    'INSERT INTO mascotas (id, usuario_id, nombre, tipo, raza, fecha_nacimiento, peso, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, userId, nombre, tipo, raza, fechaNacimiento, peso, foto],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar la mascota.' });
      }
      res.status(201).json({ id, nombre, tipo, raza, fechaNacimiento, peso, foto });
    }
  );
});

// Obtener mascotas de un usuario
app.get('/api/pets/:userId', (req, res) => {
  const { userId } = req.params;
  db.all('SELECT * FROM mascotas WHERE usuario_id = ?', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las mascotas.' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
