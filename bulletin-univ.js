/* ============================================================
   BULLETIN-UNIV.JS — Relevé de notes (niveau Université, LMD)
   À charger APRÈS bulletin-modele.js (et bulletin-primaire.js) :
     <script src="bulletin-modele.js"></script>
     <script src="bulletin-primaire.js"></script>
     <script src="bulletin-univ.js"></script>
   Modèle : REL-UNIV  (« Relevé de notes · Université »)
   Choix : « Modèle de bulletin » de la classe, sinon automatique
   pour toute classe de niveau Université.
   Règles de calcul (à régler dans REGLES) :
     crédits = coefficient de la matière · VH = crédits × 25
     note /20 = moyenne des sections saisies (S1, S2), ramenée sur 20
     pondérée = note × crédits · validé si note ≥ 10
     moyenne annuelle = total pondérées ÷ total crédits
   ============================================================ */
(function (global) {
  'use strict';

  const REGLES = {
    heuresParCredit: 25,          // VH = crédits × 25
    seuilValidation: 10,          // note /20 minimale pour valider une matière
    sections: ['S1', 'S2'],       // codes de notes KALASA (PER_UNI de note.html)
    libelleSections: 'Semestre 1 & 2',
    // Mentions : 10–11,99 = « Passable (E) » (confirmé par votre relevé). Autres seuils à confirmer.
    mentions: [[16, 'Excellent (A)'], [14, 'Très bien (B)'], [12, 'Bien (C)'], [10, 'Passable (E)'], [0, 'Insuffisant (F)']],
    decision: null                // ex. d => d.nonValides ? 'COMP' : 'ADM'  (sinon : case vide pour le jury)
  };

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fr = (v, d = 2) => (v === null || v === undefined || v === '' || isNaN(v)) ? '' : String(Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).replace('.', ',');
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const CSS = `
.bulletin.releve,.bulletin.releve *{box-sizing:border-box}
.bulletin.releve{position:relative;width:794px;height:1123px;overflow:hidden;background:#fff;color:#1a1a1a;padding:40px 34px;font-family:"Times New Roman",Times,serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.releve .entete{display:grid;grid-template-columns:90px 1fr 100px;align-items:center;gap:10px}
.releve .logo{width:80px;height:80px;display:flex;align-items:center;justify-content:center;overflow:hidden}.releve .logo img{max-width:100%;max-height:100%;object-fit:contain;display:block}
.releve .titre{text-align:center;line-height:1.3}
.releve .inst{font:900 17px Arial,sans-serif}.releve .sigle{font:bold 15px Arial,sans-serif}.releve .rdc{font:bold 14px Arial,sans-serif}
.releve .rel{font:bold 15px Arial,sans-serif;text-decoration:underline;margin-top:4px}.releve .presc{font:bold 12px Arial,sans-serif}
.releve .photo{width:90px;height:100px;border:2px solid #1a1a1a;display:flex;align-items:center;justify-content:center;font:bold 13px Arial,sans-serif;justify-self:end;overflow:hidden}.releve .photo img{width:100%;height:100%;object-fit:cover}
.releve .identite{margin:14px 0 8px;font:13px Arial,sans-serif;line-height:1.8}.releve .ligne{display:flex;flex-wrap:wrap;gap:4px 28px}
.releve h2{text-align:center;font:15px Arial,sans-serif;margin:12px 0 6px}
.releve table{width:100%;border-collapse:collapse;font:11.5px Arial,sans-serif;table-layout:fixed}
.releve th,.releve td{border:1px solid #444;padding:3px 4px;text-align:center;overflow:hidden}
.releve thead th{background:#e9e6df;font-weight:700}.releve td.mat{text-align:left;font-weight:700}
.releve tr.total td{font-weight:700;font-size:13px;background:#e9e6df}.releve .nv{font-weight:700}
.releve.dense table{font-size:10px}.releve.dense th,.releve.dense td{padding:1px 3px}
.releve .bas{display:flex;justify-content:space-between;gap:20px;margin-top:14px;font:13px Arial,sans-serif}
.releve .resume{display:grid;grid-template-columns:auto auto;column-gap:14px;row-gap:3px;margin:0}.releve .resume dt{font-weight:700}.releve .resume dd{margin:0}
.releve .signature{text-align:center;align-self:flex-end;font-size:12px;line-height:1.6;min-width:230px}.releve .signature .parafe{height:34px}
.releve .legende{display:flex;justify-content:space-between;font:11px Arial,sans-serif;margin-top:12px}
.releve .nb{text-align:center;font-style:italic;font-size:12px;margin-top:14px}
.bulletin-overlay{position:fixed;inset:0;background:#e5e5e5;z-index:9999;display:none;overflow:auto;padding:12px}
.bulletin-overlay.show{display:block}
.bulletin-overlay .bo-bar{position:sticky;top:0;background:#fff;padding:8px;display:flex;gap:8px;border-radius:8px;margin-bottom:10px;box-shadow:0 2px 6px #0003;z-index:10}
.bulletin-overlay .bo-bar button{flex:1;padding:12px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:600;cursor:pointer}
.bulletin-overlay .bo-bar button.sec{background:#8885;color:#000}
.bulletin-overlay .bo-wrap{margin:0 auto;overflow:hidden}
.bulletin-overlay .bo-sheet{transform-origin:top left;width:794px;height:1123px}
@media print{body>*:not(.bulletin-overlay){display:none!important}.bulletin-overlay{position:static;padding:0;background:#fff}.bulletin-overlay .bo-bar{display:none!important}.bulletin-overlay .bo-wrap{width:210mm!important;height:297mm!important}.bulletin-overlay .bo-sheet{transform:none!important}@page{size:A4 portrait;margin:0}}`;

  const MODELES = { 'REL-UNIV': { type: 'universite', label: 'Relevé de notes · Université (LMD)', ref: 'RELEVE' } };

  /* Calcule le relevé d'un étudiant à partir des données de note.html. */
  function calculer(data) {
    const { eleve = {}, notes = {}, matieres = [] } = data;
    const lignes = matieres.map(m => {
      const max = +m.max || 20, cr = +m.coef || 0;
      const v = REGLES.sections.map(s => (notes[m.id + '_' + s] || {})[eleve.id]).filter(x => x !== undefined && x !== null && x !== '' && !isNaN(x)).map(x => +x / max * 20);
      const note = v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
      const ok = note !== null && note >= REGLES.seuilValidation;
      return { nom: m.nom, cr, vh: cr * REGLES.heuresParCredit, note, pond: note === null ? null : note * cr, valide: note === null ? '' : (ok ? 'V' : 'NV'), crValides: ok ? cr : null };
    });
    const somme = k => lignes.reduce((s, l) => s + (l[k] || 0), 0);
    const crTot = somme('cr'), crVal = somme('crValides'), pond = somme('pond');
    const crNotes = lignes.filter(l => l.note !== null).reduce((s, l) => s + l.cr, 0);
    const moyenne = crNotes ? pond / crNotes : null;
    const ment = moyenne === null ? '' : (REGLES.mentions.find(x => moyenne >= x[0]) || [0, ''])[1];
    return { lignes, vh: somme('vh'), crTot, crVal, pond, moyenne, mention: ment, nonValides: lignes.filter(l => l.valide === 'NV').length };
  }

  function renderReleve(data) {
    const { eleve = {}, classe = {}, etab = {}, annee = '' } = data;
    const R = calculer(data);
    const photo = eleve.photo ? `<img src="${esc(eleve.photo)}" alt="">` : 'PHOTO';
    const lignes = R.lignes.map((l, i) => `<tr><td>${i + 1}</td><td></td><td class="mat">${esc(String(l.nom).toUpperCase())}</td><td>${fr(l.vh)}</td><td>${fr(l.cr)}</td><td>${fr(l.note, 2)}</td><td>${fr(l.pond, 1)}</td><td${l.valide === 'NV' ? ' class="nv"' : ''}>${l.valide}</td><td>${fr(l.crValides)}</td></tr>`).join('');
    const decision = REGLES.decision ? REGLES.decision(R) : (data.decision || '');
    const filiere = classe.option || classe.option_faculte || classe.faculte || '';
    return `<div class="bulletin releve${R.lignes.length > 22 ? ' dense' : ''}">
<header class="entete"><div class="logo"><img src="${esc(etab.logo || 'logo-etab.jpeg')}" alt=""></div>
<div class="titre"><div class="inst">${esc(String(etab.nom || '').toUpperCase())}</div>${etab.sigle ? `<div class="sigle">${esc(etab.sigle)}</div>` : ''}
<div class="rdc">REPUBLIQUE DEMOCRATIQUE DU CONGO</div>${filiere ? `<div>Section : ${esc(filiere)}</div>` : ''}
<div class="rel">RELEVE DE NOTES</div><div class="presc">${esc(classe.nom || '')} - ${REGLES.libelleSections}</div></div>
<div class="photo">${photo}</div></header>
<section class="identite"><div class="ligne"><span><b>Année universitaire :</b> ${esc(annee)}</span></div>
<div class="ligne"><span><b>Nom :</b> ${esc([eleve.nom, eleve.postnom, eleve.prenom].filter(Boolean).join(' '))}</span></div>
<div class="ligne"><span><b>Matricule :</b> ${esc(eleve.matricule || '')}</span><span><b>Né(e) à :</b> ${esc(eleve.lieuNaiss || '')}, le ${esc(eleve.naiss || '')}</span><span><b>Sexe :</b> ${esc(eleve.sexe || '')}</span></div>
<div class="ligne"><span><b>Domaine :</b> ${esc(classe.domaine || '')}</span><span><b>Filière :</b> ${esc(filiere)}</span></div></section>
<h2>Unités d'enseignement (UE) et Eléments constitutifs de l'UE (ECUE)</h2>
<table><colgroup><col style="width:5%"><col style="width:13%"><col style="width:30%"><col style="width:8%"><col style="width:8%"><col style="width:9%"><col style="width:10%"><col style="width:8%"><col style="width:9%"></colgroup>
<thead><tr><th rowspan="2">N°</th><th rowspan="2">CODE DE L'UE / ECUE</th><th rowspan="2">MATIERES</th><th rowspan="2">VH</th><th rowspan="2">Crédits</th><th colspan="4">Résultats obtenus</th></tr>
<tr><th>notes sur 20</th><th>notes Pondérées</th><th>Validité</th><th>CR VALIDES</th></tr></thead>
<tbody>${lignes}</tbody>
<tfoot><tr class="total"><td colspan="3">total</td><td>${fr(R.vh)}</td><td>${fr(R.crTot)}</td><td></td><td>${fr(R.pond, 1)}</td><td></td><td>${fr(R.crVal)}</td></tr></tfoot></table>
<section class="bas"><dl class="resume">
<dt>Total volume Horaire Annuel :</dt><dd>${fr(R.vh)}</dd><dt>Nombre total de Crédit Annuel :</dt><dd>${fr(R.crTot)}</dd>
<dt>Crédits Validés :</dt><dd>${fr(R.crVal)}</dd><dt>Moyenne annuelle :</dt><dd>${fr(R.moyenne, 2)}</dd>
<dt>Mention Obtenue :</dt><dd>${esc(R.mention)}</dd><dt>Décision de Jury :</dt><dd>${esc(decision)}</dd></dl>
<div class="signature">Le Chef de Section P.O<br><div class="parafe"></div>${esc(etab.signataire || '')}</div></section>
<div class="legende"><span>NV: Crédit Non Validé</span><span>V: crédit Validé</span><span>VH: volume horaire</span><span>Vc : crédit Validé par Compensation</span></div>
<p class="nb">N.B. : Ce relevé est délivré sans rature ni surcharge et certifié exact d'après les grilles du Premier &amp; Deuxième Semestre</p></div>`;
  }

  /* ---------- Branchement sur BULLETIN ---------- */
  const B = global.BULLETIN = global.BULLETIN || {};
  const vieux = { dispo: B.estDisponible, render: B.render, ouvrir: B.ouvrir };
  const estUniv = c => !!c && (c.modeleBulletin === 'REL-UNIV' || (!c.modeleBulletin && /univers/.test(norm(c.type || c.niveau))));

  function injecterCss() {
    if (document.getElementById('bulletin-univ-css')) return;
    const st = document.createElement('style'); st.id = 'bulletin-univ-css'; st.textContent = CSS; document.head.appendChild(st);
  }
  function ajuster() {
    const ov = document.getElementById('bulletinOverlay'); if (!ov) return;
    const w = ov.querySelector('.bo-wrap'), s = ov.querySelector('.bo-sheet'); if (!w || !s) return;
    const k = Math.min(1, (ov.clientWidth - 24) / 794);
    s.style.transform = 'scale(' + k + ')'; w.style.width = (794 * k) + 'px'; w.style.height = (1123 * k) + 'px';
  }

  B.MODELES_UNIV = MODELES; B.REGLES_UNIV = REGLES;
  B.estDisponible = c => estUniv(c) ? true : (vieux.dispo ? vieux.dispo(c) : false);
  B.render = d => { if (estUniv(d.classe)) { injecterCss(); return renderReleve(d); } return vieux.render(d); };
  B.ouvrir = d => {
    if (!estUniv(d && d.classe)) return vieux.ouvrir(d);
    injecterCss();
    let ov = document.getElementById('bulletinOverlay');
    if (!ov) { ov = document.createElement('div'); ov.id = 'bulletinOverlay'; ov.className = 'bulletin-overlay'; document.body.appendChild(ov); }
    ov.innerHTML = `<div class="bo-bar"><button onclick="window.print()">🖨 Imprimer / PDF</button><button class="sec" onclick="document.getElementById('bulletinOverlay').classList.remove('show')">Fermer</button></div><div class="bo-wrap"><div class="bo-sheet">${renderReleve(d)}</div></div>`;
    ov.classList.add('show'); ajuster(); window.scrollTo(0, 0);
    return true;
  };
  addEventListener('resize', ajuster);
  if (typeof B.MOTIF === 'string') B.MOTIF = B.MOTIF.replace(/\.$/, '') + ' ; ' + MODELES['REL-UNIV'].label + '.';
  if (B.MODELES && typeof B.MODELES === 'object' && !B.MODELES['REL-UNIV']) B.MODELES['REL-UNIV'] = { label: MODELES['REL-UNIV'].label, ref: 'RELEVE', type: 'universite' };
  if (typeof document !== 'undefined' && document.head) injecterCss();
})(window);