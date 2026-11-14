import { exigerSession, contexte, garder, deconnexion } from './kalasa-db.js';

/* ===== Pages du menu ===== */
const PAGES = [['index', '🏠 Accueil'], ['etablissement', '🏫 Établ.'], ['annee', '📅 Années'], ['classe', '👥 Classes/Promotion'], ['eleve', '🧒 Élèves'],
  ['parent', '👨‍👩‍👧 Parents'], ['personnel', '🧑‍🏫 Personnel'], ['presence', '✅ Présences'], ['note', '📝 Notes'],
  ['horaire', '🕐 Horaire'], ['finance', '💰 Frais'], ['message', '💬 Messages'],
  ['secretariat', '🗂 Secrétariat'], ['dashboard-general', '📊 Général'], ['utilisateurs', '🔐 Utilisateurs'],
  ['droits', '🔑 Droits'], ['audit', '📋 Audit']];

/* Droits par défaut du menu (à remplacer par la page « Droits » une fois migrée) */
const ACCES = {
  admin: '*',
  directeur: ['index', 'etablissement', 'annee', 'classe', 'eleve', 'parent', 'personnel', 'presence', 'note', 'horaire', 'finance', 'message', 'secretariat', 'dashboard-general'],
  secretaire: ['index', 'classe', 'eleve', 'parent', 'presence', 'message', 'secretariat'],
  enseignant: ['index', 'classe', 'eleve', 'presence', 'note', 'horaire', 'message'],
  caissier: ['index', 'eleve', 'finance', 'message'],
  eleve: ['index']
};
const ROLES = { admin: 'Administrateur', directeur: 'Directeur', secretaire: 'Secrétaire', enseignant: 'Enseignant', caissier: 'Caissier', eleve: 'Élève' };
const SANS_BARRE = ['utilisateurs', 'etablissement'];   // pages où la barre d'établissement est inutile

const C = await exigerSession();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cur = location.pathname.split('/').pop().replace('.html', '') || 'index';
const permis = f => ACCES[C.role] === '*' || (ACCES[C.role] || []).includes(f);

/* ===== Menu latéral ===== */
let n = document.getElementById('nav');
if (!n) {
  n = document.createElement('nav'); n.id = 'nav';
  (document.querySelector('body>header') || document.body).after(n);
}
n.setAttribute('aria-label', 'Menu KALASA');
n.innerHTML = '<div class="brand">KALASA</div>' +
  PAGES.filter(([f]) => permis(f))
    .map(([f, l]) => `<a href="${f}.html"${f === cur ? ' class="on" aria-current="page"' : ''}>${l}</a>`).join('') +
  `<div style="padding:14px 18px;border-top:1px solid #8883;font-size:.85rem;opacity:.85">👤 ${esc(C.nom_complet)}<br>${esc(ROLES[C.role] || C.role)}</div>` +
  '<a href="#" id="kdeco">🚪 Déconnexion</a>';

const ov = document.createElement('div'); ov.className = 'navov'; document.body.appendChild(ov);
const h = document.querySelector('body>header') || document.querySelector('header');
let b = null;
if (h) {
  b = document.createElement('button'); b.type = 'button'; b.className = 'burger'; b.innerHTML = '☰';
  b.setAttribute('aria-label', 'Ouvrir le menu'); b.setAttribute('aria-controls', 'nav'); b.setAttribute('aria-expanded', 'false');
  h.prepend(b);
}
const centrer = () => { const on = n.querySelector('.on'); if (on) n.scrollTop = on.offsetTop - n.clientHeight / 2 + on.offsetHeight / 2; };
function ouvrir(o) {
  n.classList.toggle('open', o); ov.classList.toggle('show', o); document.body.classList.toggle('navlock', o);
  if (b) b.setAttribute('aria-expanded', String(o));
  if (o) centrer();
}
if (b) b.addEventListener('click', () => ouvrir(!n.classList.contains('open')));
ov.addEventListener('click', () => ouvrir(false));
n.addEventListener('click', e => { if (e.target.closest('a')) ouvrir(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') ouvrir(false); });
const mq = matchMedia('(min-width:1024px)');
if (mq.addEventListener) mq.addEventListener('change', () => ouvrir(false));
document.getElementById('kdeco').addEventListener('click', e => { e.preventDefault(); deconnexion(); });
centrer();

/* ===== Établissement courant (partagé par toutes les pages) ===== */
function choisirEtab(id) {
  const c = contexte() || {};
  if (!id || c.etabId === id) return;
  garder({ ...c, etabId: id });
  const kb = document.getElementById('kb-e'); if (kb) kb.value = id;
  const s = document.getElementById('etab');
  if (s) {
    if ([...s.options].some(o => o.value === id)) { s.value = id; s.dispatchEvent(new Event('change', { bubbles: true })); }
  } else if (document.getElementById('kbar')) {
    location.reload();
  }
  dispatchEvent(new CustomEvent('kalasa:ctx', { detail: { etab: id } }));
}

const E = C.etablissements || [];
if (E.length && h && !SANS_BARRE.includes(cur)) {
  const st = document.createElement('style');
  st.textContent = '#kbar{position:sticky;z-index:30;display:flex;gap:8px;align-items:center;padding:8px 12px;background:var(--c,#fff);border-bottom:1px solid #8883;box-shadow:0 1px 3px #0001}' +
    '#kbar label{flex:1;display:flex;gap:6px;align-items:center;margin:0;font-size:1rem;opacity:1;min-width:0}' +
    '#kbar select{min-height:40px;padding:8px 32px 8px 8px;font-size:.9rem;min-width:0}';
  document.head.appendChild(st);
  const bar = document.createElement('div'); bar.id = 'kbar';
  bar.innerHTML = '<label title="Établissement">🏫<select id="kb-e">' +
    E.map(x => `<option value="${esc(x.id)}">${esc(x.nom || x.code)}</option>`).join('') + '</select></label>';
  h.after(bar);
  bar.style.top = h.offsetHeight + 'px';
  const kb = bar.querySelector('#kb-e');
  kb.value = C.etabId || '';
  kb.addEventListener('change', () => choisirEtab(kb.value));
}

/* Si la page change elle-même d'établissement, on le mémorise pour les autres pages */
document.addEventListener('change', e => {
  if (e.target.id === 'etab' && e.target.value) choisirEtab(e.target.value);
});

window.KCTX = {
  get: () => ({ etab: (contexte() || {}).etabId || null, annee: null }),
  set: p => p && p.etab && choisirEtab(p.etab)
};