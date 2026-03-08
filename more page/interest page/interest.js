const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
const HEADER = 53;

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight - HEADER;
}
resize();
window.addEventListener('resize', resize);

const FIELDS = [
    { id: 'esg',  color: 'rgba(0,255,100,0.18)',  speed: 0.00038, angle: 0 },
    { id: 'web3', color: 'rgba(145,21,218,0.18)', speed: 0.00027, angle: Math.PI * 0.5 },
    { id: 'ai',   color: 'rgba(79,195,247,0.18)', speed: 0.00044, angle: Math.PI },
    { id: 'vge',  color: 'rgba(255,106,0,0.18)',  speed: 0.00021, angle: Math.PI * 1.5 },
];

let pausedId    = null;
let activePanel = null;
let lastTime    = null;

function getCenter() {
    const w = window.innerWidth;
    const h = window.innerHeight - HEADER;
    return {
        cx:     w / 2,
        cy:     h / 2,
        radius: Math.min(w, h) * 0.32
    };
}

function frame(ts) {
    if (!lastTime) lastTime = ts;
    const dt = Math.min(ts - lastTime, 50); // cap dt so tab-switch doesn't jump
    lastTime = ts;

const { cx, cy, radius } = getCenter();

ctx.clearRect(0, 0, canvas.width, canvas.height);

// orbit ring
ctx.beginPath();
ctx.arc(cx, cy, radius, 0, Math.PI * 2);
ctx.setLineDash([4, 10]);
ctx.strokeStyle = 'rgba(255,255,255,0.05)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.setLineDash([]);

FIELDS.forEach(f => {
    if (pausedId !== f.id) f.angle += f.speed * dt;

    const x = cx + radius * Math.cos(f.angle);
    const y = cy + radius * Math.sin(f.angle);

    // connector
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.setLineDash([3, 7]);
    ctx.strokeStyle = f.color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // glow dot at node position on canvas
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = f.color;
    ctx.fill();

    // move DOM node
    const node = document.getElementById('node-' + f.id);
    node.style.left = x + 'px';
    node.style.top  = (y + HEADER) + 'px';

    // follow panel if open
    if (activePanel === f.id) {
        placePanelNear(f.id, x, y + HEADER);
    }
});

    // center node
    const cn = document.getElementById('center-node');
    cn.style.left = cx + 'px';
    cn.style.top  = (cy + HEADER) + 'px';

    requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

// ── PANEL ──────────────────────────────────────────────
function placePanelNear(id, nx, ny) {
    const panel  = document.getElementById('panel-' + id);
    const pw = 272, ph = 200;
    const vw = window.innerWidth, vh = window.innerHeight;
    const off = 48;
    let left = nx + off;
    let top  = ny - 80;
    if (left + pw > vw - 12) left = nx - pw - off;
    if (left < 12) left = 12;
    if (top < HEADER + 8) top = HEADER + 8;
    if (top + ph > vh - 12) top = vh - ph - 12;
    panel.style.left = left + 'px';
    panel.style.top  = top  + 'px';
}

function togglePanel(id) {
    if (activePanel === id) { closePanel(id); return; }
    if (activePanel) closePanel(activePanel);
    activePanel = id;
    pausedId    = id;
    document.getElementById('node-'  + id).classList.add('paused');
    document.getElementById('panel-' + id).classList.add('show');
    document.getElementById('hint').style.opacity = '0';
    
    // snap immediately
    const f = FIELDS.find(f => f.id === id);
    const { cx, cy, radius } = getCenter();
    placePanelNear(id,
        cx + radius * Math.cos(f.angle),
        cy + radius * Math.sin(f.angle) + HEADER
    );
}

function closePanel(id) {
    activePanel = null;
    pausedId    = null;
    document.getElementById('node-'  + id).classList.remove('paused');
    document.getElementById('panel-' + id).classList.remove('show');
    document.getElementById('hint').style.opacity = '1';
}