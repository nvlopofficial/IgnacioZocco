const fs   = require('fs');
const path = require('path');

const base        = 'c:\\Users\\Ezequiel Zocco\\Documents\\Claude\\Projects\\DJ PRESSKITS';
const ridersDir   = path.join(base, 'RIDERS TECNICOS');
const htmlPath    = path.join(base, 'index.html');

function dataUri(file) {
  return `data:image/png;base64,${fs.readFileSync(path.join(ridersDir, file)).toString('base64')}`;
}

const cdj3000  = dataUri('CDJ PIONEER 3000.png');
const v10      = dataUri('MIXER PIONEER DJM V10.png');
const nxs2000  = dataUri('PIONEER CDJ 2000 NXS2.png');

const equipHtml = `
    <h2 class="reveal" style="margin-top:2.5rem">Rider Principal</h2>
    <div class="rider-equip-grid reveal">
      <div class="rider-equip-card">
        <img src="${cdj3000}" alt="Pioneer CDJ 3000">
        <p class="rider-equip-name">PIONEER CDJ 3000</p>
      </div>
      <div class="rider-equip-card">
        <img src="${v10}" alt="Pioneer DJM-V10">
        <p class="rider-equip-name">PIONEER DJM-V10</p>
      </div>
    </div>
    <h2 class="reveal" style="margin-top:2rem">Rider Alternativo</h2>
    <div class="rider-equip-grid reveal">
      <div class="rider-equip-card">
        <img src="${nxs2000}" alt="Pioneer CDJ 2000 NXS2">
        <p class="rider-equip-name">PIONEER CDJ 2000 NXS2</p>
      </div>
    </div>
    `;

const equipCss = `
.rider-equip-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:24px}
.rider-equip-card{border:1px solid var(--line);background:var(--bg3);padding:20px;display:flex;flex-direction:column;align-items:center;gap:12px}
.rider-equip-card img{width:100%;max-width:180px;object-fit:contain;filter:brightness(.95)}
.rider-equip-name{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.12em;color:var(--mute);text-align:center}
`;

let html = fs.readFileSync(htmlPath, 'utf8');

// Inject CSS after the existing rider CSS block marker
const cssMarker = '/* ─── RIDER ─── */';
if (!html.includes('.rider-equip-grid')) {
  html = html.replace(cssMarker, cssMarker + equipCss);
  console.log('CSS inyectado.');
} else {
  console.log('CSS ya existe, saltando.');
}

// Inject equipment grid before the rider-format div
const htmlMarker = '<div class="rider-format reveal">';
if (!html.includes('<div class="rider-equip-grid')) {
  html = html.replace(htmlMarker, equipHtml + htmlMarker);
  console.log('HTML de equipos inyectado.');
} else {
  console.log('Grid HTML ya existe, saltando.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('index.html actualizado.');
