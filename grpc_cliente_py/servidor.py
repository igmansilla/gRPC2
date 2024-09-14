from concurrent import futures
import grpc
import sqlite3
import helloworld_pb2
import helloworld_pb2_grpc
import producto_pb2
import producto_pb2_grpc
import tienda_pb2
import tienda_pb2_grpc
import usuario_pb2
import usuario_pb2_grpc
import producto_tienda_pb2_grpc
import producto_tienda_pb2
from db import InMemoryDatabase  # Importa la clase de base de datos

# Implementa el servicio Greeter
class Greeter(helloworld_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        return helloworld_pb2.HelloReply(message=f"Hello, {request.name}")

# Implementa el servicio Usuario
class UsuarioService(usuario_pb2_grpc.UsuarioServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateUsuario(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("INSERT INTO usuarios (nombre) VALUES (?)", (request.nombre,))
        self.db.commit()
        return request

    def GetUsuario(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM usuarios WHERE id=?", (request.id,))
        row = cursor.fetchone()
        return usuario_pb2.Usuario(id=row[0], nombre=row[1]) if row else usuario_pb2.Usuario()

    def UpdateUsuario(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("UPDATE usuarios SET nombre=? WHERE id=?", (request.nombre, request.id))
        self.db.commit()
        return request

    def DeleteUsuario(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("DELETE FROM usuarios WHERE id=?", (request.id,))
        self.db.commit()
        return request

    def ListUsuarios(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM usuarios")
        rows = cursor.fetchall()
        usuarios = [usuario_pb2.Usuario(id=row[0], nombre=row[1]) for row in rows]
        return usuario_pb2.UsuarioList(usuarios=usuarios)

# Implementa el servicio Producto
class ProductoService(producto_pb2_grpc.ProductoServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateProducto(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("INSERT INTO productos (nombre) VALUES (?)", (request.nombre,))
        self.db.commit()
        return request

    def GetProducto(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM productos WHERE id=?", (request.id,))
        row = cursor.fetchone()
        return producto_pb2.Producto(id=row[0], nombre=row[1]) if row else producto_pb2.Producto()

    def UpdateProducto(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("UPDATE productos SET nombre=? WHERE id=?", (request.nombre, request.id))
        self.db.commit()
        return request

    def DeleteProducto(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("DELETE FROM productos WHERE id=?", (request.id,))
        self.db.commit()
        return request

    def ListProductos(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM productos")
        rows = cursor.fetchall()
        productos = [producto_pb2.Producto(id=row[0], nombre=row[1]) for row in rows]
        return producto_pb2.ProductoList(productos=productos)

# Implementa el servicio ProductoTienda
class ProductoTiendaService(producto_tienda_pb2_grpc.ProductoTiendaServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateProductoTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("INSERT INTO producto_tienda (producto_id, tienda_id) VALUES (?, ?)", 
                       (request.producto_id, request.tienda_id))
        self.db.commit()
        return request

    def GetProductoTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM producto_tienda WHERE id=?", (request.id,))
        row = cursor.fetchone()
        return producto_tienda_pb2.ProductoTienda(id=row[0], producto_id=row[1], tienda_id=row[2]) if row else producto_tienda_pb2.ProductoTienda()

    def UpdateProductoTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("UPDATE producto_tienda SET producto_id=?, tienda_id=? WHERE id=?", 
                       (request.producto_id, request.tienda_id, request.id))
        self.db.commit()
        return request

    def DeleteProductoTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("DELETE FROM producto_tienda WHERE id=?", (request.id,))
        self.db.commit()
        return request

    def ListProductoTiendas(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM producto_tienda")
        rows = cursor.fetchall()
        productos = [producto_tienda_pb2.ProductoTienda(id=row[0], producto_id=row[1], tienda_id=row[2]) for row in rows]
        return producto_tienda_pb2.ProductoTiendaList(productos=productos)

# Implementa el servicio Tienda
class TiendaService(tienda_pb2_grpc.TiendaServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("INSERT INTO tiendas (nombre) VALUES (?)", (request.nombre,))
        self.db.commit()
        return request

    def GetTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM tiendas WHERE id=?", (request.id,))
        row = cursor.fetchone()
        return tienda_pb2.Tienda(id=row[0], nombre=row[1]) if row else tienda_pb2.Tienda()

    def UpdateTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("UPDATE tiendas SET nombre=? WHERE id=?", (request.nombre, request.id))
        self.db.commit()
        return request

    def DeleteTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("DELETE FROM tiendas WHERE id=?", (request.id,))
        self.db.commit()
        return request

    def ListTiendas(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM tiendas")
        rows = cursor.fetchall()
        tiendas = [tienda_pb2.Tienda(id=row[0], nombre=row[1]) for row in rows]
        return tienda_pb2.TiendaList(tiendas=tiendas)

# Configuración del servidor gRPC
def serve():
    db = InMemoryDatabase()  # Inicializa la base de datos en memoria con datos de prueba
    
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    # Añade la implementación del servicio al servidor
    helloworld_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    usuario_pb2_grpc.add_UsuarioServiceServicer_to_server(UsuarioService(db), server)
    producto_pb2_grpc.add_ProductoServiceServicer_to_server(ProductoService(db), server)
    producto_tienda_pb2_grpc.add_ProductoTiendaServiceServicer_to_server(ProductoTiendaService(db), server)
    tienda_pb2_grpc.add_TiendaServiceServicer_to_server(TiendaService(db), server)

    # Escucha en el puerto 50051
    server.add_insecure_port('[::]:50051')

    # Inicia el servidor
    server.start()
    print("Servidor gRPC corriendo en el puerto 50051...")

    # Mantiene el servidor corriendo indefinidamente
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
