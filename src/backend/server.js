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

// Obtener detalle de una mascota por id
app.get('/api/pets/detalle/:petId', (req, res) => {
  const { petId } = req.params;
  db.get('SELECT * FROM mascotas WHERE id = ?', [petId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener la mascota.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Mascota no encontrada.' });
    }
    res.json(row);
  });
});

// --- ENDPOINTS DE HISTORIAL SANITARIO ---
// Guardar vacuna
app.post('/api/pets/:petId/vacunas', (req, res) => {
  const { petId } = req.params;
  const { nombre, fecha, proxima_fecha, notas } = req.body;
  if (!nombre || !fecha) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  const id = uuidv4();
  db.run(
    `INSERT INTO vacunas (id, mascota_id, nombre, fecha, proxima_fecha, notas) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, petId, nombre, fecha, proxima_fecha || null, notas || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar la vacuna.' });
      }
      res.status(201).json({ id, mascota_id: petId, nombre, fecha, proxima_fecha, notas });
    }
  );
});
// Obtener vacunas de una mascota
app.get('/api/pets/:petId/vacunas', (req, res) => {
  const { petId } = req.params;
  db.all('SELECT * FROM vacunas WHERE mascota_id = ?', [petId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las vacunas.' });
    }
    res.json(rows);
  });
});
// Obtener vacuna por ID
app.get('/api/vacunas/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM vacunas WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la vacuna.' });
    if (!row) return res.status(404).json({ error: 'Vacuna no encontrada.' });
    res.json(row);
  });
});

// Guardar desparasitación
app.post('/api/pets/:petId/desparasitaciones', (req, res) => {
  const { petId } = req.params;
  const { nombre, fecha, notas } = req.body;
  if (!nombre || !fecha) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  const id = uuidv4();
  db.run(
    `INSERT INTO desparasitaciones (id, mascota_id, nombre, fecha, notas) VALUES (?, ?, ?, ?, ?)`,
    [id, petId, nombre, fecha, notas || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar la desparasitación.' });
      }
      res.status(201).json({ id, mascota_id: petId, nombre, fecha, notas });
    }
  );
});
// Obtener desparasitaciones de una mascota
app.get('/api/pets/:petId/desparasitaciones', (req, res) => {
  const { petId } = req.params;
  db.all('SELECT * FROM desparasitaciones WHERE mascota_id = ?', [petId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las desparasitaciones.' });
    }
    res.json(rows);
  });
});
// Obtener desparasitación por ID
app.get('/api/desparasitaciones/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM desparasitaciones WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la desparasitación.' });
    if (!row) return res.status(404).json({ error: 'Desparasitación no encontrada.' });
    res.json(row);
  });
});

// Guardar medicación
app.post('/api/pets/:petId/medicaciones', (req, res) => {
  const { petId } = req.params;
  const { nombre, dosis, frecuencia, fecha_inicio, fecha_fin, notas } = req.body;
  if (!nombre || !dosis || !frecuencia || !fecha_inicio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  const id = uuidv4();
  db.run(
    `INSERT INTO medicaciones (id, mascota_id, nombre, dosis, frecuencia, fecha_inicio, fecha_fin, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, petId, nombre, dosis, frecuencia, fecha_inicio, fecha_fin || null, notas || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar la medicación.' });
      }
      res.status(201).json({ id, mascota_id: petId, nombre, dosis, frecuencia, fecha_inicio, fecha_fin, notas });
    }
  );
});
// Obtener medicaciones de una mascota
app.get('/api/pets/:petId/medicaciones', (req, res) => {
  const { petId } = req.params;
  db.all('SELECT * FROM medicaciones WHERE mascota_id = ?', [petId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las medicaciones.' });
    }
    res.json(rows);
  });
});
// Obtener medicación por ID
app.get('/api/medicaciones/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM medicaciones WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la medicación.' });
    if (!row) return res.status(404).json({ error: 'Medicación no encontrada.' });
    res.json(row);
  });
});

// Guardar observación
app.post('/api/pets/:petId/observaciones', (req, res) => {
  const { petId } = req.params;
  const { contenido, fecha } = req.body;
  if (!contenido || !fecha) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  const id = uuidv4();
  db.run(
    `INSERT INTO observaciones (id, mascota_id, contenido, fecha) VALUES (?, ?, ?, ?)`,
    [id, petId, contenido, fecha],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar la observación.' });
      }
      res.status(201).json({ id, mascota_id: petId, contenido, fecha });
    }
  );
});
// Obtener observaciones de una mascota
app.get('/api/pets/:petId/observaciones', (req, res) => {
  const { petId } = req.params;
  db.all('SELECT * FROM observaciones WHERE mascota_id = ?', [petId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las observaciones.' });
    }
    res.json(rows);
  });
});

// Eliminar mascota y sus historiales sanitarios
app.delete('/api/pets/:petId', (req, res) => {
  const { petId } = req.params;
  // Eliminar registros relacionados primero
  db.serialize(() => {
    db.run('DELETE FROM vacunas WHERE mascota_id = ?', [petId]);
    db.run('DELETE FROM desparasitaciones WHERE mascota_id = ?', [petId]);
    db.run('DELETE FROM medicaciones WHERE mascota_id = ?', [petId]);
    db.run('DELETE FROM observaciones WHERE mascota_id = ?', [petId]);
    db.run('DELETE FROM mascotas WHERE id = ?', [petId], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar la mascota.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Mascota no encontrada.' });
      }
      res.json({ success: true });
    });
  });
});

// Obtener visitas veterinario de una mascota
app.get('/api/pets/:petId/visitas_veterinario', (req, res) => {
  const { petId } = req.params;
  db.all('SELECT * FROM visitas_veterinario WHERE mascota_id = ?', [petId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las visitas veterinario.' });
    }
    res.json(rows);
  });
});

// Endpoint temporal para evitar error 404 en citas
app.get('/api/citas/:userId', (req, res) => {
  res.json([]); // Devuelve un array vacío por ahora
});

// Obtener todos los eventos
app.get('/api/eventos', (req, res) => {
  db.all('SELECT * FROM eventos ORDER BY fecha ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los eventos.' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
