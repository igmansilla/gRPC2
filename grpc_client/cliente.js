const express = require('express');
const path = require('path');
const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const productoRoutes = require('./routes/productos');
const tiendaRoutes = require('./routes/tiendas');

const app = express();
const port = 3000;


// Variable global para gestionar la autenticación
let isAuthenticated = false;

// Middleware para pasar la variable global a todas las vistas
app.use((req, res, next) => {
  res.locals.isAuthenticated = isAuthenticated;
  next();
});



// Configuración para servir archivos estáticos y vistas
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Usar las rutas
app.use('/', indexRoutes);
app.use('/', usuariosRoutes);
app.use('/', productoRoutes);
app.use('/', tiendaRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
