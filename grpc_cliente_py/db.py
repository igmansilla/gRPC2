import sqlite3

class InMemoryDatabase:
    def __init__(self):
        self.conn = sqlite3.connect(':memory:')  # Conexión a la base de datos en memoria
        self.create_tables()
        self.insert_test_data()  # Inserta datos de prueba al crear la base de datos

    def create_tables(self):
        cursor = self.conn.cursor()
        # Crear tablas de ejemplo
        cursor.execute('''CREATE TABLE usuarios (
                            id INTEGER PRIMARY KEY,
                            nombre TEXT
                        )''')
        cursor.execute('''CREATE TABLE productos (
                            id INTEGER PRIMARY KEY,
                            nombre TEXT
                        )''')
        cursor.execute('''CREATE TABLE tiendas (
                            id INTEGER PRIMARY KEY,
                            nombre TEXT
                        )''')
        cursor.execute('''CREATE TABLE producto_tienda (
                            id INTEGER PRIMARY KEY,
                            producto_id INTEGER,
                            tienda_id INTEGER,
                            FOREIGN KEY(producto_id) REFERENCES productos(id),
                            FOREIGN KEY(tienda_id) REFERENCES tiendas(id)
                        )''')
        self.conn.commit()

    def insert_test_data(self):
        cursor = self.conn.cursor()
        # Insertar datos de prueba en las tablas
        cursor.execute("INSERT INTO usuarios (nombre) VALUES ('Juan')")
        cursor.execute("INSERT INTO usuarios (nombre) VALUES ('Ana')")
        
        cursor.execute("INSERT INTO productos (nombre) VALUES ('Producto A')")
        cursor.execute("INSERT INTO productos (nombre) VALUES ('Producto B')")
        
        cursor.execute("INSERT INTO tiendas (nombre) VALUES ('Tienda X')")
        cursor.execute("INSERT INTO tiendas (nombre) VALUES ('Tienda Y')")
        
        cursor.execute("INSERT INTO producto_tienda (producto_id, tienda_id) VALUES (1, 1)")
        cursor.execute("INSERT INTO producto_tienda (producto_id, tienda_id) VALUES (2, 2)")
        
        self.conn.commit()

    def get_cursor(self):
        return self.conn.cursor()

    def commit(self):
        self.conn.commit()
