const express = require('express');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Configuración del servidor gRPC
const PROTO_PATH_HELLO = path.join(__dirname, 'helloworld.proto');
const PROTO_PATH_USUARIO = path.join(__dirname, 'usuario.proto');
const PROTO_PATH_PRODUCTO = path.join(__dirname, 'producto.proto');
const PROTO_PATH_TIENDA = path.join(__dirname, 'tienda.proto');

const packageDefinitionHello = protoLoader.loadSync(PROTO_PATH_HELLO, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const packageDefinitionUsuario = protoLoader.loadSync(PROTO_PATH_USUARIO, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const packageDefinitionProducto = protoLoader.loadSync(PROTO_PATH_PRODUCTO, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const packageDefinitionTienda = protoLoader.loadSync(PROTO_PATH_TIENDA, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptorHello = grpc.loadPackageDefinition(packageDefinitionHello);
const protoDescriptorUsuario = grpc.loadPackageDefinition(packageDefinitionUsuario);
const protoDescriptorProducto = grpc.loadPackageDefinition(packageDefinitionProducto);
const protoDescriptorTienda = grpc.loadPackageDefinition(packageDefinitionTienda);

const greeterProto = protoDescriptorHello.Greeter;
const usuarioProto = protoDescriptorUsuario.UsuarioService;
const productoProto = protoDescriptorProducto.ProductoService;
const tiendaProto = protoDescriptorTienda.TiendaService;

// Crear clientes gRPC
const greeterClient = new greeterProto('localhost:50051', grpc.credentials.createInsecure());
const usuarioClient = new usuarioProto('localhost:50051', grpc.credentials.createInsecure());
const productoClient = new productoProto('localhost:50051', grpc.credentials.createInsecure());
const tiendaClient = new tiendaProto('localhost:50051', grpc.credentials.createInsecure());

// Configuración de Express
const app = express();
const port = 3000;

// Configuración para servir archivos estáticos y vistas
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para mostrar el formulario
app.get('/', (req, res) => {
  res.render('index', { message: '', usuario: null, producto: null, tienda: null }); // Asegúrate de pasar variables por defecto
});

// Ruta para manejar el formulario y llamar al cliente gRPC para SayHello
app.post('/send', express.urlencoded({ extended: true }), (req, res) => {
  const name = req.body.name;

  greeterClient.SayHello({ name }, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: response.message, usuario: null, producto: null, tienda: null });
    }
  });
});

// Ruta para manejar la creación de usuarios
app.post('/createUsuario', express.urlencoded({ extended: true }), (req, res) => {
  const usuario = {
    id: parseInt(req.body.id),
    nombreUsuario: req.body.nombreUsuario,
    contrasena: req.body.contrasena,
    tienda_id: req.body.tienda_id,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    habilitado: req.body.habilitado === 'true', // Convertir a booleano
  };

  usuarioClient.CreateUsuario(usuario, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuario: null, producto: null, tienda: null });
    } else {
      res.render('index', { message: 'Usuario creado: ' + response.nombreUsuario, usuario: response, producto: null, tienda: null });
    }
  });
});

// Ruta para manejar la creación de productos
app.post('/createProducto', express.urlencoded({ extended: true }), (req, res) => {
  const producto = {
    id: parseInt(req.body.id),
    nombre: req.body.nombre,
    codigo: req.body.codigo,
    talle: req.body.talle,
    foto: req.body.foto,
    color: req.body.color,
    tienda_ids: req.body.tienda_ids.split(',') // Suponiendo que `tienda_ids` se pasa como una lista separada por comas
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

// Ruta para manejar la creación de tiendas
app.post('/createTienda', express.urlencoded({ extended: true }), (req, res) => {
  const tienda = {
    codigo: req.body.codigo,
    direccion: req.body.direccion,
    ciudad: req.body.ciudad,
    provincia: req.body.provincia,
    habilitada: req.body.habilitada === 'true', // Convertir a booleano
    producto_ids: req.body.producto_ids.split(',').map(id => parseInt(id)) // Suponiendo que `producto_ids` se pasa como una lista separada por comas
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

// Ruta para listar todos los usuarios
app.get('/listUsuarios', (req, res) => {
  usuarioClient.ListUsuarios({}, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuarios: null, productos: null, tiendas: null });
    } else {
      res.render('index', { message: 'Usuarios obtenidos', usuarios: response.usuarios, productos: null, tiendas: null });
    }
  });
});

// Ruta para listar todos los productos
app.get('/listProductos', (req, res) => {
  productoClient.ListProductos({}, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuarios: null, productos: null, tiendas: null });
    } else {
      res.render('index', { message: 'Productos obtenidos', usuarios: null, productos: response.productos, tiendas: null });
    }
  });
});

// Ruta para listar todas las tiendas
app.get('/listTiendas', (req, res) => {
  tiendaClient.ListTiendas({}, (error, response) => {
    if (error) {
      console.error('Error:', error);
      res.render('index', { message: 'Error: ' + error.message, usuarios: null, productos: null, tiendas: null });
    } else {
      res.render('index', { message: 'Tiendas obtenidas', usuarios: null, productos: null, tiendas: response.tiendas });
    }
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
