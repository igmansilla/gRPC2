import sqlite3

class InMemoryDatabase:
    def __init__(self):
        self.conn = sqlite3.connect(':memory:', check_same_thread=False)  # Conexión a la base de datos en memoria
        self.create_tables()
        self.insert_test_data()  # Inserta datos de prueba al crear la base de datos

    def create_tables(self):
        cursor = self.conn.cursor()
        # Crear tablas si no existen
        queries = [
            '''
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_usuario TEXT UNIQUE NOT NULL,
                contrasena TEXT NOT NULL,
                tienda_id TEXT,
                nombre TEXT,
                apellido TEXT,
                habilitado BOOLEAN
            )
            ''',
            '''
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                codigo TEXT UNIQUE NOT NULL,
                talle TEXT,
                foto TEXT,
                color TEXT
            )
            ''',
            '''
            CREATE TABLE IF NOT EXISTS tiendas (
                codigo TEXT PRIMARY KEY,
                direccion TEXT,
                ciudad TEXT,
                provincia TEXT,
                habilitada BOOLEAN
            )
            ''',
            '''
            CREATE TABLE IF NOT EXISTS producto_tienda (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                producto_id INTEGER,
                tienda_id TEXT,
                color TEXT,
                talle TEXT,
                cantidad INTEGER,
                FOREIGN KEY (producto_id) REFERENCES productos(id),
                FOREIGN KEY (tienda_id) REFERENCES tiendas(codigo)
            )
            '''
        ]
        for query in queries:
            print(f"Ejecutando consulta: {query}")
            cursor.execute(query)
        self.conn.commit()

    def insert_test_data(self):
        cursor = self.conn.cursor()
        
        # Insertar usuarios
        queries = [
            '''
            INSERT INTO usuarios (nombre_usuario, contrasena, tienda_id, nombre, apellido, habilitado)
            VALUES ('juan', 'password123', 'T001', 'Juan', 'Pérez', 1)
            ''',
            '''
            INSERT INTO usuarios (nombre_usuario, contrasena, tienda_id, nombre, apellido, habilitado)
            VALUES ('ana', 'password123', 'T002', 'Ana', 'Gómez', 1)
            '''
        ]
        for query in queries:
            print(f"Ejecutando consulta: {query}")
            cursor.execute(query)
        
        # Insertar productos
        queries = [
            '''
            INSERT INTO productos (nombre, codigo, talle, foto, color)
            VALUES ('Producto A', 'A001', 'M', 'url/to/fotoA', 'Rojo')
            ''',
            '''
            INSERT INTO productos (nombre, codigo, talle, foto, color)
            VALUES ('Producto B', 'B002', 'L', 'url/to/fotoB', 'Azul')
            '''
        ]
        for query in queries:
            print(f"Ejecutando consulta: {query}")
            cursor.execute(query)
        
        # Insertar tiendas
        queries = [
            '''
            INSERT INTO tiendas (codigo, direccion, ciudad, provincia, habilitada)
            VALUES ('T001', 'Calle Falsa 123', 'Ciudad X', 'Provincia X', 1)
            ''',
            '''
            INSERT INTO tiendas (codigo, direccion, ciudad, provincia, habilitada)
            VALUES ('T002', 'Calle Verdadera 456', 'Ciudad Y', 'Provincia Y', 1)
            '''
        ]
        for query in queries:
            print(f"Ejecutando consulta: {query}")
            cursor.execute(query)
        
        # Insertar producto_tienda
        queries = [
            '''
            INSERT INTO producto_tienda (producto_id, tienda_id, color, talle, cantidad)
            VALUES ((SELECT id FROM productos WHERE codigo='A001'), 'T001', 'Rojo', 'M', 100)
            ''',
            '''
            INSERT INTO producto_tienda (producto_id, tienda_id, color, talle, cantidad)
            VALUES ((SELECT id FROM productos WHERE codigo='B002'), 'T002', 'Azul', 'L', 150)
            '''
        ]
        for query in queries:
            print(f"Ejecutando consulta: {query}")
            cursor.execute(query)
        
        self.conn.commit()

    def get_cursor(self):
        return self.conn.cursor()

    def commit(self):
        self.conn.commit()
