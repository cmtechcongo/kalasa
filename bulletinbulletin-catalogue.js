// bulletin-catalogue.js — bulletins officiels MINEDUC 2024-2025 (humanités)
// max = points d'UNE période.
//  normale  : P1=max, P2=max, Examen=2×max → semestre 4×max, général 8×max
//  pratique : Travaux=max, Examen=max     → semestre 2×max, général 4×max
// AJOUTER UN MODÈLE : copier un bloc, changer cle / code / annees / option / groupes.

export const BULLETIN_CATALOGUE = [
  { cle: 'hum_peda_1', code: 'IGE/P.S./024', niveau: 'humanite', annees: [1],
    option: 'Pédagogie générale', repechage: true, examenEtat: false,
    groupes: [
      { max: 10, b: ['Religion', 'Éducation à la Vie', 'Éd. civique & morale'] },
      { max: 20, b: ['Biologie', 'Dessin', 'Éducation musicale / Théâtrale',
        'Éducation phys. & sportive', 'Géographie', 'Histoire', 'Informatique',
        'Langues nationales', 'Sociologie africaine', 'Travail manuel / Écriture'] },
      { max: 40, b: ['Chimie', 'Mathématiques', 'Pédagogie', 'Physique', 'Psychologie'] },
      { max: 50, b: ['Anglais', 'Français'] },
    ] },

  { cle: 'hum_peda_2', code: 'IGE/P.S./025', niveau: 'humanite', annees: [2],
    option: 'Pédagogie générale', repechage: true, examenEtat: false,
    groupes: [
      { max: 10, b: ['Religion', 'Éducation à la Vie', 'Éd. civique & morale'] },
      { max: 20, b: ['Chimie', 'Dessin', 'Éducation phys. & sportive', 'Économie politique',
        'Éducation musicale / Théâtrale', 'Géographie', 'Histoire', 'Informatique',
        'Langues nationales', 'Microbiologie', 'Physique'] },
      { max: 40, b: ['Didactique des disciplines', 'Didactique générale', 'Mathématiques',
        'Pédagogie', 'Psychologie', 'Travail manuel / Écriture'] },
      { max: 50, b: ['Anglais', 'Français'] },
    ] },

  { cle: 'hum_peda_3', code: 'IGE/P.S./026', niveau: 'humanite', annees: [3],
    option: 'Pédagogie générale', repechage: true, examenEtat: false,
    groupes: [
      { max: 10, b: ['Religion', 'Éducation à la Vie', 'Éd. civique & morale', 'Informatique'] },
      { max: 20, b: ['Biologie', 'Éducation musicale / Théâtrale', 'Éducation phys. & sportive',
        'Esthétique', 'Géographie', 'Histoire', 'Physique'] },
      { max: 40, b: ['Anglais', 'Langues nationales', 'Mathématiques'] },
      { max: 50, b: ['Français', 'Dessin', 'Didactique des disciplines', 'Didactique générale',
        'Pédagogie', 'Psychologie', 'Travail manuel / Écriture'] },
      { max: 100, pratique: true, b: ["Pratique d'enseignement"] },
    ] },

  { cle: 'hum_peda_4', code: 'IGE/P.S./027', niveau: 'humanite', annees: [4],
    option: 'Pédagogie générale', repechage: false, examenEtat: true,
    groupes: [
      { max: 10, b: ['Religion', 'Éducation à la Vie', 'Éd. civique & morale', 'Informatique'] },
      { max: 20, b: ['Biologie', 'Éducation phys. & sportive', 'Géographie', 'Histoire',
        'Philosophie', 'Physique'] },
      { max: 40, b: ['Anglais', 'Langues nationales', 'Mathématiques'] },
      { max: 50, b: ['Français', 'Dessin', 'Didactique des disciplines', 'Didactique générale',
        'Éducation musicale / Théâtrale', 'Pédagogie', 'Psychologie', 'Travail manuel / Écriture'] },
      { max: 100, pratique: true, b: ["Pratique d'enseignement"] },
    ] },
];

const pts = g => g.pratique
  ? { travaux: g.max, examen: g.max, semestre: 2 * g.max, general: 4 * g.max }
  : { periode: g.max, examen: 2 * g.max, semestre: 4 * g.max, general: 8 * g.max };

export const optionsHumanites = () => [...new Set(BULLETIN_CATALOGUE.map(m => m.option))];

export function trouverModele(annee, option) {
  return BULLETIN_CATALOGUE.find(m => m.annees.includes(+annee) && m.option === option) || null;
}

export function maximaModele(modele) {
  const lignes = [];
  let general = 0;
  for (const g of modele.groupes) for (const nom of g.b) {
    const p = pts(g);
    lignes.push({ nom, pratique: !!g.pratique, ...p });
    general += p.general;
  }
  return { lignes, general };
}

// notes = { 'Religion': { s1:{p1,p2,ex}, s2:{p3,p4,ex} },
//           "Pratique d'enseignement": { s1:{tr,ex}, s2:{tr,ex} } }
export function calculerBulletin(modele, notes = {}) {
  const n = v => (Number.isFinite(+v) ? +v : 0);
  const somme = (o, ks) => ks.reduce((t, k) => t + n(o?.[k]), 0);
  const { lignes, general } = maximaModele(modele);
  let obtenu = 0;
  const rows = lignes.map(l => {
    const s = notes[l.nom] || {};
    const s1 = somme(s.s1, l.pratique ? ['tr', 'ex'] : ['p1', 'p2', 'ex']);
    const s2 = somme(s.s2, l.pratique ? ['tr', 'ex'] : ['p3', 'p4', 'ex']);
    obtenu += s1 + s2;
    return { ...l, s1, s2, total: s1 + s2 };
  });
  return { rows, obtenu, general,
    pourcentage: general ? Math.round((obtenu / general) * 10000) / 100 : 0 };
}