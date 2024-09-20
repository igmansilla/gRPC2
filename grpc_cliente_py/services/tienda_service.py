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

        # Realiza la consulta para obtener las tiendas y sus productos relacionados
        query = '''
        SELECT 
            t.codigo, t.direccion, t.ciudad, t.provincia, t.habilitada, 
            GROUP_CONCAT(pt.producto_id) as producto_ids
        FROM tiendas t
        LEFT JOIN producto_tienda pt ON t.codigo = pt.tienda_id
        GROUP BY t.codigo, t.direccion, t.ciudad, t.provincia, t.habilitada
        '''
        cursor.execute(query)
        rows = cursor.fetchall()

        tiendas = []
        for row in rows:
            # Convertir la cadena concatenada de producto_ids a una lista de enteros
            producto_ids = [int(pid) for pid in row[5].split(',')] if row[5] else []

            tienda = tienda_pb2.Tienda(
                codigo=row[0],
                direccion=row[1],
                ciudad=row[2],
                provincia=row[3],
                habilitada=row[4],
                producto_ids=producto_ids
            )
            tiendas.append(tienda)

        # Devolver la lista de tiendas en el formato esperado
        return tienda_pb2.TiendaList(tiendas=tiendas)
