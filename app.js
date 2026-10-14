let currentInput = "0";

// Al cargar la página, iniciamos el contador del porcentaje del 1 al 100 en 4 segundos (4000ms)
window.addEventListener('DOMContentLoaded', () => {
    let percentage = 1;
    const progressText = document.getElementById('loading-percentage'); 
    
    let loadInterval = setInterval(() => {
        if (percentage <= 100) {
            if (progressText) {
                progressText.innerText = percentage + "%";
            }
            percentage++;
        } else {
            clearInterval(loadInterval);
            hideSplashAndShowCalc();
        }
    }, 40); // 40ms * 100 pasos = 4000ms (4 segundos exactos)
});

function hideSplashAndShowCalc() {
    const splash = document.getElementById('splash-screen');
    
    if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
        }, 500); // Transición de desvanecimiento suave
    }
}

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
        currentInput = currentInput.slice(0, -1) || "0";
    } else {
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
        let evalString = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        let result = eval(evalString);
        currentInput = String(result);
        updateDisplay();
    } catch (e) {
        currentInput = "Error";
        updateDisplay();
        setTimeout(clearCalc, 1000);
    }
}
