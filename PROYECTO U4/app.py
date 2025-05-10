from flask import Flask, render_template, redirect, url_for, request, flash, session, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mysqldb import MySQL

# Configuración de la aplicación
app = Flask(__name__)
app.config.from_object('config.Config')
mysql = MySQL(app)

# Configuración del Login Manager
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = "Por favor, inicia sesión para acceder"
login_manager.login_message_category = "info"

# Clase de Usuario
class User(UserMixin):
    def __init__(self, id, username, role_id):
        self.id = id
        self.username = username
        self.role_id = role_id

    def get_id(self):
        return str(self.id)

# Inyectar estado de sesión en todas las plantillas
@app.context_processor
def inject_user():
    return dict(logged_in=current_user.is_authenticated, username=current_user.username if current_user.is_authenticated else None)


# Cargar el usuario desde la sesión
@login_manager.user_loader
def load_user(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, username, role_id FROM usuarios WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if user:
        return User(user[0], user[1], user[2])
    return None

# Ruta principal (Index)
@app.route('/')
def index():
    return render_template('index.html')

# Ruta unificada para Login y Registro
@app.route('/login', methods=['GET', 'POST'], endpoint='login')
def login_register():
    if request.method == 'POST':
        # Verificar si es login o registro según el botón que se presionó
        if 'login' in request.form:
            # Proceso de Login
            username = request.form['username']
            password = request.form['password']

            cursor = mysql.connection.cursor()
            cursor.execute("SELECT id, username, password, role_id FROM usuarios WHERE username = %s", (username,))
            user = cursor.fetchone()

            if user and user[2] == password:
                user_obj = User(user[0], user[1], user[3])
                login_user(user_obj)
                session['username'] = user[1]
                session['role'] = 'admin' if user[3] == 1 else 'editor' if user[3] == 2 else 'client'
                flash(f'Bienvenido {session["username"]} ({session["role"]})', 'success')
                return redirect(url_for('index'))
            else:
                flash('Usuario o contraseña incorrectos', 'danger')

        elif 'register' in request.form:
            # Proceso de Registro
            username = request.form['username']
            email = request.form['email']
            password = request.form['password']
            role_id = 3  # Cliente por defecto

            cursor = mysql.connection.cursor()
            try:
                # Verificar si el usuario ya existe
                cursor.execute("SELECT id FROM usuarios WHERE username = %s OR email = %s", (username, email))
                existing_user = cursor.fetchone()

                if existing_user:
                    flash('El usuario o correo ya está registrado.', 'warning')
                    return redirect(url_for('login'))

                # Guardar el nuevo usuario en la base de datos
                cursor.execute("""
                    INSERT INTO usuarios (username, email, password, role_id)
                    VALUES (%s, %s, %s, %s)
                """, (username, email, password, role_id))
                mysql.connection.commit()

                # Iniciar sesión automáticamente después de registrarse
                cursor.execute("SELECT id, username, role_id FROM usuarios WHERE username = %s", (username,))
                user = cursor.fetchone()
                if user:
                    user_obj = User(user[0], user[1], user[2])
                    login_user(user_obj)
                    session['username'] = user[1]
                    session['role'] = 'client'
                    flash(f'Bienvenido {session["username"]} ({session["role"]})', 'success')
                    return redirect(url_for('index'))
            except Exception as e:
                flash(f'Error al registrar: {str(e)}', 'danger')
                return redirect(url_for('login'))
    return render_template('login.html')


# Ruta para registrar administradores o editores (solo accesible por administradores)
@app.route('/admin/register', methods=['GET', 'POST'])
@login_required
def admin_register():
    # Verificar si el usuario tiene rol de administrador
    if session.get('role') != 'admin':
        flash('Acceso denegado: Solo los administradores pueden acceder.', 'danger')
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        role = request.form.get('role')

        # Determinar el ID de rol (1=admin, 2=editor)
        role_id = 1 if role == 'admin' else 2

        cursor = mysql.connection.cursor()
        try:
            # Verificar si el usuario ya existe
            cursor.execute("SELECT id FROM usuarios WHERE username = %s OR email = %s", (username, email))
            existing_user = cursor.fetchone()

            if existing_user:
                flash('El usuario o correo ya está registrado.', 'warning')
                return redirect(url_for('admin_register'))

            # Guardar el nuevo usuario en la base de datos
            cursor.execute("""
                INSERT INTO usuarios (username, email, password, role_id)
                VALUES (%s, %s, %s, %s)
            """, (username, email, password, role_id))
            mysql.connection.commit()
            flash(f'Usuario {username} registrado exitosamente como {role}.', 'success')
            return redirect(url_for('admin_register'))
        except Exception as e:
            flash(f'Error al registrar: {str(e)}', 'danger')
            return redirect(url_for('admin_register'))
    return render_template('admin_register.html')

@app.route('/carrito/agregar', methods=['POST'])
@login_required
def agregar_carrito():
    try:
        data = request.get_json()
        producto_id = data.get('producto_id')
        cantidad = data.get('cantidad', 1)

        cursor = mysql.connection.cursor()
        
        # Verificar si el producto ya está en el carrito del usuario
        cursor.execute("""
            SELECT cantidad FROM carrito 
            WHERE usuario_id = %s AND producto_id = %s
        """, (current_user.id, producto_id))
        item = cursor.fetchone()

        if item:
            # Actualizar cantidad si ya existe
            nueva_cantidad = item[0] + cantidad
            cursor.execute("""
                UPDATE carrito SET cantidad = %s 
                WHERE usuario_id = %s AND producto_id = %s
            """, (nueva_cantidad, current_user.id, producto_id))
        else:
            # Insertar nuevo producto en el carrito
            cursor.execute("""
                INSERT INTO carrito (usuario_id, producto_id, cantidad) 
                VALUES (%s, %s, %s)
            """, (current_user.id, producto_id, cantidad))

        mysql.connection.commit()
        return jsonify({'success': True, 'message': 'Producto agregado al carrito'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
    
@app.route('/carrito/obtener')
@login_required
def obtener_carrito():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT p.id, p.nombre, p.precio, p.imagen, c.cantidad 
            FROM carrito c 
            JOIN productos p ON c.producto_id = p.id 
            WHERE c.usuario_id = %s
        """, (current_user.id,))
        carrito = cursor.fetchall()

        carrito_list = [{'id': item[0], 'nombre': item[1], 'precio': item[2], 'imagen': item[3], 'cantidad': item[4]} for item in carrito]
        return jsonify({'success': True, 'carrito': carrito_list})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/carrito/eliminar', methods=['POST'])
@login_required
def eliminar_carrito():
    try:
        data = request.get_json()
        producto_id = data.get('producto_id')

        cursor = mysql.connection.cursor()
        cursor.execute("""
            DELETE FROM carrito 
            WHERE usuario_id = %s AND producto_id = %s
        """, (current_user.id, producto_id))
        mysql.connection.commit()

        return jsonify({'success': True, 'message': 'Producto eliminado del carrito'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})



# Cerrar Sesión
@app.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()
    flash('Sesión cerrada exitosamente', 'success')
    return redirect(url_for('login'))

# Rutas adicionales
@app.route('/reviews')
def reviews():
    return render_template('reviews.html')

@app.route('/noticias')
def noticias():
    return render_template('noticias.html')

@app.route('/guias')
def guias():
    return render_template('guias.html')

@app.route('/tienda')
def tienda():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, nombre, precio, descripcion, imagen FROM productos")
    productos = cursor.fetchall()
    return render_template('tienda.html', productos=productos)


@app.route('/contactos')
def contactos():
    return render_template('contactos.html')

# Iniciar el servidor
if __name__ == '__main__':
    app.run(debug=True)
