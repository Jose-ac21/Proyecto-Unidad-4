document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const carritoIcono = document.getElementById('carrito-icono');
    const carritoModal = document.getElementById('carrito-modal');
    const cerrarCarrito = document.getElementById('cerrar-carrito');
    const overlay = document.getElementById('overlay');
    const carritoItems = document.getElementById('carrito-items');
    const carritoContador = document.getElementById('carrito-contador');
    const carritoTotal = document.getElementById('carrito-total');
    const botonCheckout = document.getElementById('boton-checkout');

    // Cargar carrito desde la base de datos al iniciar
    cargarCarrito();

    // Abrir carrito
    carritoIcono.addEventListener('click', function() {
        carritoModal.classList.add('activo');
        overlay.classList.add('activo');
    });

    // Cerrar carrito
    cerrarCarrito.addEventListener('click', function() {
        carritoModal.classList.remove('activo');
        overlay.classList.remove('activo');
    });

    // Cerrar carrito al hacer clic en el overlay
    overlay.addEventListener('click', function() {
        carritoModal.classList.remove('activo');
        overlay.classList.remove('activo');
    });

    // Función para cargar el carrito desde la base de datos
    function cargarCarrito() {
        fetch('/carrito/obtener')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    actualizarCarritoUI(data.carrito);
                } else {
                    console.error('Error al cargar el carrito:', data.message);
                }
            })
            .catch(error => {
                console.error('Error en la solicitud de carrito:', error);
            });
    }

    // Añadir producto al carrito
    window.agregarAlCarrito = function(id) {
        fetch('/carrito/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ producto_id: id, cantidad: 1 })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                cargarCarrito();
            } else {
                alert('Error al agregar al carrito: ' + data.message);
            }
        })
        .catch(error => {
            alert('Error en la solicitud de agregar al carrito: ' + error);
        });
    }

    // Eliminar producto del carrito
    window.eliminarDelCarrito = function(id) {
        fetch('/carrito/eliminar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ producto_id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                cargarCarrito();
            } else {
                alert('Error al eliminar del carrito: ' + data.message);
            }
        })
        .catch(error => {
            alert('Error en la solicitud de eliminar del carrito: ' + error);
        });
    }

    // Actualizar la interfaz del carrito
    // Actualizar la interfaz del carrito
function actualizarCarritoUI(carrito) {
    carritoItems.innerHTML = '';
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<div class="carrito-vacio">Tu carrito está vacío</div>';
        carritoContador.textContent = '0';
        carritoTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        
        // Construir la URL completa de la imagen
        const imagenURL = `/static/${item.imagen}`;

        const itemHTML = `
            <div class="carrito-item">
                <img src="${imagenURL}" alt="${item.nombre}" class="carrito-item-img">
                <div class="carrito-item-detalles">
                    <h4>${item.nombre}</h4>
                    <p>Precio: $${item.precio}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <button onclick="eliminarDelCarrito(${item.id})" class="btn btn-danger btn-sm">Eliminar</button>
                </div>
            </div>
        `;
        carritoItems.insertAdjacentHTML('beforeend', itemHTML);
    });
    carritoContador.textContent = carrito.length;
    carritoTotal.textContent = `$${total.toFixed(2)}`;
}


    // Finalizar compra
    botonCheckout.addEventListener('click', function() {
        fetch('/carrito/eliminar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
            alert('Compra realizada');
            cargarCarrito();
            carritoModal.classList.remove('activo');
            overlay.classList.remove('activo');
        })
        .catch(error => {
            alert('Error al finalizar compra: ' + error);
        });
    });
});
