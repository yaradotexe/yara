const bootLines = [
    "[OK] Booting yara.pw ...",
"[OK] Mounting filesystems...",
"[OK] Starting Open Source integration protocols...",
"[OK] Loading modules: Linux, Javascript, Monster Energy Drink...",
"> echo 'Hi, welcome.'",
" "
];

let lineIndex = 0;
const bootText = document.getElementById('boot-text');
const loader = document.getElementById('loader');
const mainContent = document.getElementById('main-content');

function typeLine() {
    if (lineIndex < bootLines.length) {
        bootText.innerHTML += (lineIndex > 0 ? "<br>" : "") + bootLines[lineIndex];
        lineIndex++;
        setTimeout(typeLine, Math.random() * 400 + 200);
    } else {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.style.display = 'block';
                void mainContent.offsetWidth;
                mainContent.style.opacity = '1';
            }, 1000);
        }, 800);
    }
}

setTimeout(typeLine, 500);
