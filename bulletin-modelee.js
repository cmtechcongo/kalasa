/* ============================================================
   BULLETIN-MODELE.JS
   Bulletins officiels RDC
   Modèles : IGE-004 (Élémentaire 1ère/2e année) · IGE-010 (1ère HP) · IGE-011 (2ème HP)
             IGE-012 (3ème HP) · IGE-013 (4ème HP)
             IGE-042 à IGE-045 (Commerciale & Gestion 1ère → 4ème)
             IGE-113 à IGE-116 (Electricité générale 1ère → 4ème)
             IEP-CC-12 · IEP-CC-3 · IEP-CC-4 (Coupe et Couture : 1ère/2ème, 3ème, 4ème)
   Le modèle utilisé dépend du champ "modeleBulletin" de la classe
   (choisi dans classe.html : la liste se remplit toute seule).
   Toutes les classes d'un même niveau (1ère A, 1ère B, 1ère C…) choisissent
   le même modèle : le bulletin se remplit avec les notes de chaque élève.

   Dépendances : aucune (autonome)
   Usage :
     BULLETIN.estDisponible(classe)  -> true/false
     BULLETIN.ouvrir({ eleve, classe, etab, annee, notes, matieres, rang, nEleves })
     BULLETIN.render(data)           -> HTML string

   ┌──────────────────────────────────────────────────────────┐
   │ ➕ POUR AJOUTER UN NOUVEAU BULLETIN, 2 ÉTAPES :           │
   │   ÉTAPE 1 : créer ses groupes de maxima (GROUPES_xxx)    │
   │             → repère « ÉTAPE 1 » plus bas                │
   │   ÉTAPE 2 : l'inscrire dans le registre MODELES          │
   │             → repère « ÉTAPE 2 » plus bas                │
   │   Rien d'autre à modifier (classe.html, note.html et     │
   │   espace-eleve.html se mettent à jour tout seuls).       │
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
         sup : true → affiche « (1) » après le nom (optionnel)
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
      noEx: true, // colonne examen hachurée
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
      noEx: true, // colonne examen hachurée
      matieres: [
        { nom: 'Pratique d’Enseignement', re: /pratique/i }
      ]
    }
  ];

  /* ---------- Commerciale & Gestion : matières communes (IGE-042 à 045) ----------
     Les « re » sont volontairement précis : dans ce moteur, une matière
     KALASA peut correspondre à plusieurs lignes, donc on évite les
     chevauchements (Anglais ≠ Correspondance anglaise, etc.). */
  const CG = {
    religion: { nom: 'Religion', re: /relig/i, sup: true },
    droit:    { nom: 'Droit', re: /\bdroit\b/i },
    vie:      { nom: 'Education à la Vie', re: /\bvie\b/i },
    civ:      { nom: 'Ed. civ. & morale', re: /civ|morale/i },
    sport:    { nom: 'Education phys. & sportive', re: /phys|sport/i },
    geo:      { nom: 'Géographie économique', re: /g[ée]ograph/i },
    corAng:   { nom: 'Correspondance com. anglaise', re: /corresp.*angl/i },
    corFr:    { nom: 'Correspondance com. française', re: /corresp.*fran[çc]/i },
    fisc:     { nom: 'Fiscalité', re: /fiscal/i },
    mathFin:  { nom: 'Mathématiques financières', re: /math.*financ/i },
    mathGen:  { nom: 'Mathématiques générales', re: /math(?!.*financ)/i },
    banques:  { nom: 'Op. des banques et des crédits', re: /banque|cr[ée]dit/i },
    eco:      { nom: 'Economie politique', re: /[ée]conom.*polit/i },
    ecoDev:   { nom: 'Economie de développement', re: /[ée]conom.*d[ée]velop/i },
    entrep:   { nom: 'Entrepreneuriat', re: /entrepr/i },
    deonto:   { nom: 'Déontologie professionnelle', re: /d[ée]ontolog/i },
    finPub:   { nom: 'Finances publiques', re: /financ.*publi/i },
    organ:    { nom: 'Organisation des entreprises', re: /organis/i },
    visites:  { nom: 'Activités compl. (visites guidées)', re: /activit|visite/i },
    anglais:  { nom: 'Anglais', re: /^(?!.*corresp).*anglais/i },
    docu:     { nom: 'Documentation commerciale', re: /document/i },
    francais: { nom: 'Français', re: /^(?!.*corresp).*fran[çc]ais/i },
    info:     { nom: 'Informatique', re: /informati/i },
    comptaA:  { nom: 'Comptabilité analytique', re: /comptab.*analyt/i },
    comptaG:  { nom: 'Comptabilité générale', re: /comptab(?!.*analyt)/i },
    pratique: { nom: 'Pratique professionnelle', re: /pratique|stage/i }
  };

  /* ---------- Modèle IGE-042 (1ère Commerciale & Gestion) ---------- */
  const GROUPES_042 = [
    { max: { p: 10, ex: 20 },  matieres: [CG.religion, CG.droit, CG.vie, CG.civ, CG.sport, CG.geo] },
    { max: { p: 20, ex: 40 },  matieres: [CG.corAng, CG.corFr, CG.fisc, CG.mathFin, CG.mathGen] },
    { max: { p: 20, ex: 0 },   noEx: true, matieres: [CG.visites] },
    { max: { p: 30, ex: 60 },  matieres: [CG.anglais, CG.docu] },
    { max: { p: 40, ex: 80 },  matieres: [CG.francais, CG.info] },
    { max: { p: 60, ex: 120 }, matieres: [CG.comptaG] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [CG.pratique] }
  ];

  /* ---------- Modèle IGE-043 (2ème Commerciale & Gestion) ----------
     Même structure que la 1ère (ordre Math. générales / financières inversé sur le papier). */
  const GROUPES_043 = [
    { max: { p: 10, ex: 20 },  matieres: [CG.religion, CG.droit, CG.vie, CG.civ, CG.sport, CG.geo] },
    { max: { p: 20, ex: 40 },  matieres: [CG.corAng, CG.corFr, CG.fisc, CG.mathGen, CG.mathFin] },
    { max: { p: 20, ex: 0 },   noEx: true, matieres: [CG.visites] },
    { max: { p: 30, ex: 60 },  matieres: [CG.anglais, CG.docu] },
    { max: { p: 40, ex: 80 },  matieres: [CG.francais, CG.info] },
    { max: { p: 60, ex: 120 }, matieres: [CG.comptaG] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [CG.pratique] }
  ];

  /* ---------- Modèle IGE-044 (3ème Commerciale & Gestion) ---------- */
  const GROUPES_044 = [
    { max: { p: 10, ex: 20 },  matieres: [CG.religion, CG.vie, CG.civ, CG.sport, CG.geo, CG.fisc, CG.mathFin, CG.banques] },
    { max: { p: 10, ex: 0 },   noEx: true, matieres: [CG.visites] },
    { max: { p: 20, ex: 40 },  matieres: [CG.corAng, CG.corFr, CG.droit, CG.eco, CG.entrep, CG.mathGen] },
    { max: { p: 30, ex: 60 },  matieres: [CG.anglais] },
    { max: { p: 40, ex: 80 },  matieres: [CG.francais, CG.info] },
    { max: { p: 60, ex: 120 }, matieres: [CG.comptaG] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [CG.pratique] }
  ];

  /* ---------- Modèle IGE-045 (4ème Commerciale & Gestion · Examen d'Etat) ---------- */
  const GROUPES_045 = [
    { max: { p: 10, ex: 20 },  matieres: [CG.religion, CG.corAng, CG.corFr, CG.deonto, CG.vie, CG.civ, CG.sport, CG.finPub, CG.fisc] },
    { max: { p: 10, ex: 0 },   noEx: true, matieres: [CG.visites] },
    { max: { p: 20, ex: 40 },  matieres: [CG.droit, CG.ecoDev, CG.mathGen, CG.organ] },
    { max: { p: 30, ex: 60 },  matieres: [CG.anglais] },
    { max: { p: 40, ex: 80 },  matieres: [CG.comptaA, CG.francais, CG.info] },
    { max: { p: 50, ex: 100 }, matieres: [CG.comptaG] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [CG.pratique] }
  ];

  /* ---------- Electricité générale : matières communes (IGE-113 à 116) ---------- */
  const EG = {
    religion:  { nom: 'Religion', re: /relig/i, sup: true },
    vie:       { nom: 'Education à la Vie', re: /\bvie\b/i },
    civ:       { nom: 'Ed. civ. & morale', re: /civ|morale/i },
    biologie:  { nom: 'Biologie', re: /biolog/i },
    anglais:   { nom: 'Anglais', re: /anglais/i },
    chimie:    { nom: 'Chimie', re: /chimie/i },
    electNum:  { nom: 'Electronique numérique', re: /[ée]lectronique.*num[ée]r|num[ée]r.*[ée]lectronique/i },
    geoAct:    { nom: 'Géographie / actualités', re: /g[ée]ograph|actualit/i },
    actu:      { nom: 'Actualités', re: /actualit/i },
    histoire:  { nom: 'Histoire', re: /histoir/i },
    info:      { nom: 'Informatique', re: /informati/i },
    mesures:   { nom: 'Instr. méth. Mesures', re: /instr|mesure/i },
    mecanisme: { nom: 'Mécanisme', re: /m[ée]canisme/i },
    physique:  { nom: 'Physique', re: /^(?!.*(sport|[ée]duc|ed\.)).*physique/i },
    technoMec: { nom: 'Techno. mécanique', re: /techno.*m[ée]can/i },
    dessElec:  { nom: 'Dessin électrique', re: /dessin.*[ée]lectr/i },
    dessInd:   { nom: 'Dessin industriel', re: /dessin.*industr/i },
    elecGen:   { nom: 'Electricité générale', re: /^(?!.*(dessin|techno|atelier|labo|machine|application)).*[ée]lectricit/i },
    mecGen:    { nom: 'Mécanique générale', re: /^(?!.*(techno|appliqu)).*m[ée]canique/i },
    technoElec:{ nom: 'Techno. électrique', re: /techno.*[ée]lectr/i },
    electro:   { nom: 'Electronique', re: /^(?!.*num[ée]r).*[ée]lectronique/i },
    electLabo: { nom: 'Electronique + labo.', re: /[ée]lectronique/i },
    francais:  { nom: 'Français', re: /fran[çc]ais/i },
    maths:     { nom: 'Mathématiques', re: /math/i },
    automate:  { nom: 'Automate progr.', re: /automat/i },
    resistance:{ nom: 'Résistances des matér.', re: /r[ée]sistance/i },
    machines:  { nom: 'Machines électriques', re: /machine.*[ée]lectr/i },
    appElec:   { nom: 'Application élect.', re: /application/i },
    automation:{ nom: 'Automation', re: /automat/i },
    circuit:   { nom: 'Circuit logique', re: /circuit/i },
    legislation:{ nom: 'Législation', re: /l[ée]gislat/i },
    organisation:{ nom: 'Organisation', re: /organis/i },
    machineE:  { nom: 'Machine électrique', re: /machine.*[ée]lectr/i },
    mecAppl:   { nom: 'Mécanique appliquée', re: /m[ée]canique.*appliqu/i },
    schema:    { nom: 'Schéma', re: /sch[ée]ma/i },
    atelierE:  { nom: 'Atelier électrique', re: /atelier.*[ée]lectr/i },
    atelierA:  { nom: 'Atelier ajustage', re: /ajustage/i },
    laboE:     { nom: 'Labo. électrique', re: /labo/i }
  };
  const sup = m => Object.assign({}, m, { sup: true });

  /* ---------- Modèle IGE-113 (1ère Electricité générale) ---------- */
  const GROUPES_113 = [
    { max: { p: 10, ex: 20 },  matieres: [EG.religion, EG.vie, EG.civ, sup(EG.biologie)] },
    { max: { p: 20, ex: 40 },  matieres: [EG.anglais, EG.chimie, EG.electNum, EG.geoAct, EG.histoire, EG.info, EG.mesures, EG.mecanisme, EG.physique, EG.technoMec] },
    { max: { p: 40, ex: 80 },  matieres: [EG.dessElec, EG.dessInd, EG.elecGen, EG.mecGen, EG.technoElec, EG.electro] },
    { max: { p: 50, ex: 100 }, matieres: [EG.francais, EG.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [EG.atelierE, EG.atelierA] }
  ];

  /* ---------- Modèle IGE-114 (2ème Electricité générale) ---------- */
  const GROUPES_114 = [
    { max: { p: 10, ex: 20 },  matieres: [EG.religion, EG.vie, EG.civ, sup(EG.biologie)] },
    { max: { p: 20, ex: 40 },  matieres: [EG.anglais, EG.chimie, EG.electNum, EG.geoAct, sup(EG.histoire), EG.info, EG.mesures, EG.mecanisme, EG.physique, sup(EG.technoMec)] },
    { max: { p: 40, ex: 80 },  matieres: [EG.dessElec, EG.dessInd, EG.elecGen, sup(EG.mecGen), EG.technoElec] },
    { max: { p: 50, ex: 100 }, matieres: [EG.francais, EG.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [EG.atelierE, EG.laboE] }
  ];

  /* ---------- Modèle IGE-115 (3ème Electricité générale) ---------- */
  const GROUPES_115 = [
    { max: { p: 10, ex: 20 },  matieres: [EG.religion, EG.vie, EG.civ, sup(EG.biologie)] },
    { max: { p: 20, ex: 40 },  matieres: [EG.actu, EG.anglais, sup(EG.automate), EG.electLabo, EG.info, EG.mesures, EG.resistance] },
    { max: { p: 40, ex: 80 },  matieres: [EG.dessElec, EG.elecGen, EG.machines, EG.technoElec] },
    { max: { p: 50, ex: 100 }, matieres: [EG.francais, EG.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [EG.atelierE, EG.laboE] }
  ];

  /* ---------- Modèle IGE-116 (4ème Electricité générale · Examen d'Etat) ----------
     Sur le papier, « Labo. électrique » figure deux fois (groupe 50 et
     travaux pratiques). La ligne du groupe 50 est laissée vide (re jamais
     reconnue) pour ne pas compter la même matière KALASA deux fois. */
  const GROUPES_116 = [
    { max: { p: 10, ex: 20 },  matieres: [EG.religion, EG.vie, EG.civ] },
    { max: { p: 20, ex: 40 },  matieres: [EG.actu, EG.anglais, EG.appElec, EG.automation, sup(EG.circuit), EG.info, sup(EG.legislation), EG.organisation] },
    { max: { p: 40, ex: 80 },  matieres: [EG.electLabo, EG.machineE, EG.mecAppl, EG.schema] },
    { max: { p: 50, ex: 100 }, matieres: [EG.dessElec, EG.francais, { nom: 'Labo. électrique', re: /(?!)/ }, EG.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [EG.atelierE, EG.laboE] }
  ];

  /* ---------- Coupe et Couture (IEP) : matières communes ---------- */
  const CC = {
    religion:  { nom: 'Religion', re: /relig/i, sup: true },
    vie:       { nom: 'Education à la vie', re: /\bvie\b/i, sup: true },
    civ:       { nom: 'Ed. civ. & morale', re: /civ|morale/i },
    anglais:   { nom: 'Anglais', re: /anglais/i },
    biologie:  { nom: 'Biologie', re: /biolog/i },
    chimie:    { nom: 'Chimie', re: /chimie/i },
    coutInd:   { nom: 'Couture industrielle', re: /couture.*industr/i },
    dessArt:   { nom: 'Dessin artistique', re: /dessin.*artist/i },
    dessTech:  { nom: 'Dessin technique', re: /dessin.*techni/i },
    educFam:   { nom: 'Educ. famil. puériculture', re: /famil|pu[ée]ricul/i },
    educPhys:  { nom: 'Education physique', re: /[ée]duc.*phys|ed\..*phys|sport/i },
    geo:       { nom: 'Géographie', re: /g[ée]ograph/i, sup: true },
    histActu:  { nom: 'Histoire / question d’actualité', re: /histoir|actualit/i, sup: true },
    actu:      { nom: 'Question d’actualité', re: /actualit/i },
    info:      { nom: 'Informatique', re: /informati/i },
    maths:     { nom: 'Mathématiques', re: /math/i },
    physBio:   { nom: 'Physique / Biologie', re: /^(?!.*(educ|ed\.|sport)).*(physique|biolog)/i },
    physique:  { nom: 'Physique', re: /^(?!.*(educ|ed\.|sport)).*physique/i },
    sciAppl:   { nom: 'Sciences appliquées', re: /science.*appliq/i },
    socaf:     { nom: 'Socaf / essayage moul.', re: /socaf|essayage|moulage/i, sup: true },
    essayage:  { nom: 'Essayage moulage', re: /essayage|moulage/i },
    technoSpe: { nom: 'Techno. de la spécialité', re: /techno.*sp[ée]cial/i },
    technoTex: { nom: 'Techno. des textiles', re: /techno.*textile/i },
    travMen:   { nom: 'Travaux ménagers', re: /m[ée]nag/i },
    coupe:     { nom: 'Coupe', re: /\bcoupe\b/i },
    exTech:    { nom: 'Exercices techniques', re: /exercice/i },
    coutArt:   { nom: 'Couture artisanale', re: /couture.*artisan/i },
    francais:  { nom: 'Français', re: /fran[çc]ais/i }
  };

  /* ---------- IEP-CC-12 (1ère et 2ème Coupe et Couture) ---------- */
  const GROUPES_CC12 = [
    { max: { p: 10, ex: 20 },  matieres: [CC.religion, CC.vie, CC.civ] },
    { max: { p: 20, ex: 40 },  matieres: [CC.anglais, CC.chimie, CC.coutInd, CC.dessArt, CC.dessTech, CC.educPhys, CC.geo, CC.histActu, CC.info, CC.physBio, CC.sciAppl, CC.socaf, CC.technoSpe, CC.technoTex] },
    { max: { p: 20, ex: 0 },   noEx: true, matieres: [CC.travMen] },
    { max: { p: 40, ex: 0 },   noEx: true, matieres: [CC.coupe, CC.exTech, CC.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [CC.coutArt] },
    { max: { p: 50, ex: 100 }, matieres: [CC.francais] }
  ];

  /* ---------- IEP-CC-3 (3ème Coupe et Couture) ---------- */
  const GROUPES_CC3 = [
    { max: { p: 10, ex: 20 },  matieres: [{ nom: 'Religion', re: /relig/i, sup: true }, CC.vie, CC.civ] },
    { max: { p: 20, ex: 40 },  matieres: [CC.anglais, CC.biologie, CC.chimie, CC.dessArt, CC.educFam, CC.educPhys, CC.info, CC.maths, CC.physique, CC.actu, CC.technoSpe, CC.technoTex] },
    { max: { p: 40, ex: 80 },  matieres: [CC.coupe, CC.coutInd, CC.dessTech, CC.essayage, CC.exTech, CC.francais] },
    { max: { p: 40, ex: 0 },   noEx: true, matieres: [CC.coutArt] }
  ];

  /* ---------- IEP-CC-4 (4ème Coupe et Couture · Examen d'Etat) ---------- */
  const GROUPES_CC4 = [
    { max: { p: 10, ex: 20 },  matieres: [CC.religion, CC.vie, CC.civ] },
    { max: { p: 20, ex: 40 },  matieres: [CC.anglais, CC.biologie, CC.dessArt, CC.educFam, CC.educPhys, CC.info, CC.maths, CC.physique, CC.actu, CC.technoSpe, CC.technoTex] },
    { max: { p: 40, ex: 80 },  matieres: [CC.coupe, CC.coutInd, CC.dessTech, CC.essayage, CC.exTech, CC.francais] },
    { max: { p: 40, ex: 0 },   noEx: true, matieres: [CC.coutArt] }
  ];

  /* ---------- Modèle IGE-004 (Degré élémentaire · 1ère et 2e année) ----------
     Ce bulletin est par TRIMESTRE (3 trimestres), avec des domaines, des
     sous-groupes et des sous-totaux : il a donc une « structure » (liste de
     lignes dans l'ordre du papier) au lieu de groupes de maxima.
       { dm: 'TITRE' }        → ligne de domaine
       { gr: 'TITRE' }        → ligne de sous-groupe (fond gris)
       { st: 'Sous-total' }   → somme des matières depuis le dernier dm/st
       { nom, re, max:{p,ex} } → une matière (p = max par période, ex = max examen)
       sup:true → « (1) » après le nom ; tall:true → ligne haute en gras
     Une matière KALASA n'est utilisée qu'une seule fois (de haut en bas).
     Astuce de nommage dans KALASA pour les deux « Expression orale » :
     « Langues congolaises – Expression orale » et « Français – Expression orale ». */
  const CONGO = '(congol|nationale|lingala|swahili|kikongo|tshiluba)';

  const STRUCTURE_004 = [
    { dm: 'DOMAINE DES LANGUES' },
    { gr: 'LANGUES CONGOLAISES' },
    { nom: 'Expression Orale', re: new RegExp(CONGO + '.*\\borale|\\borale.*' + CONGO, 'i'), max: { p: 20, ex: 40 } },
    { nom: 'Expression Ecrite', re: /[ée]crite/i, max: { p: 20, ex: 40 } },
    { st: 'Sous-total' },
    { gr: 'FRANÇAIS' },
    { nom: 'Vocabulaire', re: /vocabulaire/i, max: { p: 10, ex: 20 } },
    { nom: 'Expression Orale', re: new RegExp('^(?!.*' + CONGO + ').*\\borale', 'i'), max: { p: 20, ex: 40 } },
    { st: 'Sous-total' },
    { nom: 'LECT. – ECRITURE EN LANGUES CONGOLAISES', re: /lect/i, max: { p: 30, ex: 60 }, tall: true },
    { dm: 'DOMAINE DES MATHEMATIQUES, SCIENCES ET TECHNOLOGIE' },
    { gr: 'MATHEMATIQUES' },
    { nom: 'Mesures des grandeurs', re: /mesure|grandeur/i, max: { p: 10, ex: 20 } },
    { nom: 'Formes géométriques', re: /forme|g[ée]om[ée]tri/i, max: { p: 10, ex: 20 } },
    { nom: 'Numération', re: /num[ée]ration/i, max: { p: 20, ex: 40 } },
    { nom: 'Opérations', re: /op[ée]ration/i, max: { p: 20, ex: 40 } },
    { nom: 'Problèmes', re: /probl[èe]me/i, max: { p: 20, ex: 40 } },
    { gr: 'SCIENCES' },
    { nom: 'Sciences d’éveil', re: /science|[ée]veil/i, max: { p: 20, ex: 40 } },
    { gr: 'TECHNOLOGIE' },
    { nom: 'Technologie', re: /technolog/i, max: { p: 10, ex: 20 } },
    { st: 'Sous-total' },
    { dm: 'DOMAINE DE L’UNIVERS SOCIAL ET ENVIRONNEMENT' },
    { nom: 'Ed. Civ. & Morale', re: /civ|morale/i, max: { p: 10, ex: 20 } },
    { nom: 'Ed. Santé & Env.', re: /sant[ée]|environ|\benv\b/i, max: { p: 10, ex: 20 } },
    { st: 'Sous-total' },
    { dm: 'DOMAINE DES ARTS' },
    { gr: 'EDUCATION ARTISTIQUE' },
    { nom: 'Arts plastiques', re: /plastique/i, max: { p: 10, ex: 20 } },
    { nom: 'Arts dramatiques', re: /dramati|th[ée][âa]tr/i, max: { p: 10, ex: 20 } },
    { st: 'Sous-total' },
    { dm: 'DOMAINE DU DEVELOPPEMENT PERSONNEL' },
    { nom: 'Ed. phys. & sportive', re: /phys|sport/i, max: { p: 10, ex: 20 } },
    { nom: 'Init. Trav. Prod.', re: /init|trav.*prod|productif/i, max: { p: 10, ex: 20 } },
    { nom: 'Religion', re: /relig/i, max: { p: 10, ex: 20 }, sup: true },
    { st: 'Sous-total' }
  ];

  /* ➕ ÉTAPE 1 (nouveau modèle) : copie un bloc ci-dessus, par exemple
     const GROUPES_014 = [ { max:{p:..,ex:..}, matieres:[ {nom:'…', re:/…/i}, … ] }, … ];
     puis passe à l'ÉTAPE 2 juste en dessous. */

  /* ============================================================
     ÉTAPE 2 — REGISTRE DES MODÈLES
     La clé (ex. 'IGE-010') est ce qui s'enregistre dans la classe.
       label      : nom affiché dans classe.html
       ref        : référence imprimée en bas à droite du papier
       titre      : titre imprimé du bulletin
       province   : libellé de la province
       provLigne  : true → province sur sa propre ligne (modèle 3ème)
       pLabels    : en-têtes des périodes 2, 3 et 4
       chef       : texte de signature du chef d'établissement
       fait       : ligne « Fait à … le … »
       placeLabel : libellé de la ligne « PLACE/NBRE … » (optionnel)
       rowH       : hauteur des lignes en px (20 = normal ; 18 ou 17
                    pour les modèles longs)
       examenEtat : true → variante 4ème année : colonnes « Examen
                    d'Etat » + cadre de contrôle, sans bloc repêchage
       blkBas     : true → dernière colonne noircie sur Application /
                    Conduite / Signature
       maxGenDetail : true → MAXIMA GENERAUX affiché dans toutes les colonnes
       maxGeneraux  : { p, ex } valeurs imprimées sur le papier, si elles
                    diffèrent du calcul automatique (optionnel)
       groupes    : les groupes de l'ÉTAPE 1

     Modèle par trimestres (type:'elementaire') : au lieu de groupes /
     pLabels / rowH…, il utilise :
       type      : 'elementaire'
       periodes  : codes de notes KALASA par trimestre [[P1,P2,EX],[…],[…]]
       structure : la STRUCTURE de l'ÉTAPE 1
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
      maxGeneraux: { p: 750, ex: 1300 }, // valeurs imprimées sur le papier officiel
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
    },
    'IGE-004': {
      type: 'elementaire',
      label: '1ère / 2e Élémentaire',
      ref: 'IGE/P.S/004',
      titre: 'BULLETIN DE L’ELEVE DEGRE ELEMENTAIRE (1<sup>ère</sup>, 2<sup>e</sup> ANNEE) (1)',
      // Codes de notes KALASA : [période 1, période 2, examen] pour chaque trimestre
      periodes: [['P1', 'P2', 'EX1'], ['P3', 'P4', 'EX2'], ['P5', 'P6', 'EX3']],
      structure: STRUCTURE_004
    },
    'IGE-042': {
      label: '1ère HP · Commerciale & Gestion',
      ref: 'IGE/P.S./042',
      titre: 'BULLETIN DE LA 1<sup>ère</sup> ANNEE HUMANITES / COMMERCIALE &amp; GESTION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20…',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_042
    },
    'IGE-043': {
      label: '2ème HP · Commerciale & Gestion',
      ref: 'IGE/P.S./043',
      titre: 'BULLETIN DE LA 2<sup>ème</sup> ANNEE HUMANITES / COMMERCIALE &amp; GESTION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20…',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_043
    },
    'IGE-044': {
      label: '3ème HP · Commerciale & Gestion',
      ref: 'IGE/P.S./044',
      titre: 'BULLETIN DE LA 3<sup>ème</sup> ANNEE HUMANITES / COMMERCIALE &amp; GESTION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20…',
      rowH: 17,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_044
    },
    'IGE-045': {
      label: '4ème HP · Commerciale & Gestion',
      ref: 'IGE/P.S./045',
      titre: 'BULLETIN DE LA 4<sup>ème</sup> ANNEE HUMANITES / COMMERCIALE &amp; GESTION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20…',
      placeLabel: 'PLACE/NBRE ELEVES',
      rowH: 17,
      examenEtat: true,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_045
    },
    'IGE-113': {
      label: '1ère HP · Electricité générale',
      ref: 'IGE/P.S./113',
      titre: 'BULLETIN DE LA 1<sup>ère</sup> ANNEE HUMANITES / ELECTRICITE GENERALE',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 17,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_113
    },
    'IGE-114': {
      label: '2ème HP · Electricité générale',
      ref: 'IGE/P.S./114',
      titre: 'BULLETIN DE LA 2<sup>ème</sup> ANNEE HUMANITES / ELECTRICITE GENERALE',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 17,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_114
    },
    'IGE-115': {
      label: '3ème HP · Electricité générale',
      ref: 'IGE/P.S./115',
      titre: 'BULLETIN DE LA 3<sup>ème</sup> ANNEE HUMANITES / ELECTRICITE GENERALE',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_115
    },
    'IGE-116': {
      label: '4ème HP · Electricité générale',
      ref: 'IGE/P.S./116',
      titre: 'BULLETIN DE LA 4<sup>ème</sup> ANNEE HUMANITES / ELECTRICITE GENERALE',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      placeLabel: 'PLACE/NBRE ELEVES',
      rowH: 17,
      examenEtat: true,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_116
    },
    'IEP-CC-12': {
      label: '1ère / 2ème · Coupe et Couture',
      ref: 'IEP/CC/1-2',
      titre: 'BULLETIN DE LA 1<sup>ère</sup>, 2<sup>ème</sup> (1) ANNEE COUPE ET COUTURE',
      province: 'PROVINCE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 17,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_CC12
    },
    'IEP-CC-3': {
      label: '3ème · Coupe et Couture',
      ref: 'IEP/CC/3',
      titre: 'BULLETIN DE LA 3<sup>ème</sup> ANNEE COUPE ET COUTURE',
      province: 'PROVINCE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_CC3
    },
    'IEP-CC-4': {
      label: '4ème · Coupe et Couture',
      ref: 'IEP/CC/4',
      titre: 'BULLETIN DE LA 4<sup>ème</sup> ANNEE COUPE ET COUTURE',
      province: 'PROVINCE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      placeLabel: 'PLACE/NBRE ELEVES',
      rowH: 18,
      examenEtat: true,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_CC4
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

  const MODELE_DEFAUT = 'IGE-010'; // modèle utilisé pour les anciennes classes sans choix

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
    const pedaGen = /pedagogie\s*(generale|gen\b)|peda\.?\s*gen|\bp\.?\s?g\b/.test(txt);
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
/* ---- Variante élémentaire (IGE/P.S/004) : 3 trimestres, domaines, sous-totaux ---- */
.bulletin.elem{line-height:1.2}
.bulletin.elem .info>div:last-child{justify-content:space-between;gap:0}
.bulletin.elem .title{display:flex;justify-content:space-between;align-items:center;text-align:left;padding:5px 14px}
.bulletin.elem .title .a{display:inline-block;min-width:110px;border-bottom:1.5px dotted #000;height:12px;vertical-align:bottom}
.bulletin.elem th,.bulletin.elem td{padding:0 2px;height:15px;font-size:9.5px}
.bulletin.elem thead th{height:13px;font-size:8px;line-height:1.1;padding:0}
.bulletin.elem thead th.br{font-size:11px;letter-spacing:3px}
.bulletin.elem td.br{font-size:9.5px;text-align:left}
.bulletin.elem tr.st td{font-weight:bold}
.bulletin.elem tr.tall td{height:24px}
.bulletin.elem tr.tall td.br{font-size:8.5px;white-space:normal;line-height:1.1}
.bulletin.elem tr.gr td{background:#d5dae6;text-align:left;font-weight:bold;padding-left:4px}
.bulletin.elem tr.dm td{text-align:center;font-weight:bold}
.bulletin.elem tr.ht td.br{font-weight:bold;font-size:8px}
.bulletin.elem td.hat{background:repeating-linear-gradient(90deg,#000 0 1.5px,#fff 1.5px 3px)!important}
.bulletin.elem .ft{padding:6px 14px 2px;font-size:10.5px;display:flex;justify-content:space-between;align-items:flex-end}
.bulletin.elem .ft .dl{display:inline-block;border-bottom:1px dotted #000;vertical-align:bottom;height:11px}
.bulletin.elem .sg{padding:8px 30px 4px}
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

  /* ---------- Rendu « Degré élémentaire » (IGE/P.S/004) ---------- */
  function renderElementaire(data, M) {
    const {
      eleve = {}, classe = {}, etab = {}, annee = '',
      notes = {}, matieres = [], rang = '', nEleves = ''
    } = data;
    const PER = M.periodes;

    // Associer chaque ligne du papier à une matière KALASA (utilisée une seule fois)
    const used = new Set();
    const items = M.structure.map(it => {
      if (!it.nom) return it;
      const mk = matieres.find(m => !used.has(m.id) && it.re.test(m.nom));
      if (mk) used.add(mk.id);
      return Object.assign({}, it, { matK: mk || null });
    });

    // Matières non reconnues -> groupe « Autres matières »
    const autres = matieres.filter(m => !used.has(m.id));
    if (autres.length) {
      items.push({ gr: 'AUTRES MATIERES' });
      autres.forEach(m => items.push({ nom: m.nom, matK: m, max: { p: 20, ex: 40 } }));
      items.push({ st: 'Sous-total' });
    }

    // Accumulateurs : 6 périodes, 3 examens, 3 totaux trimestre, total général
    const newAcc = () => ({ P: Array(6).fill(null), EX: Array(3).fill(null), T: Array(3).fill(null), TG: null });
    const add = (a, b) => b === null ? a : (a === null ? b : a + b);
    const addTo = (acc, v) => {
      v.P.forEach((x, i) => acc.P[i] = add(acc.P[i], x));
      v.EX.forEach((x, i) => acc.EX[i] = add(acc.EX[i], x));
      v.T.forEach((x, i) => acc.T[i] = add(acc.T[i], x));
      acc.TG = add(acc.TG, v.TG);
    };

    // Valeurs d'une matière (converties sur les maxima du papier)
    const calcRow = (matK, mx) => {
      const v = newAcc();
      if (!matK) return v;
      const maxK = +matK.max || 20;
      const get = (code, maxG) => {
        const x = (notes[matK.id + '_' + code] || {})[eleve.id];
        if (x === undefined || x === null || x === '' || isNaN(x)) return null;
        return (+x / maxK) * maxG;
      };
      PER.forEach((pr, t) => {
        v.P[2 * t] = get(pr[0], mx.p);
        v.P[2 * t + 1] = get(pr[1], mx.p);
        v.EX[t] = get(pr[2], mx.ex);
        const parts = [v.P[2 * t], v.P[2 * t + 1], v.EX[t]];
        v.T[t] = parts.some(x => x !== null) ? parts.reduce((s, x) => s + (x || 0), 0) : null;
      });
      v.TG = v.T.some(x => x !== null) ? v.T.reduce((s, x) => s + (x || 0), 0) : null;
      return v;
    };

    const f = v => v === null ? '' : String(Math.round(v * 10) / 10);

    // 21 cellules à droite du libellé
    const cells = (mp, mex, v) => {
      const mt = mp * 2 + mex;
      let h = `<td>${mp}</td><td>${f(v.P[0])}</td><td>${f(v.P[1])}</td><td>${mex}</td><td>${f(v.EX[0])}</td><td>${mt}</td><td>${f(v.T[0])}</td>`;
      for (let t = 1; t < 3; t++) {
        h += `<td>${f(v.P[2 * t])}</td><td>${f(v.P[2 * t + 1])}</td><td>${mex}</td><td>${f(v.EX[t])}</td><td>${mt}</td><td>${f(v.T[t])}</td>`;
      }
      return h + `<td>${mt * 3}</td><td>${f(v.TG)}</td>`;
    };

    let tbody = '';
    let seg = newAcc(), segP = 0, segEx = 0;
    const tot = newAcc();
    const mxT = [0, 0, 0];
    let mxTG = 0;

    items.forEach(it => {
      if (it.dm) {
        tbody += `<tr class="dm"><td colspan="22">${esc(it.dm)}</td></tr>`;
        seg = newAcc(); segP = 0; segEx = 0;
        return;
      }
      if (it.gr) {
        tbody += `<tr class="gr"><td colspan="22">${esc(it.gr)}</td></tr>`;
        return;
      }
      if (it.st) {
        tbody += `<tr class="st"><td class="br">${esc(it.st)}</td>${cells(segP, segEx, seg)}</tr>`;
        seg = newAcc(); segP = 0; segEx = 0;
        return;
      }
      const v = calcRow(it.matK, it.max);
      addTo(seg, v); addTo(tot, v);
      segP += it.max.p; segEx += it.max.ex;
      const mt = it.max.p * 2 + it.max.ex;
      v.T.forEach((x, t) => { if (x !== null) mxT[t] += mt; });
      if (v.TG !== null) mxTG += mt * 3;
      tbody += `<tr${it.tall ? ' class="st tall"' : ''}><td class="br">${esc(it.nom)}${it.sup ? ' <sup>(1)</sup>' : ''}</td>${cells(it.max.p, it.max.ex, v)}</tr>`;
    });

    // Maxima généraux (papier) + points obtenus
    let sP = 0, sEx = 0;
    M.structure.forEach(it => { if (it.nom) { sP += it.max.p; sEx += it.max.ex; } });
    tbody += `<tr class="st"><td class="br">Maxima généraux</td>${cells(sP, sEx, tot)}</tr>`;

    // Lignes de bas de tableau (cases hachurées sur les colonnes MAX)
    const H = '<td class="hat"></td>', E = '<td></td>';
    const bas = (label, tv, tg) => {
      const t = i => `<td>${tv ? tv[i] : ''}</td>`;
      return `<tr class="ht"><td class="br">${label}</td>${H}${E}${E}${H}${E}${H}${t(0)}${E}${E}${H}${E}${H}${t(1)}${E}${E}${H}${E}${H}${t(2)}${H}<td>${tg || ''}</td></tr>`;
    };
    const pct = (a, b) => (a !== null && b) ? n2(a / b * 100) + '%' : '';
    tbody += bas('POURCENTAGE', [0, 1, 2].map(i => pct(tot.T[i], mxT[i])), pct(tot.TG, mxTG));
    tbody += bas('PLACE', null, rang ? esc(rang) : '');
    tbody += bas('NBRE D’ELEVES', null, nEleves ? esc(nEleves) : '');
    tbody += bas('APPLICATION');
    tbody += bas('CONDUITE');
    tbody += bas('SIGNAT. DE L’INST.');
    tbody += bas('SIGNAT. DU RESP.');

    const idCases = Array.from({ length: 20 }, () => '<i></i>').join('');
    const codeCases = Array.from({ length: 9 }, () => '<i></i>').join('');
    const permCases = Array.from({ length: 13 }, () => '<i></i>').join('');

    const colgroup = '<colgroup><col style="width:130px"><col style="width:30px"><col style="width:24px"><col style="width:24px"><col style="width:32px"><col style="width:36px"><col style="width:38px"><col style="width:32px"><col style="width:24px"><col style="width:24px"><col style="width:32px"><col style="width:36px"><col style="width:38px"><col style="width:32px"><col style="width:24px"><col style="width:24px"><col style="width:32px"><col style="width:36px"><col style="width:38px"><col style="width:32px"><col style="width:38px"><col style="width:34px"></colgroup>';

    const thead = `<thead>
<tr><th class="br" rowspan="2">BRANCHES</th><th colspan="7">PREMIER TRIMESTRE</th><th colspan="6">DEUXIEME TRIMESTRE</th><th colspan="6">TROISIEME TRIMESTRE</th><th colspan="2">TOTAL</th></tr>
<tr><th>MAX<br>per</th><th>1<sup>ère</sup>P.</th><th>2<sup>è</sup>P.</th><th>MAX<br>EX.</th><th>PTS<br>OBT.</th><th>MAX.<br>TRIM.</th><th>PTS<br>OBT.</th><th>3<sup>e</sup>P.</th><th>4<sup>e</sup>P.</th><th>MAX<br>EX.</th><th>PTS<br>OBT.</th><th>MAX.<br>TRIM.</th><th>PTS<br>OBT.</th><th>5<sup>e</sup>P.</th><th>6<sup>e</sup>P.</th><th>MAX<br>EX.</th><th>PTS<br>OBT.</th><th>MAX.<br>TRIM.</th><th>PTS<br>OBT.</th><th>MAX.</th><th>PTS<br>OBT.</th></tr>
</thead>`;

    return `
<div class="bulletin elem" id="bulletin-${esc(M.ref.replace(/[^0-9A-Za-z]+/g, '-'))}">
  <img class="wm" src="filigrane.jpg" alt="">
  <div class="hd">
    <img class="flag" src="drapeau.png" alt="Drapeau RDC">
    <div class="t">REPUBLIQUE DEMOCRATIQUE DU CONGO<br>MINISTERE DE L’EDUCATION NATIONALE<br>ET NOUVELLE CITOYENNETE</div>
    <img class="logo" src="logo.png" alt="Logo Ministère">
  </div>
  <div class="idr"><span class="lbl">N° ID.</span><span class="bx id">${idCases}</span></div>
  <div class="info">
    <div>
      <div class="f">PROVINCE EDUCATIONNELLE :<span class="l">${esc(etab.province || '')}</span></div>
      <div class="f">VILLE :<span class="l">${esc(etab.ville || '')}</span></div>
      <div class="f">COMMUNE / TER. (1) :<span class="l">${esc(etab.commune || '')}</span></div>
      <div class="f">ECOLE :<span class="l">${esc(etab.nom || '')}</span></div>
      <div class="f bxrow">CODE : <span class="bx code">${codeCases}</span></div>
    </div>
    <div>
      <div class="f">ELEVE :<span class="l">${esc([eleve.nom, eleve.postnom, eleve.prenom].filter(Boolean).join(' '))}</span> SEXE :<span class="l" style="max-width:60px">${eleve.sexe === 'M' ? 'M' : eleve.sexe === 'F' ? 'F' : ''}</span></div>
      <div class="f">NE(E) A :<span class="l">${esc(eleve.lieuNaiss || '')}</span> LE<span class="l" style="max-width:90px">${esc(eleve.naiss || '')}</span></div>
      <div class="f">CLASSE :<span class="l">${esc(classe.nom || '')}</span></div>
      <div class="f bxrow">N° PERM. : <span class="bx perm">${permCases}</span></div>
    </div>
  </div>
  <div class="title"><span>${M.titre}</span><span class="annee">ANNEE SCOLAIRE <span class="a">${esc(annee)}</span></span></div>
  <table>
    ${colgroup}
    ${thead}
    <tbody>${tbody}</tbody>
  </table>
  <div class="ft">
    <div>- L’élève passe dans la classe supérieure (1)<br>- L’élève double la classe (1)</div>
    <div>Fait à <span class="dl" style="width:190px"></span> le <span class="dl" style="width:60px"></span> / <span class="dl" style="width:60px"></span> / <span class="dl" style="width:60px"></span></div>
  </div>
  <div class="sg"><div>Signature de l’élève</div><div>Sceau de l’Ecole</div><div>Chef d’Etablissement<br>Noms &amp; Signature</div></div>
  <div class="note"><div>(1) Biffer la mention inutile.<br>NOTE IMPORTANTE : Le bulletin est sans valeur s’il est raturé ou surchargé.<br><i>Interdiction formelle de reproduire ce bulletin sous peine des sanctions prévues par la loi.</i></div><em>${esc(M.ref)}</em></div>
</div>`;
  }

  /* ---------- Rendu HTML ---------- */
  function render(data) {
    const {
      eleve = {}, classe = {}, etab = {}, annee = '',
      notes = {}, matieres = [], rang = '', nEleves = ''
    } = data;

    // Modèle choisi pour la classe (IGE-010 par défaut pour les anciennes classes)
    const M = MODELES[classe.modeleBulletin] || MODELES[MODELE_DEFAUT];
    if (M.type === 'elementaire') return renderElementaire(data, M);
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
        if (type === 'ex' && g.noEx) return null; // groupe sans examen (Pratique d'Enseignement)
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
    const nbLignes = groupes.reduce((s, g) => s + 1 + g.lignes.length, 0) + 7; // + MG, TOTAUX, %, PLACE, APPL., COND., SIGN.
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

    let ri = 0; // numéro de ligne du tableau
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

  window.addEventListener('resize', fitOverlay);

  /* Exposé aux pages (classe.html lit MODELES ; note.html et espace-eleve.html lisent MOTIF) */
  global.BULLETIN = {
    estDisponible, ouvrir, render, mapMatiere,
    MODELES, MODELE_DEFAUT, MOTIF: MOTIF_INDISPO
  };
})(window);
