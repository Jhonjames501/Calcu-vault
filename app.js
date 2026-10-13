let currentInput = "71463";
let activeModalItem = { type: '', index: -1, data: '' };

function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenName}`).classList.add('active');
    if (screenName === 'gallery') loadVaultData();
}
function updateDisplay() { document.getElementById('display').innerText = currentInput; }
function appendNumber(num) {
    if (currentInput === "0" || currentInput === "71463") { currentInput = num; } else { currentInput += num; }
    updateDisplay();
}
function appendOperator(op) {
    if(op === '⌫') { currentInput = currentInput.slice(0, -1) || "0"; } else { currentInput += " " + op + " "; }
    updateDisplay();
}
function clearCalc() { currentInput = "0"; updateDisplay(); }
function calculate() {
    let cleanVal = currentInput.trim();
    if (cleanVal === "71463" || cleanVal === "999999") { switchScreen('gallery'); return; }
    try {
        let evalString = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        let result = eval(evalString);
        currentInput = String(result);
        updateDisplay();
    } catch (e) { currentInput = "Error"; updateDisplay(); setTimeout(clearCalc, 1000); }
}
function switchTab(tabName, btnElement) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-photos').style.display = 'none';
    document.getElementById('tab-videos').style.display = 'none';
    document.getElementById('tab-notes').style.display = 'none';
    if(btnElement) btnElement.classList.add('active');
    document.getElementById(`tab-${tabName}`).style.display = tabName === 'notes'? 'flex' : 'grid';
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
        let storageKey = currentUploadType.includes('image')? 'calcu_photos' : 'calcu_videos';
        let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        items.push(e.target.result);
        localStorage.setItem(storageKey, JSON.stringify(items));
        loadVaultData();
    };
    reader.readAsDataURL(file);
}
function loadVaultData() {
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
    let notesContainer = document.getElementById('notes-container');
    if(notesContainer){ notesContainer.innerHTML = ''; }
    let total = photos.length + videos.length;
    document.getElementById('vault-counter').innerText = `${total} ELEMENTOS BLOQUEADA`;
}
function openMediaModal(type, index, data) {
    activeModalItem = { type, index, data };
    const container = document.getElementById('modal-body-container');
    if (type === 'photo') { container.innerHTML = `<img src="${data}">`; } else { container.innerHTML = `<video src="${data}" controls autoplay></video>`; }
    document.getElementById('mediaModal').style.display = 'flex';
}
function closeMediaModal() { document.getElementById('mediaModal').style.display = 'none'; }

// FUNCION CORREGIDA - GUARDAR EN GALERIA
function downloadCurrentMedia() {
    try {
        const dataUrl = activeModalItem.data;
        const extension = activeModalItem.type === 'photo'? 'jpg' : 'mp4';
        const fileName = `CalcuVault_${Date.now()}.${extension}`;
        const isKodular = window.AppInventor || navigator.userAgent.includes('AppInventor');
        if (isKodular && window.AppInventor) {
            window.AppInventor.setWebViewString(dataUrl + "|||" + fileName);
            alert("Guardando en Descargas... revisa tu galería");
            return;
        }
        fetch(dataUrl).then(res => res.blob()).then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl; a.download = fileName;
            document.body.appendChild(a); a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(blobUrl); }, 1000);
        });
    } catch (e) { window.open(activeModalItem.data, '_blank'); }
}
function deleteCurrentMedia() {
    if (!confirm("¿Estás seguro de eliminar este elemento?")) return;
    let storageKey = activeModalItem.type === 'photo'? 'calcu_photos' : 'calcu_videos';
    let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    items.splice(activeModalItem.index, 1);
    localStorage.setItem(storageKey, JSON.stringify(items));
    closeMediaModal(); loadVaultData();
}
function lockVault() { switchScreen('calc'); clearCalc(); }
function addNewNote() { let t = prompt("Título:"); if(t){ let n=JSON.parse(localStorage.getItem('calcu_notes')||'[]'); n.push({title:t, content:""}); localStorage.setItem('calcu_notes', JSON.stringify(n)); loadVaultData(); } }
function deleteNote(idx){ let n=JSON.parse(localStorage.getItem('calcu_notes')||'[]'); n.splice(idx,1); localStorage.setItem('calcu_notes', JSON.stringify(n)); loadVaultData(); }