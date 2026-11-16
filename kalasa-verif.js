import { sb } from './kalasa-db.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DEV = localStorage.getItem('kalasa_devise') || 'USD';
const fmt = n => (+n || 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' ' + DEV;
const fmtD = d => d ? String(d).slice(0, 10).split('-').reverse().join('/') : '—';
const nomE = e => e ? [e.nom, e.postnom, e.prenom].filter(Boolean).join(' ') : '';

const st = document.createElement('style');
st.textContent = `
#kv-btn{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:150;border:0;border-radius:99px;background:#2563eb;color:#fff;padding:12px 16px;font-size:.9rem;box-shadow:0 2px 10px #0004;cursor:pointer}
#kv-ov{display:none;position:fixed;inset:0;z-index:200;background:#000b;overflow:auto;padding:16px}
#kv-box{max-width:480px;margin:0 auto;background:var(--c,#fff);color:var(--t,#1b2430);border-radius:14px;padding:16px}
#kv-box h2{margin:0 0 4px;font-size:1.15rem;text-align:center}
#kv-box label{display:block;font-size:.85rem;margin:10px 0 4px;opacity:.8}
#kv-box input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #8885;border-radius:10px;font-size:1rem;background:transparent;color:inherit}
#kv-box button{width:100%;padding:13px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-size:1rem;margin-top:12px;cursor:pointer}
#kv-box button.kv-sec{background:#8883;color:inherit}
.kv-res{border-radius:10px;padding:12px;margin-top:12px;border-left:5px solid #16a34a;background:#16a34a18}
.kv-res.ko{border-left-color:#dc2626;background:#dc262618}
.kv-ln{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #8883;font-size:.88rem}
.kv-ln:last-child{border:0}
.kv-ln b{text-align:right;word-break:break-word}
`;
document.head.appendChild(st);

const btn = document.createElement('button');
btn.id = 'kv-btn'; btn.type = 'button'; btn.textContent = '🔍 Reçu';
const ov = document.createElement('div');
ov.id = 'kv-ov';
ov.innerHTML = `<div id="kv-box">
  <h2>🔍 Vérifier un reçu</h2>
  <form id="kv-f" novalidate>
    <label>Numéro de reçu</label>
    <input id="kv-r" placeholder="REC-2026-00001" autocomplete="off" autocapitalize="characters">
    <label>Code de vérification (6 caractères, sur le reçu)</label>
    <input id="kv-c" placeholder="ABC123" maxlength="6" autocomplete="off" autocapitalize="characters" style="text-transform:uppercase">
    <button id="kv-go">Vérifier</button>
  </form>
  <div id="kv-out"></div>
  <button type="button" class="kv-sec" id="kv-x">Fermer</button>
</div>`;
document.body.appendChild(btn);
document.body.appendChild(ov);

const $ = id => document.getElementById(id);
const ouvrir = () => { ov.style.display = 'block'; $('kv-r').focus(); };
const fermer = () => { ov.style.display = 'none'; };
btn.onclick = ouvrir;
$('kv-x').onclick = fermer;
ov.addEventListener('click', e => { if (e.target === ov) fermer(); });
$('kv-f').addEventListener('submit', async e => {
  e.preventDefault();
  const num = $('kv-r').value.trim().toUpperCase();
  const code = $('kv-c').value.trim().toUpperCase();
  const out = $('kv-out');
  if (!num) { out.innerHTML = '<div class="kv-res ko"><b>Saisissez le numéro de reçu.</b></div>'; return; }
  $('kv-go').disabled = true; out.innerHTML = '<p style="text-align:center">Vérification…</p>';
  try { out.innerHTML = await verifier(num, code); }
  catch (x) { out.innerHTML = '<div class="kv-res ko"><b>❌ Vérification impossible</b><p>' + esc(x.message || x) + '</p></div>'; }
  $('kv-go').disabled = false;
});

async function verifier(num, code) {
  const { data: ps, error } = await sb.from('paiements').select('*').eq('recu', num);
  if (error) throw error;
  if (!ps || !ps.length) {
    return '<div class="kv-res ko"><b>❌ Reçu introuvable</b><p>Aucun reçu accessible ne correspond à ce numéro.</p></div>';
  }
  const bons = code ? ps.filter(p => String(p.empreinte || '').toUpperCase() === code) : ps;
  if (!bons.length) {
    return '<div class="kv-res ko"><b>❌ Code de vérification incorrect</b><p>Le numéro existe mais le code saisi ne correspond pas.</p></div>';
  }
  const uniq = k => [...new Set(bons.map(p => p[k]).filter(Boolean))];
  const lire = async (table, cols, ids) => {
    if (!ids.length) return new Map();
    const { data } = await sb.from(table).select(cols).in('id', ids);
    return new Map((data || []).map(x => [x.id, x]));
  };
  const [INS, FRA, ETS] = await Promise.all([
    lire('inscriptions', 'id, matricule, nom, postnom, prenom', uniq('inscription_id')),
    lire('frais', '*', uniq('frais_id')),
    lire('etablissements', 'id, nom', uniq('etablissement_id'))
  ]);
  return bons.map(p => {
    const el = INS.get(p.inscription_id), fr = FRA.get(p.frais_id) || {}, et = ETS.get(p.etablissement_id);
    return `<div class="kv-res"><b>✔ Reçu authentique</b>
      <div class="kv-ln"><span>Numéro</span><b>${esc(p.recu)}</b></div>
      <div class="kv-ln"><span>Code</span><b>${esc(p.empreinte || '—')}</b></div>
      <div class="kv-ln"><span>Date</span><b>${esc(fmtD(p.date_paiement))}</b></div>
      <div class="kv-ln"><span>Établissement</span><b>${esc(et ? et.nom : '—')}</b></div>
      <div class="kv-ln"><span>Élève</span><b>${esc(nomE(el) || '—')}</b></div>
      <div class="kv-ln"><span>Matricule</span><b>${esc(el ? el.matricule : '—')}</b></div>
      <div class="kv-ln"><span>Motif</span><b>${esc(fr.lib ?? fr.libelle ?? fr.nom ?? '—')}</b></div>
      <div class="kv-ln"><span>Montant</span><b>${esc(fmt(p.montant))}</b></div>
      <div class="kv-ln"><span>Mode</span><b>${esc(p.mode || '—')}</b></div>
    </div>`;
  }).join('');
}