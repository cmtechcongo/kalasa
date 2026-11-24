/* ============================================================
   BULLETIN-UNIV.JS — Relevé de notes (niveau Université, LMD)
   À charger APRÈS bulletin-modele.js (et bulletin-primaire.js) :
     <script src="bulletin-modele.js"></script>
     <script src="bulletin-primaire.js"></script>
     <script src="bulletin-univ.js"></script>
   Modèle : REL-UNIV  (« Relevé de notes · Université »)
   Choix : « Modèle de bulletin » de la classe, sinon automatique
   pour toute classe de niveau Université.
   Le relevé se télécharge directement en PDF (jsPDF + html2canvas).
   Règles de calcul (à régler dans REGLES) :
     crédits = coefficient de la matière · VH = crédits × 25
     note /20 = moyenne des sessions saisies (S1, S2), ramenée sur 20
     pondérée = note × crédits · validé si note ≥ 10
     moyenne annuelle = total pondérées ÷ total crédits
   ============================================================ */
(function (global) {
  'use strict';

  const REGLES = {
    heuresParCredit: 25,          // VH = crédits × 25
    seuilValidation: 10,          // note /20 minimale pour valider une matière
    sections: ['S1', 'S2'],       // codes de notes KALASA (1ère et 2ème session)
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
.bulletin.releve .rentete{display:grid;grid-template-columns:90px 1fr 100px;align-items:center;gap:10px}
.bulletin.releve .rlogo{width:80px;height:80px;display:flex;align-items:center;justify-content:center;overflow:hidden}.bulletin.releve .rlogo img{max-width:100%;max-height:100%;object-fit:contain;display:block}
.bulletin.releve .rtitre{text-align:center;line-height:1.3}
.bulletin.releve .rinst{font:900 17px Arial,sans-serif}.bulletin.releve .rsigle{font:bold 15px Arial,sans-serif}.bulletin.releve .rrdc{font:bold 14px Arial,sans-serif}
.bulletin.releve .rrel{font:bold 15px Arial,sans-serif;text-decoration:underline;margin-top:4px}.bulletin.releve .rpresc{font:bold 12px Arial,sans-serif}
.bulletin.releve .rphoto{width:90px;height:100px;border:2px solid #1a1a1a;display:flex;align-items:center;justify-content:center;font:bold 13px Arial,sans-serif;justify-self:end;overflow:hidden}.bulletin.releve .rphoto img{width:100%;height:100%;object-fit:cover}
.bulletin.releve .ridentite{margin:14px 0 8px;font:13px Arial,sans-serif;line-height:1.8}.bulletin.releve .rligne{display:flex;flex-wrap:wrap;gap:4px 28px}
.bulletin.releve h2{text-align:center;font:15px Arial,sans-serif;margin:12px 0 6px}
.bulletin.releve table{width:100%;border-collapse:collapse;font:11.5px Arial,sans-serif;table-layout:fixed}
.bulletin.releve th,.bulletin.releve td{border:1px solid #444;padding:3px 4px;text-align:center;overflow:hidden}
.bulletin.releve thead th{background:#e9e6df;font-weight:700}.bulletin.releve td.rmat{text-align:left;font-weight:700}
.bulletin.releve tr.rtotal td{font-weight:700;font-size:13px;background:#e9e6df}.bulletin.releve .rnv{font-weight:700}
.bulletin.releve.dense table{font-size:10px}.bulletin.releve.dense th,.bulletin.releve.dense td{padding:1px 3px}
.bulletin.releve .rbas{display:flex;justify-content:space-between;gap:20px;margin-top:14px;font:13px Arial,sans-serif}
.bulletin.releve .rresume{display:grid;grid-template-columns:auto auto;column-gap:14px;row-gap:3px;margin:0}.bulletin.releve .rresume dt{font-weight:700}.bulletin.releve .rresume dd{margin:0}
.bulletin.releve .rsignature{text-align:center;align-self:flex-end;font-size:12px;line-height:1.6;min-width:230px}.bulletin.releve .rsignature .rparafe{height:34px}
.bulletin.releve .rlegende{display:flex;justify-content:space-between;font:11px Arial,sans-serif;margin-top:12px}
.bulletin.releve .rnb{text-align:center;font-style:italic;font-size:12px;margin-top:14px}
.bulletin-overlay{position:fixed;inset:0;background:#e5e5e5;z-index:9999;display:none;overflow:auto;padding:12px}
.bulletin-overlay.show{display:block}
.bulletin-overlay .bo-bar{position:sticky;top:0;background:#fff;padding:8px;display:flex;gap:8px;border-radius:8px;margin-bottom:10px;box-shadow:0 2px 6px #0003;z-index:10}
.bulletin-overlay .bo-bar button{flex:1;padding:12px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:600;cursor:pointer}
.bulletin-overlay .bo-bar button.sec{background:#8885;color:#000}
.bulletin-overlay .bo-wrap{margin:0 auto;overflow:hidden}
.bulletin-overlay .bo-sheet{transform-origin:top left;width:794px;height:1123px}
@media print{body>*:not(.bulletin-overlay){display:none!important}.bulletin-overlay{position:static;padding:0;background:#fff}.bulletin-overlay .bo-bar{display:none!important}.bulletin-overlay .bo-wrap{width:210mm!important;height:297mm!important}.bulletin-overlay .bo-sheet{transform:none!important}@page{size:A4 portrait;margin:0}}`;

  const MODELES = { 'REL-UNIV': { type: 'universite', label: 'Relevé de notes · Université (LMD)', ref: 'RELEVE' } };

  /* Calcule le relevé d'un étudiant à partir des données de note.html / espace-eleve.html. */
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
    const fd = d => d ? String(d).split('-').reverse().join('/') : '';
    const naiss = eleve.naiss || fd(eleve.date_naissance), lieu = eleve.lieuNaiss || eleve.lieu_naissance || '';
    const pho = eleve.photo || eleve.photo_url || '';
    const photo = pho ? `<img src="${esc(pho)}" alt="">` : 'PHOTO';
    const lignes = R.lignes.map((l, i) => `<tr><td>${i + 1}</td><td></td><td class="rmat">${esc(String(l.nom).toUpperCase())}</td><td>${fr(l.vh)}</td><td>${fr(l.cr)}</td><td>${fr(l.note, 2)}</td><td>${fr(l.pond, 1)}</td><td${l.valide === 'NV' ? ' class="rnv"' : ''}>${l.valide}</td><td>${fr(l.crValides)}</td></tr>`).join('');
    const decision = REGLES.decision ? REGLES.decision(R) : (data.decision || '');
    const filiere = classe.option || classe.option_faculte || classe.faculte || '';
    return `<div class="bulletin releve${R.lignes.length > 22 ? ' dense' : ''}">
<div class="rentete"><div class="rlogo"><img src="${esc(etab.logo || 'logo-etab.jpeg')}" alt="" onerror="this.style.display='none'"></div>
<div class="rtitre"><div class="rinst">${esc(String(etab.nom || '').toUpperCase())}</div>${etab.sigle ? `<div class="rsigle">${esc(etab.sigle)}</div>` : ''}
<div class="rrdc">REPUBLIQUE DEMOCRATIQUE DU CONGO</div>${filiere ? `<div>Section : ${esc(filiere)}</div>` : ''}
<div class="rrel">RELEVE DE NOTES</div><div class="rpresc">${esc(classe.nom || '')} - ${REGLES.libelleSections}</div></div>
<div class="rphoto">${photo}</div></div>
<div class="ridentite"><div class="rligne"><span><b>Année universitaire :</b> ${esc(annee)}</span></div>
<div class="rligne"><span><b>Nom :</b> ${esc([eleve.nom, eleve.postnom, eleve.prenom].filter(Boolean).join(' '))}</span></div>
<div class="rligne"><span><b>Matricule :</b> ${esc(eleve.matricule || '')}</span><span><b>Né(e) à :</b> ${esc(lieu)}, le ${esc(naiss)}</span><span><b>Sexe :</b> ${esc(eleve.sexe || '')}</span></div>
<div class="rligne"><span><b>Domaine :</b> ${esc(classe.domaine || '')}</span><span><b>Filière :</b> ${esc(filiere)}</span></div></div>
<h2>Unités d'enseignement (UE) et Eléments constitutifs de l'UE (ECUE)</h2>
<table><colgroup><col style="width:5%"><col style="width:13%"><col style="width:30%"><col style="width:8%"><col style="width:8%"><col style="width:9%"><col style="width:10%"><col style="width:8%"><col style="width:9%"></colgroup>
<thead><tr><th rowspan="2">N°</th><th rowspan="2">CODE DE L'UE / ECUE</th><th rowspan="2">MATIERES</th><th rowspan="2">VH</th><th rowspan="2">Crédits</th><th colspan="4">Résultats obtenus</th></tr>
<tr><th>notes sur 20</th><th>notes Pondérées</th><th>Validité</th><th>CR VALIDES</th></tr></thead>
<tbody>${lignes}</tbody>
<tfoot><tr class="rtotal"><td colspan="3">total</td><td>${fr(R.vh)}</td><td>${fr(R.crTot)}</td><td></td><td>${fr(R.pond, 1)}</td><td></td><td>${fr(R.crVal)}</td></tr></tfoot></table>
<div class="rbas"><dl class="rresume">
<dt>Total volume Horaire Annuel :</dt><dd>${fr(R.vh)}</dd><dt>Nombre total de Crédit Annuel :</dt><dd>${fr(R.crTot)}</dd>
<dt>Crédits Validés :</dt><dd>${fr(R.crVal)}</dd><dt>Moyenne annuelle :</dt><dd>${fr(R.moyenne, 2)}</dd>
<dt>Mention Obtenue :</dt><dd>${esc(R.mention)}</dd><dt>Décision de Jury :</dt><dd>${esc(decision)}</dd></dl>
<div class="rsignature">Le Chef de Section P.O<br><div class="rparafe"></div>${esc(etab.signataire || etab.chef_section || '')}</div></div>
<div class="rlegende"><span>NV: Crédit Non Validé</span><span>V: crédit Validé</span><span>VH: volume horaire</span><span>Vc : crédit Validé par Compensation</span></div>
<p class="rnb">N.B. : Ce relevé est délivré sans rature ni surcharge et certifié exact d'après les grilles du Premier &amp; Deuxième Semestre</p></div>`;
  }

  /* ---------- Branchement sur BULLETIN ---------- */
  const B = global.BULLETIN = global.BULLETIN || {};
  const vieux = { dispo: B.estDisponible, render: B.render, ouvrir: B.ouvrir };
  const choix = c => c && (c.modeleBulletin || c.modele_bulletin);   // note.html (modele_bulletin) ou espace-eleve (modeleBulletin)
  const estUniv = c => !!c && (choix(c) === 'REL-UNIV' || (!choix(c) && /univers/.test(norm(c.type || c.niveau))));

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

  /* ---------- Téléchargement direct en PDF (jsPDF + html2canvas, comme « Tous les bulletins ») ---------- */
  const chargerLib = (src, ok) => new Promise(res => {
    if (ok()) return res(true);
    const s = document.createElement('script');
    s.src = src; s.onload = () => res(ok()); s.onerror = () => res(false);
    document.head.appendChild(s);
  });
  const libsPdf = async () =>
    await chargerLib('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => !!(global.jspdf && global.jspdf.jsPDF)) &&
    await chargerLib('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', () => typeof global.html2canvas === 'function');

  function infoBulle(txt) {                       // petit message à l'écran pendant la création
    let b = document.getElementById('releve-info');
    if (!txt) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.id = 'releve-info'; b.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111;color:#fff;padding:12px 18px;border-radius:10px;font:600 14px Arial,sans-serif;z-index:100000;max-width:90%;text-align:center'; document.body.appendChild(b); }
    b.textContent = txt;
  }

  async function telechargerPDF(d) {
    const e = d.eleve || {};
    const fichier = ('Releve_' + [e.nom, e.postnom, e.prenom].filter(Boolean).join('_') + '_' + (d.annee || '')).replace(/[\\/:*?"<>|\s]+/g, '_').replace(/_+$/, '') + '.pdf';
    infoBulle('⏳ Création du PDF du relevé…');
    try {
      if (!(await libsPdf())) throw new Error('Module PDF indisponible (connexion nécessaire la première fois).');
      injecterCss();
      const h = document.createElement('div');
      h.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff';
      h.innerHTML = renderReleve(d);
      document.body.appendChild(h);
      try {
        const el = h.firstElementChild;
        el.style.height = 'auto'; el.style.overflow = 'visible';            // relevé long : on mesure tout le contenu
        await new Promise(r => setTimeout(r, 120));
        const H = Math.max(1123, el.scrollHeight), echelle = innerWidth < 800 ? 1.5 : 2;
        const prendre = () => global.html2canvas(h, { scale: echelle, backgroundColor: '#ffffff', useCORS: true, logging: false, scrollX: 0, scrollY: 0, windowWidth: 794, width: 794, height: H });
        let cv = await prendre();
        try { cv.toDataURL('image/jpeg', .9); }                              // image externe bloquée ? on refait sans images
        catch (_) { h.querySelectorAll('img').forEach(i => i.remove()); cv = await prendre(); }
        const { jsPDF } = global.jspdf, pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
        pdf.setProperties({ title: 'Relevé de notes ' + [e.nom, e.postnom, e.prenom].filter(Boolean).join(' ') });
        const pageH = Math.round(cv.width * 297 / 210), pages = Math.max(1, Math.ceil(cv.height / pageH));
        for (let p = 0; p < pages; p++) {                                    // coupe en pages A4 si le relevé est long
          const hh = Math.min(pageH, cv.height - p * pageH), part = document.createElement('canvas');
          part.width = cv.width; part.height = hh;
          const cx = part.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, part.width, part.height);
          cx.drawImage(cv, 0, p * pageH, cv.width, hh, 0, 0, cv.width, hh);
          if (p > 0) pdf.addPage();
          pdf.addImage(part.toDataURL('image/jpeg', .92), 'JPEG', 0, 0, 210, 297 * hh / pageH, undefined, 'FAST');
        }
        pdf.save(fichier);
      } finally { h.remove(); }
      infoBulle('✅ ' + fichier); setTimeout(() => infoBulle(''), 3500);
      return true;
    } catch (err) {
      console.error(err); infoBulle('');
      throw err;
    }
  }

  /* Aperçu + impression (secours si le PDF direct est impossible, ex. hors connexion la 1ère fois) */
  function apercu(d) {
    injecterCss();
    let ov = document.getElementById('bulletinOverlay');
    if (!ov) { ov = document.createElement('div'); ov.id = 'bulletinOverlay'; ov.className = 'bulletin-overlay'; document.body.appendChild(ov); }
    ov.innerHTML = `<div class="bo-bar"><button onclick="BULLETIN.pdfReleve(window.__releveData)">⬇ Télécharger le PDF</button><button class="sec" onclick="window.print()">🖨 Imprimer</button><button class="sec" onclick="document.getElementById('bulletinOverlay').classList.remove('show')">Fermer</button></div><div class="bo-wrap"><div class="bo-sheet">${renderReleve(d)}</div></div>`;
    global.__releveData = d;
    ov.classList.add('show'); ajuster(); window.scrollTo(0, 0);
  }

  B.MODELES_UNIV = MODELES; B.REGLES_UNIV = REGLES;
  B.pdfReleve = d => telechargerPDF(d).catch(err => alert('Création du PDF impossible : ' + (err && err.message || err)));
  B.estDisponible = c => estUniv(c) ? true : (vieux.dispo ? vieux.dispo(c) : false);
  B.render = d => { if (estUniv(d.classe)) { injecterCss(); return renderReleve(d); } return vieux.render(d); };
  B.ouvrir = d => {
    if (!estUniv(d && d.classe)) return vieux.ouvrir(d);
    /* Relevé universitaire : téléchargement direct en PDF ; sinon aperçu avec boutons PDF / impression */
    return telechargerPDF(d).catch(err => { console.error(err); apercu(d); });
  };
  addEventListener('resize', ajuster);
  if (typeof B.MOTIF === 'string') B.MOTIF = B.MOTIF.replace(/\.$/, '') + ' ; ' + MODELES['REL-UNIV'].label + '.';
  if (B.MODELES && typeof B.MODELES === 'object' && !B.MODELES['REL-UNIV']) B.MODELES['REL-UNIV'] = { label: MODELES['REL-UNIV'].label, ref: 'RELEVE', type: 'universite' };
  if (typeof document !== 'undefined' && document.head) injecterCss();
})(window);