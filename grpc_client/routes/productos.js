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

// Ruta para obtener un producto por código
router.get('/getProducto/:codigo', (req, res) => {
  const request = { codigo: req.params.codigo };

  productoClient.GetProducto(request, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Producto obtenido', usuario: null, producto: response, tienda: null });
    }
  });
});

// Ruta para actualizar un producto
router.post('/updateProducto', express.urlencoded({ extended: true }), (req, res) => {
  const producto = {
    id: parseInt(req.body.id),
    nombre: req.body.nombre,
    codigo: req.body.codigo,
    talle: req.body.talle,
    foto: req.body.foto,
    color: req.body.color,
    tienda_ids: req.body.tienda_ids.split(',')
  };

  productoClient.UpdateProducto(producto, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Producto actualizado: ' + response.nombre, usuario: null, producto: response, tienda: null });
    }
  });
});

// Ruta para eliminar un producto
router.post('/deleteProducto', express.urlencoded({ extended: true }), (req, res) => {
  const request = { id: parseInt(req.body.id) };

  productoClient.DeleteProducto(request, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Producto eliminado: ' + request.id, usuario: null, producto: null, tienda: null });
    }
  });
});

router.get('/listProductos', (req, res) => {
  productoClient.ListProductos({}, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    } else {
      res.json({ productos: response.productos });
    }
  });
});
  

module.exports = router;
