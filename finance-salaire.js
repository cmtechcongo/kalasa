/* KALASA — module « Salaire » (paiement du personnel), branché sur finance.html */
import { enteteHtml, signaturesHtml } from './kalasa-doc.js';

export async function init(K) {
  const { sb, $, esc, fmt, fmtP, fmtD, today, peut, csv, pdfTable, afficherRecu, qrUrl, empreinte, prochainRecu, toutLire, erreur, etabCourant, txtSel, C } = K;
  const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const TYPES = { salaire: 'Salaire', prime: 'Prime', allocation: 'Allocation', autres: 'Autres' };
  let PERS = [], SAL = [], DEJA = new Set(), persSel = null, lastEtab = null, etabChange = true;

  const nomP = p => [p.nom, p.postnom, p.prenom].filter(Boolean).join(' ');
  const numMat = m => +String(m || '').split('-').pop() || 0;
  const montantType = (p, t) => t === 'autres' ? 0 : (+p[t] || 0);
  const cle = (pid, t, m, a) => pid + '|' + t + '|' + m + '|' + a;
  const dejaPaye = (pid, t, m, a) => t !== 'autres' && DEJA.has(cle(pid, t, m, a));

  /* ===== Interface ===== */
  $('pR').innerHTML = `
  <form class="card" id="fSal" novalidate>
    <h2>Payer le personnel</h2>
    <label>Recherche intelligente (matricule ou nom) *</label>
    <input id="salSearch" placeholder="Ex : PER-0001, 1, ou nom du personnel…" autocomplete="off">
    <div id="salRes" style="display:flex;flex-direction:column;gap:6px;margin-top:6px"></div>
    <div id="salInfo" style="min-height:1.2em;padding:2px 4px;font-size:.8rem"></div>
    <label>Nom du personnel</label><input id="salNom" readonly placeholder="Affiché automatiquement">
    <label>Type de paiement *</label>
    <select id="salType"><option value="">Choisir…</option><option value="salaire">Salaire</option><option value="prime">Prime</option>
      <option value="allocation">Allocation</option><option value="autres">Autres</option></select>
    <div id="salMotifBox" style="display:none"><label>Motif *</label>
      <input id="salMotif" placeholder="Ex : Heures supplémentaires, avance, remboursement…" autocomplete="off"></div>
    <div class="g">
      <div><label>Montant *</label><input id="salMont" type="number" min="0.01" step="any" inputmode="decimal" readonly placeholder="Automatique"></div>
      <div><label>Mois *</label><select id="salMois"></select></div>
    </div>
    <div class="g">
      <div><label>Année *</label><input id="salAn" type="number" min="2000" max="2100"></div>
      <div><label>Date du paiement *</label><input id="salDate" type="date"></div>
    </div>
    <label>Mode</label><select id="salMode"><option>Espèces</option><option>Mobile Money</option><option>Banque</option><option>Autre</option></select>
    <div id="salMsg" style="min-height:1.2em;margin-top:8px;font-size:.85rem;color:#dc2626"></div>
    <div class="acts"><button id="salBtn" disabled>Payer et générer le reçu</button></div>
  </form>
  <div class="card">
    <h3>Historique des paiements</h3>
    <div class="filtres">
      <div><label>Mois</label><select id="salHm"></select></div>
      <div><label>Année</label><input id="salHa" type="number" min="2000" max="2100"></div>
      <div><button type="button" class="sec" id="salCsv">⬇ CSV</button></div>
      <div><button type="button" class="sec" id="salPdf">📄 PDF</button></div>
    </div>
    <p id="salTot" style="margin-top:10px;font-weight:600"></p>
  </div>
  <div class="card" id="salNon" style="display:none"></div>
  <div id="salListe"></div>`;

  const optsMois = MOIS.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('');
  const h = new Date();
  $('salMois').innerHTML = optsMois;
  $('salHm').innerHTML = '<option value="0">Tous les mois</option>' + optsMois;
  $('salMois').value = h.getMonth() + 1; $('salHm').value = h.getMonth() + 1;
  $('salAn').value = h.getFullYear(); $('salHa').value = h.getFullYear();
  $('salDate').value = today();

  /* ===== Données ===== */
  async function charger() {
    const e = K.etabId(), a = K.anneeId();
    PERS = []; SAL = []; DEJA = new Set();
    if (e) {
      try {
        const rp = await sb.from('personnel').select('id, matricule, nom, postnom, prenom, fonction, salaire, prime, allocation').eq('etablissement_id', e).order('nom');
        if (!rp.error) PERS = rp.data || [];
        if (a) SAL = await toutLire(() => sb.from('salaires').select('*').eq('etablissement_id', e).eq('annee_id', a).order('date_paiement', { ascending: false }).order('id'));
        const tous = await toutLire(() => sb.from('salaires').select('personnel_id, type, mois, an').eq('etablissement_id', e).neq('type', 'autres').order('id'));
        tous.forEach(s => DEJA.add(cle(s.personnel_id, s.type, s.mois, s.an)));
      } catch (x) { erreur('Lecture des salaires impossible : ' + esc(x.message || x)); }
    }
    K.SAL = SAL;
    if (lastEtab !== e) { lastEtab = e; etabChange = true; }
  }
  async function recharger() { await charger(); render(); K.rCaisse(); }

  /* ===== Recherche du personnel ===== */
  function salMatches(q) {
    const mots = q.split(/\s+/).filter(Boolean), num = /^\d+$/.test(q) ? +q : null;
    const exact = PERS.find(p => String(p.matricule || '').toLowerCase() === q || (num !== null && numMat(p.matricule) === num));
    if (exact) return { exact, list: [exact] };
    return { exact: null, list: PERS.filter(p => mots.every(m => ((p.matricule || '') + ' ' + nomP(p)).toLowerCase().includes(m))).slice(0, 6) };
  }
  function recherche(force) {
    const q = $('salSearch').value.trim().toLowerCase();
    persSel = null; $('salNom').value = ''; $('salInfo').innerHTML = '';
    if (!q) { $('salRes').innerHTML = ''; maj(); return; }
    const r = salMatches(q);
    if (r.exact) return choisir(r.exact.id, true);
    if (force && r.list.length === 1) return choisir(r.list[0].id);
    $('salRes').innerHTML = r.list.length
      ? r.list.map(p => `<button type="button" class="sec" data-s="c" data-id="${esc(p.id)}" style="text-align:left"><b>${esc(nomP(p))}</b><br><small>${esc(p.matricule || '')} · ${esc(p.fonction || '')}</small></button>`).join('')
      : '<small style="opacity:.7">❌ Aucun personnel trouvé</small>';
    maj();
  }
  function choisir(id, garder) {
    const p = PERS.find(x => x.id === id); if (!p) return;
    persSel = p;
    if (!garder) $('salSearch').value = p.matricule || nomP(p);
    $('salNom').value = nomP(p); $('salRes').innerHTML = '';
    $('salInfo').innerHTML = `✅ ${esc(p.matricule || '')} · ${esc(p.fonction || '')}`;
    maj();
  }
  function reset() {
    persSel = null; $('salSearch').value = ''; $('salNom').value = ''; $('salInfo').innerHTML = ''; $('salRes').innerHTML = '';
    $('salType').value = ''; $('salMont').value = ''; $('salMotif').value = '';
    maj();
  }

  /* ===== Montant automatique, mois déjà payés, message, bouton ===== */
  function maj() {
    const t = $('salType').value, an = +$('salAn').value || 0, autres = t === 'autres';
    $('salMotifBox').style.display = autres ? 'block' : 'none';
    const etaitAuto = $('salMont').readOnly;
    $('salMont').readOnly = !autres;
    if (autres && etaitAuto) $('salMont').value = '';
    if (!t) $('salMont').value = '';
    let libre = null;
    [...$('salMois').options].forEach(o => {
      const m = +o.value, paye = !!(persSel && t && dejaPaye(persSel.id, t, m, an));
      o.disabled = paye; o.textContent = MOIS[m - 1] + (paye ? ' — ✔ déjà payé' : '');
      if (!paye && libre === null) libre = o.value;
    });
    const cur = $('salMois').selectedOptions[0];
    if (cur && cur.disabled && libre !== null) $('salMois').value = libre;
    const m = +$('salMois').value;
    let msg = '', bloque = !persSel || !t;
    if (persSel && t) {
      if (!autres) {
        const mt = montantType(persSel, t);
        $('salMont').value = mt || '';
        if (!mt) { msg = `⚠ Aucun montant « ${TYPES[t]} » défini pour ${esc(nomP(persSel))} (à renseigner dans la page Personnel).`; bloque = true; }
      }
      if (dejaPaye(persSel.id, t, m, an)) { msg = `⛔ ${TYPES[t]} de ${MOIS[m - 1]} ${an} déjà payé à ${esc(nomP(persSel))} : un seul paiement par mois.`; bloque = true; }
    }
    $('salMsg').innerHTML = msg; $('salBtn').disabled = bloque || !peut('salaire');
  }

  /* ===== Enregistrement ===== */
  const ligne = (p, t, m, an, montant, motif, date, mode, recu) => ({
    etablissement_id: K.etabId(), annee_id: K.anneeId(), personnel_id: p.id, matricule: p.matricule || null, nom: nomP(p), fonction: p.fonction || null,
    type: t, motif: motif || null, mois: m, an, montant, date_paiement: date, mode, recu, empreinte: empreinte(recu, montant, date, p.id)
  });
  async function inserer(construire) {      // construire(recu de départ) -> lignes ; gère les numéros de reçu pris entre-temps
    let err = null;
    for (let essai = 0; essai < 3; essai++) {
      const base = await prochainRecu('salaires', 'SAL', today().slice(0, 4), K.etabId());
      const n0 = numMat(base), pre = base.slice(0, base.lastIndexOf('-') + 1);
      const lignes = construire(i => pre + String(n0 + i).padStart(5, '0'));
      const r = await sb.from('salaires').insert(lignes).select();
      if (!r.error) return r.data;
      err = r.error;
      if (r.error.code !== '23505') break;
      if (String(r.error.message).includes('salaires_un_par_mois')) { err = new Error('Déjà payé pour ce mois : un seul paiement par mois.'); break; }
    }
    throw err;
  }
  async function payer(ev) {
    ev.preventDefault(); erreur('');
    if (!peut('salaire')) return alert('Accès non autorisé.');
    const p = persSel && PERS.find(x => x.id === persSel.id);
    if (!p) return alert('Sélectionnez un membre du personnel.');
    const t = $('salType').value, m = +$('salMois').value, a = +$('salAn').value, date = $('salDate').value;
    if (!t) return alert('Choisissez le type de paiement.');
    if (!a || a < 2000 || a > 2100) return alert('Année invalide.');
    if (!date) return alert('Indiquez la date du paiement.');
    if (dejaPaye(p.id, t, m, a)) return alert(`${TYPES[t]} de ${MOIS[m - 1]} ${a} déjà payé à ${nomP(p)}.`);
    const montant = t === 'autres' ? +$('salMont').value : montantType(p, t);
    if (!(montant > 0)) return alert('Montant invalide.');
    const motif = $('salMotif').value.trim();
    if (t === 'autres' && !motif) return alert('Précisez le motif du paiement.');
    $('salBtn').disabled = true;
    try {
      const [x] = await inserer(rec => [ligne(p, t, m, a, montant, motif, date, $('salMode').value, rec(0))]);
      $('salHm').value = m; $('salHa').value = a;
      reset(); await recharger(); recu(x.id);
    } catch (e) { erreur('Paiement impossible : ' + esc(e.message || e)); maj(); }
  }
  async function supprimer(id) {
    if (!peut('salaire')) return alert('Accès non autorisé.');
    if (!confirm('Supprimer ce paiement ? (le mois redeviendra payable)')) return;
    const { error } = await sb.from('salaires').delete().eq('id', id);
    if (error) return erreur('Suppression impossible : ' + esc(error.message));
    await recharger();
  }

  /* ===== Historique, restant à payer, paiement groupé ===== */
  const lignes = () => {
    const m = +$('salHm').value || 0, a = +$('salHa').value || 0;
    return SAL.filter(s => (!m || s.mois === m) && (!a || s.an === a))
      .sort((x, y) => y.date_paiement.localeCompare(x.date_paiement));
  };
  function rSal() {
    const l = lignes();
    $('salTot').textContent = 'Total payé : ' + fmt(l.reduce((t, x) => t + +x.montant, 0)) + ' (' + l.length + ')';
    $('salListe').innerHTML = l.length ? l.map(x => `<div class="card el"><div class="info"><b>${fmt(x.montant)}</b> · ${esc(x.nom)}
      <small>${esc(TYPES[x.type])}${x.motif ? ' — ' + esc(x.motif) : ''} · ${MOIS[x.mois - 1]} ${x.an}<br>
      ${esc(x.matricule || '')} · ${fmtD(x.date_paiement)} · ${esc(x.mode || '')} · ${esc(x.recu)}</small></div>
      <div class="b"><button class="sec" data-s="r" data-id="${esc(x.id)}">🧾</button>
      ${peut('salaire') ? `<button class="del" data-s="d" data-id="${esc(x.id)}">✕</button>` : ''}</div></div>`).join('')
      : '<p class="vide">Aucun paiement pour ces critères</p>';
    const m = +$('salHm').value, a = +$('salHa').value, box = $('salNon');
    if (!m || !a) { box.style.display = 'none'; return; }
    const non = PERS.filter(p => montantType(p, 'salaire') > 0 && !dejaPaye(p.id, 'salaire', m, a));
    const tot = non.reduce((t, p) => t + montantType(p, 'salaire'), 0);
    box.style.display = 'block';
    box.innerHTML = `<h3>Salaires restant à payer — ${MOIS[m - 1]} ${a}</h3>` + (non.length
      ? `<p style="margin:8px 0">${non.length} personne(s) · ${fmt(tot)}</p>
         <div class="recent">${non.map(p => `<button type="button" data-s="p" data-id="${esc(p.id)}">${esc(nomP(p))} <small>${fmt(montantType(p, 'salaire'))}</small></button>`).join('')}</div>
         ${peut('salaire') ? `<div class="acts"><button type="button" data-s="t">⚡ Payer tout le personnel restant (${fmt(tot)})</button></div>` : ''}`
      : '<p class="vide">✅ Tout le personnel a reçu son salaire ce mois-ci</p>');
  }
  function preparer(id) {
    choisir(id); $('salType').value = 'salaire';
    $('salMois').value = $('salHm').value; $('salAn').value = $('salHa').value;
    maj(); scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function payerTous() {
    if (!peut('salaire')) return alert('Accès non autorisé.');
    const m = +$('salHm').value, a = +$('salHa').value;
    if (!K.etabId() || !K.anneeId()) return alert('Choisissez un établissement et une année scolaire.');
    if (!m || !a) return alert('Choisissez un mois précis dans l\'historique.');
    const l = PERS.filter(p => montantType(p, 'salaire') > 0 && !dejaPaye(p.id, 'salaire', m, a));
    if (!l.length) return alert('Aucun salaire à payer pour ce mois.');
    const tot = l.reduce((t, p) => t + montantType(p, 'salaire'), 0);
    if (!confirm(`Payer le salaire de ${MOIS[m - 1]} ${a} à ${l.length} personne(s) ?\nTotal : ${fmt(tot)}`)) return;
    try {
      await inserer(rec => l.map((p, i) => ligne(p, 'salaire', m, a, montantType(p, 'salaire'), '', today(), $('salMode').value, rec(i))));
      reset(); await recharger();
    } catch (e) { erreur('Paiement groupé impossible : ' + esc(e.message || e)); }
  }

  /* ===== Reçu : grand en-tête + contenu + signatures + sceau ===== */
  function recu(id) {
    const x = SAL.find(s => s.id === id); if (!x) return;
    const qr = qrUrl(x.recu + ' | ' + x.nom + ' | ' + x.montant + ' | ' + x.date_paiement + ' | ' + x.empreinte);
    const corps = enteteHtml(etabCourant(), 'Reçu — Paiement du personnel', txtSel('annee')) + `<table>
      <tr><td>N° reçu</td><td><b>${esc(x.recu)}</b></td></tr>
      <tr><td>Date</td><td>${fmtD(x.date_paiement)}</td></tr>
      <tr><td>Bénéficiaire</td><td>${esc(x.nom)}<br><small>${esc(x.matricule || '')} · ${esc(x.fonction || '')}</small></td></tr>
      <tr><td>Type</td><td>${esc(TYPES[x.type])}${x.motif ? ' — ' + esc(x.motif) : ''}</td></tr>
      <tr><td>Période</td><td>${MOIS[x.mois - 1]} ${x.an}</td></tr>
      <tr><td>Montant versé</td><td><b>${fmt(x.montant)}</b></td></tr>
      <tr><td>Mode</td><td>${esc(x.mode || '')}</td></tr>
      <tr><td>Empreinte</td><td>${esc(x.empreinte || '')}</td></tr></table>
      <div style="text-align:center"><img src="${qr}" alt="QR" width="120" height="120"></div>` +
      signaturesHtml([{ titre: 'Le caissier', nom: C.nom_complet }, { titre: 'Le bénéficiaire', nom: x.nom }]);
    afficherRecu(corps, 'Reçu ' + x.recu, `Reçu ${x.recu}\n${x.nom}\n${TYPES[x.type]} ${MOIS[x.mois - 1]} ${x.an} : ${fmt(x.montant)}\nDate : ${fmtD(x.date_paiement)}\nCode : ${x.empreinte}`);
  }

  /* ===== Exports (le PDF a l'en-tête et les signatures) ===== */
  function expCsv() {
    if (!peut('export')) return alert('Accès non autorisé.');
    csv('salaires_' + today(), [['Reçu', 'Date', 'Matricule', 'Nom', 'Fonction', 'Type', 'Motif', 'Mois', 'Année', 'Montant', 'Mode']]
      .concat(lignes().map(x => [x.recu, x.date_paiement, x.matricule || '', x.nom, x.fonction || '', TYPES[x.type], x.motif || '', MOIS[x.mois - 1], x.an, x.montant, x.mode || ''])));
  }
  function expPdf() {
    if (!peut('export')) return alert('Accès non autorisé.');
    const l = lignes();
    pdfTable('Paiements du personnel', ['Date', 'Matricule', 'Nom', 'Type', 'Période', 'Mode', 'Montant'],
      l.map(x => [x.date_paiement, x.matricule || '', x.nom, TYPES[x.type] + (x.motif ? ' (' + x.motif + ')' : ''), MOIS[x.mois - 1] + ' ' + x.an, x.mode || '', fmtP(x.montant)]),
      ['', '', '', '', '', 'TOTAL', fmtP(l.reduce((t, x) => t + +x.montant, 0))]);
  }

  function render() { if (etabChange) { etabChange = false; reset(); } else maj(); rSal(); }

  /* ===== Événements ===== */
  $('fSal').addEventListener('submit', payer);
  $('salSearch').addEventListener('input', () => recherche(false));
  $('salSearch').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); recherche(true); } });
  ['salType', 'salMois', 'salAn'].forEach(i => $(i).addEventListener('change', maj));
  $('salAn').addEventListener('input', maj);
  $('salHm').addEventListener('change', rSal); $('salHa').addEventListener('input', rSal);
  $('salCsv').addEventListener('click', expCsv); $('salPdf').addEventListener('click', expPdf);
  $('pR').addEventListener('click', e => {
    const b = e.target.closest('[data-s]'); if (!b) return;
    const a = b.dataset.s, id = b.dataset.id;
    if (a === 'c') choisir(id); if (a === 'r') recu(id); if (a === 'd') supprimer(id);
    if (a === 'p') preparer(id); if (a === 't') payerTous();
  });

  K.salCharger = charger; K.salRender = render;
  await charger(); render(); K.rCaisse();
}