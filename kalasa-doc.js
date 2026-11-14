/* KALASA — en-tête et signatures communs à tous les reçus et rapports */
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ----- Version HTML (écran, impression, reçus) ----- */
export function enteteHtml(etab, titre, sous) {
  const e = etab || {};
  return `<div style="text-align:center;border-bottom:3px double #000;padding-bottom:10px;margin-bottom:14px;color:#000">
  <div style="font-size:22px;font-weight:800;letter-spacing:.05em;text-transform:uppercase">${esc(e.nom || '')}</div>
  <div style="font-size:13px;margin-top:2px">${esc(e.adresse || '')}${e.telephone ? ' · Tél : ' + esc(e.telephone) : ''}</div>
  <div style="font-size:18px;font-weight:700;margin-top:12px;text-transform:uppercase">${esc(titre)}</div>
  ${sous ? `<div style="font-size:12px;margin-top:2px">${esc(sous)}</div>` : ''}</div>`;
}
/* personnes = [{ titre:'Le caissier', nom:'…' }, …] ; le sceau est ajouté automatiquement */
export function signaturesHtml(personnes) {
  const col = p => `<div style="flex:1;text-align:center;font-size:12px"><div style="font-weight:600">${esc(p.titre)}</div>
    <div style="height:46px"></div><div style="border-top:1px solid #000;padding-top:4px">${esc(p.nom || '')}</div>
    <div style="font-size:11px;opacity:.7">Signature</div></div>`;
  const sceau = `<div style="flex:1;text-align:center;font-size:12px"><div style="font-weight:600">Sceau de l'établissement</div>
    <div style="height:80px;width:80px;border:1px dashed #000;border-radius:50%;margin:6px auto"></div></div>`;
  return `<div style="display:flex;gap:10px;margin-top:22px;color:#000">${(personnes || []).map(col).join('')}${sceau}</div>`;
}
export function ouvrirImpression(corps, titre) {
  const w = window.open('', '_blank');
  if (!w) { alert('Autorisez les fenêtres pop-up pour imprimer.'); return; }
  w.document.write(`<html><head><meta charset="utf-8"><title>${esc(titre)}</title>
    <style>body{font-family:sans-serif;padding:16px;color:#000}table{width:100%;border-collapse:collapse}
    td,th{border:1px solid #000;padding:6px;font-size:12px;text-align:left}</style></head><body>${corps}
    <script>onload=()=>setTimeout(print,400)<\/script></body></html>`);
  w.document.close();
}

/* ----- Version PDF (jsPDF) ----- */
export function entetePdf(d, etab, titre, sous) {
  const e = etab || {}, W = d.internal.pageSize.getWidth();
  d.setFont(undefined, 'bold'); d.setFontSize(17);
  d.text(String(e.nom || '').toUpperCase(), W / 2, 16, { align: 'center' });
  d.setFont(undefined, 'normal'); d.setFontSize(10);
  d.text(String(e.adresse || '') + (e.telephone ? ' · Tél : ' + e.telephone : ''), W / 2, 22, { align: 'center' });
  d.setLineWidth(0.6); d.line(14, 26, W - 14, 26);
  d.setFont(undefined, 'bold'); d.setFontSize(13);
  d.text(String(titre).toUpperCase(), W / 2, 34, { align: 'center' });
  d.setFont(undefined, 'normal'); d.setFontSize(9);
  if (sous) d.text(String(sous), W / 2, 40, { align: 'center' });
  return sous ? 46 : 42;     // position Y où commence le contenu
}
export function signaturesPdf(d, y, personnes) {
  const W = d.internal.pageSize.getWidth(), H = d.internal.pageSize.getHeight();
  if (y > H - 60) { d.addPage(); y = 25; }
  y += 14;
  const l = personnes || [], n = l.length + 1, w = (W - 28) / n;
  d.setFontSize(9);
  l.forEach((p, i) => {
    const x = 14 + i * w + w / 2;
    d.setFont(undefined, 'bold'); d.text(String(p.titre), x, y, { align: 'center' });
    d.setFont(undefined, 'normal');
    d.line(x - w / 2 + 6, y + 24, x + w / 2 - 6, y + 24);
    d.text(String(p.nom || ''), x, y + 29, { align: 'center' });
    d.text('Signature', x, y + 33, { align: 'center' });
  });
  const xs = 14 + l.length * w + w / 2;
  d.setFont(undefined, 'bold'); d.text("Sceau de l'établissement", xs, y, { align: 'center' });
  d.setFont(undefined, 'normal'); d.circle(xs, y + 17, 11);
}