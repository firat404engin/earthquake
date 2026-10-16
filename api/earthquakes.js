const { normalizeAfad, normalizeKandilli } = require('../src/quake-utils');
async function getJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(14000), headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Upstream ${response.status}`);
  return response.json();
}
async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const url = new URL(req.url, 'http://localhost');
  const isArchive = url.searchParams.has('start') || url.searchParams.has('end');
  const day = /^\d{4}-\d{2}-\d{2}$/;
  const startInput = url.searchParams.get('start'); const endInput = url.searchParams.get('end');
  if (isArchive && (!day.test(startInput || '') || !day.test(endInput || ''))) return res.status(400).json({ error: 'Invalid date range' });
  if (isArchive && [startInput,endInput].some(value => {const d=new Date(`${value}T00:00:00Z`);return !Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==value;})) return res.status(400).json({ error: 'Invalid calendar date' });
  const end = isArchive ? new Date(`${endInput}T23:59:59+03:00`) : new Date();
  const start = isArchive ? new Date(`${startInput}T00:00:00+03:00`) : new Date(end.getTime() - 7 * 86400000);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start > end || end - start > 31 * 86400000 || start > new Date()) return res.status(400).json({ error: 'Choose a valid range of at most 31 days' });
  const params = new URLSearchParams({ start: start.toISOString().slice(0,19), end: end.toISOString().slice(0,19), limit: '5000', orderby: 'timedesc', format: 'json', minlat: '34', maxlat: '43', minlon: '24', maxlon: '46' });
  let events; let source; let fallback = false; let truncated = false;
  try {
    const raw = await getJson(`https://deprem.afad.gov.tr/apiv2/event/filter?${params}`);
    if (!Array.isArray(raw)) throw new Error('Invalid AFAD response');
    truncated = raw.length >= 5000;
    events = normalizeAfad(raw); source = 'AFAD';
    if (raw.length && !events.length) throw new Error('Invalid AFAD records');
  } catch (error) {
    if (isArchive) return res.status(503).json({ error: 'Archive source unavailable' });
    try {
      const raw = await getJson('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
      events = normalizeKandilli(raw.result).filter(q => q.latitude >= 34 && q.latitude <= 43 && q.longitude >= 24 && q.longitude <= 46);
      if (!events.length) throw new Error('Empty fallback');
      source = 'Kandilli'; fallback = true;
    } catch (_) { return res.status(503).json({ error: 'Earthquake sources are temporarily unavailable' }); }
  }
  res.setHeader('Cache-Control', 'public, s-maxage=45, stale-while-revalidate=60');
  return res.status(200).json({ events, source, fallback, fetchedAt: new Date().toISOString(), start: start.toISOString(), end: end.toISOString(), truncated });
}
module.exports = handler;
