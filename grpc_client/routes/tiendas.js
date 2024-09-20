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

// Ruta para obtener una tienda por código
router.get('/getTienda/:codigo', (req, res) => {
  const request = { codigo: req.params.codigo };

  tiendaClient.GetTienda(request, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Tienda obtenida', usuario: null, producto: null, tienda: response });
    }
  });
});

// Ruta para actualizar una tienda
router.post('/updateTienda', express.urlencoded({ extended: true }), (req, res) => {
  const tienda = {
    codigo: req.body.codigo,
    direccion: req.body.direccion,
    ciudad: req.body.ciudad,
    provincia: req.body.provincia,
    habilitada: req.body.habilitada === 'true',
    producto_ids: req.body.producto_ids.split(',').map(id => parseInt(id))
  };

  tiendaClient.UpdateTienda(tienda, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Tienda actualizada: ' + response.codigo, usuario: null, producto: null, tienda: response });
    }
  });
});

// Ruta para eliminar una tienda
router.post('/deleteTienda', express.urlencoded({ extended: true }), (req, res) => {
  const request = { codigo: req.body.codigo };

  tiendaClient.DeleteTienda(request, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Tienda eliminada: ' + request.codigo, usuario: null, producto: null, tienda: null });
    }
  });
});

// Ruta para listar todas las tiendas
router.get('/listTiendas', (req, res) => {
  tiendaClient.ListTiendas({}, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ message: 'Tiendas obtenidas', tiendas: response.tiendas });
    }
  });
});


module.exports = router;
