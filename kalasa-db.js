import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://jcbxzkdintbfzncyxljy.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_n_WNZW31QaI9U1ZA4hI9SA_CjMzHkL-';

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

export const ACCUEIL = {
  admin: 'index.html',
  directeur: 'index.html',
  secretaire: 'index.html',
  enseignant: 'index.html',
  caissier: 'index.html',
  eleve: 'index.html'
};

const CLE = 'kalasa_session';

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

export function garder(c) {
  localStorage.setItem(CLE, JSON.stringify(c));
}

export function contexte() {
  try { return JSON.parse(localStorage.getItem(CLE)); }
  catch { return null; }
}

export async function deconnexion() {
  localStorage.removeItem(CLE);
  try { await sb.auth.signOut(); } catch (e) {}
  location.replace('login.html');
}

function versLogin() {
  const page = location.pathname.split('/').pop() || 'index.html';
  location.replace('login.html?retour=' + encodeURIComponent(page));
  return new Promise(() => {});
}

export async function exigerSession(rolesAutorises) {
  const { data: { session } } = await sb.auth.getSession();
  const c = contexte();
  if (!session || !c || !c.exp || c.exp < Date.now()) {
    localStorage.removeItem(CLE);
    return versLogin();
  }
  let p;
  try { p = await ouvrirSession(); } catch (e) { return versLogin(); }
  if (!p || !p.actif) { await deconnexion(); return new Promise(() => {}); }
  if (Array.isArray(rolesAutorises) && rolesAutorises.length && !rolesAutorises.includes(p.role)) {
    location.replace(ACCUEIL[p.role] || 'index.html');
    return new Promise(() => {});
  }
  const etabs = p.etablissements || [];
  let etabId = c.etabId;
  if (!etabs.some(e => e.id === etabId)) etabId = etabs[0] ? etabs[0].id : null;
  const ctx = { ...c, ...p, etabId };
  garder(ctx);
  return ctx;
}