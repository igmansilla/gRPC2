import tienda_pb2
import tienda_pb2_grpc

class TiendaService(tienda_pb2_grpc.TiendaServiceServicer):
    def __init__(self, db):
        self.db = db

    def CreateTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "INSERT INTO tiendas (nombre, direccion, telefono) VALUES (?, ?, ?)", 
            (request.nombre, request.direccion, request.telefono)
        )
        self.db.commit()
        return request

    def GetTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute("SELECT * FROM tiendas WHERE id=?", (request.id,))
        row = cursor.fetchone()
        if row:
            return tienda_pb2.Tienda(
                id=row[0], nombre=row[1], direccion=row[2], telefono=row[3]
            )
        else:
            return tienda_pb2.Tienda()

    def UpdateTienda(self, request, context):
        cursor = self.db.get_cursor()
        cursor.execute(
            "UPDATE tiendas SET nombre=?, direccion=?, telefono=? WHERE id=?", 
            (request.nombre, request.direccion, request.telefono, request.id)
        )
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
        tiendas = [
            tienda_pb2.Tienda(
                id=row[0], nombre=row[1], direccion=row[2], telefono=row[3]
            ) for row in rows
        ]
        return tienda_pb2.TiendaList(tiendas=tiendas)
