const express = require('express');
const router = express.Router();
const { productoClient } = require('../grpcClient');

// Ruta para manejar la creación de productos
router.post('/createProducto', express.urlencoded({ extended: true }), (req, res) => {
  const producto = {
    id: parseInt(req.body.id),
    nombre: req.body.nombre,
    codigo: req.body.codigo,
    talle: req.body.talle,
    foto: req.body.foto,
    color: req.body.color,
    tienda_ids: req.body.tienda_ids.split(',')
  };

  productoClient.CreateProducto(producto, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Producto creado: ' + response.nombre, usuario: null, producto: response, tienda: null });
    }
  });
});

// Ruta para listar productos
router.get('/listProductos', (req, res) => {
  productoClient.ListProductos({}, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuarios: null, productos: null, tiendas: null });
    } else {
      res.render('index', { message: 'Productos obtenidos', usuarios: null, productos: response.productos, tiendas: null });
    }
  });
});

module.exports = router;
