import producto_pb2
import producto_pb2_grpc

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
