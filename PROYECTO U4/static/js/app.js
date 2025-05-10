const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.carousel-slide');
const buttonContainer = document.querySelector('.carousel-buttons');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentSlide = 0;
let interval;

// Crear dots para navegación
slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    buttonContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
    resetInterval();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
}

function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 2000);
}

// Event listeners
prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Iniciar carrusel automático
resetInterval();