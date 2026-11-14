import { sb, exigerSession, contexte, garder, deconnexion } from './kalasa-db.js';

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

const C = await exigerSession();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cur = location.pathname.split('/').pop().replace('.html', '') || 'index';
const permis = f => ACCES[C.role] === '*' || (ACCES[C.role] || []).includes(f);

/* ===== Styles ===== */
const st = document.createElement('style');
st.textContent =
  '.hbtn{flex:none;min-width:44px;min-height:44px;padding:0;font-size:1.3rem;line-height:1;background:#fff3;color:#fff;border-radius:8px}' +
  '.kuser{font-size:.8rem;font-weight:500;max-width:34vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
  '#kbar{position:sticky;z-index:30;display:flex;gap:8px;align-items:center;padding:8px 12px;background:var(--c,#fff);border-bottom:1px solid #8883;box-shadow:0 1px 3px #0001}' +
  '#kbar label{flex:1;display:flex;gap:6px;align-items:center;margin:0;font-size:1rem;opacity:1;min-width:0}' +
  '#kbar select{min-height:40px;padding:8px 32px 8px 8px;font-size:.9rem;min-width:0}';
document.head.appendChild(st);

/* ===== Menu latéral ===== */
let n = document.getElementById('nav');
if (!n) {
  n = document.createElement('nav'); n.id = 'nav';
  (document.querySelector('body>header') || document.body).after(n);
}
n.setAttribute('aria-label', 'Menu KALASA');
n.innerHTML = '<div class="brand">KALASA</div>' +
  PAGES.filter(([f]) => permis(f))
    .map(([f, l]) => `<a href="${f}.html"${f === cur ? ' class="on" aria-current="page"' : ''}>${l}</a>`).join('');

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
centrer();

/* ===== En-tête : nom, mot de passe, déconnexion ===== */
if (h) {
  const g = document.createElement('div');
  g.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:8px;min-width:0';
  g.innerHTML = `<span class="kuser" title="${esc(C.nom_complet)}">👤 ${esc(C.nom_complet)}</span>` +
    '<button type="button" class="hbtn" id="kmdp" title="Changer mon mot de passe">🔑</button>' +
    '<button type="button" class="hbtn" id="kdeco" title="Déconnexion">🚪</button>';
  h.append(g);
  document.getElementById('kdeco').addEventListener('click', () => deconnexion());
  document.getElementById('kmdp').addEventListener('click', dialogueMdp);
}

function dialogueMdp() {
  const d = document.createElement('dialog');
  d.style.cssText = 'border:0;border-radius:14px;padding:18px;width:min(92vw,340px);background:var(--c,#fff);color:var(--t,#1b2430)';
  d.innerHTML = '<h3 style="margin:0 0 8px">🔑 Changer mon mot de passe</h3>' +
    '<label>Mot de passe actuel</label><input type="password" id="m0" autocomplete="current-password">' +
    '<label>Nouveau mot de passe (10 caractères min.)</label><input type="password" id="m1" autocomplete="new-password">' +
    '<label>Confirmer le nouveau mot de passe</label><input type="password" id="m2" autocomplete="new-password">' +
    '<p id="me" style="color:#dc2626;font-size:.88rem;min-height:1.2em;margin:8px 0 0;word-break:break-word"></p>' +
    '<div style="display:flex;gap:8px;margin-top:8px"><button id="mo" style="flex:1">Enregistrer</button><button class="sec" id="ma" style="flex:1">Annuler</button></div>';
  document.body.appendChild(d); d.showModal();
  d.addEventListener('close', () => d.remove());
  d.querySelector('#ma').onclick = () => d.close();
  d.querySelector('#mo').onclick = async () => {
    const e = d.querySelector('#me'), bt = d.querySelector('#mo');
    const m0 = d.querySelector('#m0').value, m1 = d.querySelector('#m1').value, m2 = d.querySelector('#m2').value;
    e.textContent = '';
    if (!m0) return e.textContent = 'Saisissez votre mot de passe actuel.';
    if (m1.length < 10) return e.textContent = 'Le nouveau mot de passe doit avoir 10 caractères minimum.';
    if (m1 !== m2) return e.textContent = 'La confirmation ne correspond pas.';
    bt.disabled = true;
    try {
      const { data: { user } } = await sb.auth.getUser();
      const v = await sb.auth.signInWithPassword({ email: user.email, password: m0 });
      if (v.error) throw new Error('Mot de passe actuel incorrect.');
      const u = await sb.auth.updateUser({ password: m1 });
      if (u.error) throw new Error(u.error.message);
      d.close(); alert('Mot de passe modifié.');
    } catch (x) { e.textContent = x.message || String(x); bt.disabled = false; }
  };
}

/* ===== Contexte : établissement + année scolaire (partagés par toutes les pages) ===== */
const KEY = 'kalasa_ctx';
const lireK = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

let ANNEES = [];
try {
  const r = await sb.from('annees_scolaires').select('id, lib, debut, active').order('debut', { ascending: false });
  if (!r.error) ANNEES = r.data || [];
} catch (_) {}
const ACTIVE = ANNEES.find(a => a.active);
let K = lireK();
if (ACTIVE && K.active !== ACTIVE.id) {          // une autre année vient d'être activée : on la suit
  K = { annee: ACTIVE.id, active: ACTIVE.id };
  localStorage.setItem(KEY, JSON.stringify(K));
}
const anneeCourante = () => ANNEES.some(a => a.id === K.annee) ? K.annee : ((ACTIVE || ANNEES[0] || {}).id || null);

/* Aligne un <select> de la page sur la valeur du contexte ; renvoie true si fait */
function aligner(id, v) {
  const s = document.getElementById(id);
  if (!s || !v || ![...s.options].some(o => o.value === v)) return false;
  if (s.value !== v) { s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); }
  return true;
}

function choisirEtab(id) {
  const c = contexte() || {};
  if (!id || c.etabId === id) return;
  garder({ ...c, etabId: id });
  const kb = document.getElementById('kb-e'); if (kb) kb.value = id;
  if (!aligner('etab', id) && document.getElementById('kbar')) { location.reload(); return; }
  dispatchEvent(new CustomEvent('kalasa:ctx', { detail: { etab: id } }));
}
function choisirAnnee(id) {
  if (!id || anneeCourante() === id) return;
  K = { ...K, annee: id };
  localStorage.setItem(KEY, JSON.stringify(K));
  const kb = document.getElementById('kb-a'); if (kb) kb.value = id;
  const a = aligner('annee', id), f = aligner('filtre', id);
  if (!a && !f && document.getElementById('kbar')) { location.reload(); return; }
  dispatchEvent(new CustomEvent('kalasa:ctx', { detail: { annee: id } }));
}

/* ===== Barre sous l'en-tête ===== */
const E = C.etablissements || [];
if (h) {
  const bar = document.createElement('div'); bar.id = 'kbar';
  bar.innerHTML =
    '<label title="Établissement">🏫<select id="kb-e">' +
      (E.length ? E.map(x => `<option value="${esc(x.id)}">${esc(x.nom || x.code)}</option>`).join('') : '<option value="">Aucun établissement</option>') +
    '</select></label>' +
    '<label title="Année scolaire">📅<select id="kb-a">' +
      (ANNEES.length ? ANNEES.map(x => `<option value="${esc(x.id)}">${esc(x.lib)}</option>`).join('') : '<option value="">Aucune année</option>') +
    '</select></label>';
  h.after(bar);
  bar.style.top = h.offsetHeight + 'px';
  const ke = bar.querySelector('#kb-e'), ka = bar.querySelector('#kb-a');
  ke.value = C.etabId || '';
  ka.value = anneeCourante() || '';
  ke.addEventListener('change', () => choisirEtab(ke.value));
  ka.addEventListener('change', () => choisirAnnee(ka.value));
}

/* Si la page change elle-même d'établissement ou d'année, on le mémorise pour les autres pages */
document.addEventListener('change', e => {
  const t = e.target;
  if (!t || !t.value || (t.closest && t.closest('#kbar'))) return;
  if (t.id === 'etab') choisirEtab(t.value);
  else if ((t.id === 'annee' || t.id === 'filtre') && ANNEES.some(a => a.id === t.value)) choisirAnnee(t.value);
});

window.KCTX = {
  get: () => ({ etab: (contexte() || {}).etabId || null, annee: anneeCourante() }),
  set: p => { if (p && p.etab) choisirEtab(p.etab); if (p && p.annee) choisirAnnee(p.annee); }
};