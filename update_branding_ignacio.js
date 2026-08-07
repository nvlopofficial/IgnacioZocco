const fs   = require('fs');
const path = require('path');

const base       = 'c:\\Users\\Ezequiel Zocco\\Documents\\Claude\\Projects\\DJ PRESSKITS';
const htmlPath   = path.join(base, 'index.html');
const scratch    = 'C:\\Users\\EZEQUI~1\\AppData\\Local\\Temp\\claude\\C--Users-Ezequiel-Zocco-Documents-Claude-Projects-DJ-PRESSKITS\\ba98749b-90a8-4975-86f8-0594b0d85dec\\scratchpad';

// Optimized/resized assets (see scratchpad — resized+recompressed with ImageMagick,
// originals were multi-MB camera/print files, way too heavy to embed as-is)
const newPhoto  = path.join(scratch, 'foto_estudio.jpg');           // was 1.9MB PNG -> 176KB JPEG
const wordmark  = path.join(scratch, 'wordmark.png');               // was 848KB @3000px -> 149KB @900px
const galDir    = path.join(scratch, 'gallery_optimized');          // 5 photos resized to <=1600px, q80

const galFiles = [
  '26102025-_SNY4793.jpg',
  '26102025-_SNY4808-Mejorado-NR.jpg',
  '26102025-_SNY4848-Mejorado-NR.jpg',
  'IMG_7612.jpg',
  'IMG_7669.jpg',
];

function dataUri(file, mime) {
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

let html = fs.readFileSync(htmlPath, 'utf8');

const newPhotoUri = dataUri(newPhoto, 'image/jpeg');
const wordmarkUri = dataUri(wordmark, 'image/png');

// 1. Hero image (idempotent: matches whatever base64 is currently there)
{
  const re = /<img class="hero-img" src="data:image\/[a-z]+;base64,[^"]+" alt="Ignacio Zocco en vivo">/;
  if (re.test(html)) {
    html = html.replace(re, `<img class="hero-img" src="${newPhotoUri}" alt="Ignacio Zocco en vivo">`);
    console.log('Hero image reemplazada.');
  } else {
    console.log('WARNING: no se encontro el marcador de hero image.');
  }
}

// 2. Hero object-position (recuadre para foto cuadrada) - idempotent
if (html.includes('object-position:30% 30%;animation:hZoom')) {
  html = html.replace('object-position:30% 30%;animation:hZoom', 'object-position:50% 20%;animation:hZoom');
  console.log('Hero object-position ajustado.');
} else if (html.includes('object-position:50% 20%;animation:hZoom')) {
  console.log('Hero object-position ya estaba ajustado.');
} else {
  console.log('WARNING: no se encontro el marcador de hero object-position.');
}

// 3. Bio image (idempotent)
{
  const re = /<img src="data:image\/[a-z]+;base64,[^"]+" alt="Ignacio Zocco" loading="lazy">/;
  if (re.test(html)) {
    html = html.replace(re, `<img src="${newPhotoUri}" alt="Ignacio Zocco" loading="lazy">`);
    console.log('Bio image reemplazada.');
  } else {
    console.log('WARNING: no se encontro el marcador de bio image.');
  }
}

// 4. Nav logo -> wordmark (idempotent: handles both plain-text and already-image states)
{
  const textMarker = '<a href="#hero" class="nav-logo">Ignacio Zocco</a>';
  const imgRe = /<a href="#hero" class="nav-logo"><img src="data:image\/png;base64,[^"]+" alt="Ignacio Zocco"><\/a>/;
  if (html.includes(textMarker)) {
    html = html.replace(textMarker, `<a href="#hero" class="nav-logo"><img src="${wordmarkUri}" alt="Ignacio Zocco"></a>`);
    console.log('Nav logo reemplazado por wordmark.');
  } else if (imgRe.test(html)) {
    html = html.replace(imgRe, `<a href="#hero" class="nav-logo"><img src="${wordmarkUri}" alt="Ignacio Zocco"></a>`);
    console.log('Nav logo (wordmark) actualizado.');
  } else {
    console.log('WARNING: no se encontro el marcador de nav-logo.');
  }
}
if (!html.includes('.nav-logo img{')) {
  html = html.replace(
    ".nav-logo{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:.14em;color:var(--gold)}",
    ".nav-logo{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:.14em;color:var(--gold)}\n.nav-logo img{height:22px;display:block}"
  );
  console.log('CSS .nav-logo img inyectado.');
}

// 5. Footer logo -> wordmark (idempotent)
{
  const textMarker = '<div class="footer-logo">Ignacio Zocco</div>';
  const imgRe = /<div class="footer-logo"><img src="data:image\/png;base64,[^"]+" alt="Ignacio Zocco"><\/div>/;
  if (html.includes(textMarker)) {
    html = html.replace(textMarker, `<div class="footer-logo"><img src="${wordmarkUri}" alt="Ignacio Zocco"></div>`);
    console.log('Footer logo reemplazado por wordmark.');
  } else if (imgRe.test(html)) {
    html = html.replace(imgRe, `<div class="footer-logo"><img src="${wordmarkUri}" alt="Ignacio Zocco"></div>`);
    console.log('Footer logo (wordmark) actualizado.');
  } else {
    console.log('WARNING: no se encontro el marcador de footer-logo.');
  }
}
if (!html.includes('.footer-logo img{')) {
  html = html.replace(
    ".footer-logo{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:.12em;color:var(--gold);margin-bottom:16px;opacity:.5}",
    ".footer-logo{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:.12em;color:var(--gold);margin-bottom:16px;opacity:.5}\n.footer-logo img{height:38px;margin:0 auto}"
  );
  console.log('CSS .footer-logo img inyectado.');
}

// 6. Galeria: reconstruir con las 5 fotos curadas y optimizadas (idempotente: siempre reescribe el bloque)
{
  const galStart = html.indexOf('<div class="gallery-grid reveal">');
  const tail = html.slice(galStart);
  const endMatch = tail.match(/\r?\n {4}<\/div>\r?\n {2}<\/div>\r?\n<\/section>/);
  if (galStart === -1 || !endMatch) {
    console.log('WARNING: no se encontraron los marcadores de gallery-grid.');
  } else {
    const galEnd = galStart + endMatch.index;
    const items = galFiles
      .map(f => `      <div class="gal-item"><img src="${dataUri(path.join(galDir, f), 'image/jpeg')}" alt="Ignacio Zocco"></div>`)
      .join('\n');
    const newBlock = `<div class="gallery-grid reveal">\n${items}`;
    html = html.slice(0, galStart) + newBlock + html.slice(galEnd);
    console.log(`Galeria reconstruida con ${galFiles.length} fotos.`);
  }
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('index.html actualizado.');
