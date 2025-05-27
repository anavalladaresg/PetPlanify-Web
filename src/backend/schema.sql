-- schema.sql: Definición de tablas para PetPlanify

CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_url TEXT,
    provider TEXT DEFAULT 'local'
);

CREATE TABLE IF NOT EXISTS mascotas (
    id TEXT PRIMARY KEY,
    usuario_id TEXT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    raza TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    peso REAL NOT NULL,
    foto TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS vacunas (
    id TEXT PRIMARY KEY,
    mascota_id TEXT,
    nombre TEXT NOT NULL,
    fecha DATE NOT NULL,
    proxima_fecha DATE NOT NULL,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE IF NOT EXISTS visitas_veterinario (
    id TEXT PRIMARY KEY,
    mascota_id TEXT,
    fecha TIMESTAMP NOT NULL,
    motivo TEXT NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT,
    proxima_visita TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE IF NOT EXISTS medicaciones (
    id TEXT PRIMARY KEY,
    mascota_id TEXT,
    nombre TEXT NOT NULL,
    dosis TEXT NOT NULL,
    frecuencia TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE IF NOT EXISTS notas (
    id TEXT PRIMARY KEY,
    mascota_id TEXT,
    contenido TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE IF NOT EXISTS eventos (
    id TEXT PRIMARY KEY,
    creador_id TEXT,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    ubicacion TEXT NOT NULL,
    tipo_mascotas TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(creador_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS participantes_evento (
    id TEXT PRIMARY KEY,
    evento_id TEXT,
    usuario_id TEXT,
    mascota_id TEXT,
    estado TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(evento_id) REFERENCES eventos(id),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(mascota_id) REFERENCES mascotas(id)
);

CREATE TABLE IF NOT EXISTS comentarios_evento (
    id TEXT PRIMARY KEY,
    evento_id TEXT,
    usuario_id TEXT,
    contenido TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(evento_id) REFERENCES eventos(id),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS ubicaciones (
    id TEXT PRIMARY KEY,
    creador_id TEXT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    direccion TEXT NOT NULL,
    coordenadas TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    fotos TEXT NOT NULL,
    horario TEXT NOT NULL,
    servicios TEXT NOT NULL,
    estado TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(creador_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS valoraciones_ubicacion (
    id TEXT PRIMARY KEY,
    ubicacion_id TEXT,
    usuario_id TEXT,
    puntuacion INTEGER NOT NULL,
    comentario TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ubicacion_id) REFERENCES ubicaciones(id),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id TEXT PRIMARY KEY,
    usuario_id TEXT,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    datos TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS pagos (
    id TEXT PRIMARY KEY,
    usuario_id TEXT,
    tipo TEXT NOT NULL,
    estado TEXT NOT NULL,
    monto REAL NOT NULL,
    moneda TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    detalles TEXT NOT NULL,
    metodo_pago TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS desparasitaciones (
    id TEXT PRIMARY KEY,
    mascota_id TEXT,
    nombre TEXT NOT NULL,
    fecha DATE NOT NULL,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(mascota_id) REFERENCES mascotas(id)
);