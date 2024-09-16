const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Rutas a los archivos .proto
const PROTO_PATH_HELLO = path.join(__dirname, 'helloworld.proto');
const PROTO_PATH_USUARIO = path.join(__dirname, 'usuario.proto');
const PROTO_PATH_PRODUCTO = path.join(__dirname, 'producto.proto');
const PROTO_PATH_TIENDA = path.join(__dirname, 'tienda.proto');

// Cargar definiciones de los archivos .proto
const loadProto = (protoPath) => {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  return grpc.loadPackageDefinition(packageDefinition);
};

const protoDescriptorHello = loadProto(PROTO_PATH_HELLO);
const protoDescriptorUsuario = loadProto(PROTO_PATH_USUARIO);
const protoDescriptorProducto = loadProto(PROTO_PATH_PRODUCTO);
const protoDescriptorTienda = loadProto(PROTO_PATH_TIENDA);

const greeterProto = protoDescriptorHello.Greeter;
const usuarioProto = protoDescriptorUsuario.UsuarioService;
const productoProto = protoDescriptorProducto.ProductoService;
const tiendaProto = protoDescriptorTienda.TiendaService;

// Crear clientes gRPC
const greeterClient = new greeterProto('localhost:50051', grpc.credentials.createInsecure());
const usuarioClient = new usuarioProto('localhost:50051', grpc.credentials.createInsecure());
const productoClient = new productoProto('localhost:50051', grpc.credentials.createInsecure());
const tiendaClient = new tiendaProto('localhost:50051', grpc.credentials.createInsecure());

module.exports = {
  greeterClient,
  usuarioClient,
  productoClient,
  tiendaClient,
};
