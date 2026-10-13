let currentInput = "71463";
let activeModalItem = { type: '', index: -1, data: '' };

function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenName}`).classList.add('active');
    
    if (screenName === 'gallery') loadVaultData();
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
        currentInput = "Error";
        updateDisplay();
        setTimeout(clearCalc, 1000);
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
    // Fotos
    const photosGrid = document.getElementById('tab-photos');
    photosGrid.innerHTML = `<div class="media-item add-btn" onclick="triggerFileUpload('image/*')">+</div>`;
    let photos = JSON.parse(localStorage.getItem('calcu_photos') || '[]');
    photos.forEach((photo, idx) => {
        let div = document.createElement('div');
        div.className = 'media-item';
        div.innerHTML = `<img src="${photo}"><div class="lock-overlay">🔒</div>`;
        div.onclick = () => openMediaModal('photo', idx, photo);
        photosGrid.appendChild(div);
    });

    // Videos
    const videosGrid = document.getElementById('tab-videos');
    videosGrid.innerHTML = `<div class="media-item add-btn" onclick="triggerFileUpload('video/*')">+</div>`;
    let videos = JSON.parse(localStorage.getItem('calcu_videos') || '[]');
    videos.forEach((video, idx) => {
        let div = document.createElement('div');
        div.className = 'media-item';
        div.innerHTML = `<video src="${video}"></video><div class="lock-overlay">🔒</div>`;
        div.onclick = () => openMediaModal('video', idx, video);
        videosGrid.appendChild(div);
    });

    // Notas
    let notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    let notes = JSON.parse(localStorage.getItem('calcu_notes') || '[]');
    notes.forEach((note, idx) => {
        let card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `<h4>${note.title}</h4><p>${note.content}</p><button class="note-delete" onclick="deleteNote(${idx})">Eliminar</button>`;
        notesContainer.appendChild(card);
    });

    let total = photos.length + videos.length + notes.length + 12;
    document.getElementById('vault-counter').innerText = `${total} ELEMENTOS BLOQUEADA`;
}

function openMediaModal(type, index, data) {
    activeModalItem = { type, index, data };
    const container = document.getElementById('modal-body-container');
    
    if (type === 'photo') {
        container.innerHTML = `<img src="${data}">`;
    } else {
        container.innerHTML = `<video src="${data}" controls autoplay></video>`;
    }
    
    document.getElementById('mediaModal').style.display = 'flex';
}

function closeMediaModal() {
    document.getElementById('mediaModal').style.display = 'none';
}

// Método optimizado para APK / WebView que abre la imagen en ventana nueva para guardarla
function downloadCurrentMedia() {
    try {
        let w = window.open('');
        w.document.write(`
            <html>
                <head><title>Guardar Imagen</title></head>
                <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
                    <img src="${activeModalItem.data}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                </body>
            </html>
        `);
        w.document.close();
    } catch (e) {
        // Fallback si el WebView bloquea la ventana nueva
        const a = document.createElement('a');
        a.href = activeModalItem.data;
        a.target = '_blank';
        a.click();
    }
}

function deleteCurrentMedia() {
    if (!confirm("¿Estás seguro de eliminar este elemento?")) return;
    
    let storageKey = activeModalItem.type === 'photo' ? 'calcu_photos' : 'calcu_videos';
    let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    items.splice(activeModalItem.index, 1);
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    closeMediaModal();
    loadVaultData();
}

function lockVault() {
    switchScreen('calc');
    clearCalc();
}
