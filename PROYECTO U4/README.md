# GamingZA

**GamingZA** es una aplicación web desarrollada con Flask cuyo propósito es ofrecer un portal de noticias sobre videojuegos y anime. Los usuarios pueden interactuar dejando reseñas, compartiendo guías de juegos y explorando una tienda virtual con productos temáticos del mundo gamer y otaku.

## 🎯 Objetivos del Proyecto

- Informar sobre noticias recientes de videojuegos y anime.
- Crear una comunidad donde los usuarios puedan dejar reseñas y guías.
- Ofrecer una tienda con productos del mundo geek.

## 🧩 Tecnologías Utilizadas

- **Lenguaje:** Python 3.13
- **Framework:** Flask
- **Base de datos:** MySQL
- **Dependencias:** especificadas en `requirements.txt`

## 🧰 Funcionalidades

- Registro e inicio de sesión de usuarios.
- Publicación de reseñas y guías.
- Sección de noticias dinámicas.
- Catálogo de productos con opción de búsqueda y filtrado.
- Panel de administración (si aplica).

## 📦 Requisitos Previos

Antes de instalar y ejecutar esta aplicación, asegúrate de tener:

- Python 3.10 o superior (se usó 3.13 en este proyecto)
- MySQL Server
- pip (gestor de paquetes de Python)
- Git (opcional)

## 🚀 Instrucciones de Instalación

1. **Clona el repositorio** (si aplica):
   ```bash
   git clone https://github.com/tu_usuario/gamingza.git
   cd gamingza
   ```

2. **Crea un entorno virtual (opcional pero recomendado):**
   ```bash
   python -m venv env
   source env/bin/activate  # En Windows: env\Scripts\activate
   ```

3. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configura la base de datos:**
   - Crea una base de datos en MySQL.
   - Ejecuta el script `database/GamingZA.sql` para crear las tablas necesarias:
     ```bash
     mysql -u usuario -p < database/GamingZA.sql
     ```

5. **Ejecuta la aplicación:**
   ```bash
   python app.py
   ```

6. **Accede a la app en tu navegador:**
   ```
   http://localhost:5000
   ```

## 📁 Estructura del Proyecto

```
Proyectou3/
│
├── app.py                # Punto de entrada principal de la app
├── config.py             # Configuración de conexión y Flask
├── routes.py             # Rutas y vistas
├── requirements.txt      # Dependencias del proyecto
├── database/             # Scripts SQL de la base de datos
├──
│   ├── GamingZA.sql
│   └── GamingZA consultas.sql
└── env/                  # Entorno virtual (excluido en Git)
```

## 🧪 Pruebas Realizadas

- ✔️ Chrome (PC y móvil)
- ✔️ Firefox
- ❌ Safari (pendiente)

## 🔮 Mejoras Futuras

- Integración de sistema de pagos en la tienda.
- Mejora del sistema de comentarios y likes.
- Panel de moderación para contenido de usuarios.

## 📚 Recursos y Créditos

- [Documentación oficial de Flask](https://flask.palletsprojects.com/)
- [W3Schools - MySQL Tutorial](https://www.w3schools.com/sql/)
- [Bootstrap](https://getbootstrap.com/) para el diseño responsivo

## 👥 Autores

- Jose de Jesus Aguilera Cebreros.
- Luis Daniel Serrano Avendaño.
- Miguel Angel Salas Robles.


## 📌 Estado del Proyecto

✅ Proyecto funcional — En proceso de mejoras.

## 📷 Capturas de Pantalla

_Puedes añadir capturas aquí para mostrar el diseño o funcionalidad principal._


