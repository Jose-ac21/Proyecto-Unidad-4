document.addEventListener('DOMContentLoaded', function() {
    // Variables para el modal y elementos principales
    const botonCalculadora = document.getElementById('botonCalculadora');
    const modalCalculadora = document.getElementById('modalCalculadora');
    const cerrarCalculadora = document.getElementById('cerrarCalculadora');
    const pantalla = document.querySelector(".pantalla");
    const historial = document.querySelector(".historial");
    const botones = document.querySelectorAll(".botones button");
    const botonesCientificos = document.querySelector(".botones-cientificos");
    const toggleTipoCalculadora = document.getElementById("tipo-calculadora");
    const selectorTema = document.getElementById("seleccionar-tema");

    // Variables de estado
    let entradaActual = "";
    let operadorActual = "";
    let limpiarPantalla = false;
    let valorMemoria = 0;
    let modoCientifico = false;

    // Funcionalidad del modal
    botonCalculadora.addEventListener('click', function() {
        modalCalculadora.style.display = 'block';
    });

    cerrarCalculadora.addEventListener('click', function() {
        modalCalculadora.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modalCalculadora) {
            modalCalculadora.style.display = 'none';
        }
    });

    // Configuración de temas
    selectorTema.addEventListener("change", function() {
        const temaSeleccionado = this.value;
        document.body.className = "";
        document.body.classList.add(`tema-${temaSeleccionado}`);
    });

    // Toggle calculadora científica/básica
    toggleTipoCalculadora.addEventListener("change", function() {
        modoCientifico = this.checked;
        botonesCientificos.style.display = modoCientifico ? "grid" : "none";
    });

    // Función principal para manejar clics en botones
    botones.forEach((boton) => {
        boton.addEventListener("click", () => {
            const textoBoton = boton.textContent;

            // Limpiar error si existe
            if (pantalla.textContent === "Error" && textoBoton !== "C") {
                pantalla.textContent = "";
            }

            // Manejar diferentes tipos de entrada
            if (textoBoton.match(/[0-9.]/)) {
                manejarEntradaNumero(textoBoton);
            } 
            else if (textoBoton === "⌫") {
                manejarBorrado();
            } 
            else if (textoBoton === "C") {
                limpiarTodo();
            } 
            else if (textoBoton === "=") {
                calcular();
            } 
            else if (["+", "-", "*", "/"].includes(textoBoton)) {
                manejarOperadorBasico(textoBoton);
            } 
            else {
                manejarOperacionCientifica(textoBoton);
            }

            actualizarHistorial();
        });
    });

    // Manejo de entrada por teclado
   document.addEventListener('keydown', (evento) => {
    // Solo procesar eventos de teclado si la calculadora está visible
    if (modalCalculadora.style.display === 'block') {
        const tecla = evento.key;
        
        // Verificar si el foco está en el buscador
        const esBuscadorActivo = evento.target.classList.contains('search-input');
        
        // Si el buscador está activo, no procesar eventos de teclado
        if (esBuscadorActivo) {
            return;
        }

        if (tecla.match(/[0-9.]/) || ['+', '-', '*', '/', '=', 'Enter'].includes(tecla)) {
            evento.preventDefault();
            
            if (tecla === 'Enter') {
                calcular();
            } else if (tecla.match(/[0-9.]/)) {
                manejarEntradaNumero(tecla);
            } else {
                manejarOperadorBasico(tecla);
            }
            
            actualizarHistorial();
        } 
        else if (tecla === 'Backspace') {
            evento.preventDefault();
            manejarBorrado();
        } 
        else if (tecla === 'Escape') {
            evento.preventDefault();
            limpiarTodo();
        }
    }
});

    // Funciones auxiliares
    function manejarEntradaNumero(numero) {
        if (limpiarPantalla) {
            pantalla.textContent = "";
            limpiarPantalla = false;
        }
        
        if (numero === '.' && pantalla.textContent.includes('.')) {
            return;
        }
        
        if (pantalla.textContent === '0' && numero !== '.') {
            pantalla.textContent = numero;
        } else {
            pantalla.textContent += numero;
        }
    }

    function manejarBorrado() {
        if (pantalla.textContent.length === 1 || pantalla.textContent === "Error") {
            pantalla.textContent = "0";
        } else {
            pantalla.textContent = pantalla.textContent.slice(0, -1);
        }
    }

    function limpiarTodo() {
        pantalla.textContent = "0";
        historial.textContent = "0";
        entradaActual = "";
        operadorActual = "";
    }

    function manejarOperadorBasico(operador) {
        if (operadorActual && entradaActual) {
            calcular();
        }
        
        operadorActual = operador;
        entradaActual = pantalla.textContent;
        limpiarPantalla = true;
    }

    function calcular() {
        if (operadorActual && entradaActual) {
            try {
                const num1 = parseFloat(entradaActual);
                const num2 = parseFloat(pantalla.textContent);
                let resultado = realizarCalculo(num1, operadorActual, num2);
                
                if (isNaN(resultado) || !isFinite(resultado)) {
                    pantalla.textContent = "Error";
                } else {
                    pantalla.textContent = formatearResultado(resultado);
                    entradaActual = resultado;
                }
            } catch (error) {
                pantalla.textContent = "Error";
            }
            
            operadorActual = "";
            limpiarPantalla = true;
        }
    }

    function manejarOperacionCientifica(operacion) {
        try {
            const numero = parseFloat(pantalla.textContent);
            let resultado;
            
            switch (operacion) {
                case "sin":
                    resultado = Math.sin(numero * (Math.PI / 180));
                    break;
                case "cos":
                    resultado = Math.cos(numero * (Math.PI / 180));
                    break;
                case "tan":
                    resultado = Math.tan(numero * (Math.PI / 180));
                    break;
                case "log":
                    resultado = Math.log10(numero);
                    break;
                case "ln":
                    resultado = Math.log(numero);
                    break;
                case "√":
                    resultado = Math.sqrt(numero);
                    break;
                case "x²":
                    resultado = Math.pow(numero, 2);
                    break;
                case "x³":
                    resultado = Math.pow(numero, 3);
                    break;
                case "^":
                    operadorActual = "^";
                    entradaActual = numero;
                    limpiarPantalla = true;
                    return;
                case "π":
                    resultado = Math.PI;
                    break;
                case "e":
                    resultado = Math.E;
                    break;
                case "|x|":
                    resultado = Math.abs(numero);
                    break;
                case "!":
                    resultado = factorial(numero);
                    break;
                case "%":
                    resultado = numero / 100;
                    break;
                default:
                    return;
            }
            
            if (isNaN(resultado) || !isFinite(resultado)) {
                pantalla.textContent = "Error";
            } else {
                pantalla.textContent = formatearResultado(resultado);
            }
            
            limpiarPantalla = true;
        } catch (error) {
            pantalla.textContent = "Error";
        }
    }

    function realizarCalculo(num1, operador, num2) {
        switch (operador) {
            case "+":
                return num1 + num2;
            case "-":
                return num1 - num2;
            case "*":
                return num1 * num2;
            case "/":
                if (num2 !== 0) {
                    return num1 / num2;
                } else {
                    return "Error";
                }
            case "^":
                return Math.pow(num1, num2);
            default:
                return num2;
        }
    }

    function factorial(n) {
        if (n < 0 || n % 1 !== 0) return NaN;
        if (n === 0 || n === 1) return 1;
        
        let resultado = 1;
        for (let i = 2; i <= n; i++) {
            resultado *= i;
        }
        return resultado;
    }

    function formatearResultado(numero) {
        return numero.toString().length > 10 ? 
            numero.toExponential(6) : 
            parseFloat(numero.toPrecision(10)).toString();
    }

    function actualizarHistorial() {
        if (operadorActual && entradaActual) {
            historial.textContent = `${entradaActual} ${operadorActual}`;
        }
    }
});