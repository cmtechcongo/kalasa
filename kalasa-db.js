import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://VOTRE-PROJET.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_VOTRE_CLE';

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const CLE = 'kalasa_session';

/* Page d'accueil de chaque rôle : à changer quand les pages existeront */
export const ACCUEIL = {
  admin: 'index.html',
  directeur: 'index.html',
  secretaire: 'index.html',
  enseignant: 'index.html',
  caissier: 'index.html',
  eleve: 'index.html'
};

export async function emailPour(identifiant) {
  const { data, error } = await sb.rpc('email_pour_identifiant', { p_identifiant: identifiant });
  if (error) throw error;
  return data;
}

export async function ouvrirSession() {
  const { data, error } = await sb.rpc('kalasa_ouvrir_session');
  if (error) throw error;
  return data;
}

export const contexte = () => {
  try { return JSON.parse(localStorage.getItem(CLE)); } catch { return null; }
};
export const garder = (ctx) => localStorage.setItem(CLE, JSON.stringify(ctx));

/* À appeler au début de chaque page protégée.
   rolesAutorises : liste de rôles (ou rien = tous les rôles connectés) */
export async function exigerSession(rolesAutorises) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { location.replace('login.html'); return null; }

  let profil = null;
  try { profil = await ouvrirSession(); } catch { profil = null; }
  if (!profil || !profil.actif) { await deconnexion(); return null; }

  if (rolesAutorises && !rolesAutorises.includes(profil.role)) {
    alert('Accès non autorisé pour votre rôle.');
    location.replace(ACCUEIL[profil.role] || 'index.html');
    return null;
  }

  const ancien = contexte() || {};
  const etab = profil.etablissements.find(e => e.id === ancien.etabId)
            || profil.etablissements[0] || null;
  const ctx = { ...profil, etabId: etab ? etab.id : null };
  garder(ctx);
  return ctx;
}

export async function deconnexion() {
  try { await sb.auth.signOut(); } catch {}
  localStorage.removeItem(CLE);
  location.replace('login.html');
}