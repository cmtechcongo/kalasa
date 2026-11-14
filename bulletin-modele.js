/* ============================================================
   BULLETIN-MODELE.JS
   Bulletins officiels RDC (humanités pédagogiques)
   Modèles : IGE-010 (1ère) · IGE-011 (2ème) · IGE-012 (3ème) · IGE-013 (4ème)
   Le modèle utilisé dépend du champ "modeleBulletin" de la classe
   (choisi dans classe.html : la liste se remplit toute seule).
   Dépendances : aucune (autonome)
   Usage :
     BULLETIN.estDisponible(classe) -> true/false
     BULLETIN.ouvrir({ eleve, classe, etab, annee, notes, matieres, rang, nEleves })
     BULLETIN.render(data)  -> HTML string

   ┌──────────────────────────────────────────────────────────┐
   │ ➕ POUR AJOUTER UN NOUVEAU BULLETIN, 2 ÉTAPES :            │
   │   ÉTAPE 1 : créer ses groupes de maxima (GROUPES_xxx)     │
   │             → repère « ÉTAPE 1 » plus bas                 │
   │   ÉTAPE 2 : l'inscrire dans le registre MODELES           │
   │             → repère « ÉTAPE 2 » plus bas                 │
   │ Rien d'autre à modifier (classe.html, note.html et        │
   │ espace-eleve.html se mettent à jour tout seuls).          │
   └──────────────────────────────────────────────────────────┘
   ============================================================ */
(function (global) {
  'use strict';

  /* ============================================================
     ÉTAPE 1 — GROUPES DE MAXIMA DE CHAQUE MODÈLE
     Un groupe = un bloc « MAXIMA » du bulletin papier.
       max: { p: travaux journaliers (par période), ex: examen }
       matieres: lignes du papier, dans l'ordre
         nom : texte imprimé sur le bulletin
         re  : mot-clé pour reconnaître la matière saisie dans KALASA
         sup : true  → affiche « (1) » après le nom (optionnel)
       noEx: true → colonne examen hachurée, sans examen (optionnel)
     ============================================================ */

  /* ---------- Modèle IGE-010 (1ère année) ---------- */
  const GROUPES_010 = [
    {
      max: { p: 10, ex: 20 },
      matieres: [
        { nom: 'Religion', re: /relig/i },
        { nom: 'Education à la vie', re: /\bvie\b/i },
        { nom: 'Ed. civ. & morale', re: /civ|morale/i },
        { nom: 'Langue des Signes', re: /signe/i }
      ]
    },
    {
      max: { p: 20, ex: 40 },
      matieres: [
        { nom: 'Biologie', re: /biolog/i },
        { nom: 'Braille Abrégée', re: /braille/i },
        { nom: 'Dessin', re: /dessin/i },
        { nom: 'Education music. / Théâtrale', re: /music|th[ée][âa]t/i },
        { nom: 'Ed. phys. & Sportive/ Mobilité', re: /phys.*sport|sport|mobilit/i },
        { nom: 'Géographie', re: /g[ée]ograph/i },
        { nom: 'Histoire', re: /histoir/i },
        { nom: 'Informatique', re: /informati/i },
        { nom: 'Langues nationales', re: /langue.*nat/i },
        { nom: 'Sociologie africaine', re: /sociolog/i },
        { nom: 'Travail manuel / Ecriture', re: /travail.*manuel|[ée]criture/i }
      ]
    },
    {
      max: { p: 40, ex: 80 },
      matieres: [
        { nom: 'Chimie', re: /chimie/i },
        { nom: 'Mathématiques', re: /math/i },
        { nom: 'Pédagogie', re: /p[ée]dagog/i },
        { nom: 'Physique', re: /^(?!.*(sport|[ée]duc|ed\.)).*physique/i },
        { nom: 'Psychologie', re: /psycholog/i }
      ]
    },
    {
      max: { p: 50, ex: 100 },
      matieres: [
        { nom: 'Anglais', re: /anglais/i },
        { nom: 'Français', re: /fran[çc]ais/i }
      ]
    }
  ];

  /* ---------- Modèle IGE-011 (2ème année) ---------- */
  const GROUPES_011 = [
    {
      max: { p: 10, ex: 20 },
      matieres: [
        { nom: 'Religion', re: /relig/i, sup: true },
        { nom: 'Education à la vie', re: /\bvie\b/i },
        { nom: 'Ed. civ. & morale', re: /civ|morale/i, sup: true },
        { nom: 'Langue des Signes', re: /signe/i }
      ]
    },
    {
      max: { p: 20, ex: 40 },
      matieres: [
        { nom: 'Braille Abrégée', re: /braille/i },
        { nom: 'Chimie', re: /chimie/i },
        { nom: 'Dessin', re: /dessin/i },
        { nom: 'Ed. phys. & Sportive / Mobilité', re: /phys.*sport|sport|mobilit/i, sup: true },
        { nom: 'Economie politique', re: /[ée]conom/i },
        { nom: 'Education music./Théâtrale', re: /music|th[ée][âa]t/i },
        { nom: 'Géographie', re: /g[ée]ograph/i },
        { nom: 'Histoire', re: /histoir/i },
        { nom: 'Informatique', re: /informati/i },
        { nom: 'Langues nationales', re: /langue.*nat/i },
        { nom: 'Microbiologie', re: /microbio/i },
        { nom: 'Physique', re: /^(?!.*(sport|[ée]duc|ed\.)).*physique/i }
      ]
    },
    {
      max: { p: 40, ex: 80 },
      matieres: [
        { nom: 'Didactique des disciplines', re: /didact.*discipl/i },
        { nom: 'Didactique générale', re: /didact.*g[ée]n[ée]ral/i },
        { nom: 'Mathématiques', re: /math/i },
        { nom: 'Pédagogie', re: /p[ée]dagog/i },
        { nom: 'Psychologie', re: /psycholog/i },
        { nom: 'Travail manuel / Ecriture', re: /travail.*manuel|[ée]criture/i }
      ]
    },
    {
      max: { p: 50, ex: 100 },
      matieres: [
        { nom: 'Anglais', re: /anglais/i },
        { nom: 'Français', re: /fran[çc]ais/i }
      ]
    }
  ];

  /* ---------- Modèle IGE-012 (3ème année) ---------- */
  const GROUPES_012 = [
    {
      max: { p: 10, ex: 20 },
      matieres: [
        { nom: 'Religion', re: /relig/i, sup: true },
        { nom: 'Education à la vie', re: /\bvie\b/i },
        { nom: 'Ed. civ. & morale', re: /civ|morale/i },
        { nom: 'Informatique', re: /informati/i },
        { nom: 'Langue des Signes', re: /signe/i }
      ]
    },
    {
      max: { p: 20, ex: 40 },
      matieres: [
        { nom: 'Biologie', re: /biolog/i },
        { nom: 'Education music./Théâtrale', re: /music|th[ée][âa]t/i },
        { nom: 'Ed. phys. & Sportive / Mobilité', re: /phys.*sport|sport|mobilit/i, sup: true },
        { nom: 'Esthétique', re: /esth[ée]tique/i },
        { nom: 'Géographie', re: /g[ée]ograph/i },
        { nom: 'Histoire', re: /histoir/i },
        { nom: 'Physique', re: /^(?!.*(sport|[ée]duc|ed\.)).*physique/i }
      ]
    },
    {
      max: { p: 40, ex: 80 },
      matieres: [
        { nom: 'Anglais', re: /anglais/i },
        { nom: 'Langues nationales', re: /langue.*nat/i },
        { nom: 'Mathématiques', re: /math/i }
      ]
    },
    {
      max: { p: 50, ex: 100 },
      matieres: [
        { nom: 'Français', re: /fran[çc]ais/i },
        { nom: 'Dessin / Graphisme', re: /dessin|graphis/i, sup: true },
        { nom: 'Didactique des disciplines', re: /didact.*discipl/i },
        { nom: 'Didactique générale', re: /didact.*g[ée]n[ée]ral/i },
        { nom: 'Pédagogie', re: /p[ée]dagog/i },
        { nom: 'Psychologie', re: /psycholog/i },
        { nom: 'Tr. manuel / Ecriture /Braille Abr.', re: /travail.*manuel|tr\.?\s*manuel|[ée]criture|braille/i, sup: true }
      ]
    },
    {
      max: { p: 100, ex: 0 },
      noEx: true,                         // colonne examen hachurée
      matieres: [
        { nom: 'Pratique d’Enseignement', re: /pratique/i }
      ]
    }
  ];

  /* ---------- Modèle IGE-013 (4ème année · Examen d'Etat) ---------- */
  const GROUPES_013 = [
    {
      max: { p: 10, ex: 20 },
      matieres: [
        { nom: 'Religion', re: /relig/i, sup: true },
        { nom: 'Education à la vie', re: /\bvie\b/i },
        { nom: 'Ed. civ. & morale', re: /civ|morale/i },
        { nom: 'Informatique', re: /informati/i },
        { nom: 'Langue des Signes', re: /signe/i }
      ]
    },
    {
      max: { p: 20, ex: 40 },
      matieres: [
        { nom: 'Biologie', re: /biolog/i },
        { nom: 'Ed. phys. & Sportive / Mobilité', re: /phys.*sport|sport|mobilit/i, sup: true },
        { nom: 'Géographie', re: /g[ée]ograph/i },
        { nom: 'Histoire', re: /histoir/i },
        { nom: 'Philosophie', re: /philosoph/i },
        { nom: 'Physique', re: /^(?!.*(sport|[ée]duc|ed\.)).*physique/i }
      ]
    },
    {
      max: { p: 40, ex: 80 },
      matieres: [
        { nom: 'Anglais', re: /anglais/i },
        { nom: 'Langues nationales', re: /langue.*nat/i },
        { nom: 'Mathématiques', re: /math/i }
      ]
    },
    {
      max: { p: 50, ex: 100 },
      matieres: [
        { nom: 'Français', re: /fran[çc]ais/i },
        { nom: 'Dessin / Graphisme', re: /dessin|graphis/i, sup: true },
        { nom: 'Didactique des disciplines', re: /didact.*discipl/i },
        { nom: 'Didactique générale', re: /didact.*g[ée]n[ée]ral/i },
        { nom: 'Ed. musicale / Théâtrale', re: /music|th[ée][âa]t/i },
        { nom: 'Pédagogie', re: /p[ée]dagog/i },
        { nom: 'Psychologie', re: /psycholog/i },
        { nom: 'Tr. manuel / Ecriture /Braille Abr.', re: /travail.*manuel|tr\.?\s*manuel|[ée]criture|braille/i, sup: true }
      ]
    },
    {
      max: { p: 100, ex: 0 },
      noEx: true,                         // colonne examen hachurée
      matieres: [
        { nom: 'Pratique d’Enseignement', re: /pratique/i }
      ]
    }
  ];

  /* ➕ ÉTAPE 1 (nouveau modèle) : copie un bloc ci-dessus, par exemple
     const GROUPES_014 = [ { max:{p:..,ex:..}, matieres:[ {nom:'…', re:/…/i}, … ] }, … ];
     puis passe à l'ÉTAPE 2 juste en dessous. */

  /* ============================================================
     ÉTAPE 2 — REGISTRE DES MODÈLES
     La clé (ex. 'IGE-010') est ce qui s'enregistre dans la classe.
       label        : nom affiché dans classe.html
       ref          : référence imprimée en bas à droite du papier
       titre        : titre imprimé du bulletin
       province     : libellé de la province
       provLigne    : true → province sur sa propre ligne (modèle 3ème)
       pLabels      : en-têtes des périodes 2, 3 et 4
       chef         : texte de signature du chef d'établissement
       fait         : ligne « Fait à … le … »
       placeLabel   : libellé de la ligne « PLACE/NBRE … » (optionnel)
       rowH         : hauteur des lignes en px (20 = normal ; 18 ou 17
                      pour les modèles longs)
       examenEtat   : true → variante 4ème année : colonnes « Examen
                      d'Etat » + cadre de contrôle, sans bloc repêchage
       blkBas       : true → dernière colonne noircie sur Application /
                      Conduite / Signature
       maxGenDetail : true → MAXIMA GENERAUX affiché dans toutes les colonnes
       maxGeneraux  : { p, ex } valeurs imprimées sur le papier, si elles
                      diffèrent du calcul automatique (optionnel)
       groupes      : les groupes de l'ÉTAPE 1
     ============================================================ */
  const MODELES = {
    'IGE-010': {
      label: '1ère HP · Pédagogie générale',
      ref: 'IGE/PS./010',
      titre: 'BULLETIN DE L’ELEVE : HUMANITES PEDAGOGIQUES / PEDA. GENERALE / ENSEIGNEMENT SPECIAL (1<sup>ère</sup>ANNEE)',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>ème</sup>P.', '3<sup>ème</sup>P.', '4<sup>ème</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et signature',
      fait: 'Fait à ……………….……., le……/……/20…',
      rowH: 20,
      blkBas: true,
      maxGenDetail: false,
      groupes: GROUPES_010
    },
    'IGE-011': {
      label: '2ème HP · Pédagogie générale',
      ref: 'IGE/PS./011',
      titre: 'BULLETIN DE L’ELEVE : HUMANITES PEDAGOGIQUES / PEDA. GENERALE / ENSEIGNEMENT SPECIAL (2<sup>ème</sup>ANNEE)',
      province: 'PROVINCE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Le Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_011
    },
    'IGE-012': {
      label: '3ème HP · Pédagogie générale',
      ref: 'IGE/PS./012',
      titre: 'BULLETIN DE L’ELEVE : HUMANITES PEDAGOGIQUES / PEDA. GENERALE / ENSEIGNEMENT SPECIAL (3<sup>ème</sup>ANNEE)',
      province: 'PROVINCE :',
      provLigne: true,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      maxGeneraux: { p: 750, ex: 1300 },   // valeurs imprimées sur le papier officiel
      groupes: GROUPES_012
    },
    'IGE-013': {
      label: '4ème HP · Pédagogie générale',
      ref: 'IGE/PS./013',
      titre: 'BULLETIN DE L’ELEVE : HUMANITES PEDAGOGIQUE / PEDA. GENERALE / ENSEIGNEMENT SPECIAL (4<sup>ème</sup>ANNEE)',
      province: 'PROVINCE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      placeLabel: 'PLACE/NBRE ELEVES',
      rowH: 17,
      examenEtat: true,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_013
    }

    /* ➕ ÉTAPE 2 (nouveau modèle) : ajoute une virgule après le bloc ci-dessus,
       puis colle et complète :
    'IGE-014': {
      label: '… HP · …',
      ref: 'IGE/PS./014',
      titre: 'BULLETIN DE L’ELEVE : … (…)',
      province: 'PROVINCE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_014
    }
    */
  };
  const MODELE_DEFAUT = 'IGE-010';   // modèle utilisé pour les anciennes classes sans choix

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const n = v => (v === null || v === undefined || v === '' || isNaN(v)) ? '' : Number(v).toFixed(0);
  const n2 = v => (v === null || v === undefined || v === '' || isNaN(v)) ? '' : Number(v).toFixed(2);

  function mapMatiere(nomKalasa, groupes = GROUPES_010) {
    for (const g of groupes) {
      for (const mm of g.matieres) {
        if (mm.re.test(nomKalasa)) return { groupe: g, modeleMat: mm };
      }
    }
    return null;
  }

  /* ---------- Éligibilité ---------- */
  const MOTIF_INDISPO = 'Le bulletin n\'est disponible que pour : ' +
    Object.values(MODELES).map(m => m.label).join(' ; ') + '.';

  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  function estDisponible(classe) {
    if (!classe) return false;
    // Méthode fiable : champ explicite défini dans classe.html
    if ('modeleBulletin' in classe) return !!MODELES[classe.modeleBulletin];
    // Anciennes classes (sans le champ) : détection par le texte (modèle IGE-010 seulement)
    const txt = norm(['nom', 'lib', 'type', 'option', 'section']
      .map(k => classe[k]).filter(Boolean).join(' | '));
    const premiere = /\b(1(ere|re|er)?|premiere)\b/.test(txt);
    const pedaGen  = /pedagogie\s*(generale|gen\b)|peda\.?\s*gen|\bp\.?\s?g\b/.test(txt);
    return premiere && pedaGen;
  }

  /* ---------- CSS encapsulé (identique au modèle papier) ---------- */
  const CSS = `
@page{size:A4 portrait;margin:0}
.bulletin,.bulletin *{box-sizing:border-box}
.bulletin{position:relative;width:794px;height:1123px;display:flex;flex-direction:column;overflow:hidden;background:#fff;color:#000;border:2px solid #000;font-family:"Times New Roman",Times,serif;font-size:11px;line-height:1.25;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bulletin table,.bulletin th,.bulletin td{font-family:"Times New Roman",Times,serif;font-size:11px}
.bulletin .wm{position:absolute;top:50%;left:50%;width:560px;height:auto;transform:translate(-50%,-50%);opacity:.16;mix-blend-mode:multiply;pointer-events:none;z-index:5}
.bulletin .hd{display:flex;align-items:center;justify-content:space-between;padding:6px 14px;background:#eef3f8;border-bottom:1.5px solid #000}
.bulletin .hd .t{text-align:center;font-weight:bold;font-size:14px}
.bulletin .hd img{display:block;object-fit:contain}
.bulletin .hd .flag{width:64px;height:48px}
.bulletin .hd .logo{height:54px;width:auto}
.bulletin .idr{display:flex;align-items:center;padding:5px 0 5px 21px;border-bottom:1.5px solid #000;font-weight:bold;font-size:14px;white-space:nowrap}
.bulletin .idr .lbl{width:84px;flex:none}
.bulletin .bx{display:inline-flex;border:1px solid #000;height:24px;flex:none}
.bulletin .bx i{display:block;flex:1;border-right:1px solid #000}
.bulletin .bx i:last-child{border-right:0}
.bulletin .bx.id{width:586px;height:27px}
.bulletin .bx.code{width:243px}
.bulletin .bx.perm{width:274px}
.bulletin .bx.cc{width:56px;height:16px;display:flex}
.bulletin .prov{padding:6px 14px;border-bottom:1.5px solid #000}
.bulletin .info{display:flex;border-bottom:1.5px solid #000}
.bulletin .info>div{flex:1;min-width:0;padding:8px 14px;display:flex;flex-direction:column;gap:9px}
.bulletin .info>div:first-child{border-right:1.5px solid #000}
.bulletin .f{display:flex;align-items:flex-end;gap:4px;font-weight:bold;white-space:nowrap;font-size:11px}
.bulletin .f .l{flex:1;border-bottom:1.5px dotted #000;min-width:20px;height:13px;overflow:hidden;text-overflow:ellipsis}
.bulletin .f.bxrow{align-items:center}
.bulletin .title{text-align:center;font-weight:bold;font-size:12px;padding:5px 4px;border-bottom:1.5px solid #000}
.bulletin .annee .a{display:inline-block;min-width:120px;border-bottom:1.5px dotted #000;height:12px;vertical-align:bottom}
.bulletin table{width:100%;border-collapse:collapse;table-layout:fixed}
.bulletin th,.bulletin td{border:1px solid #000;padding:0 3px;height:20px;text-align:center;overflow:hidden;white-space:nowrap}
.bulletin.rh18 tbody td{height:18px}
.bulletin.rh17 tbody td{height:17px}
.bulletin thead th{height:16px;font-size:10.5px;font-weight:bold}
.bulletin td.br,.bulletin th.br{text-align:left}
.bulletin th.br{font-size:13px;letter-spacing:2px;text-align:center}
.bulletin tr.mx td{font-weight:bold}
.bulletin .blk{background:#000!important;padding:0}
.bulletin td.sl{font-weight:normal;font-style:italic}
.bulletin td.hat{background:repeating-linear-gradient(90deg,#000 0 1px,#fff 1px 3px)!important}
.bulletin td.lab{font-size:8px;font-weight:bold;padding:0}
.bulletin td.box{text-align:left;font-size:10px;font-weight:normal;vertical-align:top;padding:3px 5px;line-height:1.25;white-space:normal}
.bulletin td.box .sm{font-size:9px}
.bulletin td.box .c{text-align:center}
.bulletin td.ex{text-align:left;vertical-align:top;font-size:9px;font-weight:normal;padding:4px 4px;line-height:1.3;white-space:normal}
.bulletin td.ex div{margin-bottom:5px}
.bulletin td.ex .dl{border-bottom:1px dotted #000;height:11px;margin-bottom:3px}
.bulletin td.ex .c{text-align:center}
.bulletin td.ex b{font-weight:bold}
.bulletin sup{font-size:7px;line-height:0}
.bulletin .ft{margin-top:auto;padding:6px 14px 4px;font-size:11px}
.bulletin .ft .dots{border-bottom:1px dotted #000;display:inline-block;width:260px;vertical-align:bottom;height:11px}
.bulletin .ft .full{border-bottom:1px dotted #000;display:inline-block;width:calc(100% - 30px);height:11px;vertical-align:bottom}
.bulletin .sg{display:flex;justify-content:space-between;align-items:flex-end;padding:2px 30px 4px;font-weight:bold;font-size:11px}
.bulletin .sg div{text-align:center}
.bulletin .note{padding:2px 14px 6px;font-size:9.5px;display:flex;justify-content:space-between;align-items:flex-end}
.bulletin .note i{font-weight:bold}

.bulletin-overlay{position:fixed;inset:0;background:#e5e5e5;z-index:9999;display:none;overflow:auto;padding:12px}
.bulletin-overlay.show{display:block}
.bulletin-overlay .bo-bar{position:sticky;top:0;background:#fff;padding:8px;display:flex;gap:8px;border-radius:8px;margin-bottom:10px;box-shadow:0 2px 6px #0003;z-index:10}
.bulletin-overlay .bo-bar button{flex:1;padding:12px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:600;cursor:pointer}
.bulletin-overlay .bo-bar button.sec{background:#8885;color:#000}
.bulletin-overlay .bo-wrap{margin:0 auto;overflow:hidden}
.bulletin-overlay .bo-sheet{transform-origin:top left;width:794px;height:1123px}

@media print{
  body>*:not(.bulletin-overlay){display:none!important}
  .bulletin-overlay{position:static;padding:0;background:#fff}
  .bulletin-overlay .bo-bar{display:none!important}
  .bulletin-overlay .bo-wrap{width:210mm!important;height:297mm!important}
  .bulletin-overlay .bo-sheet{transform:none!important}
  @page{size:A4 portrait;margin:0}
}
`;

  function injectCSS() {
    if (document.getElementById('bulletin-modele-css')) return;
    const st = document.createElement('style');
    st.id = 'bulletin-modele-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ---------- Rendu HTML ---------- */
  function render(data) {
    const {
      eleve = {}, classe = {}, etab = {}, annee = '',
      notes = {}, matieres = [], rang = '', nEleves = ''
    } = data;

    // Modèle choisi pour la classe (IGE-010 par défaut pour les anciennes classes)
    const M = MODELES[classe.modeleBulletin] || MODELES[MODELE_DEFAUT];
    const exEtat = !!M.examenEtat;

    // Construire la structure des groupes avec matières réelles
    const groupes = M.groupes.map(g => ({
      max: g.max,
      noEx: !!g.noEx,
      lignes: g.matieres.map(mm => {
        const mk = matieres.find(m => mm.re.test(m.nom));
        return { modele: mm.nom, sup: !!mm.sup, matK: mk || null, groupeRef: g };
      })
    }));

    // Matières non reconnues -> groupe « Autres »
    const autres = matieres.filter(m => !mapMatiere(m.nom, M.groupes));
    if (autres.length) {
      const gA = { max: { p: 20, ex: 40 } };
      groupes.push({
        max: gA.max,
        noEx: false,
        lignes: autres.map(m => ({ modele: m.nom, sup: false, matK: m, groupeRef: gA }))
      });
    }

    // Valeurs d'une ligne matière
    const ligneVals = (l) => {
      const empty = { p1: '', p2: '', ex1: '', tot1: '', p3: '', p4: '', ex2: '', tot2: '', tg: '' };
      if (!l.matK) return empty;
      const g = l.groupeRef;
      const raw = (p) => (notes[l.matK.id + '_' + p] || {})[eleve.id];
      const conv = (p, type) => {
        if (type === 'ex' && g.noEx) return null;      // groupe sans examen (Pratique d'Enseignement)
        const v = raw(p);
        if (v === undefined || v === null || v === '') return null;
        const maxK = +l.matK.max || 20;
        const maxG = type === 'ex' ? g.max.ex : g.max.p;
        return (+v / maxK) * maxG;
      };
      const p1 = conv('P1', 'p'), p2 = conv('P2', 'p'), ex1 = conv('EX1', 'ex');
      const p3 = conv('P3', 'p'), p4 = conv('P4', 'p'), ex2 = conv('EX2', 'ex');
      const tot1 = (p1 !== null || p2 !== null || ex1 !== null) ? (p1 || 0) + (p2 || 0) + (ex1 || 0) : null;
      const tot2 = (p3 !== null || p4 !== null || ex2 !== null) ? (p3 || 0) + (p4 || 0) + (ex2 || 0) : null;
      const tg = (tot1 !== null || tot2 !== null) ? (tot1 || 0) + (tot2 || 0) : null;
      return {
        p1: p1 !== null ? n(p1) : '', p2: p2 !== null ? n(p2) : '', ex1: ex1 !== null ? n(ex1) : '',
        tot1: tot1 !== null ? n(tot1) : '',
        p3: p3 !== null ? n(p3) : '', p4: p4 !== null ? n(p4) : '', ex2: ex2 !== null ? n(ex2) : '',
        tot2: tot2 !== null ? n(tot2) : '', tg: tg !== null ? n(tg) : ''
      };
    };

    // Totaux généraux
    let sumTG = 0, sumMaxTG = 0;
    groupes.forEach(g => g.lignes.forEach(l => {
      if (!l.matK) return;
      const v = ligneVals(l);
      if (v.tg !== '') { sumTG += +v.tg; sumMaxTG += (g.max.p * 2 + g.max.ex) * 2; }
    }));
    const pourcentage = sumMaxTG ? (sumTG / sumMaxTG * 100) : null;

    // Cases à cocher
    const idCases = Array.from({ length: 20 }, () => '<i></i>').join('');
    const codeCases = Array.from({ length: 9 }, () => '<i></i>').join('');
    const permCases = Array.from({ length: 13 }, () => '<i></i>').join('');
    const blkBas = M.blkBas ? '<td class="blk"></td>' : '<td></td>';

    /* --- Variante « Examen d'Etat » (4ème) : colonnes de droite ---
       Les 3 colonnes de droite sont fusionnées à partir de la 3ème ligne du tableau. */
    const nbLignes = groupes.reduce((s, g) => s + 1 + g.lignes.length, 0) + 7;   // + MG, TOTAUX, %, PLACE, APPL., COND., SIGN.
    const cellExEtat = `<td class="ex" colspan="3" rowspan="${nbLignes - 2}">
      <div><b>Pour contrôle</b><br>Le ….. /….. /……</div>
      <div>Nom et signature du Chef de Centre</div>
      <div class="dl"></div><div class="dl"></div>
      <div>Code du Centre</div>
      <div><span class="bx cc"><i></i><i></i><i></i><i></i></span></div>
      <div style="margin-top:8px"><b>RESULTAT FINAL</b></div>
      <div>Diplôme (1)<br>avec………..%</div>
      <div>A échoué (1)</div>
      <div style="margin-top:8px"><b>Pour témoignage</b><br>Le..…/……/…….</div>
      <div class="c">Le Chef<br>d’Etablissement</div>
      <div class="c" style="margin-top:6px">Sceau de l’Ecole</div>
    </td>`;
    let ri = 0;   // numéro de ligne du tableau
    // Cellules situées à droite de la colonne noire (après T.G.)
    const fin = (stdTail) => {
      if (!exEtat) return stdTail;
      const i = ri++;
      if (i === 0) return '<td class="lab">M.EC</td><td></td><td></td>';
      if (i === 1) return '<td class="lab">%</td><td colspan="2"></td>';
      if (i === 2) return cellExEtat;
      return '';
    };

    let tbody = '';
    groupes.forEach(g => {
      const maxP = g.max.p, maxEx = g.max.ex;
      const tot1 = maxP * 2 + maxEx;
      const tg = tot1 * 2;
      const cellEx = g.noEx ? '<td class="hat"></td>' : `<td>${maxEx}</td>`;

      tbody += `<tr class="mx"><td class="br">MAXIMA</td>
        <td>${maxP}</td><td>${maxP}</td>${cellEx}<td>${tot1}</td>
        <td>${maxP}</td><td>${maxP}</td>${cellEx}<td>${tot1}</td>
        <td>${tg}</td><td class="blk"></td>${fin('<td class="blk" colspan="2"></td>')}</tr>`;

      g.lignes.forEach(l => {
        const v = ligneVals(l);
        tbody += `<tr><td class="br">${esc(l.modele)}${l.sup ? ' <sup>(1)</sup>' : ''}</td>
          <td>${v.p1}</td><td>${v.p2}</td><td>${v.ex1}</td><td>${v.tot1}</td>
          <td>${v.p3}</td><td>${v.p4}</td><td>${v.ex2}</td><td>${v.tot2}</td>
          <td>${v.tg}</td><td class="blk"></td>${fin('<td></td><td></td>')}</tr>`;
      });
    });

    // Maxima généraux : calcul par branche, ou valeurs imprimées (M.maxGeneraux) si fournies
    let sP = 0, sEx = 0;
    M.groupes.forEach(g => { sP += g.max.p * g.matieres.length; sEx += g.max.ex * g.matieres.length; });
    if (M.maxGeneraux) { sP = M.maxGeneraux.p; sEx = M.maxGeneraux.ex; }
    const sTot = sP * 2 + sEx, maxGen = sTot * 2;
    const mg = M.maxGenDetail
      ? `<td>${sP}</td><td>${sP}</td><td>${sEx}</td><td>${sTot}</td><td>${sP}</td><td>${sP}</td><td>${sEx}</td><td>${sTot}</td>`
      : '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';

    tbody += `<tr class="mx"><td class="br">MAXIMA GENERAUX</td>
      ${mg}
      <td>${maxGen}</td><td class="blk"></td>${exEtat ? '' : '<td class="blk" colspan="2"></td>'}</tr>`;

    const boxTotaux = exEtat ? '' : `
      <td class="box" colspan="2" rowspan="6">
        <div>- PASSE <sup>(1)</sup></div>
        <div>- DOUBLE <sup>(1)</sup></div>
        <div class="sm">LE … …/ …… / 20……</div>
        <div class="sm">Le Chef d’Etablissement</div>
        <div class="sm c">Sceau de l’école</div>
      </td>`;

    tbody += `<tr class="mx"><td class="br">TOTAUX</td>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      <td>${n2(sumTG)}</td><td class="blk"></td>${boxTotaux}</tr>`;

    tbody += `<tr class="mx"><td class="br">POURCENTAGE</td>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      <td>${pourcentage !== null ? n2(pourcentage) + '%' : ''}</td><td class="blk"></td></tr>`;

    tbody += `<tr class="mx"><td class="br">${M.placeLabel || 'PLACE/NBRE D’ELEVES'}</td>
      <td class="sl">/</td><td class="sl">/</td><td class="sl">/</td><td class="sl">/</td>
      <td class="sl">/</td><td class="sl">/</td><td class="sl">/</td><td class="sl">/</td>
      <td class="sl">${rang ? rang + '/' + nEleves : '/'}</td><td class="blk"></td></tr>`;

    tbody += `<tr class="mx"><td class="br">APPLICATION</td>
      <td></td><td></td><td class="hat" colspan="2"></td><td></td><td></td>
      <td class="hat" colspan="2"></td><td></td>${blkBas}</tr>`;

    tbody += `<tr class="mx"><td class="br">CONDUITE</td>
      <td></td><td></td><td class="hat" colspan="2"></td><td></td><td></td>
      <td class="hat" colspan="2"></td><td></td>${blkBas}</tr>`;

    tbody += `<tr class="mx"><td class="br">Signature du responsable</td>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      <td></td>${blkBas}</tr>`;

    // Province : dans la colonne de gauche, ou sur sa propre ligne (modèle 3ème)
    const champProvince = `<div class="f">${M.province}<span class="l">${esc(etab.province || '')}</span></div>`;
    const ligneProvince = M.provLigne ? `<div class="prov">${champProvince}</div>` : '';
    const provGauche = M.provLigne ? '' : champProvince;

    // Colonnes et en-tête du tableau (standard ou « Examen d'Etat »)
    const colgroup = exEtat
      ? '<colgroup><col style="width:23%"><col style="width:6.5%"><col style="width:6.5%"><col style="width:7%"><col style="width:7%"><col style="width:6.5%"><col style="width:6.5%"><col style="width:7%"><col style="width:7%"><col style="width:7.5%"><col style="width:2.5%"><col style="width:3.5%"><col style="width:5.5%"><col style="width:4%"></colgroup>'
      : '<colgroup><col style="width:23%"><col style="width:6.5%"><col style="width:6.5%"><col style="width:7%"><col style="width:7%"><col style="width:6.5%"><col style="width:6.5%"><col style="width:7%"><col style="width:7%"><col style="width:7.5%"><col style="width:2.5%"><col style="width:5%"><col style="width:8%"></colgroup>';

    const thead = exEtat
      ? `<thead>
      <tr><th class="br" rowspan="3">BRANCHES</th><th colspan="4">PREMIER SEMESTRE</th><th colspan="4">SECOND SEMESTRE</th><th rowspan="3">T.G.</th><th class="blk" rowspan="3"></th><th colspan="3">EXAMEN D’ETAT</th></tr>
      <tr><th colspan="2" style="font-size:8px">TRAV. JOURNAL.</th><th rowspan="2">EXAM.</th><th rowspan="2">TOT.</th><th colspan="2" style="font-size:8px">TRAV. JOURNAL.</th><th rowspan="2">EXAM.</th><th rowspan="2">TOT.</th><th rowspan="2" style="padding:0"></th><th rowspan="2" style="font-size:7.5px;white-space:normal;padding:0;line-height:1.05">Points<br>Obtenus</th><th rowspan="2" style="font-size:8px;padding:0">MAX.</th></tr>
      <tr><th>1<sup>ère</sup>P.</th><th>${M.pLabels[0]}</th><th>${M.pLabels[1]}</th><th>${M.pLabels[2]}</th></tr>
    </thead>`
      : `<thead>
      <tr><th class="br" rowspan="3">BRANCHES</th><th colspan="4">PREMIER SEMESTRE</th><th colspan="4">SECOND SEMESTRE</th><th rowspan="3">T.G.</th><th class="blk" rowspan="3"></th><th colspan="2" rowspan="2" style="white-space:normal">EXAMEN DE<br>REPECHAGE</th></tr>
      <tr><th colspan="2" style="font-size:8px">TRAV. JOURNAL.</th><th rowspan="2">EXAM.</th><th rowspan="2">TOT.</th><th colspan="2" style="font-size:8px">TRAV. JOURNAL.</th><th rowspan="2">EXAM.</th><th rowspan="2">TOT.</th></tr>
      <tr><th>1<sup>ère</sup>P.</th><th>${M.pLabels[0]}</th><th>${M.pLabels[1]}</th><th>${M.pLabels[2]}</th><th>%</th><th style="font-size:8.5px">SIGN. PROF.</th></tr>
    </thead>`;

    // Pied de page (standard : repêchage ; « Examen d'Etat » : seulement la date)
    const pied = exEtat
      ? `<div class="ft" style="padding:6px 14px 2px">
    <div style="display:flex;justify-content:flex-end"><div style="margin-right:30px">${M.fait}</div></div>
  </div>`
      : `<div class="ft">
    <div>- L’élève ne pourra passer dans la classe supérieure s’il n’a subi avec succès un examen de repêchage en <span class="dots"></span></div>
    <div><span class="full"></span>(1)</div>
    <div style="display:flex;justify-content:space-between"><div>- L’élève passe dans la classe supérieure (1)<br>- L’élève double sa classe (1)</div><div style="align-self:flex-end;margin-right:30px">${M.fait}</div></div>
  </div>`;

    const classeH = M.rowH && M.rowH !== 20 ? ' rh' + M.rowH : '';

    return `
<div class="bulletin${classeH}" id="bulletin-${esc(M.ref.replace(/[^0-9A-Za-z]+/g, '-'))}">
  <img class="wm" src="filigrane.jpg" alt="">
  <div class="hd">
    <img class="flag" src="drapeau.png" alt="Drapeau RDC">
    <div class="t">REPUBLIQUE DEMOCRATIQUE DU CONGO<br>MINISTERE DE L’EDUCATION NATIONALE<br>ET NOUVELLE CITOYENNETE</div>
    <img class="logo" src="logo.png" alt="Logo Ministère">
  </div>
  <div class="idr"><span class="lbl">N° ID.</span><span class="bx id">${idCases}</span></div>
  ${ligneProvince}
  <div class="info">
    <div>
      ${provGauche}
      <div class="f">VILLE :<span class="l">${esc(etab.ville || '')}</span></div>
      <div class="f">COMMUNE / TERR. (1) :<span class="l">${esc(etab.commune || '')}</span></div>
      <div class="f">ECOLE :<span class="l">${esc(etab.nom || '')}</span></div>
      <div class="f bxrow">CODE : <span class="bx code">${codeCases}</span></div>
    </div>
    <div>
      <div class="f">ELEVE :<span class="l">${esc([eleve.nom, eleve.postnom, eleve.prenom].filter(Boolean).join(' '))}</span></div>
      <div class="f">SEXE :<span class="l">${eleve.sexe === 'M' ? 'M' : eleve.sexe === 'F' ? 'F' : ''}</span></div>
      <div class="f">NE(E) A :<span class="l">${esc(eleve.lieuNaiss || '')}</span> LE<span class="l" style="max-width:90px">${esc(eleve.naiss || '')}</span></div>
      <div class="f">CLASSE :<span class="l">${esc(classe.nom || '')}</span></div>
      <div class="f bxrow">N° PERM. : <span class="bx perm">${permCases}</span></div>
    </div>
  </div>
  <div class="title">${M.titre}<br><span class="annee">ANNEE SCOLAIRE <span class="a">${esc(annee)}</span></span></div>
  <table>
    ${colgroup}
    ${thead}
    <tbody>${tbody}</tbody>
  </table>
  ${pied}
  <div class="sg"><div>Signature de l’élève</div><div>Sceau de l’Ecole</div><div>${M.chef}</div></div>
  <div class="note"><div>(1) Biffer la mention inutile.<br>Note importante : Le bulletin est sans valeur s’il est raturé ou surchargé.<br><i>Interdiction formelle de reproduire ce bulletin sous peine des sanctions prévues par la loi.</i></div><em>${esc(M.ref)}</em></div>
</div>`;
  }

  /* ---------- Overlay ---------- */
  function fitOverlay() {
    const ov = document.getElementById('bulletinOverlay');
    if (!ov) return;
    const wrap = ov.querySelector('.bo-wrap');
    const sheet = ov.querySelector('.bo-sheet');
    if (!wrap || !sheet) return;
    const W = 794, H = 1123;
    const k = Math.min(1, (ov.clientWidth - 24) / W);
    sheet.style.transform = 'scale(' + k + ')';
    wrap.style.width = (W * k) + 'px';
    wrap.style.height = (H * k) + 'px';
  }

  function ouvrir(data) {
    // Garde-fou : refuse si la classe n'a pas de modèle de bulletin
    if (!estDisponible(data && data.classe)) { alert(MOTIF_INDISPO); return false; }
    injectCSS();
    let ov = document.getElementById('bulletinOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'bulletinOverlay';
      ov.className = 'bulletin-overlay';
      document.body.appendChild(ov);
    }
    ov.innerHTML = `
      <div class="bo-bar">
        <button onclick="window.print()">🖨 Imprimer / PDF</button>
        <button class="sec" onclick="document.getElementById('bulletinOverlay').classList.remove('show')">Fermer</button>
      </div>
      <div class="bo-wrap"><div class="bo-sheet">${render(data)}</div></div>`;
    ov.classList.add('show');
    fitOverlay();
    window.scrollTo(0, 0);
    return true;
  }

  window.addEventListener('resize', () => {
    const ov = document.getElementById('bulletinOverlay');
    if (ov && ov.classList.contains('show')) fitOverlay();
  });

  global.BULLETIN = {
    render, ouvrir, mapMatiere, estDisponible,
    MODELES, GROUPES: GROUPES_010, MOTIF: MOTIF_INDISPO
  };
})(window);