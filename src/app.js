import express from 'express';
import { pool } from './db.js';
import { PORT } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para leer el body en formato JSON
app.use(express.json());

// Configuración de sesiones para manejo de autenticación
app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: true
}));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect('/');
  }
}

// Ruta principal para el Login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

// Ruta protegida para el Dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/dashboard.html'));
});

// Ruta para manejar autenticación
app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE name = ? AND password = ?', [name, password]);

    if (rows.length > 0) {
      req.session.isAuthenticated = true; // Establecer sesión autenticada
      res.json({ success: true, message: 'Autenticación exitosa' });
    } else {
      res.status(401).json({ success: false, message: 'Nombre o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para obtener usuarios (opcional)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Ruta para obtener usuarios (opcional)
app.get('/api/datos_baston', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM datos_baston ORDER BY Fecha DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener Dastos del Baston:', error);
    res.status(500).json({ error: 'Error al obtener Datos del Baston' });
  }
});

// Cerrar sesión
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }
    res.json({ success: true, message: 'Sesión cerrada exitosamente' });
  });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log('Server on port', PORT);
});
