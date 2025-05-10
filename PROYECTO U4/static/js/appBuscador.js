// Asegurarse de que este código se ejecute después de que la página cargue
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado. Inicializando buscador...');
    
    // Obtener referencias a elementos del DOM
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const guides = document.querySelectorAll('.guide');
    
    console.log('Formulario:', searchForm);
    console.log('Input:', searchInput);
    console.log('Guías encontradas:', guides.length);
    
    // Función para filtrar guías
    function filterGuides(searchTerm) {
        console.log('Filtrando por:', searchTerm);
        searchTerm = searchTerm.toLowerCase().trim();
        let visibleGuides = 0;
        
        guides.forEach(guide => {
            const title = guide.querySelector('h2').textContent.toLowerCase();
            const description = guide.querySelector('p').textContent.toLowerCase();
            
            if (searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm)) {
                guide.style.display = 'flex';
                visibleGuides++;
            } else {
                guide.style.display = 'none';
            }
        });
        
        console.log('Guías visibles:', visibleGuides);
        
        // Manejar mensaje de no resultados
        let noResultsMessage = document.getElementById('no-results-message');
        if (visibleGuides === 0 && searchTerm !== '') {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('p');
                noResultsMessage.id = 'no-results-message';
                noResultsMessage.className = 'text-center mt-4 w-100';
                noResultsMessage.textContent = 'No se encontraron guías que coincidan con tu búsqueda';
                document.querySelector('.guides').appendChild(noResultsMessage);
            }
            noResultsMessage.style.display = 'block';
        } else {
            if (noResultsMessage) {
                noResultsMessage.style.display = 'none';
            }
        }
    }
    
    // Manejar evento submit del formulario
    searchForm.addEventListener('submit', function(event) {
        console.log('Formulario enviado');
        event.preventDefault(); // Evitar que el formulario se envíe
        filterGuides(searchInput.value);
    });
    
    // Búsqueda en tiempo real
    searchInput.addEventListener('input', function() {
        console.log('Input cambiado:', this.value);
        filterGuides(this.value);
    });
    
    console.log('Buscador inicializado correctamente');
});