/* ============================================================
   BULLETIN-PRIMAIRE.JS — Bulletins officiels RDC (Élémentaire → CTEB)
   À charger APRÈS bulletin-modele.js :
     <script src="bulletin-modele.js"></script>
     <script src="bulletin-primaire.js"></script>
   Il ajoute 5 modèles au bulletin IGE-004 (1ère année) déjà présent :
     IGE-001  2ème année · Degré élémentaire (spécial inclus)
     IGE-MOY  3ème et 4ème année · Degré moyen
     IGE-006  5ème année · Degré terminal
     IGE-TS   5ème/6ème année · Degré terminal · Enseignement spécial
     IGE-CTEB 7ème année · Cycle terminal (CTEB)
   Même modèle pour toutes les sections (1ère A, B, C…).
   Choix : champ « Modèle de bulletin » de la classe, sinon AUTO (plus bas).
   ➕ Nouveau modèle = 1 bloc dans MODELES + 1 ligne dans AUTO.
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- Saisie des lignes du papier ----------
     DM('TITRE') domaine · GR('TITRE', 'cong'|'fr') groupe
     L('Nom', max) branche · T('Nom<br>…', max) ligne haute
     ST() sous-total (somme depuis le dernier ST / domaine)       */
  const DM = t => ({ dm: t }), GR = (t, g) => ({ gr: t, g });
  const L = (nom, p, o) => ({ nom, p, ...o }), T = (nom, p) => ({ nom, p, tall: true });
  const ST = (t = 'Sous-total') => ({ st: t });

  const CONGO = '(congol|nationale|lingala|swahili|kikongo|tshiluba)';
  const strip = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const mots = s => strip(String(s).replace(/<[^>]+>/g, ' ').replace(/\(1\)/g, ' ')).split(/[^a-z]+/).filter(w => w.length > 2).map(w => w.slice(0, 5));
  const ACC = { a: 'aàâä', e: 'eéèêë', i: 'iîï', o: 'oôö', u: 'uùûü', c: 'cç' };
  const tok = w => w.replace(/[aeiouc]/g, c => '[' + ACC[c] + ']');

  /* Reconnaissance d'une branche dans les matières KALASA (accents et abréviations tolérés) :
     « Exp. Orale/L. des Signes » → 2 variantes ; branches des groupes « Langues congolaises » /
     « Français » : le nom de la matière doit contenir (ou non) « congolaises/nationales… ». */
  function regex(nom, g, dup) {
    const alts = String(nom).replace(/<[^>]+>/g, ' ').replace(/\(1\)/g, ' ').split('/').map(mots).filter(a => a.length);
    const corps = alts.map(a => a.map(w => '(?=.*' + tok(w) + ')').join('')).join('|');
    let g1 = '';
    if (g === 'cong') g1 = dup ? '(?=.*' + CONGO + ')' : '(?=.*' + CONGO + '|(?!.*fran))';
    if (g === 'fr') g1 = '(?!.*' + CONGO + ')';
    return new RegExp('^' + g1 + '(?:' + corps + ')', 'i');
  }

  /* Transforme les lignes saisies en STRUCTURE (même format que STRUCTURE_004). */
  function structure(lignes) {
    const cle = r => mots(r.nom).join('-');
    const comptes = {};
    let g = null;
    lignes.forEach(r => { if (r.gr) g = r.g || null; if (r.nom) { const k = cle(r); comptes[k] = (comptes[k] || 0) + 1; } });
    g = null;
    return lignes.map(r => {
      if (r.dm) { g = null; return { dm: r.dm }; }
      if (r.gr) { g = r.g || null; return { gr: r.gr }; }
      if (r.st) return { st: r.st };
      const rg = r.tall ? null : g;
      return { nom: r.nom.replace(/<br>/g, ' '), nomHtml: r.nom, re: regex(r.nom, rg, comptes[cle(r)] > 1), max: { p: r.p, ex: r.p * 2 }, tall: !!r.tall, sup: /\(1\)/.test(r.nom) };
    });
  }

  /* ---------- Blocs communs ---------- */
  const LANGUES = (cong, fr, lect) => [DM('DOMAINE DES LANGUES'), GR('LANGUES CONGOLAISES', 'cong'), ...cong, ST(), GR('FRANÇAIS', 'fr'), ...fr, ST(), ...lect];
  const MATHS_BASE = [DM('DOMAINE DES MATHEMATIQUES, SCIENCES ET TECHNOLOGIE'), GR('MATHEMATIQUES'),
    L('Mesures des grandeurs', 10), L('Formes géométriques', 10), L('Numération', 20), L('Opérations', 20), L('Problèmes', 20),
    GR('SCIENCES'), L('Sciences d’éveil', 20), GR('TECHNOLOGIE'), L('Technologie', 10), ST()];
  const SOCIAL_BASE = n => [DM('DOMAINE DE L’UNIVERS SOCIAL ET ENVIRONNEMENT'), L(n[0], 10), L(n[1], 10), ST()];
  const ARTS = [DM('DOMAINE DES ARTS'), GR('EDUCATION ARTISTIQUE'), L('Arts plastiques', 10), L('Arts dramatiques', 10), ST()];
  const PERSO = (a, b) => [DM('DOMAINE DU DEVELOPPEMENT PERSONNEL'), L(a, 10), L(b, 10), L('Religion <sup>(1)</sup>', 10), ST()];
  const MATHS_T = [DM('DOMAINE DES MATHEMATIQUES, SCIENCES ET TECHNOLOGIE'), GR('MATHEMATIQUES'),
    L('Numération', 10), L('Opérations', 10), L('Mesures des grandeurs', 10), L('Formes géométriques', 10), L('Problèmes', 20), ST(),
    GR('SCIENCES'), L('Phys. Zoolo. - Info.', 10), L('Anatomie - botanique', 20), ST(), GR('TECHNOLOGIE'), L('Technologie', 10), ST()];
  const SOCIAL_T = [DM('DOMAINE DE L’UNIVERS SOCIAL ET ENVIRONNEMENT'), L('Ed. civ. & morale', 10), L('Ed. santé & env.', 10), L('Géographie', 10), L('Histoire', 10), ST()];
  const ARTS_T = [DM('DOMAINE DES ARTS'), GR('EDUCATION ARTISTIQUE'), L('Arts Plastiques', 10), L('Arts Dramatiques', 10), ST()];
  const LECT_L = '<br>LANGUES CONGOLAISES', LECT_F = '<br>LANGUE FRANÇAISE', LAB = '/<br>LECTURE LABIALE <sup>(1)</sup>';

  const TRIM = ['PREMIER TRIMESTRE', 'DEUXIEME TRIMESTRE', 'TROISIEME TRIMESTRE'];
  const BAS = ['POURCENTAGE', 'PLACE', 'NBRE D’ELEVES', 'APPLICATION', 'CONDUITE', 'SIGNAT. DE L’INST.', 'SIGNAT. DU RESP.'];
  const P_TRI = [['P1', 'P2', 'EX1'], ['P3', 'P4', 'EX2'], ['P5', 'P6', 'EX3']];   // Élémentaire → Terminal
  const P_SEM = [['P1', 'P2', 'EX1'], ['P3', 'P4', 'EX2']];                         // Cycle terminal (7ème)

  /* ============================================================
     REGISTRE DES MODÈLES (la clé est enregistrée dans la classe)
       ref : référence imprimée · periodes : codes de notes KALASA
       blocs : titres des 3 blocs · bas : lignes du bas du tableau
     ============================================================ */
  const MODELES = {
    'IGE-001': {
      type: 'primaire', label: '2ème année · Degré élémentaire (spécial inclus)', ref: 'IGE/P.S/001', periodes: P_TRI, blocs: TRIM, bas: BAS,
      titre: 'BULLETIN DE L’ELEVE : DEGRE ELEMENTAIRE / ENSEIGNEMENT SPECIAL (1<sup>ère</sup>, 2<sup>e</sup> ANNEE) (1)',
      lignes: [...LANGUES([L('Exp. Orale/L. des Signes <sup>(1)</sup>', 20), L('Exp. Ecrite/Braille Int. <sup>(1)</sup>', 20)],
        [L('Vocabulaire', 10), L('Exp. Orale/Art & Parole <sup>(1)</sup>', 20)],
        [T('LECTURE – ECRITURE EN' + LECT_L + ' /<br>LECTURE LABIALE <sup>(1)</sup>', 30)]),
        ...MATHS_BASE, ...SOCIAL_BASE(['Education Civ. & Morale', 'Education Santé & Env.']), ...ARTS,
        ...PERSO('Ed. phys. &sport./Mobil. <sup>(1)</sup>', 'Init. Trav. Prod./Act. V. J. <sup>(1)</sup>')]
    },
    'IGE-MOY': {
      type: 'primaire', label: '3ème et 4ème année · Degré moyen', ref: 'IGE/P.S/004', periodes: P_TRI, blocs: TRIM, bas: BAS,
      titre: 'BULLETIN DE L’ELEVE : DEGRE MOYEN (3<sup>ème</sup>, 4<sup>ème</sup> ANNEE) (1)',
      lignes: [...LANGUES([L('Exp. Orale & Vocabulaire', 10), L('Grammaire & Conjug.', 10), L('Orth. & Rédaction', 5)],
        [L('Vocabulaire', 10), L('Exp. Orale/Art & Parole <sup>(1)</sup>', 20)],
        [T('LECTURE – ECRITURE EN' + LECT_L + ' /<br>LECTURE LABIALE <sup>(1)</sup>', 30)]),
        ...MATHS_BASE, ...SOCIAL_BASE(['Education Civ. & Morale', 'Education Santé & Env.']), ...ARTS,
        ...PERSO('Ed. phys. &sport./Mobil. <sup>(1)</sup>', 'Init. Trav. Prod./Act. V. J. <sup>(1)</sup>')]
    },
    'IGE-006': {
      type: 'primaire', label: '5ème année · Degré terminal', ref: 'IGE/P.S/006', periodes: P_TRI, blocs: TRIM, bas: BAS,
      titre: 'BULLETIN DE L’ELEVE : DEGRE TERMINAL (5<sup>ème</sup> ANNEE)',
      lignes: [...LANGUES([L('Gram. & Conj.', 10), L('Exp. Orale & Vocab.', 10), L('Orth. & rédaction', 10)],
        [L('Exp. Oral & Vocab.', 10), L('Orthographe', 10), L('Rédaction', 10), L('Gram. Conj. Analyse', 20)],
        [T('LECT. - ECRITURE EN' + LECT_L, 20), T('LECT. - ECRITURE EN' + LECT_F, 20)]),
        ...MATHS_T, ...SOCIAL_T, ...ARTS_T, ...PERSO('Init. Trav. Prod.', 'Ed. phys. & sportive')]
    },
    'IGE-TS': {
      type: 'primaire', label: '5ème/6ème année · Degré terminal · Enseignement spécial', ref: 'IGE/P.S/004', periodes: P_TRI, blocs: TRIM, bas: BAS,
      titre: 'BULLETIN DE L’ELEVE : DEGRE TERMINAL / ENSEIGNEMENT SPECIAL (6<sup>ème</sup> ANNEE)',
      lignes: [...LANGUES([L('Grammaire & Conj.', 10), L('Exp. Orale & Voc./L. des Sig. <sup>(1)</sup>', 10), L('Orth. & rédaction', 10)],
        [L('Exp. Oral & Vocabulaire', 10), L('Orthographe', 10), L('Rédaction / Braille Int. <sup>(1)</sup>', 10), L('Gram. Conj. Analyse', 20)],
        [T('LECTURE – ECRITURE EN' + LECT_L + LAB, 20), T('LECTURE – ECRITURE EN' + LECT_F + LAB, 20)]),
        ...MATHS_T, ...SOCIAL_T, ...ARTS_T,
        DM('DOMAINE DU DEVELOPPEMENT PERSONNEL'), L('Init. Tr. Prod./Act. V. J. <sup>(1)</sup>', 10),
        L('Ed. phys.& sport./Mobilité <sup>(1)</sup>', 10), L('Religion <sup>(1)</sup>', 10), ST()]
    },
    'IGE-CTEB': {
      type: 'primaire', label: '7ème année · Cycle terminal (CTEB)', ref: 'IGE/P.S/004', periodes: P_SEM, repechage: true,
      blocs: ['PREMIER SEMESTRE', 'SECOND SEMESTRE', 'TOTAL GENERAL'], bas: ['TOTAL', 'POURCENTAGE', 'PLACE / NBRE D’ELEVES', 'APPLICATION', 'CONDUITE', 'SIGNATURE'],
      titre: 'BULLETIN DE LA 7<sup>ème</sup> ANNEE CYCLE TERMINAL DE L’EDUCATION DE BASE (CTEB)',
      lignes: [DM('DOMAINE DES SCIENCES'), GR('Sous-domaine des Mathématiques'), L('Arithmétique', 10), L('Statistique', 10), L('Géométrie', 20), L('Algèbre', 40), ST('Sous-Total'),
        GR('Sous-domaine des Sciences de la Vie et de la Terre'), L('Anatomie', 10), L('Botanique', 10), L('Zoologie', 10), ST('Sous-Total'),
        GR('Sous-domaine des Sciences Physiques, Technologie et TIC'), L('Sciences Physiques', 10), L('Technologie', 10), L('Techn. d’Info. & Com (TIC)', 10), ST('Sous-Total'),
        DM('DOMAINE DES LANGUES'), L('Anglais', 30), L('Français', 70), ST('Sous-Total'),
        DM('DOMAINE DE L’UNIVERS SOCIAL ET ENVIRONNEMENT'), L('Religion <sup>(1)</sup>', 20), L('Education à la vie', 20), L('Ed. civique et morale', 20),
        L('Géographie', 20), L('Histoire', 20), ST('Sous-Total'),
        DM('DOMAINE DES ARTS'), L('Dessin', 20), L('Musique', 20), ST('Sous-Total'),
        DM('DOMAINE DU DEVELOPPEMENT PERSONNEL'), L('Educat. Phys. & sport.', 20), ST('Sous-Total')]
    }
  };
  Object.values(MODELES).forEach(M => { M.structure = structure(M.lignes); });

  /* ============================================================
     AFFECTATION AUTOMATIQUE (si la classe n'a pas de modèle choisi)
     numéro d'année → modèle. 1ère → IGE-004 (déjà dans bulletin-modele.js).
     La 6ème n'a pas de modèle ordinaire : à choisir dans classe.html.
     ============================================================ */
  const AUTO = { 1: 'IGE-004', 2: 'IGE-001', 3: 'IGE-MOY', 4: 'IGE-MOY', 5: 'IGE-006', 7: 'IGE-CTEB' };
  const AUTO_SPECIAL = { 5: 'IGE-TS', 6: 'IGE-TS' };

  function modeleAuto(c) {
    if (!c) return null;
    const type = strip(c.type || c.niveau);
    if (c.option || c.option_faculte || c.faculte || !/elementaire|moyen|terminal|primaire/.test(type)) return null;   // Maternelle, Humanité, Université : non
    const txt = strip([c.nom, c.lib, c.section].filter(Boolean).join(' '));
    const m = txt.match(/(\d)\s*(?:ere|er|re|eme|e|ieme)?\b/);
    if (!m) return null;
    const an = +m[1];
    return (/special/.test(txt) && AUTO_SPECIAL[an]) || AUTO[an] || null;
  }

  /* ---------- Rendu ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const n2 = v => (v === null || v === undefined || v === '' || isNaN(v)) ? '' : Number(v).toFixed(2);

  const CSS = `
.bulletin.prim,.bulletin.prim *{box-sizing:border-box}
.bulletin.prim{position:relative;width:794px;height:1123px;display:flex;flex-direction:column;overflow:hidden;background:#fff;color:#000;border:2px solid #000;font-family:"Times New Roman",Times,serif;font-size:11px;line-height:1.2;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.prim table,.prim th,.prim td{font-family:"Times New Roman",Times,serif}
.prim .wm{position:absolute;top:50%;left:50%;width:560px;height:auto;transform:translate(-50%,-50%);opacity:.16;mix-blend-mode:multiply;pointer-events:none;z-index:5}
.prim .hd{display:flex;align-items:center;justify-content:space-between;padding:6px 14px;background:#eef3f8;border-bottom:1.5px solid #000}
.prim .hd .t{text-align:center;font-weight:bold;font-size:14px}.prim .hd img{display:block;object-fit:contain}.prim .hd .flag{width:64px;height:48px}.prim .hd .logo{height:54px;width:auto}
.prim .idr{display:flex;align-items:center;padding:5px 0 5px 21px;border-bottom:1.5px solid #000;font-weight:bold;font-size:14px;white-space:nowrap}.prim .idr .lbl{width:84px;flex:none}
.prim .bx{display:inline-flex;border:1px solid #000;height:24px;flex:none}.prim .bx i{display:block;flex:1;border-right:1px solid #000}.prim .bx i:last-child{border-right:0}
.prim .bx.id{width:586px;height:27px}.prim .bx.code{width:243px}.prim .bx.perm{width:274px}
.prim .info{display:flex;border-bottom:1.5px solid #000}.prim .info>div{flex:1;min-width:0;padding:8px 14px;display:flex;flex-direction:column;gap:9px}.prim .info>div:first-child{border-right:1.5px solid #000}.prim .info>div:last-child{justify-content:space-between;gap:0}
.prim .f{display:flex;align-items:flex-end;gap:4px;font-weight:bold;white-space:nowrap;font-size:11px}.prim .f .l{flex:1;border-bottom:1.5px dotted #000;min-width:20px;height:13px;overflow:hidden;text-overflow:ellipsis;font-weight:normal}.prim .f.bxrow{align-items:center}
.prim .title{text-align:center;font-weight:bold;font-size:12px;padding:5px 14px;border-bottom:1.5px solid #000;line-height:1.35}
.prim .title .a{display:inline-block;min-width:110px;border-bottom:1.5px dotted #000;height:12px;vertical-align:bottom;font-weight:normal}
.prim table{width:100%;border-collapse:collapse;table-layout:fixed}
.prim th,.prim td{border:1px solid #000;padding:0 2px;height:15px;text-align:center;overflow:hidden;white-space:nowrap;font-size:9.5px}
.prim thead th{height:13px;font-size:8px;font-weight:bold;line-height:1.1;padding:0}.prim thead th.br{font-size:11px;letter-spacing:3px}
.prim td.br{text-align:left;font-size:9.5px}.prim tr.st td{font-weight:bold}
.prim tr.tall td{height:30px}.prim tr.tall td.br{font-size:8px;white-space:normal;line-height:1.1;background:#d5dae6}
.prim tr.gr td{background:#d5dae6;text-align:left;font-weight:bold;padding-left:4px}.prim tr.dm td{text-align:center;font-weight:bold}
.prim tr.ht td.br{font-weight:bold;font-size:8px}
.prim td.hat{background:repeating-linear-gradient(90deg,#000 0 1.5px,#fff 1.5px 3px)!important}
.prim sup{font-size:7px;line-height:0}
.prim .ft{margin-top:auto;padding:6px 14px 2px;font-size:10.5px;display:flex;justify-content:space-between;align-items:flex-end}
.prim .ft .dl{display:inline-block;border-bottom:1px dotted #000;vertical-align:bottom;height:11px}
.prim .sg{display:flex;justify-content:space-between;align-items:flex-end;padding:8px 30px 4px;font-weight:bold;font-size:11px}.prim .sg div{text-align:center}
.prim .note{padding:2px 14px 6px;font-size:9.5px;display:flex;justify-content:space-between;align-items:flex-end}.prim .note i{font-weight:bold}
.bulletin-overlay{position:fixed;inset:0;background:#e5e5e5;z-index:9999;display:none;overflow:auto;padding:12px}
.bulletin-overlay.show{display:block}
.bulletin-overlay .bo-bar{position:sticky;top:0;background:#fff;padding:8px;display:flex;gap:8px;border-radius:8px;margin-bottom:10px;box-shadow:0 2px 6px #0003;z-index:10}
.bulletin-overlay .bo-bar button{flex:1;padding:12px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:600;cursor:pointer}
.bulletin-overlay .bo-bar button.sec{background:#8885;color:#000}
.bulletin-overlay .bo-wrap{margin:0 auto;overflow:hidden}
.bulletin-overlay .bo-sheet{transform-origin:top left;width:794px;height:1123px}
@media print{body>*:not(.bulletin-overlay){display:none!important}.bulletin-overlay{position:static;padding:0;background:#fff}.bulletin-overlay .bo-bar{display:none!important}.bulletin-overlay .bo-wrap{width:210mm!important;height:297mm!important}.bulletin-overlay .bo-sheet{transform:none!important}@page{size:A4 portrait;margin:0}}`;

  const COLG = '<colgroup>' + [130, 30, 24, 24, 32, 36, 38, 32, 24, 24, 32, 36, 38, 32, 24, 24, 32, 36, 38, 32, 38, 34].map(w => `<col style="width:${w}px">`).join('') + '</colgroup>';
  const NP = ['1<sup>ère</sup>P.', '2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.', '5<sup>e</sup>P.', '6<sup>e</sup>P.'];

  function renderPrim(data, M) {
    const { eleve = {}, classe = {}, etab = {}, annee = '', notes = {}, matieres = [], rang = '', nEleves = '' } = data;
    const PER = M.periodes, NB = PER.length;               // 3 trimestres ou 2 semestres
    const used = new Set();
    const items = M.structure.map(it => {
      if (!it.nom) return it;
      const mk = matieres.find(m => !used.has(m.id) && it.re.test(m.nom));
      if (mk) used.add(mk.id);
      return { ...it, matK: mk || null };
    });
    const autres = matieres.filter(m => !used.has(m.id));
    if (autres.length) { items.push({ gr: 'AUTRES MATIERES' }); autres.forEach(m => items.push({ nom: m.nom, nomHtml: esc(m.nom), matK: m, max: { p: 20, ex: 40 } })); items.push({ st: 'Sous-total' }); }

    const newAcc = () => ({ P: Array(6).fill(null), EX: Array(3).fill(null), T: Array(3).fill(null), TG: null });
    const add = (a, b) => b === null ? a : (a === null ? b : a + b);
    const addTo = (acc, v) => { v.P.forEach((x, i) => acc.P[i] = add(acc.P[i], x)); v.EX.forEach((x, i) => acc.EX[i] = add(acc.EX[i], x)); v.T.forEach((x, i) => acc.T[i] = add(acc.T[i], x)); acc.TG = add(acc.TG, v.TG); };

    const calcRow = (matK, mx) => {                         // notes converties sur les maxima du papier
      const v = newAcc();
      if (!matK) return v;
      const maxK = +matK.max || 20;
      const get = (code, maxG) => { const x = (notes[matK.id + '_' + code] || {})[eleve.id]; return (x === undefined || x === null || x === '' || isNaN(x)) ? null : (+x / maxK) * maxG; };
      PER.forEach((pr, t) => {
        v.P[2 * t] = get(pr[0], mx.p); v.P[2 * t + 1] = get(pr[1], mx.p); v.EX[t] = get(pr[2], mx.ex);
        const parts = [v.P[2 * t], v.P[2 * t + 1], v.EX[t]];
        v.T[t] = parts.some(x => x !== null) ? parts.reduce((s, x) => s + (x || 0), 0) : null;
      });
      v.TG = v.T.some(x => x !== null) ? v.T.reduce((s, x) => s + (x || 0), 0) : null;
      return v;
    };
    const f = v => v === null ? '' : String(Math.round(v * 10) / 10);
    const cells = (mp, mex, v) => {                         // 21 cellules à droite du libellé
      const mt = mp * 2 + mex, blk = t => t < NB ? `<td>${f(v.P[2 * t])}</td><td>${f(v.P[2 * t + 1])}</td><td>${mex}</td><td>${f(v.EX[t])}</td><td>${mt}</td><td>${f(v.T[t])}</td>`
        : `<td></td><td></td><td>${mex}</td><td></td><td>${mt}</td><td>${f(v.TG)}</td>`;
      return `<td>${mp}</td>` + blk(0) + blk(1) + blk(2) + `<td>${mt * NB}</td><td>${f(v.TG)}</td>`;
    };

    let tbody = '', seg = newAcc(), segP = 0, segEx = 0;
    const tot = newAcc(), mxT = [0, 0, 0]; let mxTG = 0;
    items.forEach(it => {
      if (it.dm) { tbody += `<tr class="dm"><td colspan="22">${esc(it.dm)}</td></tr>`; seg = newAcc(); segP = 0; segEx = 0; return; }
      if (it.gr) { tbody += `<tr class="gr"><td colspan="22">${esc(it.gr)}</td></tr>`; return; }
      if (it.st) { tbody += `<tr class="st"><td class="br">${esc(it.st)}</td>${cells(segP, segEx, seg)}</tr>`; seg = newAcc(); segP = 0; segEx = 0; return; }
      const v = calcRow(it.matK, it.max);
      addTo(seg, v); addTo(tot, v); segP += it.max.p; segEx += it.max.ex;
      const mt = it.max.p * 2 + it.max.ex;
      v.T.forEach((x, t) => { if (x !== null) mxT[t] += mt; });
      if (v.TG !== null) mxTG += mt * NB;
      tbody += `<tr${it.tall ? ' class="st tall"' : ''}><td class="br">${it.nomHtml || esc(it.nom)}</td>${cells(it.max.p, it.max.ex, v)}</tr>`;
    });
    let sP = 0, sEx = 0;
    M.structure.forEach(it => { if (it.nom) { sP += it.max.p; sEx += it.max.ex; } });
    tbody += `<tr class="st"><td class="br">Maxima généraux</td>${cells(sP, sEx, tot)}</tr>`;

    const H = '<td class="hat"></td>', E = '<td></td>';
    const bas = (label, tv, tg) => { const t = i => `<td>${tv ? tv[i] : ''}</td>`; return `<tr class="ht"><td class="br">${label}</td>${H}${E}${E}${H}${E}${H}${t(0)}${E}${E}${H}${E}${H}${t(1)}${E}${E}${H}${E}${H}${t(2)}${H}<td>${tg || ''}</td></tr>`; };
    const pct = (a, b) => (a !== null && b) ? n2(a / b * 100) + '%' : '';
    M.bas.forEach(b => {
      if (/^TOTAL/.test(b)) tbody += bas(b, [0, 1, 2].map(i => f(tot.T[i])), f(tot.TG));
      else if (/^POURCENT/.test(b)) tbody += bas(b, [0, 1, 2].map(i => pct(tot.T[i], mxT[i])), pct(tot.TG, mxTG));
      else if (/^PLACE \//.test(b)) tbody += bas(b, null, rang ? esc(rang) + '/' + esc(nEleves) : '');
      else if (/^PLACE/.test(b)) tbody += bas(b, null, rang ? esc(rang) : '');
      else if (/^NBRE/.test(b)) tbody += bas(b, null, nEleves ? esc(nEleves) : '');
      else tbody += bas(b);
    });

    const cases = k => Array.from({ length: k }, () => '<i></i>').join('');
    const h2 = ['MAX<br>per', NP[0], NP[1], 'MAX<br>EX.', 'PTS<br>OBT.', 'MAX<br>TRIM.', 'PTS<br>OBT.', NP[2], NP[3], 'MAX<br>EX.', 'PTS<br>OBT.', 'MAX<br>TRIM.', 'PTS<br>OBT.', NP[4], NP[5], 'MAX<br>EX.', 'PTS<br>OBT.', 'MAX<br>TRIM.', 'PTS<br>OBT.', 'MAX', 'PTS<br>OBT.'].map(t => `<th>${t}</th>`).join('');
    const thead = `<thead><tr><th class="br" rowspan="2">BRANCHES</th><th colspan="7">${M.blocs[0]}</th><th colspan="6">${M.blocs[1]}</th><th colspan="6">${M.blocs[2]}</th><th colspan="2">TOTAL</th></tr><tr>${h2}</tr></thead>`;
    const rep = M.repechage ? '- L’élève ne pourra passer dans la classe supérieure s’il n’a subi avec succès un examen de repêchage en...<br>' : '';
    return `<div class="bulletin prim" id="bulletin-${esc(M.ref.replace(/[^0-9A-Za-z]+/g, '-'))}">
<img class="wm" src="filigrane.jpg" alt="">
<div class="hd"><img class="flag" src="drapeau.png" alt="Drapeau RDC"><div class="t">REPUBLIQUE DEMOCRATIQUE DU CONGO<br>MINISTERE DE L’EDUCATION NATIONALE<br>ET NOUVELLE CITOYENNETE</div><img class="logo" src="logo.png" alt="Logo Ministère"></div>
<div class="idr"><span class="lbl">N° ID.</span><span class="bx id">${cases(20)}</span></div>
<div class="info"><div>
<div class="f">PROVINCE EDUCATIONNELLE :<span class="l">${esc(etab.province || '')}</span></div>
<div class="f">VILLE :<span class="l">${esc(etab.ville || '')}</span></div>
<div class="f">COMMUNE / TERR. (1) :<span class="l">${esc(etab.commune || '')}</span></div>
<div class="f">ECOLE :<span class="l">${esc(etab.nom || '')}</span></div>
<div class="f bxrow">CODE : <span class="bx code">${cases(9)}</span></div></div>
<div>
<div class="f">ELEVE :<span class="l">${esc([eleve.nom, eleve.postnom, eleve.prenom].filter(Boolean).join(' '))}</span></div>
<div class="f">SEXE :<span class="l">${eleve.sexe === 'M' ? 'M' : eleve.sexe === 'F' ? 'F' : ''}</span></div>
<div class="f">NE(E) A :<span class="l">${esc(eleve.lieuNaiss || '')}</span> LE<span class="l" style="max-width:90px">${esc(eleve.naiss || '')}</span></div>
<div class="f">CLASSE :<span class="l">${esc(classe.nom || '')}</span></div>
<div class="f bxrow">N° PERM. : <span class="bx perm">${cases(13)}</span></div></div></div>
<div class="title">${M.titre}<br>ANNEE SCOLAIRE <span class="a">${esc(annee)}</span></div>
<table>${COLG}${thead}<tbody>${tbody}</tbody></table>
<div class="ft"><div>${rep}- L’élève passe dans la classe supérieure (1)<br>- L’élève double la classe (1)</div>
<div>Fait à <span class="dl" style="width:190px"></span> le <span class="dl" style="width:60px"></span> / <span class="dl" style="width:60px"></span> / <span class="dl" style="width:60px"></span></div></div>
<div class="sg"><div>Signature de l’élève</div><div>Sceau de l’Ecole</div><div>Chef d’Etablissement<br>Noms &amp; Signature</div></div>
<div class="note"><div>(1) Biffer la mention inutile.<br>NOTE IMPORTANTE : Le bulletin est sans valeur s’il est raturé ou surchargé.<br><i>Interdiction formelle de reproduire ce bulletin sous peine des sanctions prévues par la loi.</i></div><em>${esc(M.ref)}</em></div></div>`;
  }

  /* ---------- Branchement sur BULLETIN (bulletin-modele.js) ---------- */
  const B = global.BULLETIN = global.BULLETIN || {};
  const vieux = { dispo: B.estDisponible, render: B.render, ouvrir: B.ouvrir };

  /* Quel modèle pour cette classe ? choix explicite d'abord, sinon automatique. */
  const cleDe = c => (c && c.modeleBulletin) ? c.modeleBulletin : modeleAuto(c);
  const avecCle = (d, k) => ({ ...d, classe: { ...d.classe, modeleBulletin: k } });

  function injecterCss() {
    if (document.getElementById('bulletin-prim-css')) return;
    const st = document.createElement('style'); st.id = 'bulletin-prim-css'; st.textContent = CSS; document.head.appendChild(st);
  }
  function ajuster() {
    const ov = document.getElementById('bulletinOverlay'); if (!ov) return;
    const w = ov.querySelector('.bo-wrap'), s = ov.querySelector('.bo-sheet'); if (!w || !s) return;
    const k = Math.min(1, (ov.clientWidth - 24) / 794);
    s.style.transform = 'scale(' + k + ')'; w.style.width = (794 * k) + 'px'; w.style.height = (1123 * k) + 'px';
  }

  B.MODELES_PRIM = MODELES;
  B.modeleAuto = modeleAuto;
  B.estDisponible = c => {
    if (!c) return false;
    if (MODELES[c.modeleBulletin]) return true;
    if (c.modeleBulletin) return vieux.dispo ? vieux.dispo(c) : false;
    return modeleAuto(c) ? true : (vieux.dispo ? vieux.dispo(c) : false);
  };
  B.render = d => {
    const k = cleDe(d.classe);
    if (MODELES[k]) { injecterCss(); return renderPrim(d, MODELES[k]); }
    return vieux.render(k ? avecCle(d, k) : d);
  };
  B.ouvrir = d => {
    const k = cleDe(d && d.classe);
    if (!MODELES[k]) return vieux.ouvrir(k ? avecCle(d, k) : d);
    injecterCss();
    let ov = document.getElementById('bulletinOverlay');
    if (!ov) { ov = document.createElement('div'); ov.id = 'bulletinOverlay'; ov.className = 'bulletin-overlay'; document.body.appendChild(ov); }
    ov.innerHTML = `<div class="bo-bar"><button onclick="window.print()">🖨 Imprimer / PDF</button><button class="sec" onclick="document.getElementById('bulletinOverlay').classList.remove('show')">Fermer</button></div><div class="bo-wrap"><div class="bo-sheet">${renderPrim(d, MODELES[k])}</div></div>`;
    ov.classList.add('show'); ajuster(); window.scrollTo(0, 0);
    return true;
  };
  addEventListener('resize', ajuster);
  if (typeof B.MOTIF === 'string') B.MOTIF = B.MOTIF.replace(/\.$/, '') + ' ; ' + Object.values(MODELES).map(m => m.label).join(' ; ') + '.';
  if (B.MODELES && typeof B.MODELES === 'object') Object.entries(MODELES).forEach(([k, m]) => { if (!B.MODELES[k]) B.MODELES[k] = { label: m.label, ref: m.ref, type: 'primaire' }; });
  if (typeof document !== 'undefined' && document.head) injecterCss();
})(window);