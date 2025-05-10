document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del buscador
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const productos = document.querySelectorAll('.tarjeta-producto');

    // Función para filtrar productos
    function filtrarProductos(terminoBusqueda) {
        terminoBusqueda = terminoBusqueda.toLowerCase().trim();

        productos.forEach(producto => {
            const titulo = producto.querySelector('.titulo-producto').textContent.toLowerCase();
            const descripcion = producto.querySelector('.descripcion-producto').textContent.toLowerCase();
            const precio = producto.querySelector('.precio-producto').textContent.toLowerCase();

            if (terminoBusqueda === '' || 
                titulo.includes(terminoBusqueda) || 
                descripcion.includes(terminoBusqueda) || 
                precio.includes(terminoBusqueda)) {
                producto.style.display = ''; // Mostrar el producto
            } else {
                producto.style.display = 'none'; // Ocultar el producto
            }
        });
    }

    // Evento para la búsqueda en tiempo real
    searchInput.addEventListener('input', function() {
        filtrarProductos(this.value);
    });

    // Prevenir el envío del formulario
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filtrarProductos(searchInput.value);
    });
});