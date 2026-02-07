import psycopg2
from credenciales import (
    nombre_host_db_azure,
    nombre_db_azure,
    nombre_usuario_db_azure,
    contrasena_db_azure
)

class DatabaseManager:
    def __init__(self):
        self.conn = None
        self.cursor = None

    def conectar(self):
        try:
            self.conn = psycopg2.connect(
                host=nombre_host_db_azure(),
                database=nombre_db_azure(),
                user=nombre_usuario_db_azure(),
                password=contrasena_db_azure(),
                port="5432",
                sslmode="require"
            )
            self.cursor = self.conn.cursor()
            return True
        except Exception as e:
            print(f"Error al conectar a Azure: {e}")
            return False

    def ejecutar_consulta(self, query, params=None):
        if not self.conn: self.conectar()
        try:
            self.cursor.execute(query, params)
            return self.cursor.fetchall()
        except Exception as e:
            print(f"Error en consulta: {e}")
            return None

    def ejecutar_comando(self, query, params=None):
        if not self.conn: self.conectar()
        try:
            self.cursor.execute(query, params)
            self.conn.commit()
            return True
        except Exception as e:
            if self.conn: self.conn.rollback()
            print(f"Error en comando: {e}")
            return False

    def cerrar(self):
        if self.cursor: self.cursor.close()
        if self.conn: self.conn.close()
        print("Conexión con Azure finalizada.")