// generate_fani_epk.js — Generates FANI's EPK with base64 embedded images
const fs   = require('fs');
const path = require('path');

const base       = 'c:/Users/Ezequiel Zocco/Documents/Claude/Projects/DJ PRESSKITS';
const epkFolder  = path.join(base, '\u{1F4C1} EPK - [FANI]');
const ridersFolder = path.join(base, 'RIDERS TECNICOS');
const outputFile = path.join(epkFolder, 'fani_epk.html');

function dataUri(filePath) {
  const ext  = path.extname(filePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  const b64  = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${b64}`;
}

console.log('Loading main photos...');
const heroUri = dataUri(path.join(epkFolder, '01 - Fotos', '01 - Foto Principal', 'fani-348.jpg'));
const bioUri  = dataUri(path.join(epkFolder, '01 - Fotos', '01 - Foto Principal', 'fani-270.jpg'));

console.log('Loading gallery...');
const galDir = path.join(epkFolder, '01 - Fotos', '06 - Galeria imagenes (Redes, en cabina, etc)');
const galFiles = [
  'Herbarium@faumalacalza-158.jpg',
  'Herbarium@faumalacalza-160.jpg',
  'fani-026.jpg',
  'fani-176.jpg',
  'fani-227.jpg',
  'fani-240.jpg',
  'IMG_5424.jpg',
  'IMG_5755.jpeg',
  'Intra - djs @godymex-43.jpg'
];
const galUris = galFiles.map(f => dataUri(path.join(galDir, f)));
const galHtml = galUris.map(uri =>
  `      <div class="gal-item reveal"><img src="${uri}" alt="FANI" loading="lazy"></div>`
).join('\n');

console.log('Loading rider equipment...');
const cdj3000Uri  = dataUri(path.join(ridersFolder, 'CDJ PIONEER 3000.png'));
const cdj2000Uri  = dataUri(path.join(ridersFolder, 'PIONEER CDJ 2000 NXS2.png'));
const mixerV10Uri = dataUri(path.join(ridersFolder, 'MIXER PIONEER DJM V10.png'));
const xone96Uri   = dataUri(path.join(ridersFolder, 'MIXER ALLEN&HEATH XONE 96.png'));
const xone92Uri   = dataUri(path.join(ridersFolder, 'MIXER ALLEN&HEATH XONE 92.png'));

console.log('Building HTML...');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FANI — Electronic Presskit</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --bg:      #090d1c;
  --bg2:     #0d1225;
  --bg3:     #07091a;
  --fg:      #ede8f5;
  --mute:    #a898c8;
  --dim:     #6a5f8a;
  --accent:  #b88ee0;
  --accent2: #d4b8f0;
  --glow:    rgba(184,142,224,.35);
  --line:    rgba(184,142,224,.10);
  --line2:   rgba(184,142,224,.22);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--fg); font-family: 'DM Sans', sans-serif; font-weight: 300; overflow-x: hidden; }

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 40px;
  background: rgba(9,13,28,.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
  transition: background .3s;
}
nav.solid { background: rgba(9,13,28,.97); }
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.6rem; letter-spacing: .18em;
  color: var(--fg); text-decoration: none;
}
.nav-links { display: flex; gap: 28px; list-style: none; }
.nav-links a {
  font-size: .75rem; letter-spacing: .18em; text-transform: uppercase;
  color: var(--mute); text-decoration: none; transition: color .2s;
}
.nav-links a:hover { color: var(--accent); }
.nav-booking {
  font-size: .7rem; letter-spacing: .2em; text-transform: uppercase;
  padding: 9px 20px; border: 1px solid var(--accent);
  color: var(--accent); text-decoration: none; transition: all .25s;
}
.nav-booking:hover { background: var(--accent); color: var(--bg); }
@media (max-width: 768px) {
  nav { padding: 14px 20px; }
  .nav-links { display: none; }
}

/* HERO */
#hero {
  position: relative; height: 100vh;
  display: flex; align-items: flex-end;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background-image: url('${heroUri}');
  background-size: cover; background-position: center 20%;
  animation: hZoom 24s ease-in-out infinite alternate;
}
.hero-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(9,13,28,.92) 0%, rgba(9,13,28,.3) 50%, rgba(9,13,28,.05) 100%);
}
@keyframes hZoom { from { transform: scale(1); } to { transform: scale(1.06); } }
.hero-content {
  position: relative; z-index: 2;
  padding: 0 40px 60px;
  width: 100%;
}
.hero-tag {
  font-size: .7rem; letter-spacing: .35em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 12px;
  opacity: 0; animation: fadeUp .6s ease .3s forwards;
}
.hero-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(5rem, 18vw, 14rem);
  line-height: .9; letter-spacing: .04em;
  color: var(--fg);
  opacity: 0; animation: fadeUp .7s ease .5s forwards;
}
.hero-sub {
  font-size: .8rem; letter-spacing: .25em; text-transform: uppercase;
  color: var(--mute); margin-top: 14px;
  opacity: 0; animation: fadeUp .6s ease .7s forwards;
}
.hero-badges {
  display: flex; gap: 10px; flex-wrap: wrap; margin-top: 22px;
  opacity: 0; animation: fadeUp .6s ease .95s forwards;
}
.badge {
  font-size: .65rem; letter-spacing: .2em; text-transform: uppercase;
  padding: 6px 14px; border: 1px solid var(--line2); color: var(--mute);
}
.badge.accent { border-color: var(--accent); color: var(--accent); }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* SECTIONS */
.sec { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
.sec-label {
  font-size: .65rem; letter-spacing: .35em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 48px;
  display: flex; align-items: center; gap: 16px;
}
.sec-label::before {
  content: ''; display: block; width: 40px; height: 1px; background: var(--accent);
}
.sec-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.8rem, 6vw, 5.5rem);
  letter-spacing: .06em; line-height: 1;
  color: var(--fg); margin-bottom: 36px;
}

/* BIO */
#bio { border-bottom: 1px solid var(--line); }
.bio-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: start; }
.bio-text p { font-size: 1rem; line-height: 1.85; color: var(--mute); margin-bottom: 20px; }
.bio-photo { position: relative; }
.bio-photo img {
  width: 100%; aspect-ratio: 3/4; object-fit: cover; object-position: top; display: block;
  border: 1px solid var(--line2);
  filter: brightness(.92) saturate(.85); transition: filter .4s;
}
.bio-photo img:hover { filter: brightness(1) saturate(1); }
.bio-photo-frame {
  position: absolute; inset: 12px -12px -12px 12px;
  border: 1px solid var(--line2); z-index: -1;
}
@media (max-width: 768px) {
  .bio-grid { grid-template-columns: 1fr; }
  .bio-photo { order: -1; }
}

/* CABINAS COMPARTIDAS */
#cabinas {
  background: var(--bg3);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.cabinas-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 100px 40px; text-align: center;
}
.cabinas-stage {
  position: relative; height: 130px;
  display: flex; align-items: center; justify-content: center;
  margin: 48px 0 16px;
  overflow: hidden;
}
.cabinas-name {
  position: absolute; width: 100%;
  opacity: 0; transform: translateY(18px);
  transition: opacity .7s ease, transform .7s ease;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 5.5vw, 4.8rem);
  letter-spacing: .18em; color: var(--accent);
  white-space: nowrap; text-align: center;
}
.cabinas-name.active { opacity: 1; transform: translateY(0); }
.cabinas-name.leaving { opacity: 0; transform: translateY(-18px); }
.cabinas-hint {
  font-size: .65rem; letter-spacing: .3em; text-transform: uppercase;
  color: var(--dim); margin-top: 8px;
}
.cabinas-dots { display: flex; justify-content: center; gap: 8px; margin-top: 32px; }
.c-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--dim); transition: background .3s;
}
.c-dot.on { background: var(--accent); }

/* MÚSICA */
#musica { border-bottom: 1px solid var(--line); }
.musica-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.musica-embed iframe { width: 100%; border: 1px solid var(--line2); display: block; }
.musica-links { display: flex; flex-direction: column; gap: 16px; }
.music-link {
  display: flex; align-items: center; gap: 16px; padding: 20px 24px;
  border: 1px solid var(--line2); text-decoration: none; transition: all .25s; color: var(--fg);
}
.music-link:hover { border-color: var(--accent); background: rgba(184,142,224,.06); }
.music-link-icon { font-size: 1.3rem; flex-shrink: 0; }
.music-link-text strong { display: block; font-size: .85rem; letter-spacing: .06em; font-weight: 500; margin-bottom: 3px; }
.music-link-text span { font-size: .7rem; letter-spacing: .15em; text-transform: uppercase; color: var(--mute); }
.youtube-embed {
  grid-column: 1 / -1; position: relative;
  padding-bottom: 56.25%; height: 0; border: 1px solid var(--line2);
}
.youtube-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
@media (max-width: 768px) { .musica-grid { grid-template-columns: 1fr; } }

/* GALERÍA */
#galeria { border-bottom: 1px solid var(--line); }
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.gal-item { aspect-ratio: 3/4; overflow: hidden; border: 1px solid var(--line); transition: all .3s ease; }
.gal-item:hover { border-color: var(--accent); transform: scale(1.015); }
.gal-item img {
  width: 100%; height: 100%; object-fit: cover;
  filter: brightness(.88) saturate(.75); transition: filter .4s, transform .4s;
}
.gal-item:hover img { filter: brightness(1) saturate(1); transform: scale(1.04); }
@media (max-width: 768px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }

/* RIDER */
#rider { border-bottom: 1px solid var(--line); }
.rider-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 48px; }
.rider-card { border: 1px solid var(--line2); padding: 24px 16px 18px; text-align: center; transition: border-color .25s; }
.rider-card:hover { border-color: var(--accent); }
.rider-card img {
  width: 100%; max-height: 130px; object-fit: contain;
  filter: brightness(.85) saturate(.6); transition: filter .3s; margin-bottom: 14px;
}
.rider-card:hover img { filter: brightness(1) saturate(1); }
.rider-card-name { font-size: .65rem; letter-spacing: .18em; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; }
.rider-card-qty { font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); }
.rider-specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.rider-spec-item { padding: 24px; border: 1px solid var(--line); }
.rider-spec-label { font-size: .6rem; letter-spacing: .25em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
.rider-spec-val { font-size: .85rem; color: var(--mute); line-height: 1.7; }
@media (max-width: 768px) {
  .rider-grid { grid-template-columns: repeat(2, 1fr); }
  .rider-specs { grid-template-columns: 1fr; }
}

/* CONTACTO */
#contacto { text-align: center; }
.contact-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 48px; }
.contact-link {
  display: flex; align-items: center; gap: 10px; padding: 14px 28px;
  border: 1px solid var(--line2); color: var(--mute); text-decoration: none;
  font-size: .75rem; letter-spacing: .15em; text-transform: uppercase; transition: all .25s;
}
.contact-link:hover { border-color: var(--accent); color: var(--accent); }
.contact-booking { margin-top: 60px; padding-top: 48px; border-top: 1px solid var(--line); }
.contact-booking p { font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; color: var(--mute); margin-bottom: 12px; }
.contact-booking a {
  font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: .2em;
  color: var(--accent); text-decoration: none; transition: color .2s;
}
.contact-booking a:hover { color: var(--accent2); }

/* FOOTER */
footer {
  border-top: 1px solid var(--line); padding: 32px 40px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: .65rem; letter-spacing: .2em; text-transform: uppercase; color: var(--dim);
}
@media (max-width: 768px) { footer { flex-direction: column; gap: 8px; text-align: center; } }

/* REVEAL */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
.reveal.visible { opacity: 1; transform: none; }
</style>
</head>
<body>

<nav id="main-nav">
  <a class="nav-logo" href="#hero">FANI</a>
  <ul class="nav-links">
    <li><a href="#bio">Bio</a></li>
    <li><a href="#cabinas">Cabinas</a></li>
    <li><a href="#musica">Música</a></li>
    <li><a href="#galeria">Galería</a></li>
    <li><a href="#rider">Rider</a></li>
    <li><a href="#contacto">Contacto</a></li>
  </ul>
  <a class="nav-booking" href="https://www.instagram.com/fanicrew.agency/" target="_blank">Booking</a>
</nav>

<!-- HERO -->
<section id="hero">
  <div class="hero-bg"></div>
  <div class="hero-content">
    <div class="hero-tag">Electronic Presskit</div>
    <h1 class="hero-name">FANI</h1>
    <p class="hero-sub">Indie Dance &nbsp;·&nbsp; Acid House &nbsp;·&nbsp; Techno &nbsp;·&nbsp; Electro</p>
    <div class="hero-badges">
      <span class="badge accent">Ibiza Resident</span>
      <span class="badge">Herbarium</span>
      <span class="badge">Fani Crew</span>
      <span class="badge">La Plata · ARG</span>
    </div>
  </div>
</section>

<!-- BIO -->
<section id="bio">
  <div class="sec">
    <div class="sec-label">Artista</div>
    <div class="bio-grid">
      <div class="bio-text reveal">
        <h2 class="sec-title">Biografía</h2>
        <p>Nacida en La Plata y criada en una familia de músicos, Fani construyó su vínculo con el ritmo desde muy chica. Guitarra, danza y exploración constante marcaron una identidad artística que hoy se traduce en cabina. Desde 2014 desarrolla un sonido influenciado por el Indie Dance, Acid House, Techno y Electro, siempre con una energía eufórica y una conexión directa con la pista.</p>
        <p>Su recorrido la llevó a ser residente en Ibiza, presentándose en clubes de la isla y consolidando una experiencia internacional que fortaleció su propuesta. Creadora de Herbarium, ciclo dedicado a la electrónica emergente, y fundadora de Fani Crew, impulsa nuevos talentos y expande la escena con una mirada fresca y curatorial.</p>
        <p>Groove, carácter y una atmósfera envolvente que transforma cada set en experiencia colectiva.</p>
        <p>Fani también se abrió paso en la producción musical. Lanzó su single "Telephone" por Módula Discos, sello enfocado en sonidos indie dance y sintetizadores analógicos con aires de disco vintage. Además presentó su EP "Dispuesta" a través del sello Zatori, donde combina dark disco y minimal techno con vocales propias.</p>
      </div>
      <div class="bio-photo reveal">
        <img src="${bioUri}" alt="FANI DJ">
        <div class="bio-photo-frame"></div>
      </div>
    </div>
  </div>
</section>

<!-- CABINAS COMPARTIDAS -->
<section id="cabinas">
  <div class="cabinas-inner">
    <div class="sec-label">Trayectoria</div>
    <h2 class="sec-title">Cabinas Compartidas</h2>
    <div class="cabinas-stage">
      <div class="cabinas-name active">Victoria Engel</div>
      <div class="cabinas-name">Nicolás Taboada</div>
      <div class="cabinas-name">Brigado Crew</div>
      <div class="cabinas-name">Guido Sartoris</div>
      <div class="cabinas-name">Pampa</div>
      <div class="cabinas-name">Valdovinos</div>
      <div class="cabinas-name">Mila Journee</div>
      <div class="cabinas-name">Traumer</div>
      <div class="cabinas-name">Yubik</div>
      <div class="cabinas-name">Magdalena</div>
    </div>
    <div class="cabinas-hint">Escena Nacional &amp; Internacional</div>
    <div class="cabinas-dots" id="cDots"></div>
  </div>
</section>

<!-- MÚSICA -->
<section id="musica">
  <div class="sec">
    <div class="sec-label">Música</div>
    <h2 class="sec-title reveal">Sets &amp; Releases</h2>
    <div class="musica-grid">
      <div class="musica-embed reveal">
        <iframe src="https://open.spotify.com/embed/artist/6MDSJaDjt9IMUiAGch5JJ5?utm_source=generator&theme=0"
          height="380" frameborder="0" allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"></iframe>
      </div>
      <div class="musica-links reveal">
        <a class="music-link" href="https://soundcloud.com/fani-dj" target="_blank" rel="noopener">
          <div class="music-link-icon">☁</div>
          <div class="music-link-text">
            <strong>SoundCloud</strong>
            <span>Sets &amp; mixes completos</span>
          </div>
        </a>
        <a class="music-link" href="https://www.beatport.com/es/artist/fani/628629" target="_blank" rel="noopener">
          <div class="music-link-icon">♫</div>
          <div class="music-link-text">
            <strong>Beatport</strong>
            <span>Releases &amp; tracks</span>
          </div>
        </a>
        <a class="music-link" href="https://www.youtube.com/watch?v=NBcNrmqdFcQ" target="_blank" rel="noopener">
          <div class="music-link-icon">▶</div>
          <div class="music-link-text">
            <strong>Gregoria Session #64</strong>
            <span>Indie Dance · YouTube</span>
          </div>
        </a>
        <a class="music-link" href="https://www.instagram.com/fani.dj/" target="_blank" rel="noopener">
          <div class="music-link-icon">◈</div>
          <div class="music-link-text">
            <strong>@fani.dj</strong>
            <span>Instagram · Últimos sets</span>
          </div>
        </a>
      </div>
      <div class="youtube-embed reveal">
        <iframe src="https://www.youtube.com/embed/NBcNrmqdFcQ"
          title="FANI — Gregoria Session #64 Indie Dance"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen loading="lazy"></iframe>
      </div>
    </div>
  </div>
</section>

<!-- GALERÍA -->
<section id="galeria">
  <div class="sec">
    <div class="sec-label">Fotos</div>
    <h2 class="sec-title reveal">Galería</h2>
    <div class="gallery-grid">
${galHtml}
    </div>
  </div>
</section>

<!-- RIDER TÉCNICO -->
<section id="rider">
  <div class="sec">
    <div class="sec-label">Técnico</div>
    <h2 class="sec-title reveal">Rider Técnico</h2>
    <div class="rider-grid reveal">
      <div class="rider-card">
        <img src="${cdj2000Uri}" alt="Pioneer CDJ 2000 NXS2">
        <div class="rider-card-name">Pioneer CDJ 2000 NXS2</div>
        <div class="rider-card-qty">× 4 unidades</div>
      </div>
      <div class="rider-card">
        <img src="${cdj3000Uri}" alt="Pioneer CDJ 3000">
        <div class="rider-card-name">Pioneer CDJ 3000</div>
        <div class="rider-card-qty">Alternativa aceptada</div>
      </div>
      <div class="rider-card">
        <img src="${mixerV10Uri}" alt="Pioneer DJM V10">
        <div class="rider-card-name">Pioneer DJM V10</div>
        <div class="rider-card-qty">Mixer principal</div>
      </div>
      <div class="rider-card">
        <img src="${xone96Uri}" alt="Allen &amp; Heath XONE 96">
        <div class="rider-card-name">Allen &amp; Heath XONE:96</div>
        <div class="rider-card-qty">Mixer alternativa</div>
      </div>
      <div class="rider-card">
        <img src="${xone92Uri}" alt="Allen &amp; Heath XONE 92">
        <div class="rider-card-name">Allen &amp; Heath XONE:92</div>
        <div class="rider-card-qty">Mixer alternativa</div>
      </div>
    </div>
    <div class="rider-specs reveal">
      <div class="rider-spec-item">
        <div class="rider-spec-label">Players</div>
        <div class="rider-spec-val">4× Pioneer CDJ 2000 NXS2<br>o CDJ 3000</div>
      </div>
      <div class="rider-spec-item">
        <div class="rider-spec-label">Mixer</div>
        <div class="rider-spec-val">Pioneer DJM V10<br>o Allen &amp; Heath XONE 96/92</div>
      </div>
      <div class="rider-spec-item">
        <div class="rider-spec-label">Monitoring</div>
        <div class="rider-spec-val">Sistema de sonido SUB<br>+ 2 Mid/High speakers</div>
      </div>
    </div>
  </div>
</section>

<!-- CONTACTO -->
<section id="contacto">
  <div class="sec">
    <div class="sec-label">Contacto</div>
    <h2 class="sec-title reveal">Conectar</h2>
    <div class="contact-grid reveal">
      <a class="contact-link" href="https://www.instagram.com/fani.dj/" target="_blank" rel="noopener">@fani.dj</a>
      <a class="contact-link" href="https://www.instagram.com/fani.crew/" target="_blank" rel="noopener">@fani.crew</a>
      <a class="contact-link" href="https://www.instagram.com/fanicrew.agency/" target="_blank" rel="noopener">@fanicrew.agency</a>
      <a class="contact-link" href="https://open.spotify.com/intl-es/artist/6MDSJaDjt9IMUiAGch5JJ5" target="_blank" rel="noopener">Spotify</a>
      <a class="contact-link" href="https://www.beatport.com/es/artist/fani/628629" target="_blank" rel="noopener">Beatport</a>
      <a class="contact-link" href="https://soundcloud.com/fani-dj" target="_blank" rel="noopener">SoundCloud</a>
    </div>
    <div class="contact-booking">
      <p>Booking</p>
      <a href="https://www.instagram.com/fanicrew.agency/" target="_blank" rel="noopener">@fanicrew.agency</a>
    </div>
  </div>
</section>

<footer>
  <span>FANI — Electronic Presskit</span>
  <span>© 2025 Fani Crew · NVLOP</span>
</footer>

<script>
// NAV scroll solidify
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: .07 });
revealEls.forEach(el => revealObs.observe(el));

// Cabinas compartidas cycling animation
(function() {
  const names  = Array.from(document.querySelectorAll('.cabinas-name'));
  const dotsEl = document.getElementById('cDots');
  let current  = 0;

  names.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'c-dot' + (i === 0 ? ' on' : '');
    dotsEl.appendChild(d);
  });
  const dots = Array.from(dotsEl.querySelectorAll('.c-dot'));

  function advance() {
    const prev = current;
    names[prev].classList.add('leaving');
    names[prev].classList.remove('active');
    dots[prev].classList.remove('on');

    setTimeout(() => {
      names[prev].classList.remove('leaving');
      current = (prev + 1) % names.length;
      names[current].classList.add('active');
      dots[current].classList.add('on');
    }, 750);
  }

  setInterval(advance, 3000);
})();
</script>
</body>
</html>`;

console.log('Writing file...');
fs.writeFileSync(outputFile, html, 'utf8');
const size = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(1);
console.log(`Done: ${outputFile} (${size} MB)`);
