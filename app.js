let currentInput = "0";

function updateDisplay() {
    const displayElement = document.getElementById('display');
    if (displayElement) {
        displayElement.innerText = currentInput;
    }
}

function appendNumber(num) {
    if (currentInput === "0") {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function appendOperator(op) {
    if(op === '⌫') {
        // Operación de borrado (retroceso)
        currentInput = currentInput.slice(0, -1);
        // Si queda vacío, vuelve a mostrar el 0
        if (currentInput === "") {
            currentInput = "0";
        }
    } else {
        // Evita agregar operadores dobles seguidos
        let lastChar = currentInput.slice(-1);
        if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
            return; 
        }
        currentInput += " " + op + " ";
    }
    updateDisplay();
}

function clearCalc() {
    currentInput = "0";
    updateDisplay();
}

function calculate() {
    try {
        // Reemplaza los símbolos visuales por los de JavaScript para el cálculo
        let evalString = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Ejecuta el cálculo matemático
        let result = eval(evalString);
        
        // Convierte el resultado a cadena y lo muestra
        currentInput = String(result);
        updateDisplay();
    } catch (e) {
        // Muestra error si la operación no es válida
        currentInput = "Error";
        updateDisplay();
        // Limpia la pantalla después de un segundo
        setTimeout(clearCalc, 1000);
    }
}

// Inicializa la pantalla al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    clearCalc();
});
