// Vercel serverless function: reads the published Google Sheet (CSV) and returns JSON.
// Set SHEET_CSV_URL in Vercel → Project Settings → Environment Variables.

function parseCSV(t) {
  const rows = [];
  let r = [], c = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) {
      if (ch === '"') { if (t[i + 1] === '"') { c += '"'; i++; } else q = false; }
      else c += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { r.push(c); c = ''; }
    else if (ch === '\n') { r.push(c); rows.push(r); r = []; c = ''; }
    else if (ch !== '\r') c += ch;
  }
  if (c || r.length) { r.push(c); rows.push(r); }
  return rows;
}

module.exports = async (req, res) => {
  const url = process.env.SHEET_CSV_URL;
  if (!url) return res.status(500).json({ error: 'SHEET_CSV_URL is not set' });
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Sheet responded with ' + resp.status);
    const rows = parseCSV(await resp.text());
    const head = rows.shift().map(h => h.trim().toLowerCase());
    const col = (name, fallback) => {
      const i = head.findIndex(h => h.includes(name));
      return i === -1 ? fallback : i;
    };
    const iDate = col('date', 0), iAsk = col('ask', 1), iReply = col('reply', 2),
          iScore = col('score', 3), iNote = col('note', 4);
    const entries = rows
      .map(r => ({
        date: (r[iDate] || '').trim(),
        ask: (r[iAsk] || '').trim(),
        reply: (r[iReply] || '').trim(),
        score: parseFloat(r[iScore]),
        note: (r[iNote] || '').trim(),
      }))
      .filter(e => e.ask && !isNaN(e.score));
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json({ entries });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
