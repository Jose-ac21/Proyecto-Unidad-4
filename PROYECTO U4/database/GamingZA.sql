
CREATE DATABASE gamingza;
USE gamingza;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);
-- Insertar roles predefinidos
INSERT INTO roles (nombre) VALUES ('admin'), ('editor'), ('client');

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

SELECT id FROM roles WHERE nombre = 'client';

INSERT INTO usuarios (username, email, password, role_id) 
VALUES ('cliente1', 'cliente1@gamingza.com', 'password123', 
        (SELECT id FROM roles WHERE nombre = 'client'));



-- Usuario administrador por defecto
INSERT INTO usuarios (username, email, password, role_id) 
VALUES ('admin', 'admin@gamingza.com', 'admin123', 1);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255) DEFAULT '/img/default.jpg',
    stock INT DEFAULT 0
);
-- Ejemplo de inserción
INSERT INTO productos (nombre, descripcion, precio, imagen, stock) 
VALUES
('Camiseta Logo Central', 'Camiseta de algodón 100%', 249.99, 'img/MERCH/1.jpg', 50),
('Camiseta Logo Pecho Izq', 'Logo pequeño en la parte superior', 249.99, 'img/MERCH/2.jpg', 30),
('Camiseta Logo Pecho Der', 'Logo pequeño en la parte superior', 249.99, 'img/MERCH/3.jpg', 30),
('Camiseta GamingZA Moderna', 'Texto GamingZA en estilo moderno', 249.99, 'img/MERCH/4.jpg', 20),
('Gorra Con Logo Y GamingZA', 'Gorra de alta calidad diseñada para gamers', 449.99, 'img/MERCH/7.jpg', 15),
('Gorra Con Logo', 'Gorra de alta calidad', 449.99, 'img/MERCH/8.jpg', 15),
('Termo GamingZA', 'Termo para bebidas', 199.99, 'img/MERCH/9.jpg', 40);



CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    total DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE detalles_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT DEFAULT 1,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    cantidad INT DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE historial_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    cantidad INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);



