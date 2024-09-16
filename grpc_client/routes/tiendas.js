const express = require('express');
const router = express.Router();
const { tiendaClient } = require('../grpcClient');

// Ruta para manejar la creación de tiendas
router.post('/createTienda', express.urlencoded({ extended: true }), (req, res) => {
  const tienda = {
    codigo: req.body.codigo,
    direccion: req.body.direccion,
    ciudad: req.body.ciudad,
    provincia: req.body.provincia,
    habilitada: req.body.habilitada === 'true',
    producto_ids: req.body.producto_ids.split(',').map(id => parseInt(id))
  };

  tiendaClient.CreateTienda(tienda, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Tienda creada: ' + response.codigo, usuario: null, producto: null, tienda: response });
    }
  });
});

// Ruta para listar tiendas
router.get('/listTiendas', (req, res) => {
  tiendaClient.ListTiendas({}, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuarios: null, productos: null, tiendas: null });
    } else {
      res.render('index', { message: 'Tiendas obtenidas', usuarios: null, productos: null, tiendas: response.tiendas });
    }
  });
});

module.exports = router;
