def create_tables(conn):
    cursor = conn.cursor()
    
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
    
    conn.commit()
