-- Mostrar todos los usuarios
SELECT u.id, u.username, u.email, r.nombre AS role
FROM usuarios u
JOIN roles r ON u.role_id = r.id
WHERE r.nombre = 'client';


-- Consultar el carrito de un usuario:
SELECT p.nombre, c.cantidad 
FROM carrito c
JOIN productos p ON c.producto_id = p.id
WHERE c.usuario_id = 1;

-- Ver el historial de compras de un usuario
SELECT p.nombre, h.cantidad, h.fecha
FROM historial_compras h
JOIN productos p ON h.producto_id = p.id
WHERE h.usuario_id = 1;

-- Ver las ventas realizadas
SELECT v.id, u.username, v.total, v.fecha
FROM ventas v
JOIN usuarios u ON v.usuario_id = u.id;

-- Ver detalles de una venta
SELECT dv.producto_id, p.nombre, dv.cantidad, dv.subtotal
FROM detalles_venta dv
JOIN productos p ON dv.producto_id = p.id
WHERE dv.venta_id = 1;


USE gamingza;
SELECT * FROM productos;

