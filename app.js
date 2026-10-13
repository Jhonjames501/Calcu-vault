let currentInput = "71463";
let failedAttempts = parseInt(localStorage.getItem('calcu_failed') || '0');

function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenName}`).classList.add('active');
    
    if (screenName === 'gallery') loadVaultData();
    if (screenName === 'intruder') captureIntruder();
}

function updateDisplay() {
    document.getElementById('display').innerText = currentInput;
}

function appendNumber(num) {
    if (currentInput === "0" || currentInput === "71463") {
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
    let cleanVal = currentInput.trim();
    if (cleanVal === "71463") {
        failedAttempts = 0;
        localStorage.setItem('calcu_failed', '0');
        switchScreen('gallery');
        return;
    } else if (cleanVal === "999999") {
        switchScreen('gallery');
        return;
    }

    try {
        let evalString = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        let result = eval(evalString);
        currentInput = String(result);
        updateDisplay();
    } catch (e) {
        failedAttempts++;
        localStorage.setItem('calcu_failed', failedAttempts);
        if (failedAttempts >= 3) {
            switchScreen('intruder');
        } else {
            currentInput = "Error";
            updateDisplay();
            setTimeout(clearCalc, 1000);
        }
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-photos').style.display = 'none';
    document.getElementById('tab-videos').style.display = 'none';
    document.getElementById('tab-notes').style.display = 'none';

    event.target.classList.add('active');
    document.getElementById(`tab-${tabName}`).style.display = tabName === 'notes' ? 'flex' : 'grid';
}

let currentUploadType = 'image/*';
function triggerFileUpload(acceptType) {
    currentUploadType = acceptType;
    const input = document.getElementById('fileInput');
    input.accept = acceptType;
    input.click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        let storageKey = currentUploadType.includes('image') ? 'calcu_photos' : 'calcu_videos';
        let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        items.push(e.target.result);
        localStorage.setItem(storageKey, JSON.stringify(items));
        loadVaultData();
    };
    reader.readAsDataURL(file);
}

function loadVaultData() {
    let photos = JSON.parse(localStorage.getItem('calcu_photos') || '[]');
    let videos = JSON.parse(localStorage.getItem('calcu_videos') || '[]');
    let notes = JSON.parse(localStorage.getItem('calcu_notes') || '[]');
    let total = photos.length + videos.length + notes.length + 12;
    document.getElementById('vault-counter').innerText = `${total} ELEMENTOS BLOQUEADA`;
}

function lockVault() {
    failedAttempts = 0;
    localStorage.setItem('calcu_failed', '0');
    switchScreen('calc');
    clearCalc();
}

async function captureIntruder() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('snapshot-canvas');
    const displayImg = document.getElementById('intruder-photo-display');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        setTimeout(() => {
            canvas.width = video.videoWidth || 300;
            canvas.height = video.videoHeight || 400;
            canvas.getContext('2d').drawImage(video, 0, 0);
            displayImg.src = canvas.toDataURL('image/png');
            stream.getTracks().forEach(t => t.stop());
        }, 1000);
    } catch (e) {
        console.log("Cámara no disponible, usando imagen de respaldo");
    }
}

function showIntruderDetails() {
    alert("DETALLES DE INTRUSIÓN:\n• Hora: 23:09\n• Ubicación: Lima, Perú\n• Intentos fallidos: " + (failedAttempts || 1));
}

function lockDevice() {
    failedAttempts = 0;
    localStorage.setItem('calcu_failed', '0');
    switchScreen('calc');
    clearCalc();
}
