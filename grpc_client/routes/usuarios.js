const express = require('express');
const router = express.Router();
const { usuarioClient } = require('../grpcClient');

//Cambiar esto


// Ruta para manejar la creación de usuarios
router.post('/createUsuario', express.urlencoded({ extended: true }), (req, res) => {
  const usuario = {
    id: parseInt(req.body.id),
    nombreUsuario: req.body.nombreUsuario,
    contrasena: req.body.contrasena,
    tienda_id: req.body.tienda_id,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    habilitado: req.body.habilitado === 'true',
  };

  usuarioClient.CreateUsuario(usuario, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.redirect('/login');
    }
  });
});

// Ruta para manejar el login
router.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  const usuarioRequest = {
    nombreUsuario,
    contrasena
  };

  usuarioClient.GetUsuario(usuarioRequest, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else if (response && response.nombreUsuario === nombreUsuario && response.contrasena === contrasena) {
      res.render('index', { message: 'Login exitoso', usuario: { nombreUsuario }, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Usuario o contraseña incorrectos', usuario: null, producto: null, tienda: null });
    }
  });
});
// Ruta para listar usuarios
router.get('/listUsuarios', (req, res) => {
  usuarioClient.ListUsuarios({}, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuarios: null, productos: null, tiendas: null });
    } else {
      res.render('index', { message: 'Usuarios obtenidos', usuarios: response.usuarios, productos: null, tiendas: null });
    }
  });
});

module.exports = router;
