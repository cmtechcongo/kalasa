/* ============================================================
   BULLETIN-MODELE.JS
   Bulletins officiels RDC
   Modèles : IGE-004 (Élémentaire 1ère/2e année) · IGE-010 (1ère HP) · IGE-011 (2ème HP)
             IGE-012 (3ème HP) · IGE-013 (4ème HP)
             IGE-042 à IGE-045 (Commerciale & Gestion 1ère → 4ème)
             IGE-113 à IGE-116 (Electricité générale 1ère → 4ème)
             IEP-CC-12 · IEP-CC-3 · IEP-CC-4 (Coupe et Couture : 1ère/2ème, 3ème, 4ème)
             HS-1 · HS-2 · HS-3 (Humanités Scientifiques 1ère, 2ème, 3ème · IGE/P.S./012)
             IGE-153 à 156 (Mécanique automobile) · IGE-117 à 119 (Construction) · IGE-105 à 108 (Nutrition)
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

  /* ---------- Humanités Scientifiques (IGE/P.S./012) : bulletin par domaines ----------
     Même principe que STRUCTURE_004, mais par SEMESTRE.
       max: { p, ex, tot?, ps? }
         p   : maximum « travaux journaliers » imprimé
         ex  : maximum examen
         tot : maximum du semestre (par défaut 2×p + ex)
         ps  : maximum réel de chaque période pour le calcul (par défaut p) */
  const HS_PHYS = /^(?!.*(sport|[ée]duc|ed\.)).*physique/i;
  const hsCommun = [
    { gr: 'Sous-domaine des Sciences Physiques, Technologie et TIC' },
    { nom: 'Chimie', re: /chimie/i, max: { p: 30, ex: 60 } },
    { nom: 'Physique', re: HS_PHYS, max: { p: 30, ex: 60 } },
    { nom: 'Tech. d’Info et Com (TIC)', re: /\btic\b|informati/i, max: { p: 10, ex: 20 } },
    { st: 'Sous-Total' },
    { dm: 'DOMAINE DES LANGUES' },
    { nom: 'Français', re: /fran[çc]ais/i, max: { p: 50, ex: 100 } },
    { nom: 'Anglais', re: /anglais/i, max: { p: 30, ex: 60 } },
    { st: 'Sous-Total' },
    { dm: 'DOMAINE DE L’UNIVERS SOCIAL ET ENVIRONNEMENT' },
    { nom: 'Ed. civ. & morale', re: /civ|morale/i, max: { p: 10, ex: 20 } },
    { nom: 'Géographie', re: /g[ée]ograph/i, max: { p: 20, ex: 40 } },
    { nom: 'Histoire', re: /histoir/i, max: { p: 20, ex: 40 } },
    { nom: 'Education à la vie', re: /\bvie\b/i, max: { p: 10, ex: 20 }, sup: true },
    { nom: 'Sociologie africaine', re: /sociolog/i, max: { p: 20, ex: 40 } },
    { nom: 'Religion', re: /relig/i, max: { p: 10, ex: 20 }, sup: true },
    { st: 'Sous-Total' },
    { dm: 'DOMAINE DU DEVELOPPEMENT PERSONNEL' },
    { nom: 'Educat. phys. & sport.', re: /[ée]duc.*phys|ed\..*phys|sport/i, max: { p: 10, ex: 20 } },
    { st: 'Sous-Total' }
  ];

  /* 1ère et 2ème année : même structure */
  const STRUCTURE_HS12 = [
    { dm: 'DOMAINE DES SCIENCES' },
    { gr: 'Sous-domaine des Mathématiques' },
    { nom: 'Algèbre, Stat. & Analy.', re: /alg[èe]bre|analyse/i, max: { p: 40, ex: 80 } },
    { nom: 'Géométrie et Trigo.', re: /g[ée]om[ée]tri|trigo/i, max: { p: 20, ex: 40 } },
    { nom: 'Dessin scientifique', re: /dessin/i, max: { p: 10, ex: 20 } },
    { st: 'Sous-Total' },
    { gr: 'Sous-domaine des Sciences de la Vie et de la Terre' },
    { nom: 'Biologie générale', re: /^(?!.*micro).*biolog/i, max: { p: 20, ex: 40 } },
    { nom: 'Microbiologie', re: /microbio/i, max: { p: 10, ex: 20 } },
    { nom: 'Géologie', re: /g[ée]olog/i, max: { p: 10, ex: 20 } },
    { st: 'Sous-Total' }
  ].concat(hsCommun);

  /* 3ème année */
  const STRUCTURE_HS3 = [
    { dm: 'DOMAINE DES SCIENCES' },
    { gr: 'Sous-domaine des Mathématiques' },
    { nom: 'Algèbre, Stat. & Analy.', re: /alg[èe]bre|analyse/i, max: { p: 30, ex: 60 } },
    { nom: 'Géométrie', re: /g[ée]om[ée]tri/i, max: { p: 20, ex: 40 } },
    { nom: 'Trigo. & Statistiques', re: /trigo|statistiq/i, max: { p: 10, ex: 20 } },
    { nom: 'Dessin scientifique', re: /dessin/i, max: { p: 10, ex: 20 } },
    { st: 'Sous-Total' },
    { gr: 'Sous-domaine des Sciences de la Vie et de la Terre' },
    { nom: 'Biologie générale', re: /biolog/i, max: { p: 20, ex: 40 } },
    // Valeurs imprimées sur le papier officiel (20 / 20 / 40) : ps = 10 par période pour rester dans le total
    { nom: 'Systématique et Jardin.', re: /syst[ée]matique|jardin/i, max: { p: 20, ex: 20, tot: 40, ps: 10 } },
    { nom: 'Géologie / Ecologie', re: /g[ée]olog|[ée]colog/i, max: { p: 20, ex: 20, tot: 40, ps: 10 } },
    { st: 'Sous-Total' }
  ].concat(hsCommun);

  /* ---------- Mécanique automobile : matières communes (IGE-153 à 156) ---------- */
  const MA = {
    religion:  { nom: 'Religion', re: /relig/i, sup: true },
    vie:       { nom: 'Education à la Vie', re: /\bvie\b/i },
    civ:       { nom: 'Ed. civ. & morale', re: /civ|morale/i },
    histoire:  { nom: 'Histoire', re: /histoir/i },
    geo:       { nom: 'Géographie', re: /g[ée]ograph/i },
    physique:  { nom: 'Physique', re: /^(?!.*(sport|[ée]duc|ed\.)).*physique/i },
    chimie:    { nom: 'Chimie', re: /chimie/i },
    info:      { nom: 'Informatique', re: /informati/i },
    metal:     { nom: 'Métallurgie', re: /m[ée]tallurg/i },
    actu:      { nom: 'Actualités', re: /actualit/i },
    anglais:   { nom: 'Anglais', re: /anglais/i },
    electro:   { nom: 'Electronique', re: /[ée]lectronique/i },
    technoAuto:{ nom: 'Techno. automobile', re: /techno.*auto/i },
    elecGen:   { nom: 'Electricité générale', re: /^(?!.*auto).*[ée]lectricit/i },
    elecAuto:  { nom: 'Electricité auto.', re: /[ée]lectricit.*auto/i },
    dessInd:   { nom: 'Dessin industriel', re: /dessin/i },
    mecGen:    { nom: 'Mécanique générale', re: /^(?!.*(appliqu|techno)).*m[ée]canique/i },
    technoAj:  { nom: 'Techno. ajustage', re: /techno.*ajust/i },
    francais:  { nom: 'Français', re: /fran[çc]ais/i },
    maths:     { nom: 'Mathématiques', re: /math/i },
    tpLabo:    { nom: 'T.P. labo.', re: /labo/i },
    atelierAj: { nom: 'Atelier ajustage', re: /^(?!.*techno).*ajust/i },
    connMat:   { nom: 'Connaiss. des matériaux', re: /connaiss.*mat|mat[ée]riaux/i },
    ecoProf:   { nom: 'Economie professionnelle', re: /[ée]conom/i },
    moteur:    { nom: 'Moteur thermique', re: /moteur/i },
    automation:{ nom: 'Automation', re: /automation/i },
    thp:       { nom: 'T.H.P.', re: /t\.?h\.?p\b|hydro|pneumat/i },
    elemMach:  { nom: 'Eléments des machines', re: /[ée]l[ée]ments?.*machine/i },
    resist:    { nom: 'Résistance matérielle', re: /r[ée]sist/i },
    mecAppl:   { nom: 'Mécanique appliquée', re: /m[ée]canique.*appliqu/i },
    automate:  { nom: 'Automate programmable', re: /automate|programm/i },
    organ:     { nom: 'Organisation', re: /organis/i },
    construct: { nom: 'Construction', re: /^(?!.*techno).*construction/i },
    atelierAuto:{ nom: 'Atelier Auto.', re: /atelier|pratique/i }
  };

  /* IGE-153 : 1ère */
  const GROUPES_153 = [
    { max: { p: 10, ex: 20 },  matieres: [MA.religion, MA.vie, MA.civ, MA.histoire, MA.geo, MA.physique, MA.chimie, MA.info, MA.metal] },
    { max: { p: 20, ex: 40 },  matieres: [MA.anglais, MA.electro, MA.technoAuto] },
    { max: { p: 30, ex: 60 },  matieres: [MA.elecGen, MA.dessInd, MA.mecGen, MA.technoAj] },
    { max: { p: 40, ex: 80 },  matieres: [MA.francais] },
    { max: { p: 50, ex: 100 }, matieres: [MA.maths] },
    { max: { p: 50, ex: 0 },   noEx: true, matieres: [MA.tpLabo, MA.atelierAj] }
  ];
  /* IGE-154 : 2ème */
  const GROUPES_154 = [
    { max: { p: 10, ex: 20 },  matieres: [MA.religion, MA.vie, MA.civ, MA.physique, MA.metal, MA.info, MA.actu] },
    { max: { p: 20, ex: 40 },  matieres: [MA.anglais, MA.chimie, MA.connMat, MA.ecoProf, MA.electro, MA.elecGen, MA.moteur, MA.technoAuto] },
    { max: { p: 30, ex: 60 },  matieres: [MA.dessInd, MA.mecGen] },
    { max: { p: 40, ex: 80 },  matieres: [MA.francais, MA.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [MA.tpLabo] }
  ];
  /* IGE-155 : 3ème */
  const GROUPES_155 = [
    { max: { p: 10, ex: 20 },  matieres: [MA.religion, MA.vie, MA.civ, MA.automation, MA.thp, MA.anglais, MA.metal, MA.info, MA.actu] },
    { max: { p: 20, ex: 40 },  matieres: [MA.technoAuto, MA.moteur, MA.elemMach, MA.electro, MA.resist, MA.mecAppl, MA.elecAuto, MA.automate] },
    { max: { p: 30, ex: 60 },  matieres: [MA.dessInd, MA.francais] },
    { max: { p: 40, ex: 80 },  matieres: [MA.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [MA.atelierAuto] }
  ];
  /* IGE-156 : 4ème · Examen d'Etat */
  const GROUPES_156 = [
    { max: { p: 10, ex: 20 },  matieres: [MA.religion, MA.vie, MA.civ, MA.anglais, MA.info, MA.actu, MA.electro] },
    { max: { p: 20, ex: 40 },  matieres: [{ nom: 'Résist.+ Eléments matér.', re: /r[ée]sist/i }, MA.mecAppl, MA.organ, MA.construct] },
    { max: { p: 30, ex: 60 },  matieres: [MA.dessInd] },
    { max: { p: 40, ex: 80 },  matieres: [MA.elecAuto, MA.moteur, MA.technoAuto] },
    { max: { p: 50, ex: 100 }, matieres: [MA.francais, MA.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [MA.atelierAuto] }
  ];

  /* ---------- Construction : matières communes (IGE-117 à 119) ---------- */
  const CO = {
    religion:  { nom: 'Religion', re: /relig/i, sup: true },
    vie:       { nom: 'Education à la Vie', re: /\bvie\b/i },
    civ:       { nom: 'Ed. civ. & morale', re: /civ|morale/i },
    anglais:   { nom: 'Anglais', re: /anglais/i },
    chimie:    { nom: 'Chimie', re: /chimie/i },
    connMat:   { nom: 'Connaissance des matér.', re: /connaiss.*mat|mat[ée]riaux/i },
    geoAct:    { nom: 'Géographie / actualités', re: /g[ée]ograph|actualit/i },
    actu:      { nom: 'Actualités', re: /actualit/i },
    graphost:  { nom: 'Graphostatique', re: /graphostat/i },
    histoire:  { nom: 'Histoire', re: /histoir/i },
    info:      { nom: 'Informatique', re: /informati/i },
    mecAppl:   { nom: 'Mécanique appliquée', re: /m[ée]canique.*appliqu/i },
    mecanique: { nom: 'Mécanique', re: /^(?!.*appliqu).*m[ée]canique/i },
    physique:  { nom: 'Physique', re: /^(?!.*(sport|[ée]duc|ed\.)).*physique/i },
    rdm:       { nom: 'Résistance des matériaux', re: /r[ée]sistance/i },
    technoCst: { nom: 'Techno. de construction', re: /techno.*construct/i },
    topo:      { nom: 'Topographie', re: /topograph/i },
    voies:     { nom: 'Voies de communication', re: /voies?.*communic/i },
    dessCst:   { nom: 'Dessin de construction', re: /dessin/i },
    francais:  { nom: 'Français', re: /fran[çc]ais/i },
    maths:     { nom: 'Mathématiques', re: /math/i },
    pratique:  { nom: 'Pratique professionnelle', re: /pratique|stage/i },
    assain:    { nom: 'Assainissement', re: /assainiss/i },
    beton:     { nom: 'Béton armé', re: /b[ée]ton/i },
    elec:      { nom: 'Electricité', re: /[ée]lectricit/i },
    outChant:  { nom: 'Outillage de chantier', re: /outillage/i },
    procedes:  { nom: 'Procédés des construct.', re: /proc[ée]d[ée]s/i },
    edPhys:    { nom: 'Éd. Physique & sportive', re: /[ée]duc.*phys|ed\..*phys|sport/i },
    legis:     { nom: 'Législation', re: /l[ée]gislat/i },
    organ:     { nom: 'Organisation', re: /organis/i },
    technolo:  { nom: 'Technologie', re: /technolog/i },
    dessin:    { nom: 'Dessin', re: /dessin/i }
  };
  /* IGE-117 : 1ère et 2ème (bulletin commun) */
  const GROUPES_117 = [
    { max: { p: 10, ex: 20 },  matieres: [CO.religion, CO.vie, CO.civ] },
    { max: { p: 20, ex: 40 },  matieres: [CO.anglais, CO.chimie, CO.connMat, CO.geoAct, CO.graphost, CO.histoire, CO.info, CO.mecAppl, CO.mecanique, CO.physique, CO.rdm, CO.technoCst, CO.topo, CO.voies] },
    { max: { p: 50, ex: 100 }, matieres: [CO.dessCst, CO.francais, CO.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [CO.pratique] }
  ];
  /* IGE-118 : 3ème */
  const GROUPES_118 = [
    { max: { p: 10, ex: 20 },  matieres: [CO.religion, CO.vie, CO.civ] },
    { max: { p: 20, ex: 40 },  matieres: [CO.actu, CO.anglais, CO.assain, CO.beton, CO.elec, CO.graphost, CO.info, CO.mecanique, CO.outChant, CO.procedes, CO.rdm, CO.technoCst, CO.topo, CO.voies] },
    { max: { p: 50, ex: 100 }, matieres: [CO.dessCst, CO.francais, CO.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [CO.pratique] }
  ];
  /* IGE-119 : 4ème · Examen d'Etat */
  const GROUPES_119 = [
    { max: { p: 10, ex: 20 },  matieres: [CO.religion, CO.civ, CO.vie] },
    { max: { p: 20, ex: 40 },  matieres: [CO.actu, CO.anglais, CO.edPhys, CO.elec, CO.info, CO.legis, CO.organ, CO.outChant, CO.rdm, CO.technolo, CO.topo, CO.voies] },
    { max: { p: 40, ex: 80 },  matieres: [CO.beton, CO.francais, CO.procedes] },
    { max: { p: 50, ex: 100 }, matieres: [CO.dessin, CO.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [CO.pratique] }
  ];

  /* ---------- Nutrition : matières communes (IGE-105 à 108) ---------- */
  const NU = {
    religion:  { nom: 'Religion', re: /relig/i, sup: true },
    vie:       { nom: 'Education à la Vie', re: /\bvie\b/i },
    civ:       { nom: 'Ed. civ. & morale', re: /civ|morale/i },
    edPhys:    { nom: 'Education phys. & sportive', re: /[ée]duc.*phys|ed\..*phys|sport/i },
    geo:       { nom: 'Géographie', re: /g[ée]ograph/i },
    histoire:  { nom: 'Histoire', re: /histoir/i },
    hygAlim:   { nom: 'Hygiène alimentaire', re: /hygi[èe]ne/i },
    info:      { nom: 'Informatique', re: /informati/i },
    anglais:   { nom: 'Anglais', re: /anglais/i },
    chimie:    { nom: 'Chimie', re: /chimie/i },
    nutGen:    { nom: 'Nutrition générale', re: /nutrition.*g[ée]n/i },
    physique:  { nom: 'Physique', re: /^(?!.*(sport|[ée]duc|ed\.)).*physique/i },
    technoAl:  { nom: 'Technologie alimentaire', re: /technolog.*aliment/i },
    biologie:  { nom: 'Biologie', re: /^(?!.*micro).*biolog/i },
    agri:      { nom: 'Agriculture', re: /agricult/i },
    francais:  { nom: 'Français', re: /fran[çc]ais/i },
    maths:     { nom: 'Mathématiques', re: /math/i },
    pratique:  { nom: 'Pratique professionnelle', re: /pratique/i },
    technoCul: { nom: 'Technologie culinaire', re: /culinaire/i },
    educNut:   { nom: 'Education nutritionnelle', re: /[ée]ducation.*nutri/i },
    pathNut:   { nom: 'Pathologie de la nutrition', re: /pathologi/i },
    zoo:       { nom: 'Zootechnie (élevage)', re: /zootechn|[ée]levage/i },
    ecoAlim:   { nom: 'Economie alimentaire', re: /[ée]conom/i },
    enquete:   { nom: 'Enquête nutritionnelle', re: /enqu[êe]te/i },
    entrep:    { nom: 'Entrepreneuriat', re: /entrepr/i },
    microAl:   { nom: 'Microbiologie alimentaire', re: /microbio/i },
    anatomie:  { nom: 'Anatomie & physiologie', re: /anatomie|physiolog/i },
    dietet:    { nom: 'Diététique', re: /di[ée]t[ée]tique/i },
    stage:     { nom: 'Stage', re: /stage/i }
  };
  /* IGE-105 : 1ère */
  const GROUPES_105 = [
    { max: { p: 10, ex: 20 },  matieres: [NU.religion, NU.vie, NU.civ, sup(NU.edPhys), NU.geo, NU.histoire, NU.hygAlim, sup(NU.info)] },
    { max: { p: 20, ex: 40 },  matieres: [NU.anglais, NU.chimie, NU.nutGen, NU.physique, NU.technoAl] },
    { max: { p: 30, ex: 60 },  matieres: [NU.biologie] },
    { max: { p: 40, ex: 80 },  matieres: [NU.agri] },
    { max: { p: 60, ex: 120 }, matieres: [NU.francais, NU.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [NU.pratique] }
  ];
  /* IGE-106 : 2ème */
  const GROUPES_106 = [
    { max: { p: 10, ex: 20 },  matieres: [NU.religion, NU.vie, NU.civ, sup(NU.edPhys), NU.geo, NU.histoire, NU.hygAlim, NU.info, NU.technoCul] },
    { max: { p: 20, ex: 40 },  matieres: [NU.anglais, NU.chimie, NU.educNut, NU.physique] },
    { max: { p: 30, ex: 60 },  matieres: [NU.biologie, NU.nutGen, NU.pathNut, NU.technoAl, NU.zoo] },
    { max: { p: 50, ex: 100 }, matieres: [NU.francais, NU.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [NU.pratique] }
  ];
  /* IGE-107 : 3ème */
  const GROUPES_107 = [
    { max: { p: 10, ex: 20 },  matieres: [NU.religion, NU.vie, NU.civ, sup(NU.edPhys), NU.geo, NU.histoire, NU.info] },
    { max: { p: 20, ex: 40 },  matieres: [NU.anglais, NU.chimie, NU.ecoAlim, NU.enquete, NU.entrep, NU.microAl, NU.physique] },
    { max: { p: 30, ex: 60 },  matieres: [NU.anatomie, NU.biologie, NU.dietet, NU.technoCul] },
    { max: { p: 40, ex: 80 },  matieres: [NU.francais, NU.maths] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [NU.pratique, NU.stage] }
  ];
  /* IGE-108 : 4ème · Examen d'Etat */
  const GROUPES_108 = [
    { max: { p: 10, ex: 20 },  matieres: [NU.religion, NU.vie, NU.civ, NU.edPhys, NU.geo, NU.histoire, NU.info, NU.physique] },
    { max: { p: 20, ex: 40 },  matieres: [NU.anglais, NU.chimie, NU.entrep] },
    { max: { p: 30, ex: 60 },  matieres: [NU.anatomie, NU.dietet, NU.francais, NU.maths, NU.technoCul] },
    { max: { p: 100, ex: 0 },  noEx: true, matieres: [NU.pratique] }
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
    },
    'HS-1': {
      type: 'domaines',
      label: '1ère HS · Scientifique',
      ref: 'IGE/P.S./012',
      titre: 'BULLETIN DE LA 1<sup>ère</sup> ANNEE DES HUMANITES SCIENTIFIQUES',
      structure: STRUCTURE_HS12
    },
    'HS-2': {
      type: 'domaines',
      label: '2ème HS · Scientifique',
      ref: 'IGE/P.S./012',
      titre: 'BULLETIN DE LA 2<sup>ème</sup> ANNEE DES HUMANITES SCIENTIFIQUES',
      structure: STRUCTURE_HS12
    },
    'HS-3': {
      type: 'domaines',
      label: '3ème HS · Scientifique',
      ref: 'IGE/P.S./012',
      titre: 'BULLETIN DE LA 3<sup>ème</sup> ANNEE DES HUMANITES SCIENTIFIQUES',
      structure: STRUCTURE_HS3
    },
    'IGE-153': {
      label: '1ère HP · Mécanique automobile',
      ref: 'IGE/P.S./153',
      titre: 'BULLETIN DE LA 1<sup>ère</sup> ANNEE HUMANITES / MECANIQUE AUTOMOBILE',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_153
    },
    'IGE-154': {
      label: '2ème HP · Mécanique automobile',
      ref: 'IGE/P.S./154',
      titre: 'BULLETIN DE LA 2<sup>ème</sup> ANNEE HUMANITES / MECANIQUE AUTOMOBILE',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_154
    },
    'IGE-155': {
      label: '3ème HP · Mécanique automobile',
      ref: 'IGE/P.S./155',
      titre: 'BULLETIN DE LA 3<sup>ème</sup> ANNEE HUMANITES / MECANIQUE AUTOMOBILE',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_155
    },
    'IGE-156': {
      label: '4ème HP · Mécanique automobile',
      ref: 'IGE/P.S./156',
      titre: 'BULLETIN DE LA 4<sup>ème</sup> ANNEE HUMANITES / MECANIQUE AUTOMOBILE',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      placeLabel: 'PLACE/NBRE ELEVES',
      rowH: 18,
      examenEtat: true,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_156
    },
    'IGE-117': {
      label: '1ère / 2ème HP · Construction',
      ref: 'IGE/P.S./117',
      titre: 'BULLETIN DE LA 1<sup>ère</sup>, 2<sup>ème</sup> (1) ANNEE HUMANITES / CONSTRUCTION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_117
    },
    'IGE-118': {
      label: '3ème HP · Construction',
      ref: 'IGE/P.S./118',
      titre: 'BULLETIN DE LA 3<sup>ème</sup> ANNEE HUMANITES / CONSTRUCTION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_118
    },
    'IGE-119': {
      label: '4ème HP · Construction',
      ref: 'IGE/P.S./119',
      titre: 'BULLETIN DE LA 4<sup>ème</sup> ANNEE HUMANITES / CONSTRUCTION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      placeLabel: 'PLACE/NBRE ELEVES',
      rowH: 18,
      examenEtat: true,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_119
    },
    'IGE-105': {
      label: '1ère HP · Nutrition',
      ref: 'IGE/P.S./105',
      titre: 'BULLETIN DE LA 1<sup>ère</sup> ANNEE HUMANITES / NUTRITION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_105
    },
    'IGE-106': {
      label: '2ème HP · Nutrition',
      ref: 'IGE/P.S./106',
      titre: 'BULLETIN DE LA 2<sup>ème</sup> ANNEE HUMANITES / NUTRITION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 18,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_106
    },
    'IGE-107': {
      label: '3ème HP · Nutrition',
      ref: 'IGE/P.S./107',
      titre: 'BULLETIN DE LA 3<sup>ème</sup> ANNEE HUMANITES / NUTRITION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      rowH: 17,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_107
    },
    'IGE-108': {
      label: '4ème HP · Nutrition',
      ref: 'IGE/P.S./108',
      titre: 'BULLETIN DE LA 4<sup>ème</sup> ANNEE HUMANITES / NUTRITION',
      province: 'PROVINCE EDUCATIONNELLE :',
      provLigne: false,
      pLabels: ['2<sup>e</sup>P.', '3<sup>e</sup>P.', '4<sup>e</sup>P.'],
      chef: 'Chef d’Etablissement,<br>Noms et Signature',
      fait: 'Fait à ……………….……., le……/……/20……',
      placeLabel: 'PLACE/NBRE ELEVES',
      rowH: 20,
      examenEtat: true,
      blkBas: false,
      maxGenDetail: true,
      groupes: GROUPES_108
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

  /* ---------- Rendu « Humanités Scientifiques » (par domaines, 2 semestres) ---------- */
  function renderDomaines(data, M) {
    const {
      eleve = {}, classe = {}, etab = {}, annee = '',
      notes = {}, matieres = [], rang = '', nEleves = ''
    } = data;

    const used = new Set();
    const items = M.structure.map(it => {
      if (!it.nom) return it;
      const mk = matieres.find(m => !used.has(m.id) && it.re.test(m.nom));
      if (mk) used.add(mk.id);
      return Object.assign({}, it, { matK: mk || null });
    });
    const autres = matieres.filter(m => !used.has(m.id));
    if (autres.length) {
      items.push({ gr: 'AUTRES MATIERES' });
      autres.forEach(m => items.push({ nom: m.nom, matK: m, max: { p: 20, ex: 40 } }));
      items.push({ st: 'Sous-Total' });
    }

    const mt = m => m.tot !== undefined ? m.tot : m.p * 2 + m.ex;
    const add = (a, b) => b === null ? a : (a === null ? b : a + b);
    const newPts = () => ({ P: [null, null, null, null], EX: [null, null], T: [null, null], TG: null });
    const addPts = (a, v) => {
      v.P.forEach((x, i) => a.P[i] = add(a.P[i], x));
      v.EX.forEach((x, i) => a.EX[i] = add(a.EX[i], x));
      v.T.forEach((x, i) => a.T[i] = add(a.T[i], x));
      a.TG = add(a.TG, v.TG);
    };
    const calc = (matK, m) => {
      const v = newPts();
      if (!matK) return v;
      const maxK = +matK.max || 20;
      const ps = m.ps !== undefined ? m.ps : m.p;
      const get = (code, maxG) => {
        const x = (notes[matK.id + '_' + code] || {})[eleve.id];
        if (x === undefined || x === null || x === '' || isNaN(x)) return null;
        return (+x / maxK) * maxG;
      };
      const codes = [['P1', 'P2', 'EX1'], ['P3', 'P4', 'EX2']];
      codes.forEach((c, t) => {
        v.P[2 * t] = get(c[0], ps);
        v.P[2 * t + 1] = get(c[1], ps);
        v.EX[t] = get(c[2], m.ex);
        const parts = [v.P[2 * t], v.P[2 * t + 1], v.EX[t]];
        v.T[t] = parts.some(x => x !== null) ? parts.reduce((s, x) => s + (x || 0), 0) : null;
      });
      v.TG = v.T.some(x => x !== null) ? v.T.reduce((s, x) => s + (x || 0), 0) : null;
      return v;
    };
    const f = v => v === null ? '' : String(Math.round(v * 10) / 10);

    // 19 colonnes : libellé + 2×7 (semestres) + 2 (T.G.) + 2 (repêchage)
    const cells = (m, v) => {
      const T = mt(m);
      let h = '';
      for (let t = 0; t < 2; t++) {
        h += `<td>${m.p}</td><td>${f(v.P[2 * t])}</td><td>${f(v.P[2 * t + 1])}</td><td>${m.ex}</td><td>${f(v.EX[t])}</td><td>${T}</td><td>${f(v.T[t])}</td>`;
      }
      return h + `<td>${T * 2}</td><td>${f(v.TG)}</td><td></td><td></td>`;
    };

    let tbody = '';
    let seg = newPts(), segM = { p: 0, ex: 0, tot: 0 };
    const tot = newPts(), gen = { p: 0, ex: 0, tot: 0 };
    const mxT = [0, 0];
    let mxTG = 0;

    items.forEach(it => {
      if (it.dm) { tbody += `<tr class="dm"><td colspan="19">${esc(it.dm)}</td></tr>`; return; }
      if (it.gr) { tbody += `<tr class="gr"><td colspan="19">${esc(it.gr)}</td></tr>`; return; }
      if (it.st) {
        tbody += `<tr class="st"><td class="br">${esc(it.st)}</td>${cells({ p: segM.p, ex: segM.ex, tot: segM.tot }, seg)}</tr>`;
        seg = newPts(); segM = { p: 0, ex: 0, tot: 0 };
        return;
      }
      const v = calc(it.matK, it.max);
      const T = mt(it.max);
      addPts(seg, v); addPts(tot, v);
      segM.p += it.max.p; segM.ex += it.max.ex; segM.tot += T;
      gen.p += it.max.p; gen.ex += it.max.ex; gen.tot += T;
      v.T.forEach((x, t) => { if (x !== null) mxT[t] += T; });
      if (v.TG !== null) mxTG += T * 2;
      tbody += `<tr><td class="br">${esc(it.nom)}${it.sup ? ' <sup>(1)</sup>' : ''}</td>${cells(it.max, v)}</tr>`;
    });

    const H = '<td class="hat"></td>', E = '<td></td>';
    // Maxima généraux (sans points) et totaux (points)
    const semMax = `<td>${gen.p}</td>${E}${E}<td>${gen.ex}</td>${E}<td>${gen.tot}</td>${E}`;
    tbody += `<tr class="st"><td class="br">MAXIMA GENERAUX</td>${semMax}${semMax}<td>${gen.tot * 2}</td>${E}${E}${E}</tr>`;
    const bas = (label, tv, tg) => {
      const t = i => `<td>${tv ? tv[i] : ''}</td>`;
      const sem = i => `${H}${E}${E}${H}${E}${H}${t(i)}`;
      return `<tr class="ht"><td class="br">${label}</td>${sem(0)}${sem(1)}${H}<td>${tg || ''}</td>${E}${E}</tr>`;
    };
    const pts = (a) => a === null ? '' : f(a);
    const pct = (a, b) => (a !== null && b) ? n2(a / b * 100) + '%' : '';
    // TOTAUX : points obtenus (colonnes MAX hachurées)
    tbody += `<tr class="st"><td class="br">TOTAUX</td>${[0, 1].map(t => `${H}<td>${pts(tot.P[2 * t])}</td><td>${pts(tot.P[2 * t + 1])}</td>${H}<td>${pts(tot.EX[t])}</td>${H}<td>${pts(tot.T[t])}</td>`).join('')}${H}<td>${pts(tot.TG)}</td>${E}${E}</tr>`;
    tbody += bas('POURCENTAGE', [0, 1].map(i => pct(tot.T[i], mxT[i])), pct(tot.TG, mxTG));
    tbody += bas('PLACE / NBRE D’ELEVES', null, rang ? esc(rang) + '/' + esc(nEleves) : '/');
    tbody += bas('APPLICATION');
    tbody += bas('CONDUITE');
    tbody += bas('SIGNATURE');

    const idCases = Array.from({ length: 20 }, () => '<i></i>').join('');
    const codeCases = Array.from({ length: 9 }, () => '<i></i>').join('');
    const permCases = Array.from({ length: 13 }, () => '<i></i>').join('');

    const w = [30, 28, 28, 30, 32, 32, 34];
    const sem = w.map(x => `<col style="width:${x}px">`).join('');
    const colgroup = `<colgroup><col style="width:170px">${sem}${sem}<col style="width:34px"><col style="width:36px"><col style="width:36px"><col style="width:48px"></colgroup>`;
    const subH = (a, b) => `<th>MAX</th><th>${a}</th><th>${b}</th><th>MAX<br>EX.</th><th>EXAM.</th><th>MAX<br>TOT.</th><th>TOTAL</th>`;
    const thead = `<thead>
<tr><th class="br" rowspan="2">BRANCHES</th><th colspan="7">PREMIER SEMESTRE</th><th colspan="7">SECOND SEMESTRE</th><th colspan="2">TOTAL GENERAL</th><th colspan="2">EXAMEN DE REPECHAGE</th></tr>
<tr>${subH('1<sup>ère</sup>P.', '2<sup>e</sup>P.')}${subH('3<sup>e</sup>P.', '4<sup>e</sup>P.')}<th>MAX</th><th>PTS</th><th>%</th><th>SIGN.<br>PROF.</th></tr>
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
  <div class="ft" style="display:block">
    <div>- L’élève ne pourra passer dans la classe supérieure s’il n’a subi avec succès un examen de repêchage en <span class="dl" style="width:300px"></span> (1)</div>
    <div style="display:flex;justify-content:space-between;margin-top:3px"><div>- L’élève passe dans la classe supérieure (1)<br>- L’élève double la classe (1)</div><div style="align-self:flex-end">Fait à <span class="dl" style="width:150px"></span> le <span class="dl" style="width:40px"></span> / <span class="dl" style="width:40px"></span> / 20<span class="dl" style="width:30px"></span></div></div>
  </div>
  <div class="sg"><div>Signature de l’élève</div><div>Sceau de l’Ecole</div><div>Chef d’Etablissement<br>Noms &amp; Signature</div></div>
  <div class="note"><div>(1) Biffer la mention inutile.<br>Note importante : Le bulletin est sans valeur s’il est raturé ou surchargé.<br><i>Interdiction formelle de reproduire ce bulletin sous peine des sanctions prévues par la loi.</i></div><em>${esc(M.ref)}</em></div>
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
    if (M.type === 'domaines') return renderDomaines(data, M);
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
