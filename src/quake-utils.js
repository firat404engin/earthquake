function numeric(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
function utcTimestamp(value) {
  if (!value) return null;
  const text = String(value).trim().replace(' ', 'T');
  const date = new Date(/(?:Z|[+-]\d\d:\d\d)$/i.test(text) ? text : `${text}Z`);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}
function normalizeAfad(rows) {
  return clean((Array.isArray(rows) ? rows : []).map(q => ({
    id: `afad-${q.eventID}`, time: utcTimestamp(q.date), latitude: numeric(q.latitude), longitude: numeric(q.longitude),
    magnitude: numeric(q.magnitude), depth: numeric(q.depth), magnitudeType: q.type || 'M',
    location: q.location || [q.district, q.province].filter(Boolean).join(', '), source: 'AFAD',
  })));
}
function normalizeKandilli(rows) {
  return clean((Array.isArray(rows) ? rows : []).map(q => ({
    id: `kandilli-${q.earthquake_id || q._id || (q.date || q.date_time) + q.title}`, time: utcTimestamp((q.date_time || q.date) ? String(q.date_time || q.date).replace(/\./g, '-').replace(' ', 'T') + '+03:00' : ''),
    latitude: numeric(q.geojson?.coordinates?.[1]), longitude: numeric(q.geojson?.coordinates?.[0]), magnitude: numeric(q.mag),
    depth: numeric(q.depth), magnitudeType: 'M', location: q.title || '', source: 'Kandilli',
  })));
}
function clean(rows) {
  const seen = new Set();
  return rows.filter(q => {
    if (!q.time || !q.location || q.latitude === null || q.longitude === null || q.magnitude === null ||
      q.latitude < -90 || q.latitude > 90 || q.longitude < -180 || q.longitude > 180 || q.magnitude < 0 || q.magnitude > 10 || seen.has(q.id)) return false;
    seen.add(q.id); return true;
  }).sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
}
function filterQuakes(rows, { search = '', minimum = 0, hours = 0, now = Date.now() } = {}) {
  const query = search.trim().toLocaleLowerCase('tr-TR');
  return rows.filter(q => q.magnitude >= Number(minimum) && (!query || q.location.toLocaleLowerCase('tr-TR').includes(query)) &&
    (!Number(hours) || Date.parse(q.time) >= now - Number(hours) * 3600000));
}
function magnitudeColor(m) { return m >= 5 ? '#fb7185' : m >= 4 ? '#fb923c' : m >= 3 ? '#fbbf24' : '#38bdb1'; }
module.exports = { numeric, utcTimestamp, normalizeAfad, normalizeKandilli, clean, filterQuakes, magnitudeColor };
