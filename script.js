const themeToggleBtn = document.getElementById('theme-toggle');
const faviconEl = document.querySelector('link[rel="icon"]');

function updateFavicon(accentColor) {
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23181825"/><path d="M14 20 L28 32 L14 44" stroke="${accentColor}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="34" y1="44" x2="48" y2="44" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/></svg>`;
    if (faviconEl) {
        faviconEl.href = `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;
    }
}

function applyTheme(theme) {
    if (theme === 'latte') {
        document.documentElement.setAttribute('data-theme', 'latte');
        if (themeToggleBtn) themeToggleBtn.textContent = '> latte (light)';
        updateFavicon('#1e66f5');
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '> mocha (dark)';
        updateFavicon('#89b4fa');
    }
}

const savedTheme = localStorage.getItem('yara-theme') || 'mocha';
applyTheme(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'latte' ? 'latte' : 'mocha';
        const nextTheme = currentTheme === 'latte' ? 'mocha' : 'latte';
        localStorage.setItem('yara-theme', nextTheme);
        applyTheme(nextTheme);
    });
}

const originalTitle = document.title;
const awayMessages = [
    ">> Unbedingt einstellen!",
    ">> Hire me, I fix things",
    ">> Status: 404 Recruiter not found",
    ">> sudo hire yara",
    ">> Don't leave me hanging :("
];

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        const randomMsg = awayMessages[Math.floor(Math.random() * awayMessages.length)];
        document.title = randomMsg;
    } else {
        document.title = originalTitle;
    }
});

const bootScreen = document.getElementById('boot-screen');
const disclaimerModal = document.getElementById('disclaimer-modal');
const biosContainer = document.getElementById('bios-container');
const biosMemCounter = document.getElementById('bios-mem-counter');
const biosDevices = document.getElementById('bios-devices');
const biosTableWrapper = document.getElementById('bios-table-wrapper');
const biosBootMsg = document.getElementById('bios-boot-msg');
const mainContent = document.getElementById('main-content');

const btnStartBoot = document.getElementById('btn-start-boot');
const btnSkipBoot = document.getElementById('btn-skip-boot');

let bootCancelled = false;
let isBooting = false;

if (bootScreen && localStorage.getItem('yara-skip-notice') === 'true') {
    bootScreen.style.display = 'none';
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
    }
}

function finishBoot() {
    if (!bootScreen) return;
    bootScreen.style.opacity = '0';
    setTimeout(() => {
        bootScreen.style.display = 'none';
        if (mainContent) {
            mainContent.style.display = 'block';
            void mainContent.offsetWidth;
            mainContent.style.opacity = '1';
        }
    }, 700);
}

function skipBootDirectly(persist = true) {
    bootCancelled = true;
    if (persist) {
        localStorage.setItem('yara-skip-notice', 'true');
    }
    finishBoot();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runBiosBoot() {
    if (isBooting) return;
    isBooting = true;

    if (disclaimerModal) disclaimerModal.style.display = 'none';
    if (biosContainer) biosContainer.style.display = 'block';

    const stage1 = document.getElementById('bios-stage-1');
    const stage2 = document.getElementById('bios-stage-2');
    const memRow = document.getElementById('bios-mem-row');
    const memVal = document.getElementById('bios-mem-val');
    const memStatus = document.getElementById('bios-mem-status');
    const pnpBlock = document.getElementById('bios-pnp-block');
    const ideList = document.getElementById('bios-ide-list');
    const dmiMsg = document.getElementById('bios-dmi-msg');
    const bootTarget = document.getElementById('bios-boot-target');

    await sleep(600);
    if (bootCancelled) return;

    if (memRow) memRow.style.display = 'block';
    if (memStatus) memStatus.classList.add('cursor-blink');

    const targetMem = 32768;
    let currentMem = 0;
    const step = 2048;

    while (currentMem < targetMem && !bootCancelled) {
        currentMem += step;
        if (currentMem > targetMem) currentMem = targetMem;
        if (memVal) memVal.textContent = currentMem;
        await sleep(40);
    }

    if (bootCancelled) return;
    if (memStatus) {
        memStatus.classList.remove('cursor-blink');
        memStatus.textContent = 'OK';
    }

    await sleep(400);
    if (bootCancelled) return;

    if (pnpBlock) pnpBlock.style.display = 'block';
    await sleep(500);
    if (bootCancelled) return;


    const ideEntries = [
        { label: 'Detecting IDE Primary Master', res: '... YaraOS_NVMe_2TB [FAST]' },
        { label: 'Detecting IDE Primary Slave', res: '... /dev/btrfs/subvolumes [HEALTHY]' },
        { label: 'Detecting IDE Secondary Master', res: '... OPNsense_Gateway [ONLINE]' },
        { label: 'Detecting IDE Secondary Slave', res: '... None' }
    ];

    for (let entry of ideEntries) {
        if (bootCancelled) return;
        const line = document.createElement('div');
        line.innerHTML = `${entry.label} <span class="cursor-blink"></span>`;
        if (ideList) ideList.appendChild(line);
        await sleep(280);
        if (bootCancelled) return;

        line.innerHTML = `${entry.label} <span style="color: #fff;">${entry.res}</span>`;
        await sleep(150);
    }

    await sleep(800);
    if (bootCancelled) return;

    if (stage1) stage1.style.display = 'none';
    if (stage2) stage2.style.display = 'block';

    await sleep(400);
    if (bootCancelled) return;

    if (dmiMsg) dmiMsg.textContent = 'Verifying Monster Energy Drink Stash........ Success';
    await sleep(600);
    if (bootCancelled) return;

    if (bootTarget) bootTarget.innerHTML = 'Starting Portfolio... <span class="cursor-blink"></span>';
    await sleep(800);

    if (!bootCancelled) {
        finishBoot();
    }
}

window.runBiosBoot = runBiosBoot;
window.skipBootDirectly = skipBootDirectly;

if (btnStartBoot) btnStartBoot.addEventListener('click', runBiosBoot);
if (btnSkipBoot) btnSkipBoot.addEventListener('click', () => skipBootDirectly(true));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        skipBootDirectly(false);
    }
});

if (biosContainer) {
    biosContainer.addEventListener('click', () => {
        if (isBooting) skipBootDirectly(false);
    });
}

const bootDate = new Date('2026-09-28T22:00:00');

function updateUptime() {
    const uptimeEl = document.getElementById('uptime-display');
    if (!uptimeEl) return;
    
    const now = new Date();
    const diff = Math.max(0, Math.floor((now - bootDate) / 1000));
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    uptimeEl.textContent = `Uptime: ${days}d ${hours}h ${mins}m`;
}

if (document.getElementById('uptime-display')) {
    updateUptime();
    setInterval(updateUptime, 60000);
}


function ensureContextMenuAndDino() {
    let cm = document.getElementById('custom-cm');
    if (!cm) {
        cm = document.createElement('div');
        cm.id = 'custom-cm';
        cm.innerHTML = `
            <div class="cm-header">// CONTEXT ACTIONS</div>
            <div class="cm-item" onclick="alert('Nice try! ;)')">> Inspect Element</div>
            <div class="cm-item" onclick="navigator.clipboard.writeText('yblankenstein@proton.me'); alert('Mail in Zwischenablage kopiert!')">> Copy Yara's Email</div>
            <div class="cm-item" onclick="openDinoGame()">> yaradotdino 🦖</div>
            <div class="cm-item" onclick="window.location.href='/'">> cd /home/portfolio</div>
            <div class="cm-item" onclick="localStorage.removeItem('yara-skip-notice'); window.location.href='/'">> reboot --force</div>
        `;
        document.body.appendChild(cm);
    }

    let dinoModal = document.getElementById('dino-modal');
    if (!dinoModal) {
        dinoModal = document.createElement('div');
        dinoModal.id = 'dino-modal';
        dinoModal.className = 'dino-modal-backdrop';
        dinoModal.style.display = 'none';
        dinoModal.innerHTML = `
            <div class="dino-window win-card">
                <div class="win-header">
                    <div class="win-title">🦖 yaradotdino</div>
                    <div class="win-controls">
                        <span class="win-dot dot-red" id="dino-close-btn" title="Schließen (ESC)" style="cursor: pointer;"></span>
                        <span class="win-dot dot-yellow"></span>
                        <span class="win-dot dot-green"></span>
                    </div>
                </div>
                <div class="dino-body">
                    <div class="dino-statusbar">
                        <span id="dino-status-text">[STATUS: READY]</span>
                        <span id="dino-score-display">SCORE: 00000</span>
                        <span id="dino-hi-display">HI: 00000</span>
                    </div>
                    <div class="dino-canvas-wrap">
                        <canvas id="dino-canvas" width="640" height="220"></canvas>
                    </div>
                    <div class="dino-instructions">
                        <span>[LEERTASTE] Springen</span>
                        <span>[↓] Ducken</span>
                        <span>[ESC] Schließen</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dinoModal);
    }

    const closeBtn = document.getElementById('dino-close-btn');
    if (closeBtn && !closeBtn.dataset.bound) {
        closeBtn.dataset.bound = 'true';
        closeBtn.addEventListener('click', closeDinoGame);
    }
    if (dinoModal && !dinoModal.dataset.bound) {
        dinoModal.dataset.bound = 'true';
        dinoModal.addEventListener('click', (e) => {
            if (e.target === dinoModal) closeDinoGame();
        });
    }
    const canvas = document.getElementById('dino-canvas');
    if (canvas && !canvas.dataset.bound) {
        canvas.dataset.bound = 'true';
        canvas.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            handleDinoJump();
        });
    }
}

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    ensureContextMenuAndDino();
    const cm = document.getElementById('custom-cm');
    if (!cm) return;
    cm.style.display = 'block';
    
    // Prevent menu from overflowing window bounds
    const x = Math.min(e.clientX, window.innerWidth - 230);
    const y = Math.min(e.clientY, window.innerHeight - 220);
    
    cm.style.left = `${x}px`;
    cm.style.top = `${y}px`;
});

document.addEventListener('click', () => {
    const cm = document.getElementById('custom-cm');
    if (cm) cm.style.display = 'none';
});


let dinoModalOpen = false;
let dinoAudioCtx = null;

function getDinoAudio() {
    if (!dinoAudioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) dinoAudioCtx = new AudioClass();
    }
    if (dinoAudioCtx && dinoAudioCtx.state === 'suspended') {
        dinoAudioCtx.resume();
    }
    return dinoAudioCtx;
}

function playDinoSfx(type) {
    try {
        const ctx = getDinoAudio();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'jump') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (type === 'hit') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(40, now + 0.28);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
            osc.start(now);
            osc.stop(now + 0.28);
        } else if (type === 'score') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(659, now);
            osc.frequency.setValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        }
    } catch (e) {
    
    }
}

// Pixel sprites
const DINO_PIXEL_SCALE = 2.4;
const DINO_SPRITES = {
    stand: [
        "0000000001111111000",
        "0000000001011111000",
        "0000000001111111000",
        "0000000001111000000",
        "0000000001111110000",
        "0100000011111000000",
        "0100000111111110000",
        "0110001111111100000",
        "0111011111111000000",
        "0111111111110000000",
        "0011111111110000000",
        "0001111111100000000",
        "0000111111000000000",
        "0000011110000000000",
        "0000011011000000000",
        "0000010001000000000",
        "0000010001000000000",
        "0000011001100000000"
    ],
    run1: [
        "0000000001111111000",
        "0000000001011111000",
        "0000000001111111000",
        "0000000001111000000",
        "0000000001111110000",
        "0100000011111000000",
        "0100000111111110000",
        "0110001111111100000",
        "0111011111111000000",
        "0111111111110000000",
        "0011111111110000000",
        "0001111111100000000",
        "0000111111000000000",
        "0000011110000000000",
        "0000011011000000000",
        "0000010001100000000",
        "0000010000000000000",
        "0000011000000000000"
    ],
    run2: [
        "0000000001111111000",
        "0000000001011111000",
        "0000000001111111000",
        "0000000001111000000",
        "0000000001111110000",
        "0100000011111000000",
        "0100000111111110000",
        "0110001111111100000",
        "0111011111111000000",
        "0111111111110000000",
        "0011111111110000000",
        "0001111111100000000",
        "0000111111000000000",
        "0000011110000000000",
        "0000011011000000000",
        "0000001001000000000",
        "0000000001000000000",
        "0000000001100000000"
    ],
    duck1: [
        "0000000000001111111000",
        "0000000000001011111000",
        "0000000000001111111000",
        "0000000000001111000000",
        "0100001111111111110000",
        "0110011111111111100000",
        "0111111111111110000000",
        "0011111111111100000000",
        "0001111111100000000000",
        "0000110001100000000000",
        "0000100000000000000000",
        "0000110000000000000000"
    ],
    duck2: [
        "0000000000001111111000",
        "0000000000001011111000",
        "0000000000001111111000",
        "0000000000001111000000",
        "0100001111111111110000",
        "0110011111111111100000",
        "0111111111111110000000",
        "0011111111111100000000",
        "0001111111100000000000",
        "0000110001100000000000",
        "0000000000100000000000",
        "0000000001100000000000"
    ],
    dead: [
        "0000000001111111000",
        "0000000001X11111000",
        "0000000001111111000",
        "0000000001111000000",
        "0000000001111110000",
        "0100000011111000000",
        "0100000111111110000",
        "0110001111111100000",
        "0111011111111000000",
        "0111111111110000000",
        "0011111111110000000",
        "0001111111100000000",
        "0000111111000000000",
        "0000011110000000000",
        "0000011011000000000",
        "0000010001000000000",
        "0000010001000000000",
        "0000011001100000000"
    ],
    cactusSmall: [
        "001100",
        "001100",
        "101100",
        "101101",
        "111111",
        "011110",
        "001100",
        "001100",
        "001100",
        "001100",
        "001100",
        "001100"
    ],
    cactusLarge: [
        "00011000",
        "00011000",
        "10011001",
        "10011001",
        "10011011",
        "11111111",
        "01111110",
        "00011000",
        "00011000",
        "00011000",
        "00011000",
        "00011000",
        "00011000",
        "00011000",
        "00011000"
    ],
    bird1: [
        "000000011000",
        "000000111110",
        "110001111111",
        "111111111100",
        "011111111000",
        "001111110000",
        "000011000000",
        "000010000000"
    ],
    bird2: [
        "000010000000",
        "000011000000",
        "001111110000",
        "011111111000",
        "111111111100",
        "110001111111",
        "000000111110",
        "000000011000"
    ],
    moon: [
        "00111100",
        "01111110",
        "11110000",
        "11100000",
        "11100000",
        "11110000",
        "01111110",
        "00111100"
    ]
};

function renderMatrix(ctx, matrix, x, y, scale, color) {
    for (let r = 0; r < matrix.length; r++) {
        const row = matrix[r];
        for (let c = 0; c < row.length; c++) {
            const char = row[c];
            if (char === '1') {
                ctx.fillStyle = color;
                ctx.fillRect(Math.round(x + c * scale), Math.round(y + r * scale), Math.ceil(scale), Math.ceil(scale));
            } else if (char === 'X') {
                ctx.fillStyle = '#f38ba8'; // Catppuccin red X eye
                ctx.fillRect(Math.round(x + c * scale), Math.round(y + r * scale), Math.ceil(scale), Math.ceil(scale));
            }
        }
    }
}


const DINO_GROUND_Y = 175;
let dinoState = 'IDLE'; // 'IDLE' | 'RUNNING' | 'GAMEOVER'
let dinoAnimId = null;
let dinoScore = 0;
let dinoHighScore = parseInt(localStorage.getItem('yara-dino-hi') || '0', 10);
let dinoAnimFrame = 0;
let lastMilestone = 0;

let dino = {
    x: 45,
    y: DINO_GROUND_Y - (18 * DINO_PIXEL_SCALE),
    vy: 0,
    isDucking: false,
    isGrounded: true
};

let obstacles = [];
let spawnCountdown = 70;
let terrainBumps = [];
let stars = [];

function initTerrain() {
    terrainBumps = [];
    for (let x = 0; x < 640; x += 32) {
        terrainBumps.push({ x: x, len: Math.floor(Math.random() * 8) + 4 });
    }
    stars = [
        { x: 80, y: 35, s: 2 },
        { x: 210, y: 22, s: 1.5 },
        { x: 330, y: 50, s: 2 },
        { x: 440, y: 28, s: 1.5 },
        { x: 500, y: 65, s: 2 }
    ];
}

function resetDinoGame() {
    dinoScore = 0;
    dinoAnimFrame = 0;
    lastMilestone = 0;
    dino.y = DINO_GROUND_Y - (18 * DINO_PIXEL_SCALE);
    dino.vy = 0;
    dino.isDucking = false;
    dino.isGrounded = true;
    obstacles = [];
    spawnCountdown = 60;
    initTerrain();
    updateScoreUI();
    const statusText = document.getElementById('dino-status-text');
    if (statusText) statusText.textContent = '[STATUS: RUNNING]';
}

function updateScoreUI() {
    const sStr = String(Math.floor(dinoScore)).padStart(5, '0');
    const hStr = String(Math.floor(dinoHighScore)).padStart(5, '0');
    const scoreDisplay = document.getElementById('dino-score-display');
    const hiDisplay = document.getElementById('dino-hi-display');
    if (scoreDisplay) scoreDisplay.textContent = `SCORE: ${sStr}`;
    if (hiDisplay) hiDisplay.textContent = `HI: ${hStr}`;
}

function handleDinoJump() {
    if (dinoState === 'IDLE' || dinoState === 'GAMEOVER') {
        resetDinoGame();
        dinoState = 'RUNNING';
        playDinoSfx('jump');
        return;
    }

    if (dinoState === 'RUNNING' && dino.isGrounded) {
        dino.vy = -11.6;
        dino.isGrounded = false;
        playDinoSfx('jump');
    }
}

function handleDinoDuck(isDucking) {
    if (dinoState !== 'RUNNING') return;
    dino.isDucking = isDucking;
    if (isDucking && !dino.isGrounded) {
        dino.vy += 3.5; // Fast fall
    }
}

function spawnObstacle() {
    const currentSpeed = Math.min(11.5, 5.2 + (dinoScore / 180));
    const canSpawnBird = dinoScore >= 180;
    const r = Math.random();

    if (canSpawnBird && r < 0.32) {
        // Pterodactyl bird at low, mid, or high height
        const heights = [148, 128, 96];
        const flyY = heights[Math.floor(Math.random() * heights.length)];
        obstacles.push({
            type: 'bird',
            x: 650,
            y: flyY,
            w: 12 * DINO_PIXEL_SCALE,
            h: 8 * DINO_PIXEL_SCALE,
            matrix1: DINO_SPRITES.bird1,
            matrix2: DINO_SPRITES.bird2,
            color: '#f38ba8'
        });
    } else if (r < 0.68) {
        // Large cactus
        obstacles.push({
            type: 'cactusLarge',
            x: 650,
            y: DINO_GROUND_Y - (15 * DINO_PIXEL_SCALE),
            w: 8 * DINO_PIXEL_SCALE,
            h: 15 * DINO_PIXEL_SCALE,
            matrix: DINO_SPRITES.cactusLarge,
            color: '#a6e3a1'
        });
    } else {
        // Small cactus
        obstacles.push({
            type: 'cactusSmall',
            x: 650,
            y: DINO_GROUND_Y - (12 * DINO_PIXEL_SCALE),
            w: 6 * DINO_PIXEL_SCALE,
            h: 12 * DINO_PIXEL_SCALE,
            matrix: DINO_SPRITES.cactusSmall,
            color: '#a6e3a1'
        });
    }

    const minGap = Math.max(38, 90 - Math.floor(dinoScore / 25));
    const randomExtra = Math.floor(Math.random() * 45);
    spawnCountdown = minGap + randomExtra;
}

function checkDinoCollision(dBox, oBox) {
    const pad = 4;
    return (
        dBox.x + pad < oBox.x + oBox.w - pad &&
        dBox.x + dBox.w - pad > oBox.x + pad &&
        dBox.y + pad < oBox.y + oBox.h - pad &&
        dBox.y + dBox.h - pad > oBox.y + pad
    );
}

function dinoGameLoop() {
    if (!dinoModalOpen) return;
    const canvas = document.getElementById('dino-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    dinoAnimFrame++;

    // Clear canvas
    ctx.fillStyle = '#11111b';
    ctx.fillRect(0, 0, 640, 220);

    const currentSpeed = Math.min(11.5, 5.2 + (dinoScore / 180));

    // Stars & Moon background
    renderMatrix(ctx, DINO_SPRITES.moon, 560, 22, 2.0, '#f9e2af');
    ctx.fillStyle = '#6c7086';
    for (let s of stars) {
        if (dinoState === 'RUNNING') {
            s.x -= currentSpeed * 0.15;
            if (s.x < -10) s.x = 650;
        }
        ctx.fillRect(Math.round(s.x), Math.round(s.y), Math.round(s.s), Math.round(s.s));
    }

    // Ground horizon line
    ctx.strokeStyle = '#45475a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, DINO_GROUND_Y);
    ctx.lineTo(640, DINO_GROUND_Y);
    ctx.stroke();

    // Ground terrain dashes
    ctx.fillStyle = '#585b70';
    for (let b of terrainBumps) {
        if (dinoState === 'RUNNING') {
            b.x -= currentSpeed;
            if (b.x < -20) b.x = 640 + Math.random() * 20;
        }
        ctx.fillRect(Math.round(b.x), DINO_GROUND_Y + 4, b.len, 2);
    }

    // Logic when RUNNING
    if (dinoState === 'RUNNING') {
        dinoScore += 0.14;
        updateScoreUI();

        // 100 pt milestone chime
        const currentHundred = Math.floor(dinoScore / 100);
        if (currentHundred > lastMilestone) {
            lastMilestone = currentHundred;
            playDinoSfx('score');
        }

        // Dino Physics
        dino.vy += 0.62; // Gravity
        dino.y += dino.vy;

        const maxStandingY = DINO_GROUND_Y - (18 * DINO_PIXEL_SCALE);
        const maxDuckingY = DINO_GROUND_Y - (12 * DINO_PIXEL_SCALE);
        const maxY = dino.isDucking ? maxDuckingY : maxStandingY;

        if (dino.y >= maxY) {
            dino.y = maxY;
            dino.vy = 0;
            dino.isGrounded = true;
        } else {
            dino.isGrounded = false;
        }

        // Spawning
        spawnCountdown--;
        if (spawnCountdown <= 0) {
            spawnObstacle();
        }

        // Update obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            obs.x -= currentSpeed;
            if (obs.x + obs.w < -20) {
                obstacles.splice(i, 1);
            }
        }

        // Current Dino Hitbox
        const dinoHitbox = {
            x: dino.x,
            y: dino.y,
            w: (dino.isDucking ? 22 : 19) * DINO_PIXEL_SCALE,
            h: (dino.isDucking ? 12 : 18) * DINO_PIXEL_SCALE
        };

        // Check Collisions
        for (let obs of obstacles) {
            if (checkDinoCollision(dinoHitbox, obs)) {
                dinoState = 'GAMEOVER';
                playDinoSfx('hit');
                if (dinoScore > dinoHighScore) {
                    dinoHighScore = Math.floor(dinoScore);
                    localStorage.setItem('yara-dino-hi', dinoHighScore);
                }
                updateScoreUI();
                const statusText = document.getElementById('dino-status-text');
                if (statusText) {
                    statusText.textContent = '[STATUS: GAME OVER]';
                    statusText.style.color = '#f38ba8';
                }
                break;
            }
        }
    }

    // Render Obstacles
    for (let obs of obstacles) {
        if (obs.type === 'bird') {
            const frame = Math.floor(dinoAnimFrame / 8) % 2 === 0 ? obs.matrix1 : obs.matrix2;
            renderMatrix(ctx, frame, obs.x, obs.y, DINO_PIXEL_SCALE, obs.color);
        } else {
            renderMatrix(ctx, obs.matrix, obs.x, obs.y, DINO_PIXEL_SCALE, obs.color);
        }
    }

    // Render Dino
    let currentDinoMatrix = DINO_SPRITES.stand;
    if (dinoState === 'GAMEOVER') {
        currentDinoMatrix = DINO_SPRITES.dead;
    } else if (dinoState === 'RUNNING') {
        if (!dino.isGrounded) {
            currentDinoMatrix = DINO_SPRITES.stand;
        } else if (dino.isDucking) {
            currentDinoMatrix = Math.floor(dinoAnimFrame / 6) % 2 === 0 ? DINO_SPRITES.duck1 : DINO_SPRITES.duck2;
        } else {
            currentDinoMatrix = Math.floor(dinoAnimFrame / 6) % 2 === 0 ? DINO_SPRITES.run1 : DINO_SPRITES.run2;
        }
    }
    renderMatrix(ctx, currentDinoMatrix, dino.x, dino.y, DINO_PIXEL_SCALE, '#89b4fa');

    // UI Overlay on Canvas
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px "Noto Sans Mono", monospace';

    if (dinoState === 'IDLE') {
        ctx.fillStyle = '#89b4fa';
        ctx.fillText('> DRÜCKE [LEERTASTE] ZUM STARTEN <', 320, 100);
        ctx.font = '12px "Noto Sans Mono", monospace';
        ctx.fillStyle = '#a6adc8';
        ctx.fillText('Weiche den Kakteen & Pterodaktylen aus!', 320, 125);
    } else if (dinoState === 'GAMEOVER') {
        ctx.fillStyle = '#f38ba8';
        ctx.font = 'bold 20px "Noto Sans Mono", monospace';
        ctx.fillText('G A M E   O V E R', 320, 90);
        ctx.fillStyle = '#cdd6f4';
        ctx.font = '13px "Noto Sans Mono", monospace';
        ctx.fillText('[LEERTASTE] für Neustart  //  [ESC] Beenden', 320, 120);
    }

    dinoAnimId = requestAnimationFrame(dinoGameLoop);
}

function openDinoGame() {
    ensureContextMenuAndDino();
    const modal = document.getElementById('dino-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    dinoModalOpen = true;
    dinoState = 'IDLE';
    dinoScore = 0;
    const statusText = document.getElementById('dino-status-text');
    if (statusText) {
        statusText.textContent = '[STATUS: READY]';
        statusText.style.color = '#a6e3a1';
    }
    initTerrain();
    updateScoreUI();
    getDinoAudio();
    if (dinoAnimId) cancelAnimationFrame(dinoAnimId);
    dinoAnimId = requestAnimationFrame(dinoGameLoop);
}

function closeDinoGame() {
    const modal = document.getElementById('dino-modal');
    if (modal) modal.style.display = 'none';
    dinoModalOpen = false;
    if (dinoAnimId) cancelAnimationFrame(dinoAnimId);
}

function triggerKonamiToast() {
    const existing = document.querySelector('.konami-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'konami-toast';
    toast.textContent = '🦖 KONAMI CODE UNLOCKED! Launching Dino Runner...';
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2600);
}

// Konami Code Detector: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    // If game modal is open, intercept game keys
    if (dinoModalOpen) {
        if (e.key === 'Escape') {
            closeDinoGame();
            e.preventDefault();
            return;
        }
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            handleDinoJump();
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            handleDinoDuck(true);
            e.preventDefault();
            return;
        }
        return;
    }

    // Track Konami Code
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = KONAMI_CODE[konamiIndex].toLowerCase();

    if (key === expected) {
        konamiIndex++;
        if (konamiIndex === KONAMI_CODE.length) {
            konamiIndex = 0;
            triggerKonamiToast();
            playDinoSfx('score');
            setTimeout(openDinoGame, 400);
        }
    } else {
        konamiIndex = (key === 'arrowup') ? 1 : 0;
    }
});

document.addEventListener('keyup', (e) => {
    if (dinoModalOpen) {
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            handleDinoDuck(false);
            e.preventDefault();
        }
    }
});

// Initial bind on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureContextMenuAndDino);
} else {
    ensureContextMenuAndDino();
}

window.openDinoGame = openDinoGame;
window.closeDinoGame = closeDinoGame;


