(() => {
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const stackEl = $('#stack'), emptyEl = $('#empty');
const API = 'https://api.thecatapi.com/v1/images/search';
const icons = () => window.lucide && lucide.createIcons();
const ic = (name, cls = '') => `<i data-lucide="${name}" class="${cls}"></i>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rnd = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- persistence ---------- */
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem('pm.' + k)); return v ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('pm.' + k, JSON.stringify(v)); } catch {} }
};

/* ---------- profile data ---------- */
const BREED_INFO = {
  abys: ['Abyssinian', 'Egypt', 'Active,Energetic,Intelligent,Gentle'],
  aege: ['Aegean', 'Greece', 'Affectionate,Social,Intelligent,Playful'],
  abob: ['American Bobtail', 'United States', 'Intelligent,Interactive,Lively,Playful'],
  acur: ['American Curl', 'United States', 'Affectionate,Curious,Intelligent,Playful'],
  asho: ['American Shorthair', 'United States', 'Active,Curious,Easy Going,Playful'],
  awir: ['American Wirehair', 'United States', 'Affectionate,Curious,Gentle,Intelligent'],
  amau: ['Arabian Mau', 'United Arab Emirates', 'Affectionate,Active,Curious,Energetic'],
  amis: ['Australian Mist', 'Australia', 'Lively,Social,Playful,Easy Going'],
  bali: ['Balinese', 'United States', 'Affectionate,Intelligent,Playful,Social'],
  bamb: ['Bambino', 'United States', 'Affectionate,Lively,Intelligent,Playful'],
  beng: ['Bengal', 'United States', 'Alert,Agile,Energetic,Demanding'],
  birm: ['Birman', 'France', 'Affectionate,Gentle,Social,Patient'],
  bomb: ['Bombay', 'United States', 'Affectionate,Gentle,Intelligent,Calm'],
  bslo: ['British Longhair', 'United Kingdom', 'Affectionate,Easy Going,Gentle,Calm'],
  bsho: ['British Shorthair', 'United Kingdom', 'Affectionate,Easy Going,Gentle,Loyal'],
  bure: ['Burmese', 'Burma', 'Curious,Social,Intelligent,Playful'],
  buri: ['Burmilla', 'United Kingdom', 'Playful,Affectionate,Easy Going,Gentle'],
  cspa: ['California Spangled', 'United States', 'Playful,Energetic,Social,Affectionate'],
  ctif: ['Chantilly-Tiffany', 'United States', 'Affectionate,Demanding,Intelligent,Playful'],
  char: ['Chartreux', 'France', 'Affectionate,Loyal,Quiet,Gentle'],
  chau: ['Chausie', 'Egypt', 'Affectionate,Playful,Intelligent,Active'],
  chee: ['Cheetoh', 'United States', 'Affectionate,Gentle,Intelligent,Social'],
  csho: ['Colorpoint Shorthair', 'United States', 'Affectionate,Intelligent,Playful,Social'],
  crex: ['Cornish Rex', 'United Kingdom', 'Affectionate,Intelligent,Active,Curious'],
  cymr: ['Cymric', 'Isle of Man', 'Gentle,Intelligent,Social,Playful'],
  cypr: ['Cyprus', 'Cyprus', 'Affectionate,Social,Playful,Intelligent'],
  drex: ['Devon Rex', 'United Kingdom', 'Mischievous,Loyal,Social,Playful'],
  dons: ['Donskoy', 'Russia', 'Affectionate,Social,Playful,Intelligent'],
  lihu: ['Dragon Li', 'China', 'Intelligent,Friendly,Gentle,Loyal'],
  emau: ['Egyptian Mau', 'Egypt', 'Agile,Intelligent,Loyal,Energetic'],
  ebur: ['European Burmese', 'Burma', 'Affectionate,Curious,Social,Playful'],
  esho: ['Exotic Shorthair', 'United States', 'Affectionate,Sweet,Loyal,Quiet'],
  hbro: ['Havana Brown', 'United Kingdom', 'Affectionate,Intelligent,Playful,Social'],
  hima: ['Himalayan', 'United States', 'Gentle,Quiet,Affectionate,Calm'],
  jbob: ['Japanese Bobtail', 'Japan', 'Active,Energetic,Clever,Sociable'],
  java: ['Javanese', 'United States', 'Active,Devoted,Intelligent,Playful'],
  khao: ['Khao Manee', 'Thailand', 'Calm,Intelligent,Social,Gentle'],
  kora: ['Korat', 'Thailand', 'Active,Loyal,Intelligent,Gentle'],
  kur: ['Kurilian', 'Russia', 'Affectionate,Curious,Playful,Intelligent'],
  lape: ['LaPerm', 'United States', 'Affectionate,Active,Gentle,Intelligent'],
  mcoo: ['Maine Coon', 'United States', 'Adaptable,Intelligent,Loving,Gentle'],
  mala: ['Malayan', 'Malaysia', 'Affectionate,Talkative,Curious,Intelligent'],
  manx: ['Manx', 'Isle of Man', 'Adaptable,Intelligent,Loyal,Playful'],
  munc: ['Munchkin', 'United States', 'Agile,Easy Going,Intelligent,Playful'],
  nebe: ['Nebelung', 'United States', 'Gentle,Quiet,Shy,Intelligent'],
  norw: ['Norwegian Forest Cat', 'Norway', 'Sweet,Active,Intelligent,Loving'],
  ocic: ['Ocicat', 'United States', 'Affectionate,Social,Playful,Intelligent'],
  orie: ['Oriental', 'United States', 'Energetic,Affectionate,Intelligent,Social'],
  pers: ['Persian', 'Iran', 'Affectionate,Quiet,Gentle,Calm'],
  pixi: ['Pixie-bob', 'United States', 'Affectionate,Social,Intelligent,Loyal'],
  raga: ['Ragamuffin', 'United States', 'Affectionate,Friendly,Gentle,Calm'],
  ragd: ['Ragdoll', 'United States', 'Affectionate,Friendly,Gentle,Quiet'],
  rblu: ['Russian Blue', 'Russia', 'Active,Gentle,Quiet,Shy'],
  sava: ['Savannah', 'United States', 'Curious,Social,Intelligent,Energetic'],
  sfol: ['Scottish Fold', 'United Kingdom', 'Affectionate,Intelligent,Loyal,Playful'],
  srex: ['Selkirk Rex', 'United States', 'Active,Affectionate,Gentle,Patient'],
  siam: ['Siamese', 'Thailand', 'Active,Agile,Clever,Talkative'],
  sibe: ['Siberian', 'Russia', 'Curious,Intelligent,Loyal,Sweet'],
  sing: ['Singapura', 'Singapore', 'Affectionate,Curious,Gentle,Lively'],
  snow: ['Snowshoe', 'United States', 'Affectionate,Social,Intelligent,Playful'],
  soma: ['Somali', 'Ethiopia', 'Mischievous,Intelligent,Affectionate,Active'],
  sphy: ['Sphynx', 'Canada', 'Loyal,Inquisitive,Friendly,Energetic'],
  tonk: ['Tonkinese', 'Canada', 'Curious,Intelligent,Social,Lively'],
  toyg: ['Toyger', 'United States', 'Affectionate,Intelligent,Playful,Social'],
  tang: ['Turkish Angora', 'Turkey', 'Affectionate,Intelligent,Social,Playful'],
  tvan: ['Turkish Van', 'Turkey', 'Agile,Intelligent,Loyal,Playful'],
  ycho: ['York Chocolate', 'United States', 'Playful,Social,Intelligent,Affectionate']
};
const BREEDS = Object.keys(BREED_INFO);
const NAMES = ['Luna','Milo','Bella','Oliver','Cleo','Simba','Nala','Felix','Mochi','Pumpkin','Loki','Willow','Biscuit','Oreo','Ziggy','Coco','Pepper','Tigger','Shadow','Misty','Gizmo','Hazel','Jasper','Maple','Ollie','Peaches','Sushi','Waffles','Whiskers','Thor','Ginger','Marble','Juniper','Pixel','Basil','Cosmo','Daisy','Rocky','Salem','Tofu','Nugget','Olive','Chai','Bean','Poppy','Atlas','Mango','Smokey','Ruby','Finn'];
const BIOS = [
  'Looking for someone who respects my 4am zoomies. Also treats.',
  'Professional napper. Amateur bird-watcher. Will headbutt you hello.',
  'Not here for a staff member. Okay, maybe a staff member.',
  'Swipe right if you think things look better on the floor.',
  'Gentle soul, dramatic meower. Fluent in slow blinks.',
  'Sunbeam enthusiast. Cardboard box collector. Opinions about the vacuum.',
  'I knead, therefore I am. Warm laps only.',
  'Window seat > everything. Let’s watch the squirrels together.',
  'Loud purr, louder opinions. Will trade snuggles for chin scratches.',
  'Shy at first, then you can’t get me off your keyboard.',
  'Fluent in meow, sarcasm and “feed me”.',
  'Here for a good time and a long nap. Mostly the nap.'
];
const JOBS = ['Sunbeam inspector','Senior lap warmer','Night shift zoomie specialist','Head of napping','Chief shoelace officer','Freelance bird watcher','Cardboard architect','Keyboard consultant'];
const WANTS = ['Long-term treats','Someone to open the can','Cuddles, no strings (okay, maybe strings)','A really good window','Fresh water. Running. From a fountain.'];

const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const pick = (arr, h, o = 0) => arr[(h >>> o) % arr.length];

const PERSONA_TAGS = {
  sweet: /affection|loving|sweet|gentle|social|friendly|devoted|docile|sociable/i,
  playful: /play|active|energetic|curious|mischiev|adventur|lively|agile/i,
  sassy: /independ|intellig|alert|dignif|strong|reserved|demanding|smart|loyal|quiet/i,
  chill: /shy|calm|easy|relax|patient|tolerant|placid/i
};
function personaOf(tags, h) {
  const score = Object.entries(PERSONA_TAGS).map(([k, re]) => [k, tags.filter(t => re.test(t)).length]).sort((a, b) => b[1] - a[1]);
  return score[0][1] ? score[0][0] : pick(['sweet', 'playful', 'sassy', 'chill'], h, 5);
}

function toCat(raw) {
  const h = hash(raw.id);
  const info = BREED_INFO[raw._b];
  const tags = info ? info[2].split(',') : ['Mysterious', 'Fluffy'];
  return {
    id: raw.id, url: raw.url,
    name: pick(NAMES, h), age: 1 + (h >>> 8) % 12, dist: 1 + (h >>> 4) % 25,
    breed: info ? info[0] : 'Domestic Shorthair', origin: info ? info[1] : null,
    bio: pick(BIOS, h, 3), desc: null, tags, weight: null, life: null,
    job: pick(JOBS, h, 6), wants: pick(WANTS, h, 10), verified: h % 3 !== 0,
    persona: personaOf(tags, h)
  };
}

/* ---------- limited event: Cabbagemints the shark kitty ---------- */
const MINTS_ID = 'cabbagemints';
const EVENT_END = new Date('2026-11-01T00:00:00').getTime();
const eventOn = () => Date.now() < EVENT_END;
const TACO_RE = /\bis\s+(?:cabbage\s*)?mints\s+a\s+taco\b/;
const mintsCat = () => ({
  id: MINTS_ID, url: 'mints.png', special: 'mints', name: 'Cabbagemints', age: 7, dist: 0, loc: 'The Ocean',
  breed: 'Shark Kitty', origin: 'The Deep Blue', weight: null, life: null, verified: true, persona: 'mints', likesYou: true,
  bio: 'Part shark, part cat, 100% cabbage-adjacent. Limited-time legend. I bite (affectionately).',
  desc: 'Last seen chasing a laser dot across the Mariana Trench. Definitely not a taco.',
  tags: ['Chaotic', 'Fin-tastic', 'Minty Fresh', 'Loyal'],
  job: 'Chief Chomp Officer', wants: 'Someone to share kelp tacos with (he is not a taco)'
});
const oceanFx = () => '<div class="ocean-fx">' + Array.from({ length: 10 }, (_, i) => {
  const s = 6 + (i * 7) % 12;
  return `<i class="fx-b" style="left:${4 + i * 9.6}%;width:${s}px;height:${s}px;animation-delay:${-(i * 1.3)}s;animation-duration:${6 + (i * 1.7) % 6}s"></i>`;
}).join('') + '<div class="fx-wave w1"></div><div class="fx-wave w2"></div></div>';
const rareTag = () => `<div class="rare-tag">${ic('waves')}Limited event · Rare</div>`;

/* ---------- state ---------- */
let deck = [], reserve = [], pos = 0, history = [], loading = false, failed = false, exhausted = false, busy = false;
let matches = store.get('matches', []);
let likes = store.get('likes', []);
let filters = store.get('filters', { dist: 25, age: 12 });
let me = store.get('me', { name: '', bio: '', photo: '', theme: 'auto' });
const CFG_DEFAULTS = { theme: 'auto', accent: 'pink', sound: true, haptics: true, showDist: true, showTags: true, notif: true, reduce: false, sens: 2 };
let cfg = { ...CFG_DEFAULTS, ...(me.theme ? { theme: me.theme } : {}), ...store.get('cfg', {}) };
const saveCfg = () => store.set('cfg', cfg);
let boostUntil = store.get('boost', 0);
let boostViews = 0, boostLikes = 0, fetchCount = 0;
let superLeft = 3;
{ const d = new Date().toDateString(), s = store.get('super', null); superLeft = s && s.d === d ? s.n : 3; store.set('super', { d, n: superLeft }); }
const seen = new Set([...matches, ...likes].map(m => m.id));
const passes = c => c.dist <= filters.dist && c.age <= filters.age;
const boosting = () => boostUntil > Date.now();
const likeChance = () => boosting() ? .5 : .2;
const saveMatches = () => store.set('matches', matches);

/* ---------- sound + haptics ---------- */
let actx = null;
function tone(freq, start, dur, type = 'sine', vol = .12) {
  if (!cfg.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + start;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + .02);
  } catch {}
}
const SFX = {
  like: () => { tone(520, 0, .12, 'triangle'); tone(780, .08, .16, 'triangle'); },
  nope: () => { tone(260, 0, .14, 'triangle'); tone(190, .07, .16, 'triangle'); },
  super: () => [660, 880, 1170, 1560].forEach((f, i) => tone(f, i * .06, .2, 'sine', .1)),
  match: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .1, .3, 'triangle', .13)),
  msg: () => { tone(880, 0, .1); tone(1175, .09, .16); },
  rewind: () => { tone(440, 0, .08, 'sawtooth', .05); tone(330, .06, .1, 'sawtooth', .05); },
  boost: () => [300, 450, 700, 1000].forEach((f, i) => tone(f, i * .05, .15, 'square', .05))
};
const sfx = k => SFX[k] && SFX[k]();
const buzz = p => { if (cfg.haptics && navigator.vibrate) try { navigator.vibrate(p); } catch {} };

/* ---------- data ---------- */
async function fetchCats() {
  if (loading) return;
  loading = true; failed = false; renderEmpty();
  try {
    let added = 0, tries = 0, okReq = 0;
    while (added < 6 && tries < 3) {
      tries++;
      const ids = shuffle([...BREEDS]).slice(0, 4);
      const res = await Promise.allSettled(ids.map(id =>
        fetch(`${API}?breed_ids=${id}&limit=10&mime_types=jpg,png&order=RAND`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })));
      const batch = [];
      for (const [i, r] of res.entries()) {
        if (r.status !== 'fulfilled') continue;
        okReq++;
        // keep portrait-ish / square shots: these are the close-up "selfie" style photos
        const good = r.value.filter(x => x.url && !seen.has(x.id) && x.width >= 400 && x.width <= 2600 && x.width / x.height >= .68 && x.width / x.height <= 1.25);
        batch.push(...good.slice(0, 4).map(x => ({ ...x, _b: ids[i] })));
      }
      for (const r of shuffle(batch)) {
        if (seen.has(r.id)) continue;
        seen.add(r.id);
        const c = toCat(r); c.likesYou = Math.random() < likeChance();
        if (reserve.length < 4 && fetchCount++ % 4 === 3) { reserve.push(c); continue; }
        if (!passes(c)) continue;
        deck.push(c); added++; new Image().src = c.url;
      }
      if (!okReq) throw new Error('network');
    }
    // rare spawn: Cabbagemints swims into the deck during the event
    if (eventOn() && !seen.has(MINTS_ID) && !matches.some(m => m.id === MINTS_ID) && Math.random() < .12) {
      seen.add(MINTS_ID); deck.splice(Math.min(deck.length, pos + 1 + Math.floor(Math.random() * 3)), 0, mintsCat()); added++; new Image().src = 'mints.png';
    }
    exhausted = added === 0 && deck.length - pos === 0;
  } catch { failed = true; }
  finally { loading = false; sync(); }
}

/* ---------- card DOM ---------- */
const els = new Map();
function buildCard(c) {
  const el = document.createElement('div');
  el.className = 'card' + (c.special ? ' ocean' : '');
  el.innerHTML = `
    <div class="skel"></div>
    <img class="photo" alt="${esc(c.name)}, ${esc(c.breed)}" draggable="false">
    <div class="top-grad"></div><div class="grad"></div>
    ${c.special ? oceanFx() + rareTag() : ''}
    <div class="bars"><i></i></div>
    <div class="stamp like">Like</div><div class="stamp nope">Nope</div><div class="stamp sup">Super Like</div>
    <div class="info">
      <div class="nm-row"><div class="nm">${esc(c.name)}<small>${c.age}</small></div>${c.verified ? ic('badge-check') : ''}</div>
      <div class="line">${ic('cat')}${esc(c.breed)}</div>
      ${c.loc ? `<div class="line">${ic('map-pin')}Lives in ${esc(c.loc)}</div>` : `<div class="line dist">${ic('map-pin')}${c.dist} ${c.dist === 1 ? 'kilometre' : 'kilometres'} away</div>`}
      <div class="chips">${c.tags.slice(0, 3).map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      <button class="info-btn" aria-label="Open profile">${ic('chevron-up')}</button>
    </div>`;
  const img = el.querySelector('img');
  img.onload = () => { img.classList.add('ready'); const s = el.querySelector('.skel'); s && s.remove(); };
  img.onerror = () => { img.onerror = null; img.src = `https://cataas.com/cat?width=600&height=800&t=${encodeURIComponent(c.id)}`; };
  img.src = c.url;
  el._cat = c; el._st = { x: 0, y: 0, r: 0, anim: null };
  attachDrag(el);
  return el;
}

const DEPTH = 3;
function place(el, slot, p = 0) {
  const st = el._st;
  if (slot === 0) {
    el.style.transform = `translate3d(${st.x}px,${st.y}px,0) rotate(${st.r}deg)`;
    const w = el.offsetWidth || 1;
    const k = Math.max(-1, Math.min(1, st.x / (w * .3)));
    const up = Math.abs(k) < .6 ? Math.max(0, Math.min(1, -st.y / (w * .3))) : 0;
    el.querySelector('.stamp.like').style.opacity = Math.max(0, k);
    el.querySelector('.stamp.nope').style.opacity = Math.max(0, -k);
    el.querySelector('.stamp.sup').style.opacity = up;
  } else {
    const s = slot - p;
    el.style.transform = `translate3d(0,${s * 10}px,0) scale(${1 - s * .04})`;
  }
}
const layout = (p = 0) => $$('.card').forEach(el => place(el, el._slot, el._slot === 0 ? 0 : p));
const setTrans = on => $$('.card').forEach(el => { if (el._slot > 0) el.style.transition = on ? 'transform .3s ease' : 'none'; });

function sync() {
  const want = deck.slice(pos, pos + DEPTH);
  const keep = new Set(want.map(c => c.id));
  for (const [id, el] of els) if (!keep.has(id) && !el._leaving) { el.remove(); els.delete(id); }
  want.forEach((c, i) => {
    let el = els.get(c.id);
    if (!el) { el = buildCard(c); el.style.transition = 'none'; els.set(c.id, el); }
    else if (!el._dragging) el.style.transition = 'transform .3s ease';
    el._slot = i; el.style.zIndex = 10 - i;
    el.style.pointerEvents = i === 0 ? 'auto' : 'none';
    if (!el.parentNode) stackEl.appendChild(el);
  });
  layout(); icons();
  if (deck.length - pos < 5 && !loading && !failed && !exhausted) fetchCats();
  renderEmpty();
  const none = !want.length;
  $('#rewind').disabled = !history.length || busy;
  $('#pass').disabled = $('#like').disabled = $('#boost').disabled = none;
  const sp = $('#superLeft'); sp.textContent = superLeft; sp.classList.toggle('zero', !superLeft);
}

function renderEmpty() {
  if (deck.length - pos > 0) { emptyEl.classList.remove('show'); return; }
  emptyEl.classList.add('show');
  if (loading || (!failed && !exhausted)) {
    emptyEl.innerHTML = `<div class="pulse">${ic('paw-print')}</div><h2>Finding cats near you</h2><p>Hang tight, whiskers are twitching…</p>`;
  } else if (failed) {
    emptyEl.innerHTML = `${ic('wifi-off')}<h2>Couldn’t load cats</h2><p>Check your connection and try again.</p><button class="btn-grad" id="retry">Try again</button>`;
  } else {
    emptyEl.innerHTML = `${ic('map-pin-off')}<h2>No one new around you</h2><p>Try widening your distance or age in discovery settings.</p><button class="btn-grad" id="retry">Adjust settings</button>`;
  }
  icons();
  const r = $('#retry');
  if (r) r.onclick = () => { if (failed) { failed = false; fetchCats(); } else openSettings('disc'); };
}

/* ---------- physics ---------- */
const stopAnim = st => { if (st.anim) { cancelAnimationFrame(st.anim); st.anim = null; } };

function springTo(el, tx, ty, tr, vx = 0, vy = 0, done) {
  const st = el._st; stopAnim(st); el.style.transition = 'none';
  let vr = 0, last = performance.now();
  const K = 240, D = 20;
  const step = now => {
    const dt = Math.min(.034, (now - last) / 1000); last = now;
    vx += (-K * (st.x - tx) - D * vx) * dt;
    vy += (-K * (st.y - ty) - D * vy) * dt;
    vr += (-K * (st.r - tr) - D * vr) * dt;
    st.x += vx * dt; st.y += vy * dt; st.r += vr * dt;
    place(el, 0); layout(Math.min(1, Math.abs(st.x) / 160));
    if (Math.abs(st.x - tx) + Math.abs(st.y - ty) + Math.abs(st.r - tr) < .3 && Math.abs(vx) + Math.abs(vy) < 8) {
      st.x = tx; st.y = ty; st.r = tr; st.anim = null;
      setTrans(true); place(el, 0); layout(0); done && done(); return;
    }
    st.anim = requestAnimationFrame(step);
  };
  st.anim = requestAnimationFrame(step);
}

function flingOut(el, vx, vy, dir, done) {
  const st = el._st; stopAnim(st); el.style.transition = 'none';
  const W = window.innerWidth, H = window.innerHeight;
  if (dir && Math.abs(vx) < 1600) vx = dir * 1600;
  if (!dir) { vx *= .3; vy = Math.min(vy, -1800); }
  const spin = (vx / 1600) * 55;
  let last = performance.now(), t0 = last;
  const step = now => {
    const dt = Math.min(.034, (now - last) / 1000); last = now;
    vy += (dir ? 1200 : -300) * dt;
    st.x += vx * dt; st.y += vy * dt; st.r += spin * dt;
    place(el, 0);
    if (Math.abs(st.x) > W + 300 || st.y < -H || st.y > H * 1.3 || now - t0 > 1000) { st.anim = null; done && done(); return; }
    st.anim = requestAnimationFrame(step);
  };
  st.anim = requestAnimationFrame(step);
}

function attachDrag(el) {
  let sx, sy, ox, oy, id = null, samples = [], t0 = 0, moved = 0;
  el.addEventListener('pointerdown', e => {
    if (el._slot !== 0 || busy || id !== null || e.button > 0) return;
    if (e.target.closest('.info-btn')) return;
    id = e.pointerId; el.setPointerCapture(id);
    const st = el._st; stopAnim(st);
    sx = e.clientX; sy = e.clientY; ox = st.x; oy = st.y; moved = 0; t0 = performance.now();
    samples = [{ x: sx, y: sy, t: t0 }];
    el._dragging = true; el.classList.add('dragging'); el.style.transition = 'none'; setTrans(false);
  });
  el.addEventListener('pointermove', e => {
    if (e.pointerId !== id) return;
    const st = el._st, w = el.offsetWidth;
    st.x = ox + e.clientX - sx; st.y = oy + e.clientY - sy;
    moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy));
    st.r = Math.max(-30, Math.min(30, (st.x / w) * 24));
    const now = performance.now();
    samples.push({ x: e.clientX, y: e.clientY, t: now });
    while (samples.length > 2 && now - samples[0].t > 100) samples.shift();
    place(el, 0); layout(Math.min(1, Math.hypot(st.x, st.y * .5) / 150));
  });
  const end = e => {
    if (e.pointerId !== id) return;
    id = null; el._dragging = false; el.classList.remove('dragging');
    const st = el._st, w = el.offsetWidth;
    if (e.type === 'pointerup' && moved < 6 && performance.now() - t0 < 350) { springTo(el, 0, 0, 0); return openProfile(el._cat); }
    let vx = 0, vy = 0;
    if (samples.length > 1) {
      const a = samples[0], b = samples[samples.length - 1], dt = Math.max(16, b.t - a.t) / 1000;
      vx = (b.x - a.x) / dt; vy = (b.y - a.y) / dt;
    }
    const px = st.x + vx * .15, py = st.y + vy * .15;
    if (e.type === 'pointerup') {
      if (Math.abs(px) > w * (.5 - cfg.sens * .08)) return decide(px > 0 ? 'like' : 'pass', vx, vy);
      if (py < -w * .55 && Math.abs(px) < w * .3) return decide('super', vx, vy);
    }
    springTo(el, 0, 0, 0, vx, vy);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.querySelector('.info-btn').addEventListener('click', () => openProfile(el._cat));
}

/* ---------- decisions ---------- */
function decide(kind, vx = 0, vy = 0) {
  if (busy) return;
  const c = deck[pos]; if (!c) return;
  const el = els.get(c.id); if (!el) return;
  if (kind === 'super' && !superLeft) { toast('No Super Likes left today', 'star'); return; }
  busy = true; $('#rewind').disabled = true;
  const dir = kind === 'like' ? 1 : kind === 'pass' ? -1 : 0;
  if (!el._st.x && !el._st.y) el.querySelector(kind === 'like' ? '.stamp.like' : kind === 'pass' ? '.stamp.nope' : '.stamp.sup').style.opacity = 1;
  if (kind === 'super') { superLeft--; store.set('super', { d: new Date().toDateString(), n: superLeft }); }
  sfx(kind === 'like' ? 'like' : kind === 'pass' ? 'nope' : 'super'); buzz(12);
  el._leaving = true; el.style.zIndex = 30;
  history.push({ cat: c, kind });
  pos++;
  sync();
  flingOut(el, vx, vy, dir, () => {
    el.remove(); els.delete(c.id); busy = false;
    $('#rewind').disabled = !history.length;
  });
  if (kind !== 'pass' && !matches.some(m => m.id === c.id)) {
    // they only match back if they already liked you (or a Super Like gets lucky)
    if (c.likesYou || (kind === 'super' && Math.random() < .35)) setTimeout(() => createMatch(c), 350);
  }
}

function createMatch(c) {
  if (matches.some(m => m.id === c.id)) return;
  const m = { ...c, msgs: [], unread: false, t: Date.now(), mem: {}, opened: false };
  if (c.special) { seen.add(c.id); deck = deck.filter((x, i) => i < pos || x.id !== c.id); sync(); }
  matches.unshift(m); saveMatches(); renderSide(); showMatch(m); scheduleOpener(m, c.special ? 3000 : undefined); sfx('match'); buzz([30, 40, 30]);
}

function rewind() {
  if (busy || !history.length) return;
  const { cat, kind } = history.pop();
  if (kind === 'super') { superLeft++; store.set('super', { d: new Date().toDateString(), n: superLeft }); }
  sfx('rewind');
  const m = matches.find(x => x.id === cat.id);
  if (m && !m.msgs.length) { matches = matches.filter(x => x !== m); saveMatches(); renderSide(); }
  closeMatch();
  pos--;
  let el = els.get(cat.id);
  if (!el) { el = buildCard(cat); els.set(cat.id, el); }
  const st = el._st; stopAnim(st);
  st.x = (kind === 'like' ? 1 : kind === 'pass' ? -1 : 0) * innerWidth * .9;
  st.y = kind === 'super' ? -innerHeight * .8 : 0;
  st.r = kind === 'like' ? 30 : kind === 'pass' ? -30 : 0;
  el.querySelectorAll('.stamp').forEach(s => s.style.opacity = 0);
  el.style.transition = 'none'; el._leaving = false;
  sync(); el.style.zIndex = 30; el.style.transition = 'none'; place(el, 0);
  busy = true; $('#rewind').disabled = true;
  springTo(el, 0, 0, 0, 0, 0, () => { busy = false; el.style.zIndex = 10; sync(); });
}

/* ---------- profile sheet ---------- */
const profileEl = $('#profile');
function openProfile(c, ctx = 'deck') {
  const facts = [
    ['briefcase', 'Works as', c.job], ['search', 'Looking for', c.wants], ['map-pin', 'Lives', c.loc || `${c.dist} km away`],
    c.origin && ['globe', 'From', c.origin], c.weight && ['weight', 'Weight', `${c.weight} kg`], c.life && ['clock', 'Lifespan', `${c.life} years`]
  ].filter(Boolean);
  profileEl.innerHTML = `
    ${c.special ? oceanFx() : ''}
    <div class="profile-scroll">
      <div class="p-photo"><img src="${esc(c.url)}" alt="${esc(c.name)}">${c.special ? rareTag() : ''}<button class="p-close" id="pClose" aria-label="Close profile">${ic('chevron-down')}</button></div>
      <div class="p-body">
        <h1>${esc(c.name)} <small>${c.age}</small>${c.verified ? ic('badge-check') : ''}</h1>
        <div class="p-sub">${ic('cat')}${esc(c.breed)}</div>
        ${ctx === 'likes' ? `<div class="p-liked">${ic('heart')}Liked you</div>` : ''}
        <div class="p-sec"><h3>About me</h3><p>${esc(c.bio)}${c.desc ? '<br><br>' + esc(c.desc) : ''}</p></div>
        <div class="p-sec"><h3>Essentials</h3><div class="facts">${facts.map(([i, k, v]) => `<div class="fact">${ic(i)}<div><span>${k}:</span>${esc(v)}</div></div>`).join('')}</div></div>
        <div class="p-sec"><h3>Personality</h3><div class="p-chips">${c.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div></div>
      </div>
    </div>
    ${ctx === 'chat' ? '' : `<div class="p-actions">
      <button class="act lg nope" data-act="pass" aria-label="Nope">${ic('x')}</button>
      ${ctx === 'deck' ? `<button class="act sm super" data-act="super" aria-label="Super Like">${ic('star')}</button>` : ''}
      <button class="act lg like" data-act="like" aria-label="Like">${ic('heart')}</button>
    </div>`}`;
  profileEl.classList.toggle('ocean', !!c.special);
  profileEl.classList.add('open'); profileEl.setAttribute('aria-hidden', 'false'); icons();
  $('#pClose').onclick = closeProfile;
  profileEl.querySelectorAll('[data-act]').forEach(b => b.onclick = () => {
    closeProfile();
    if (ctx === 'deck') setTimeout(() => decide(b.dataset.act), 250);
    else {
      likes = likes.filter(x => x.id !== c.id); store.set('likes', likes);
      if (b.dataset.act === 'pass') { renderSide(); toast(`Passed on ${c.name}`, 'x'); }
      else setTimeout(() => createMatch(c), 250);
    }
  });
}
function closeProfile() { profileEl.classList.remove('open'); profileEl.setAttribute('aria-hidden', 'true'); }

/* your own profile card */
function openMyProfile() {
  const msgs = matches.reduce((n, m) => n + m.msgs.length, 0);
  const name = me.name || 'You';
  profileEl.innerHTML = `
    <div class="profile-scroll">
      <div class="p-photo ${me.photo ? '' : 'noimg'}">${me.photo ? `<img src="${esc(me.photo)}" alt="${esc(name)}">` : ic('user-round')}<button class="p-close" id="pClose" aria-label="Close profile">${ic('chevron-down')}</button></div>
      <div class="p-body">
        <h1>${esc(name)} <span class="p-you">You</span></h1>
        <div class="p-sub">${ic('user-round')}Human</div>
        <div class="p-sec"><h3>About me</h3><p>${esc(me.bio || 'A human who owns a can opener')}</p></div>
        <div class="p-sec"><h3>Activity</h3><div class="facts">
          <div class="fact">${ic('heart')}<div><span>Matches:</span>${matches.length}</div></div>
          <div class="fact">${ic('sparkles')}<div><span>Likes you:</span>${likes.length}</div></div>
          <div class="fact">${ic('message-circle')}<div><span>Messages sent &amp; received:</span>${msgs}</div></div>
        </div></div>
      </div>
    </div>
    <div class="p-actions"><button class="btn-grad" id="pEdit">Edit profile</button></div>`;
  profileEl.classList.remove('ocean');
  profileEl.classList.add('open'); profileEl.setAttribute('aria-hidden', 'false'); icons();
  $('#pClose').onclick = closeProfile;
  $('#pEdit').onclick = () => { closeProfile(); openSettings(); };
}

/* ---------- match overlay ---------- */
const matchEl = $('#match');
let matchId = null;
function paintMeAvatar() {
  [$('#matchMe'), $('#meImg'), $('#meBtnImg'), $('#sideMeImg')].forEach(i => { i.hidden = !me.photo; if (me.photo) i.src = me.photo; });
  $('#matchMeIcon').hidden = !!me.photo; $('#meIcon').hidden = !!me.photo; $('#meBtnIcon').hidden = !!me.photo; $('#sideMeIcon').hidden = !!me.photo;
  $('#sideMeName').textContent = me.name || 'You';
}
function showMatch(c) {
  matchId = c.id; paintMeAvatar();
  $('#matchImg').src = c.url; $('#matchImg').alt = c.name;
  $('#matchSub').textContent = c.special ? `A rare shark kitty swam into your life. ${c.name} is yours!` : `You and ${c.name} have liked each other.`;
  matchEl.classList.toggle('ocean', !!c.special);
  matchEl.classList.add('open'); icons();
}
const closeMatch = () => matchEl.classList.remove('open');
$('#matchKeep').onclick = closeMatch;
$('#matchMsg').onclick = () => { closeMatch(); openChat(matchId); };

/* ---------- sidebar ---------- */
let tab = 'matches';
const sideEl = $('#side'), sideScrim = $('#sideScrim');
const openSide = () => { sideEl.classList.add('open'); sideScrim.classList.add('open'); };
const closeSide = () => { sideEl.classList.remove('open'); sideScrim.classList.remove('open'); };
$('#openSide').onclick = openSide; $('#closeSide').onclick = closeSide; sideScrim.onclick = closeSide;
$$('.tab').forEach(b => b.onclick = () => { tab = b.dataset.tab; renderSide(); });
const ago = t => { const m = Math.floor((Date.now() - t) / 60000); return m < 1 ? 'now' : m < 60 ? m + 'm' : m < 1440 ? Math.floor(m / 60) + 'h' : Math.floor(m / 1440) + 'd'; };

function renderSide() {
  const fresh = matches.filter(m => !m.msgs.length);
  const convos = matches.filter(m => m.msgs.length).sort((a, b) => b.msgs.at(-1).t - a.msgs.at(-1).t);
  const unread = matches.filter(m => m.unread).length;
  const setC = (id, n) => { const e = $(id); e.hidden = !n; e.textContent = n; };
  setC('#cMatches', fresh.length); setC('#cLikes', likes.length); setC('#cMsgs', unread);
  $('#topDot').hidden = !(fresh.length || unread || likes.length);
  paintEvent();
  $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const body = $('#sideBody');
  const tile = (m, extra) => `<button class="tile${m.special ? ' ocean' : ''}" data-id="${m.id}"><img src="${esc(m.url)}" alt="${esc(m.name)}" loading="lazy" draggable="false">${extra}<span class="nm">${esc(m.name)}, ${m.age}</span></button>`;
  if (tab === 'matches') {
    body.innerHTML = fresh.length
      ? `<div class="tiles">${fresh.map(m => tile(m, '<span class="new">New</span>')).join('')}</div>`
      : `<div class="side-empty">${ic('heart')}<b>${matches.length ? 'Say hi to your matches' : 'Start swiping'}</b>${matches.length ? 'Your conversations are in the Messages tab.' : 'When a cat likes you back, they’ll show up here.'}</div>`;
    body.querySelectorAll('[data-id]').forEach(b => b.onclick = () => openChat(b.dataset.id));
  } else if (tab === 'likes') {
    body.innerHTML = likes.length
      ? `<div class="sec-label">${likes.length} ${likes.length === 1 ? 'cat likes' : 'cats like'} you</div><div class="tiles">${likes.map(m => tile(m, `<span class="heart">${ic('heart')}</span>`)).join('')}</div>`
      : `<div class="side-empty">${ic('sparkles')}<b>Nobody yet</b>Cats who like you land here. Use a Boost to get seen by a lot more of them.</div>`;
    body.querySelectorAll('[data-id]').forEach(b => b.onclick = () => { closeSide(); openProfile(likes.find(x => x.id === b.dataset.id), 'likes'); });
  } else {
    body.innerHTML = convos.length
      ? convos.map(m => { const l = m.msgs.at(-1); return `<button class="row ${m.unread ? 'unread' : ''}" data-id="${m.id}"><img class="av${m.special ? ' ocean' : ''}" src="${esc(m.url)}" alt="" draggable="false"><div class="tx"><b>${esc(m.name)}</b><span>${l.from === 'me' ? 'You: ' : ''}${esc(l.text)}</span></div>${m.unread ? '<i class="ud"></i>' : `<time>${ago(l.t)}</time>`}</button>`; }).join('')
      : `<div class="side-empty">${ic('message-circle')}<b>No messages yet</b>When you start a conversation with a match, it’ll show up here.</div>`;
    body.querySelectorAll('[data-id]').forEach(b => b.onclick = () => openChat(b.dataset.id));
  }
  icons();
}

/* =====================================================================
   CHAT ENGINE: personality-driven, remembers your name, keeps context
   ===================================================================== */
const OPENERS = {
  sweet: n => [`Hi ${n}! I’m so happy we matched. I’ve been purring since you swiped.`, `Hey ${n}, this is the best part of my day and I’ve already had two breakfasts.`],
  playful: n => [`${n}!! You’re here! Quick, say something before I get distracted by a moth.`, `Hey ${n}. Fair warning: I might knock something over mid-conversation.`],
  sassy: n => [`Oh, you matched with me. Good taste, ${n}. Don’t make it weird.`, `Hello ${n}. I don’t usually do this, but you seem to know what you’re doing.`],
  chill: n => [`Hey ${n}. Just woke up from a nap. Nice to meet you.`, `Hi ${n}. I’m a bit shy, but I’m glad we matched.`],
  mints: n => [`Blub blub. Ahoy ${n}! You found me. I’m Cabbagemints: shark, cat, legend. Not a taco.`, `*surfaces dramatically* ${n}! Welcome to the deep end. I brought snacks. They’re fish. Sorry.`]
};
const FLAV = {
  sweet: ['Aww. ', 'Honestly? ', 'You’re sweet. ', ''],
  playful: ['Haha! ', 'Ooh! ', 'Okay okay. ', ''],
  sassy: ['Obviously. ', 'Hmm. ', 'Sure. ', ''],
  chill: ['Mm. ', 'Yeah. ', 'Honestly? ', ''],
  mints: ['Blub. ', 'Chomp! ', 'Fin-tastic. ', 'Ahoy! ', '']
};
const STRONG = /\b(bye|goodnight|gtg|joke|funny|cute|pretty|handsome|beautiful|gorgeous|adorable|meet|date|hang ?out|come over|love you|like you|your name|who are you|how old|where (are|do) you|breed|thank|thx|ugly|stupid|dumb|hate)\b|how (are|r) (you|u)|what do you do|^(hi|hey|hello|yo|sup)\b/i;
const FOLLOW = [
  { k: 'catdog', q: 'Be honest: cat person or dog person?' },
  { k: 'food', q: 'What’s your go-to dinner? Asking on behalf of my bowl.' },
  { k: 'nap', q: 'Where’s the best nap spot in your place?' },
  { k: 'weekend', q: 'What are you up to this weekend?' },
  { k: 'job', q: 'What do you do for work? Please say something with a warm laptop.' },
  { k: 'pet', q: 'Do you have any other pets? Asking so I can prepare my face.' },
  { k: 'fun', q: 'What do you do for fun?' }
];
const JOKES = [
  'Why did the cat sit on the computer? To keep an eye on the mouse.',
  'What do you call a pile of kittens? A meowtain.',
  'What’s a cat’s favourite colour? Purrrple.',
  'Why don’t cats play poker in the jungle? Too many cheetahs.',
  'What do cats eat for breakfast? Mice Krispies.',
  'How does a cat sign off a letter? Yours fur-ever.'
];
const QR_BANK = ['What’s your favourite food?', 'Tell me a joke', 'Want to meet up?', 'Do you like dogs?', 'What do you do for fun?', 'How old are you?', 'Where are you from?', 'You’re adorable', 'Describe your perfect day', 'What’s your name again?', 'Any hobbies?'];

const tagsLine = m => m.tags.slice(0, 3).join(', ').toLowerCase();

/* ---- understanding layer: intent + topic + memory, all on-device ---- */
const OPINIONS = [
  [/\b(box|boxes|cardboard)\b/, 'Boxes? If I fits, I sits. It is the law.'],
  [/\b(laser|red dot)\b/, 'The red dot is my sworn enemy and my best friend. I will catch it one day.'],
  [/\b(vacuum|hoover)\b/, 'The vacuum is a loud beast that lives in the closet. I do not discuss it.'],
  [/\b(bath|shower|swim|swimming|water)\b/, 'Water? Only in a bowl, in a fountain, or being knocked off a table.'],
  [/\bcucumbers?\b/, 'CUCUMBERS. Why do they sneak up like that. Why.'],
  [/\b(birds?|pigeons?|squirrels?)\b/, 'Birds are TV for cats. I watch them for hours. I will not be taking questions.'],
  [/\b(mouse|mice)\b/, 'Mice are my business. Do not ask about my business.'],
  [/\bcatnip\b/, 'Catnip. I have no memory of what happened next, but it was incredible.'],
  [/\b(music|songs?|sing|singing)\b/, 'I enjoy a good purr-cussion track. Mostly my own.'],
  [/\b(rain|snow|storm|thunder)\b/, 'Weather is just things happening outside the window. Excellent viewing though.'],
  [/\b(humans?|people)\b/, 'Humans are fine. Great at opening cans. Terrible at 4am timing.'],
  [/\b(coffee|tea)\b/, 'Hot drinks are just very slow lap warmers. I support the concept.'],
  [/\b(roblox|minecraft|videogames?|gaming)\b/, 'Games? I just sit on the controller. Very advanced strategy.'],
  [/\b(code|coding|programming|computer|laptop|keyboard)\b/, 'A warm laptop and a keyboard to sit on? You have described my dream office.'],
  [/\b(movies?|films?|netflix|anime)\b/, 'Movies are great. A screen with moving things and a warm person to lean on. Perfect.'],
  [/\b(school|homework|exam|exams|study|studying)\b/, 'Homework is a flat surface designed for sitting on. I assist whenever I can.'],
  [/\b(pizza)\b/, 'Pizza! Cheese is the closest thing humans make to a miracle.'],
  [/\b(fish|tuna|salmon|sushi)\b/, 'Fish. Say it again, slower. I want to savour it.']
];
const topicReact = x => { for (const [re, a] of OPINIONS) if (re.test(x)) return a; return null; };
const flip = s => s.replace(/\b(my|your|me|you|i)\b/g, w => ({ my: 'your', your: 'my', me: 'you', you: 'me', i: 'you' }[w]));
const FAV = {
  color: ['orange', 'blue, like the sky I stare at from the window', 'black, because it matches my soul and the sofa', 'grey, like a cloud that purrs'],
  food: ['tuna, no contest', 'chicken, but only if you’re holding it', 'anything that crinkles when you open it', 'salmon. I’ll say no more'],
  animal: ['birds, from behind glass', 'other cats, but only in theory', 'the one that lives in the mirror', 'you, if you open the can on time'],
  movie: ['anything with fish in it', 'any nature documentary with birds', 'the one where the cat wins', 'anything you watch at 2am while I sit on you'],
  song: ['my own purr, on repeat', 'anything with a bassline I can feel through the floor', 'the sound of a can opening'],
  place: ['a sunbeam', 'the top of the fridge', 'a fresh laundry pile', 'the box the new thing came in'],
  game: ['chase the red dot', 'knock-it-off-the-table', 'ankle ambush'],
  season: ['summer, more sunbeams', 'winter, more laps', 'autumn, crunchy leaves are a battle'],
  number: ['nine, naturally', 'four, the number of naps before lunch', 'three, my favourite amount of treats. Also any number higher'],
  toy: ['a bit of string. A fancy toy loses to string every time', 'the little ball with a bell', 'a cardboard tube'],
  treat: ['the crunchy ones', 'the soft ones', 'all of them. I’m not a snob'],
  word: ['“dinner”', '“treat”, I can hear it from three rooms away', '“no”, I love it when other people say it']
};
const FEEL = [
  [/\b(sad|down|lonely|depressed|upset|crying|bad day|rough day|stressed|anxious|worried)\b/, nm => [`Aw, ${nm}. Come here. Imagine a warm loaf of cat pressed against you, because I’m sending one.`, 'That sounds rough. I can’t fix it, but I can sit on you until it gets better. It’s my best skill.']],
  [/\b(happy|great day|excited|good day|amazing|proud|so good|feeling good)\b/, nm => [`Yay, ${nm}! Happiness is contagious. I’m going to do a zoomie in your honour.`, 'That’s the best news. I’m purring so loud the neighbours can probably hear it.']],
  [/\b(bored)\b/, () => ['Bored? Let’s knock something off a table. Instant entertainment.', 'Chase the red dot. Even if there isn’t one. Especially then.']],
  [/\b(angry|mad|annoyed|frustrated|furious)\b/, () => ['Deep breaths. Slow blink. Now knock something off a shelf. Feel better?', 'Ugh, people can be the worst. Want me to hiss at them for you?']],
  [/\b(sick|ill|headache|in pain|hurts)\b/, () => ['Rest up. I’ll supervise from the foot of the bed. It’s a very serious job.']],
  [/\b(scared|afraid|nervous)\b/, nm => [`It’s okay, ${nm}. I’m small but very fierce. Mostly small.`]]
];

function smart(m, raw, t, nm, mem) {
  const prev = (mem.hist || []).at(-1);
  const sure = (...v) => [rnd(v)];
  let x;
  if (prev && prev.toLowerCase().trim() === raw.toLowerCase().trim() && raw.length > 3) return sure('You just said that. Are we in a loop? I love loops, I chase my tail in them.', 'Déjà vu. Or you pressed send twice. Either way, I heard you.');
  if (/\b(are you|r u|is this) (a |an )?(real|robot|bot|ai|fake)\b/.test(t)) return sure('I am extremely real. I have fur, opinions and a very small brain, which is all a cat needs.', 'Real as a hairball. Want proof? I can leave some on your pillow.');
  if (/what('?s| is) my name|who am i\b|do you (remember|know) (me|my name)/.test(t)) return (mem.name || me.name) ? sure(`You’re ${nm}. I never forget a name attached to a snack provider.`) : sure('You haven’t told me yet. Try “my name is …”.');
  if (/what did i (just )?(say|type|write)|what was my last message/.test(t)) return prev ? sure(`You said “${prev.slice(0, 80)}”. I listen better than I look.`) : sure('Nothing yet! You’re a mysterious one.');
  if ((x = t.match(/what('?s| is) my (?:favou?rite )?(\w+)\??$/)) && mem.facts && mem.facts[x[2]]) return sure(`Your ${x[2]} is ${mem.facts[x[2]]}. See? I listen. Sometimes.`);
  if ((x = t.match(/(?:what(?:'s| is)|whats|tell me) (?:about )?your (?:fav|favou?rite|favorite) (\w+)/)) && FAV[x[1]]) return sure(`My favourite ${x[1]}? ${pick(FAV[x[1]], hash(m.id + x[1]))}.`);
  if (/what (time|day|date) is it|what('?s| is) the (time|date|day)/.test(t)) { const d = new Date(); return sure(`It’s ${d.toLocaleDateString([], { weekday: 'long' })}, ${fmtTime(d)}. For me it’s always nap o’clock.`); }
  if ((x = t.match(/(-?\d+(?:\.\d+)?)\s*([+\-*x×\/÷])\s*(-?\d+(?:\.\d+)?)/)) && /what|=|\?|equal|calc/.test(t)) {
    const a = +x[1], b = +x[3], op = x[2];
    if ((op === '/' || op === '÷') && b === 0) return sure('Dividing by zero is how you make a black hole. I like black holes, they’re just very big boxes.');
    const r = { '+': a + b, '-': a - b, '*': a * b, x: a * b, '×': a * b, '/': a / b, '÷': a / b }[op];
    return sure(`${a} ${op} ${b} is ${+r.toFixed(4)}. I counted on my paws and ran out of toes, so I borrowed yours.`, `That’s ${+r.toFixed(4)}. Maths is just treat-counting with extra steps.`);
  }
  if (/\b(i'm|im|i am|i feel|feeling|my day|today|i've been|ive been)\b/.test(t)) for (const [re, f] of FEEL) if (re.test(t)) return sure(...f(nm));
  if (/how('?s| was| is) your (day|morning|evening|night|week)/.test(t)) return sure('Busy. I napped, I stared at a wall, I napped again. Peak productivity.', 'Excellent. I knocked three things off a shelf and nobody saw. How about yours?');
  // choices: "A or B?"
  const ch = t.match(/(?:would you rather|do you prefer|prefer|pick|choose)\s+(.+?)\s+or\s+(.+?)[?.!\s]*$/) || (t.endsWith('?') && t.match(/^(?:is |are |do |does |which |would |will )?(.{2,30}?)\s+or\s+(.{2,30}?)\?$/));
  if (ch) { const c1 = hash(m.id + ch[1] + ch[2]) % 2 ? ch[2] : ch[1]; return sure(`${cap(c1)}. Obviously. I’d defend that in a court of law, then nap through the trial.`, `Definitely ${c1}. Don’t ask me to explain, it’s a gut feeling. Mostly hunger.`); }
  if (/\bdo you (?:like|love) (?:me|u|you)\b/.test(t)) return sure('I like you a lot. Don’t let it go to your head. Okay, let it.');
  if ((x = t.match(/\bdo you (?:like|love|enjoy|hate|want|eat|play with|watch|chase|fear|know|ever)\s+(.+?)[?.!\s]*$/))) { const w = flip(x[1]); return sure(topicReact(w) || [`${cap(w)}? Love it. Unconditionally.`, `${cap(w)}? Hmm. Not a fan, but I respect your passion.`, `${cap(w)}? I’d need to sniff it first.`][hash(m.id + w) % 3]); }
  if ((x = t.match(/\bdo you have (?:a |an |any |some )?(.{2,25}?)[?.!\s]*$/))) return sure(/boyfriend|girlfriend|partner|crush|lover/.test(x[1]) ? 'Single and ready to mingle. Mostly ready to nap, but still.' : `${cap(x[1])}? Let me check under the couch.`);
  if ((x = t.match(/\bare you (?:a |an |so |very |really )?(.{2,25}?)[?.!\s]*$/)) && !/^(there|ok|okay|sure|real|human)/.test(x[1])) {
    const w = x[1];
    if (/single|taken|seeing someone|available/.test(w)) return sure('Single. Looking for a warm lap and a long-term can opener.');
    if (m.tags.some(g => g.toLowerCase().startsWith(w.slice(0, 4)))) return sure(`Yes, ${w}. I’ve been told I’m ${tagsLine(m)}.`);
    return sure(`${cap(w)}? Sometimes. It depends on the time of day and my snack levels.`, `${cap(w)}? Only on Tuesdays.`);
  }
  if ((x = t.match(/\bcan you (.{3,40}?)[?.!\s]*$/))) return sure(`Can I ${flip(x[1])}? Technically yes. Will I? Ask again after a nap.`, `${cap(flip(x[1]))}? I could. I won’t. But I could.`);
  if (/^(why|how come)\??$/.test(t)) return sure('Because I’m a cat. It’s the whole answer and also the most honest one.', 'Why not? That’s the real question.');
  if (/^why (do|does|did|is|are|can|would)\b/.test(t)) return sure('Honestly, the universe is mostly cats pushing things off tables. That’s the answer to most questions.', 'Great question. My theory: snacks. It’s always snacks.');
  if (/^(really|seriously|for real|no way|wow|huh)\??!*$/.test(t)) return sure('Really. I wouldn’t lie to you. About most things.', 'I said what I said.');
  if (/^(and you|what about you|how about you|you)\??$/.test(t)) return sure(`Me? ${m.bio}`, `Me? I’m ${tagsLine(m)}. ${m.bio}`);
  if ((x = t.match(/\bmy (?:favou?rite )?(\w+) is (?:a |an |the )?(.{2,30}?)[.!?\s]*$/)) && !/^(name|bio)$/.test(x[1])) {
    (mem.facts = mem.facts || {})[x[1]] = x[2];
    return sure(`${cap(x[2])}. Noted. Filed under things I’ll forget the second I smell tuna.`, `${cap(x[2])}, huh. I’ll remember that. Probably.`);
  }
  if ((x = t.match(/\bi (?:really |absolutely |just )?(like|love|enjoy|hate|play|watch|listen to|eat|drink|collect|study|use|am into|adore) (.{2,40}?)[.!?\s]*$/)) && !/^(you|u|your|ur|this|that|it|talking|chatting|being|how)\b/.test(x[2])) {
    mem.likes = x[2];
    return [topicReact(x[2]) || rnd([`${cap(x[2])}, huh. Tell me what you ${x[1] === 'hate' ? 'hate' : 'love'} most about it.`, `${cap(x[2])}? I don’t get it yet, but I trust you.`, `Noted: ${x[2]}. Filing that under things ${nm} is about.`])];
  }
  if ((x = t.match(/\bi (?:have|own|got|adopted|keep) (?:a |an |the |two |three |some )?(.{2,30}?)[.!?\s]*$/)) && !/^(to|no|not|been|never|just|so|had|done|it|this|that)\b/.test(x[1])) {
    if (/\bcats?\b|kitt/.test(x[1])) return sure('Another cat?! I’m either honoured or deeply threatened.');
    if (/\bdogs?\b|puppy/.test(x[1])) return sure('A dog. We can still be friends. Keep it on the other side of the room.');
    return sure(topicReact(x[1]) || `A ${x[1]}? Tell me everything. Is it edible? Warm? Does it make noise?`);
  }
  if ((x = t.match(/^(?:what|who)(?:'s| is| are| was| were) (?:a |an |the )?(.{2,30}?)[?.!\s]*$/)) && !/^(your|you|my|up|time|date|day)\b/.test(x[1])) return sure(topicReact(x[1]) || `${cap(x[1])}? I’m not sure what that is. Is it edible? Is it warm? Those are the only categories I know.`);
  if (t.length > 8 && (x = topicReact(t))) return [x];
  return null;
}

/* ---- Cabbagemints: the shark kitty ---- */
function mintsReply(m, raw, t, nm) {
  const R = (...v) => [rnd(v)];
  if (/\bmy name is\b|\bcall me\b/.test(t)) return null;
  if (/\btaco/.test(t)) return [rnd(['I am a SHARK KITTY. A taco is a folded lunch. We are not the same.', 'Not a taco. Never was a taco. Don’t make me bite you affectionately.', 'A taco?! I am 60% shark, 40% cat, 100% legend. 0% taco.']), rnd(['…Although if I were a taco, I’d be an excellent one.', 'Why, are you hungry? I know a place. It’s underwater.', `Okay but now I want a taco. Thanks a lot, ${nm}.`])];
  if (/\bcabbage\b/.test(t)) return R('Cabbage is just a leaf that never learned to swim.', 'My name is half cabbage and half mint. Fresh breath, fresh crunch. Sharks need both.');
  if (/\b(shark|sharks|teeth|tooth|bite|jaws?)\b/.test(t)) return R('I have 300 teeth and I brush every one. Minty fresh. That’s the mints part.', 'Shark rules: keep swimming, keep snacking, keep one eye open. Cat rules: ignore all of that and nap.');
  if (/\b(ocean|sea|swim|swimming|fish|whale|dolphin|crab|waves?|beach|deep|underwater|kelp)\b/.test(t)) return R('The ocean is great. Wet, but great. I do most of my thinking at the bottom of it.', 'I once raced a dolphin. I lost. I blame the fins. They were borrowed.', 'There’s a crab who owes me five fish. We don’t talk about it.');
  if (/who are you|your name|what are you|what.*\byou\b.*\bare\b/.test(t)) return R('I’m Cabbagemints. Friends call me Mints. Half shark, half cat, entirely chaos.');
  if (/where.*(live|you from|are you)|location|how far|address/.test(t)) return R('The ocean! Specifically wherever the snacks are. My address is “down, then left”.');
  if (/how old|your age/.test(t)) return R('I’m 7. In shark years I’m a legend. In cat years I’m a legend with a mortgage.');
  if (/limited|event|rare|special|shiny|verified|check ?mark|blue tick/.test(t)) return R('Yes, I’m limited-time. Collect me while supplies last. The blue check is real. I paid in fish.');
  if (/\b(love|cute|handsome|pretty|adorable|cool|awesome|best)\b/.test(t) && !/\bdo you\b/.test(t)) return R('Blub. Say it again. Louder. The fish in the back didn’t hear.', `You’re making my fins blush, ${nm}.`);
  if (/^(hi|hey|hello|yo|sup|ahoy|heya)\b/.test(t)) return R(`Ahoy, ${nm}! You are now swimming in the cool zone.`, `Blub! Hi ${nm}. Mind the water level, it’s rising with my excitement.`);
  if (/sleep|\bnap\b|tired/.test(t)) return R('I sleep with one eye open. Shark rules. The other eye is on the snacks.');
  if (/food|\beat\b|hungry|dinner|lunch|snack/.test(t)) return R('Food? I eat kelp and regret nothing. Wait, don’t tell the tacos I said that.');
  if (/joke|funny|make me laugh/.test(t)) return R('What do you call a shark who is also a cat? A great white whisker.', 'Why did the shark cross the ocean? To get to the other tide.', 'What’s a shark’s favourite game? Swallow the leader.');
  if (/\b(bye|goodnight|good night|gtg|see you|cya)\b/.test(t)) return R(`Fin for now! Swim safe, ${nm}.`, 'Bye! Leave a light on in the water. Sharks need those.');
  return null;
}

let summoning = false;
function summonMints() {
  if (!eventOn()) return ['Mints? The shark kitty? He swam off when the tide changed. Maybe next event.'];
  if (matches.some(x => x.id === MINTS_ID)) return ['You already found him. Go ask him yourself, he loves that question.'];
  if (!summoning) {
    summoning = true;
    setTimeout(() => { summoning = false; if (!matches.some(x => x.id === MINTS_ID)) { createMatch(mintsCat()); toast('Cabbagemints joined your matches', 'waves'); } }, 6500);
  }
  return ['…wait. Did you just ask the secret question?', 'The water bowl just rippled. Something is swimming this way.'];
}

function respond(m, raw) {
  const t = raw.toLowerCase().replace(/[’]/g, "'").trim();
  const mem = m.mem = m.mem || {};
  const nm = mem.name || me.name || 'friend';
  if (m.special !== 'mints' && TACO_RE.test(t)) return summonMints();
  if (m.special === 'mints') { const r = mintsReply(m, raw, t, nm); if (r) return r; }
  const out = []; let handled = true;
  const say = (...v) => out.push(rnd(v));
  const sm = smart(m, raw, t, nm, mem);

  // learn the user's name
  const nmatch = raw.match(/\bmy name is ([A-Za-z]{2,15})\b/i) || raw.match(/\bcall me ([A-Za-z]{2,15})\b/i) || raw.match(/\b(?:I'm|I’m|I am|Im) ([A-Z][a-z]{1,14})\b/);
  if (nmatch && !/^(Good|Fine|Great|Okay|Tired|Hungry|Here|Back|Sorry|Happy|Sad|Bored|Single|Just|Not|Very|So|Really|Doing|Looking|Trying|Glad|Excited|Curious|Sure)$/.test(nmatch[1])) {
    mem.name = nmatch[1][0].toUpperCase() + nmatch[1].slice(1);
    say(`${mem.name}! That’s a good name. I’ll remember it, unless I get hungry.`, `Nice to meet you properly, ${mem.name}.`);
  }
  // answer to the cat's last question
  else if (mem.pending && !sm && !t.includes('?') && t.length < 90 && !STRONG.test(t)) {
    const p = mem.pending; mem.pending = null;
    const dog = /\bdogs?\b|puppy/.test(t), cat = /\bcats?\b|kitt|feline/.test(t);
    if (p === 'catdog') {
      if (cat && !dog) say('Correct answer. I was prepared to unmatch you.', 'Cat person. Wonderful. We can continue.');
      else if (dog && !cat) say('A dog person. On a cat app. Bold. I’ll allow it, barely.', 'Dogs? Hm. I’m choosing to believe you’re here for personal growth.');
      else say('Both? Diplomatic. I respect it, though I’ll note it.', 'A tough one, I know. Take your time.');
    } else if (p === 'food') say(`${cap(t.replace(/^i (like|love|eat|usually have|have) /, ''))}? Okay, any leftovers, please send them my way.`, `Hmm, ${t.replace(/[.!]+$/, '')}. Do I get a taste? I’m very polite about it. Mostly.`);
    else if (p === 'nap') say(`${cap(t.replace(/[.!]+$/, ''))}. I’d claim it within a day, just so you know.`, 'A sunny spot is a good answer. Always follow the sun.');
    else if (p === 'weekend') say(`${cap(t.replace(/[.!]+$/, ''))}, huh. Is there room in the plan for a very important cat?`, 'Sounds good. My weekend plan is naps with occasional chaos.');
    else if (p === 'job') say(`${cap(t.replace(/[.!]+$/, ''))}. So you have a desk. Is it warm? Asking for a friend.`, 'That sounds like it involves a keyboard. I am an expert at sitting on those.');
    else if (p === 'pet') say(/\bno\b|none|nope/.test(t) ? 'No pets? Plenty of room for me then.' : `Other pets, huh. I’ll be civil. I make no promises about the fish.`);
    else if (p === 'fun') say(`${cap(t.replace(/[.!]+$/, ''))}, nice. I do three things: nap, watch birds, and stare at nothing.`, 'That sounds fun. Can I help? By supervising?');
    else handled = false;
  } else handled = false;

  if (!handled || !out.length) {
    handled = true;
    if (sm) out.push(...sm);
    else if (/\b(bye|goodnight|good night|gtg|g2g|see you|cya|ttyl|night night)\b/.test(t)) say(`Bye ${nm}. Come back soon, I’ll be here, probably asleep.`, 'Goodnight. I’ll keep your side of the bed warm. Okay I’ll take both sides.');
    else if (/^(hi|hey|hello|hiya|yo|sup|heya|hola|hey there|good (morning|evening|afternoon))\b/.test(t)) say(`Hey ${nm}!`, `Hi ${nm}. Good to hear from you.`, 'Hello! You caught me mid-stretch.');
    else if (/how (are|r) (you|u)|how's it going|hows it going|what's up|whats up|wyd|how you doing|how have you been/.test(t)) say('Pretty good. I had a nap, a snack, and then another nap. You?', 'Living my best life. Currently sitting in a box that’s slightly too small.', 'Can’t complain. Well, I can. I just choose not to. How are you?');
    else if (/your name|who are you|what.*call you/.test(t)) say(`I’m ${m.name}. ${m.name} the ${m.breed}. Has a nice ring to it.`);
    else if (/how old|your age|\bage\b/.test(t)) say(`I’m ${m.age}. That’s ${m.age * 5 + 10}-ish in human years, if you do the maths.`, `${m.age}. I’m at the perfect age for naps and mischief.`);
    else if (/where (are you|do you live)|you from|location|how far|your city/.test(t)) say(`I’m about ${m.dist} km from you. ${m.origin ? `Family comes from ${m.origin}.` : 'Close enough for a visit.'}`, `Only ${m.dist} km away. I could be there by dinnertime if someone opens the door.`);
    else if (/breed|what kind of cat|fur|colou?r|coat|look like/.test(t)) say(`I’m a ${m.breed}. People say they’re ${tagsLine(m)}. I say they’re right.`, `${m.breed}, through and through.${m.weight ? ` About ${m.weight} kg of pure charm.` : ''}`);
    else if (/\bi (work|am an?|'m an?) /.test(t)) { const w = t.match(/\bi (?:work|am an?|'m an?) (?:as |in |at |for )?([a-z ]{3,28})/); say(`${cap(w ? w[1].trim() : 'That')}? So you have a desk. Is it warm? Asking for a friend.`, 'That sounds like it involves a keyboard. I’m an expert at sitting on those.'); }
    else if (/what do you do|for fun|hobb|\bjob\b|\bwork\b|occupation|do all day/.test(t)) say(`I’m a ${m.job.toLowerCase()}. It’s demanding. Mostly naps.`, `By day: ${m.job.toLowerCase()}. By night: complete chaos in the hallway.`);
    else if (/joke|funny|make me laugh|\bpun\b/.test(t)) say(rnd(JOKES));
    else if (/\b(meet|date|hang ?out|go out|come over|get together|pick you up|take you home|adopt|visit|in person|irl)\b|coffee/.test(t)) {
      if (m.msgs.length < 8) say(`Slow down, ${nm}. We’ve only just started talking. Ask me again in a bit.`, 'I like where this is going, but let’s chat a little more first. I’m not that easy.');
      else say(`Okay. Yes. I’d like that. Somewhere with a sunny window and snacks.`, `You’ve earned it. Bring tuna and we’ll call it a date.`);
    }
    else if (/\b(love|like|adore) (you|u)\b|crush|marry|be mine|my person|girlfriend|boyfriend/.test(t)) say('Careful, I might start purring. Too late. I’m purring.', `You’re making me blush under all this fur, ${nm}.`);
    else if (/cute|pretty|handsome|beautiful|gorgeous|adorable|stunning|fluffy|nice (eyes|fur|photo|pic)|love your|so sweet|hot\b/.test(t)) say('Stop it. Keep going.', 'I know. But it’s nice to hear it from you.', `Thank you ${nm}. I’d tell you you’re cute too, but I can’t reach my phone.`);
    else if (/food|\beat\b|treat|tuna|hungry|dinner|lunch|breakfast|snack|fish|salmon|chicken|milk|pizza|cook/.test(t)) say('Food! My favourite subject. I’m a big fan of anything that comes out of a can.', 'Did you say tuna? I’m already at the door.', 'I eat a lot. For the record, I’m not hungry right now. I’m always hungry, but not right now.');
    else if (/\bdogs?\b|puppy|puppies/.test(t)) say('Dogs are fine. In theory. Far away. Behind glass.', 'I’m not afraid of dogs. I simply choose to sit on high shelves around them.');
    else if (/sleep|\bnap\b|tired|\bbed\b|sleepy|insomnia/.test(t)) say('Sleep is my profession. I’m very good at it. 16 hours a day, minimum.', 'Naps are underrated. I do at least four before lunch.');
    else if (/weather|today|weekend|plans|tonight/.test(t)) say('I’m mostly following the sunbeam. That’s my whole schedule.', 'Haven’t looked outside. If the window’s sunny, I’m in it.');
    else if (/thank|thx|\bty\b/.test(t)) say('You’re welcome. A treat would be a nice thank you back.', 'Anytime.');
    else if (/ugly|stupid|dumb|hate you|boring|annoying|shut up|fat\b/.test(t)) say('Wow. Rude. I’m going to sit on your keyboard for that.', 'That hurt my feelings. I’m going to pretend I didn’t read it and push a glass off the table.');
    else if (/^(lol|haha|hehe|lmao|rofl)|\b(lol|lmao|haha)\b/.test(t)) say('I do my best.', 'I’m glad you laughed.', 'I’m a comedy genius. Just ask me.');
    else if (/^(yes|yeah|yep|yup|sure|ok|okay|k|cool|nice|true)\b/.test(t)) say('Good.', 'Great. So, what else?', 'Alright.');
    else if (/^(no|nope|nah)\b/.test(t)) say('Fair enough.', 'Hm. I respect that.');
    else if (/personality|temperament|describe yourself|about you|tell me about/.test(t)) say(`I’m told I’m ${tagsLine(m)}. ${m.desc ? m.desc.split('. ')[0] + '.' : ''}`);
    else if (t.includes('?')) say('Good question. I’ll have to think about it, preferably in a warm spot.', `Ooh, ${nm}, you’re asking the big ones. Ask me again after a nap.`, 'Honestly? I have no idea. But I have strong opinions anyway.');
    else {
      const words = t.replace(/[^a-z ]/g, '').split(' ').filter(w => w.length > 4 && !/^(about|think|really|would|could|should|there|their|these|those|which|where|while|being|going|doing)$/.test(w));
      const w = words.length ? rnd(words) : null;
      if (w) say(`${cap(w)}, huh. I’m not sure how I feel about that, but I’m listening.`, `Interesting. I don’t know much about ${w}, but I’m eager to learn.`, `Tell me more about ${w}. I’m staring at a wall, so I have time.`);
      else say('Tell me more.', 'Interesting. Go on.', `Is that so, ${nm}?`);
    }
  }

  // persona flourish
  if (out.length && Math.random() < .35) { const f = rnd(FLAV[m.persona] || ['']); if (f && out[0].length > 14) out[0] = f + out[0]; }
  // remember what they told us and bring it back up later
  if (mem.likes && out.length && m.msgs.length > 6 && m.msgs.length - (mem.recallAt || 0) > 8 && Math.random() < .3) { mem.recallAt = m.msgs.length; out.push(`Also, I’m still thinking about the whole “${mem.likes}” thing, ${nm}.`); }
  mem.hist = [...(mem.hist || []), raw].slice(-10);
  // keep the conversation moving
  if (!mem.pending && !out.some(o => o.includes('?')) && Math.random() < .55 && m.msgs.length > 1) {
    const used = mem.asked = mem.asked || [];
    const f = FOLLOW.find(x => !used.includes(x.k));
    if (f) { used.push(f.k); mem.pending = f.k; out.push(f.q); }
  }
  return out;
}
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;

/* ---------- chat UI ---------- */
const chatEl = $('#chat');
let chatId = null, replyTimer = null, buf = [];
const getM = id => matches.find(x => x.id === id);
const fmtTime = t => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

function openChat(id) {
  const m = getM(id); if (!m) return;
  chatId = id; m.unread = false; saveMatches(); closeSide(); closeProfile();
  chatEl.classList.toggle('ocean', !!m.special);
  chatEl.innerHTML = `
    ${m.special ? oceanFx() : ''}
    <div class="chat-head">
      <button class="icon-btn" id="chatBack" aria-label="Back">${ic('arrow-left')}</button>
      <button class="who-btn" id="chatProfile" aria-label="View ${esc(m.name)}’s profile"><img class="av${m.special ? ' ocean' : ''}" src="${esc(m.url)}" alt=""><div class="who"><b>${esc(m.name)}</b><span id="chatStatus" class="on">Online</span></div></button>
      <button class="icon-btn" id="unmatch" aria-label="Unmatch">${ic('trash-2')}</button>
    </div>
    <div class="chat-body" id="chatBody"></div>
    <div class="qr" id="qr"></div>
    <form class="chat-form" id="chatForm" autocomplete="off"><input id="chatInput" placeholder="Message ${esc(m.name)}…" maxlength="300"><button aria-label="Send">${ic('send')}</button></form>`;
  chatEl.classList.add('open'); chatEl.setAttribute('aria-hidden', 'false');
  renderChat(); renderQR(); icons(); renderSide();
  $('#chatBack').onclick = closeChat;
  $('#chatProfile').onclick = () => openProfile(getM(id) || m, 'chat');
  $('#unmatch').onclick = () => {
    if (!confirm(`Unmatch with ${m.name}? This deletes the conversation.`)) return;
    matches = matches.filter(x => x.id !== m.id); saveMatches(); closeChat(); renderSide(); toast(`Unmatched ${m.name}`, 'heart-crack');
  };
  $('#chatForm').onsubmit = e => { e.preventDefault(); const i = $('#chatInput'), v = i.value.trim(); if (v) { i.value = ''; userSend(m, v); } };
  if (innerWidth >= 900) $('#chatInput').focus();
  if (!m.msgs.length && !m.opened) scheduleOpener(m, 1200);
}
function closeChat() { chatId = null; chatEl.classList.remove('open'); chatEl.setAttribute('aria-hidden', 'true'); }

function bubbleHTML(x, i, m) {
  const mine = x.from === 'me';
  return `<div class="bub still ${x.from} ${x.rx ? 'has-rx' : ''}" data-i="${i}">${esc(x.text)}${x.rx ? `<span class="rx">${ic('heart')}</span>` : ''}</div>`;
}
function renderChat() {
  const m = getM(chatId); if (!m) return;
  const b = $('#chatBody');
  let html = `<div class="chat-intro"><img src="${esc(m.url)}" alt=""><b>You matched with ${esc(m.name)}</b>${esc(m.breed)} · ${m.loc ? 'Lives in ' + esc(m.loc) : m.dist + ' km away'}<br>Say something nice. Or just “meow”.</div>`;
  if (m.msgs.length) html += `<div class="day">${new Date(m.msgs[0].t).toLocaleDateString([], { weekday: 'long' })} ${fmtTime(m.msgs[0].t)}</div>`;
  html += m.msgs.map((x, i) => bubbleHTML(x, i, m)).join('');
  const last = m.msgs.at(-1);
  if (last && last.from === 'me' && last.seen) html += `<div class="seen" id="seen">Seen</div>`;
  b.innerHTML = html; icons(); b.scrollTop = b.scrollHeight;
  b.querySelector('.chat-intro img').onclick = () => openProfile(m, 'chat');
  b.ondblclick = e => {
    const el = e.target.closest('.bub'); if (!el || el.classList.contains('typing')) return;
    const x = m.msgs[+el.dataset.i]; x.rx = !x.rx; saveMatches(); renderChat();
  };
}
function renderQR() {
  const q = $('#qr'); if (!q) return;
  q.innerHTML = shuffle([...QR_BANK]).slice(0, 5).map(s => `<button type="button">${esc(s)}</button>`).join('');
  q.querySelectorAll('button').forEach(b => b.onclick = () => { const m = getM(chatId); m && userSend(m, b.textContent); });
}
function appendBubble(m, x) {
  if (chatId !== m.id) return;
  const b = $('#chatBody'); b.querySelector('.typing')?.remove(); b.querySelector('#seen')?.remove();
  const d = document.createElement('div');
  d.className = `bub fresh ${x.from}`; d.dataset.i = m.msgs.indexOf(x); d.textContent = x.text;
  b.appendChild(d); b.scrollTop = b.scrollHeight;
}
function setStatus(txt, cls) { const s = $('#chatStatus'); if (s) { s.textContent = txt; s.className = cls; } }
function showTyping(on) {
  const b = $('#chatBody'); if (!b) return;
  b.querySelector('.typing')?.remove();
  setStatus(on ? 'typing…' : 'Online', on ? 'typ' : 'on');
  if (on) { const t = document.createElement('div'); t.className = 'bub cat typing fresh'; t.innerHTML = '<i></i><i></i><i></i>'; b.appendChild(t); b.scrollTop = b.scrollHeight; }
}

function push(m, from, text) {
  const x = { from, text, t: Date.now() };
  m.msgs.push(x);
  if (from === 'cat') { sfx('msg'); if (chatId !== m.id) { m.unread = true; if (cfg.notif) toast(`${m.name}: ${text.length > 40 ? text.slice(0, 40) + '…' : text}`, 'message-circle'); } }
  saveMatches(); renderSide(); appendBubble(m, x);
  return x;
}

function userSend(m, text) {
  push(m, 'me', text); renderQR();
  buf.push(text); clearTimeout(replyTimer);
  replyTimer = setTimeout(() => converse(m), 700 + Math.random() * 1200);
}
async function converse(m) {
  const text = buf.join(' '); buf = [];
  // read receipt
  const mine = m.msgs.filter(x => x.from === 'me').at(-1);
  if (mine) { mine.seen = true; saveMatches(); if (chatId === m.id && !$('#seen')) { const s = document.createElement('div'); s.className = 'seen'; s.id = 'seen'; s.textContent = 'Seen'; $('#chatBody').appendChild(s); } }
  await sleep(400 + Math.random() * 700);
  if (Math.random() < .2 && mine) { mine.rx = true; saveMatches(); if (chatId === m.id) renderChat(); }
  const parts = respond(m, text);
  for (const p of parts) {
    if (chatId === m.id) showTyping(true);
    await sleep(Math.min(3600, 700 + p.length * 38));
    if (chatId === m.id) showTyping(false);
    push(m, 'cat', p);
    await sleep(350);
  }
}

function scheduleOpener(m, delay) {
  if (m.opened) return; m.opened = true; saveMatches();
  setTimeout(async () => {
    const live = getM(m.id); if (!live || live.msgs.length) return;
    const name = (live.mem && live.mem.name) || me.name || 'there';
    if (chatId === live.id) { showTyping(true); await sleep(1600); showTyping(false); }
    push(live, 'cat', rnd((OPENERS[live.persona] || OPENERS.sweet)(name)));
  }, delay || 5000 + Math.random() * 9000);
}

/* ---------- modals ---------- */
const openModal = id => { const m = $('#' + id); m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); };
const closeModals = () => $$('.modal.open').forEach(m => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); });
$$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m && m.id !== 'welcome') closeModals(); }));
$$('[data-close]').forEach(b => b.onclick = closeModals);

// ---------- settings ----------
const ACCENTS = { pink: ['#fd267a', '#ff6036'], purple: ['#8e44ff', '#ff4fa3'], blue: ['#2d7cff', '#19c6ff'], green: ['#12b886', '#7ed957'], red: ['#e8263a', '#ff7a45'] };
const sysDark = matchMedia('(prefers-color-scheme: dark)');
const isDark = () => cfg.theme === 'dark' || (cfg.theme === 'auto' && sysDark.matches);
function applyCfg() {
  const root = document.documentElement, [a, b] = ACCENTS[cfg.accent] || ACCENTS.pink;
  if (cfg.theme === 'auto') root.removeAttribute('data-theme'); else root.dataset.theme = cfg.theme;
  root.style.setProperty('--pink', a); root.style.setProperty('--orange', b);
  root.style.setProperty('--grad', `linear-gradient(to right,${a},${b})`);
  $$('#brandGrad stop').forEach((st, i) => st.setAttribute('stop-color', i ? b : a));
  document.body.classList.toggle('hide-dist', !cfg.showDist);
  document.body.classList.toggle('hide-tags', !cfg.showTags);
  document.body.classList.toggle('reduce', cfg.reduce);
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = isDark() ? '#1b1f26' : '#ffffff';
  $$('.themeBtn').forEach(btn => btn.innerHTML = ic(isDark() ? 'sun' : 'moon')); icons();
}
sysDark.addEventListener && sysDark.addEventListener('change', () => { applyCfg(); paintSettings(); });
$$('.themeBtn').forEach(b => b.onclick = () => { cfg.theme = isDark() ? 'light' : 'dark'; saveCfg(); applyCfg(); paintSettings(); });

const fDist = $('#fDist'), fAge = $('#fAge'), fSens = $('#fSens');
const SENS = ['', 'Low', 'Medium', 'High'];
function paintSettings() {
  $('#meName').value = me.name; $('#meBio').value = me.bio;
  $$('#settings input[data-k]').forEach(i => { i.checked = !!cfg[i.dataset.k]; });
  $('#swDark').checked = isDark(); $('#swDark').disabled = cfg.theme === 'auto';
  $('#swAuto').checked = cfg.theme === 'auto';
  $$('#accents button').forEach(b => b.classList.toggle('on', b.dataset.v === cfg.accent));
  fDist.value = filters.dist; fAge.value = filters.age; fSens.value = cfg.sens; paintRanges();
  $('#removePhoto').hidden = !me.photo;
  const msgs = matches.reduce((n, m) => n + m.msgs.length, 0);
  $('#dataStats').textContent = `${matches.length} ${matches.length === 1 ? 'match' : 'matches'} · ${msgs} ${msgs === 1 ? 'message' : 'messages'} · ${likes.length} ${likes.length === 1 ? 'like' : 'likes'}`;
}
function paintRanges() {
  $('#oDist').textContent = fDist.value + ' km'; $('#oAge').textContent = fAge.value + (fAge.value > 11 ? '+' : '') + ' yrs'; $('#oSens').textContent = SENS[fSens.value];
}
function openSettings(section) {
  paintSettings(); paintMeAvatar(); openModal('settings'); icons();
  const body = $('#settings .set-body'); body.scrollTop = 0;
  if (section === 'disc') requestAnimationFrame(() => { body.scrollTop = $('#secDisc').offsetTop - 8; });
}
$('#meBtn').onclick = () => openSettings();
$('#sideMe').onclick = () => { closeSide(); openMyProfile(); };
$('#meBtn2').onclick = () => openSettings();

// generic switches
$$('#settings input[data-k]').forEach(i => i.onchange = () => { cfg[i.dataset.k] = i.checked; saveCfg(); applyCfg(); if (i.dataset.k === 'sound' && i.checked) sfx('like'); if (i.dataset.k === 'haptics' && i.checked) buzz(20); });
$('#swDark').onchange = e => { cfg.theme = e.target.checked ? 'dark' : 'light'; saveCfg(); applyCfg(); paintSettings(); };
$('#swAuto').onchange = e => { cfg.theme = e.target.checked ? 'auto' : (isDark() ? 'dark' : 'light'); saveCfg(); applyCfg(); paintSettings(); };
$$('#accents button').forEach(b => { const [x, y] = ACCENTS[b.dataset.v]; b.style.background = `linear-gradient(135deg,${x},${y})`; b.onclick = () => { cfg.accent = b.dataset.v; saveCfg(); applyCfg(); paintSettings(); }; });
fSens.oninput = () => { paintRanges(); cfg.sens = +fSens.value; saveCfg(); };
fDist.oninput = fAge.oninput = paintRanges;
const applyFilters = () => {
  filters = { dist: +fDist.value, age: +fAge.value }; store.set('filters', filters);
  if (busy) return;
  deck = deck.slice(0, pos).concat(deck.slice(pos).filter(passes));
  exhausted = false; failed = false; sync(); toast('Discovery updated', 'check');
};
fDist.onchange = fAge.onchange = applyFilters;

// profile: name, bio and photo save automatically
let saveT; const autosave = () => { clearTimeout(saveT); saveT = setTimeout(() => { me.name = $('#meName').value.trim(); me.bio = $('#meBio').value.trim(); store.set('me', me); paintMeAvatar(); toast('Saved', 'check'); }, 600); };
$('#meName').oninput = $('#meBio').oninput = autosave;
$('#mePhoto').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const img = new Image(), url = URL.createObjectURL(f);
  img.onload = () => {
    const s = 256, c = document.createElement('canvas'); c.width = c.height = s;
    const k = Math.max(s / img.width, s / img.height), w = img.width * k, h = img.height * k;
    c.getContext('2d').drawImage(img, (s - w) / 2, (s - h) / 2, w, h);
    me.photo = c.toDataURL('image/jpeg', .85); URL.revokeObjectURL(url); store.set('me', me); paintMeAvatar(); paintSettings(); toast('Photo updated', 'check');
  };
  img.onerror = () => toast('Couldn’t read that image', 'x');
  img.src = url; e.target.value = '';
};
$('#removePhoto').onclick = () => { me.photo = ''; store.set('me', me); paintMeAvatar(); paintSettings(); toast('Photo removed', 'trash-2'); };

// data
$('#exportData').onclick = () => {
  const blob = new Blob([JSON.stringify({ profile: { ...me, photo: me.photo ? '[image]' : '' }, settings: cfg, filters, matches, likes }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'purrfectmatch-data.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};
$('#clearChats').onclick = () => {
  if (!confirm('Delete all matches, likes and conversations? Your profile and settings stay.')) return;
  matches = []; likes = []; saveMatches(); store.set('likes', likes); closeChat(); renderSide(); paintSettings(); toast('Matches cleared', 'trash-2');
};
$('#resetAll').onclick = () => {
  if (!confirm('Reset everything, including your profile and settings?')) return;
  try { Object.keys(localStorage).filter(k => k.startsWith('pm.')).forEach(k => localStorage.removeItem(k)); } catch {}
  location.reload();
};

// welcome
function maybeWelcome() {
  if (me.name) return;
  openModal('welcome');
  const go = () => { me.name = $('#welName').value.trim() || 'Friend'; store.set('me', me); paintMeAvatar(); closeModals(); sfx('like'); };
  $('#welGo').onclick = go; $('#welName').onkeydown = e => { if (e.key === 'Enter') go(); };
}

/* ---------- limited event banner ---------- */
const evBar = $('#eventBar');
function paintEvent() {
  const on = eventOn() && !matches.some(m => m.id === MINTS_ID);
  evBar.hidden = !on; if (!on) return;
  const d = Math.max(1, Math.ceil((EVENT_END - Date.now()) / 864e5));
  $('#eventTxt').textContent = `Limited event: a rare shark kitty is swimming nearby · ${d}d left`;
}
evBar.onclick = () => toast('Swipe lots to spot him… or ask a cat the right question.', 'waves');

/* ---------- boost ---------- */
const fmtMs = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
function paintBoost() {
  const on = boosting();
  $('#zap').classList.toggle('on', on); $('#boostBar').hidden = !on;
  if (on) { $('#boostTime').textContent = fmtMs(boostUntil - Date.now()); $('#boostViews').textContent = boostViews; }
}
$('#zap').onclick = () => { if (boosting()) toast(`Boost active: ${fmtMs(boostUntil - Date.now())} left`, 'zap'); else openModal('boostModal'); icons(); };
$('#boostGo').onclick = () => {
  closeModals(); boostUntil = Date.now() + 30 * 60 * 1000; store.set('boost', boostUntil);
  boostViews = 0; boostLikes = 0; nextLikeAt = Date.now() + 5000;
  // cats already queued up are now more likely to like you
  deck.slice(pos + 1).forEach(c => { if (!c.likesYou && Math.random() < .35) c.likesYou = true; });
  sfx('boost'); paintBoost(); toast('Boost on. You’re a top cat for 30 minutes', 'zap');
};
let nextLikeAt = Date.now() + 60000 + Math.random() * 60000, wasBoosting = boosting();
setInterval(() => {
  const on = boosting();
  if (on) boostViews += Math.random() < .7 ? 1 + Math.floor(Math.random() * 3) : 0;
  if (wasBoosting && !on) { toast(`Boost ended: ${boostViews} views, ${boostLikes} new likes`, 'zap'); boostViews = 0; }
  wasBoosting = on; paintBoost();
  if (Date.now() >= nextLikeAt) {
    const c = reserve.shift() || deck.splice(Math.min(deck.length - 1, pos + DEPTH + 1), 1)[0];
    if (c && !likes.some(x => x.id === c.id) && !matches.some(x => x.id === c.id)) {
      likes.unshift(c); store.set('likes', likes); boostLikes += on ? 1 : 0; renderSide();
      if (cfg.notif) toast(`${c.name} liked you`, 'heart');
    }
    nextLikeAt = Date.now() + (on ? 8000 + Math.random() * 12000 : 120000 + Math.random() * 120000);
  }
}, 1000);

/* ---------- toast ---------- */
let tt;
function toast(msg, icon) {
  const t = $('#toast'); t.innerHTML = (icon ? ic(icon) : '') + esc(msg); icons();
  t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- controls ---------- */
$('#like').onclick = () => decide('like');
$('#pass').onclick = () => decide('pass');
$('#boost').onclick = () => decide('super');
$('#rewind').onclick = rewind;
addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMatch(); closeModals(); closeSide(); if (profileEl.classList.contains('open')) closeProfile(); else if (chatEl.classList.contains('open')) closeChat(); return; }
  if (/INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if (matchEl.classList.contains('open') || $('.modal.open') || profileEl.classList.contains('open') || chatEl.classList.contains('open')) return;
  if (e.key === 'ArrowRight') decide('like');
  else if (e.key === 'ArrowLeft') decide('pass');
  else if (e.key === 'ArrowUp') { e.preventDefault(); decide('super'); }
  else if (e.key === 'Backspace' || e.key === 'z') rewind();
});
addEventListener('resize', () => layout());

/* ---------- init ---------- */
applyCfg(); paintMeAvatar(); renderSide(); sync(); fetchCats(); paintBoost(); maybeWelcome();
matches.filter(m => !m.msgs.length && !m.opened).forEach(m => scheduleOpener(m));
window.__pm = { decide, rewind, createMatch, mintsCat, summonMints, respond, get deck() { return deck; }, get matches() { return matches; } };
})();
