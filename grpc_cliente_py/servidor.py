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
# Implementa el servicio Usuario
class UsuarioService(usuario_pb2_grpc.UsuarioServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateUsuario(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "INSERT INTO usuarios (nombre_usuario, contrasena, tienda_id, nombre, apellido, habilitado) VALUES (?, ?, ?, ?, ?, ?)", 
            (request.nombre_usuario, request.contrasena, request.tienda_id, request.nombre, request.apellido, request.habilitado)
        )
        self.db.commit()
        return request

    def GetUsuario(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM usuarios WHERE id=?", (request.id,))
        row = cursor.fetchone()
        if row:
            return usuario_pb2.Usuario(
                id=row[0], nombre_usuario=row[1], contrasena=row[2], tienda_id=row[3],
                nombre=row[4], apellido=row[5], habilitado=row[6]
            )
        else:
            return usuario_pb2.Usuario()

    def UpdateUsuario(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "UPDATE usuarios SET nombre_usuario=?, contrasena=?, tienda_id=?, nombre=?, apellido=?, habilitado=? WHERE id=?", 
            (request.nombre_usuario, request.contrasena, request.tienda_id, request.nombre, request.apellido, request.habilitado, request.id)
        )
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
        usuarios = [
            usuario_pb2.Usuario(
                id=row[0], nombre_usuario=row[1], contrasena=row[2], tienda_id=row[3],
                nombre=row[4], apellido=row[5], habilitado=row[6]
            ) for row in rows
        ]
        return usuario_pb2.UsuarioList(usuarios=usuarios)


# Implementa el servicio Producto
# Implementa el servicio Producto
class ProductoService(producto_pb2_grpc.ProductoServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateProducto(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "INSERT INTO productos (nombre, codigo, talle, foto, color) VALUES (?, ?, ?, ?, ?)", 
            (request.nombre, request.codigo, request.talle, request.foto, request.color)
        )
        self.db.commit()
        return request

    def GetProducto(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM productos WHERE id=?", (request.id,))
        row = cursor.fetchone()
        if row:
            return producto_pb2.Producto(
                id=row[0], nombre=row[1], codigo=row[2], talle=row[3], foto=row[4], color=row[5]
            )
        else:
            return producto_pb2.Producto()

    def UpdateProducto(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "UPDATE productos SET nombre=?, codigo=?, talle=?, foto=?, color=? WHERE id=?", 
            (request.nombre, request.codigo, request.talle, request.foto, request.color, request.id)
        )
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
        productos = [
            producto_pb2.Producto(
                id=row[0], nombre=row[1], codigo=row[2], talle=row[3], foto=row[4], color=row[5]
            ) for row in rows
        ]
        return producto_pb2.ProductoList(productos=productos)


# Implementa el servicio ProductoTienda
class ProductoTiendaService(producto_tienda_pb2_grpc.ProductoTiendaServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateProductoTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "INSERT INTO producto_tienda (producto_id, tienda_id, color, talle, cantidad) VALUES (?, ?, ?, ?, ?)", 
            (request.producto_id, request.tienda_id, request.color, request.talle, request.cantidad)
        )
        self.db.commit()
        return request

    def GetProductoTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM producto_tienda WHERE id=?", (request.id,))
        row = cursor.fetchone()
        if row:
            return producto_tienda_pb2.ProductoTienda(
                id=row[0], producto_id=row[1], tienda_id=row[2], color=row[3], talle=row[4], cantidad=row[5]
            )
        else:
            return producto_tienda_pb2.ProductoTienda()

    def UpdateProductoTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "UPDATE producto_tienda SET producto_id=?, tienda_id=?, color=?, talle=?, cantidad=? WHERE id=?", 
            (request.producto_id, request.tienda_id, request.color, request.talle, request.cantidad, request.id)
        )
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
        productos_tienda = [
            producto_tienda_pb2.ProductoTienda(
                id=row[0], producto_id=row[1], tienda_id=row[2], color=row[3], talle=row[4], cantidad=row[5]
            ) for row in rows
        ]
        return producto_tienda_pb2.ProductoTiendaList(productos=productos_tienda)


# Implementa el servicio Tienda
class TiendaService(tienda_pb2_grpc.TiendaServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "INSERT INTO tiendas (codigo, direccion, ciudad, provincia, habilitada) VALUES (?, ?, ?, ?, ?)", 
            (request.codigo, request.direccion, request.ciudad, request.provincia, request.habilitada)
        )
        self.db.commit()
        return request

    def GetTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM tiendas WHERE codigo=?", (request.codigo,))
        row = cursor.fetchone()
        if row:
            return tienda_pb2.Tienda(
                codigo=row[0], direccion=row[1], ciudad=row[2], provincia=row[3], habilitada=row[4]
            )
        else:
            return tienda_pb2.Tienda()

    def UpdateTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "UPDATE tiendas SET direccion=?, ciudad=?, provincia=?, habilitada=? WHERE codigo=?", 
            (request.direccion, request.ciudad, request.provincia, request.habilitada, request.codigo)
        )
        self.db.commit()
        return request

    def DeleteTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("DELETE FROM tiendas WHERE codigo=?", (request.codigo,))
        self.db.commit()
        return request

    def ListTiendas(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM tiendas")
        rows = cursor.fetchall()
        tiendas = [
            tienda_pb2.Tienda(
                codigo=row[0], direccion=row[1], ciudad=row[2], provincia=row[3], habilitada=row[4]
            ) for row in rows
        ]
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
