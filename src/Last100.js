import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Last100.css";
import { texts, LANG } from './i18n';

function parseAfadFromHtml(htmlString) {
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table tr'));
  let parsed = rows
    .map(row => {
      const cells = row.querySelectorAll('td');
      if (!cells || cells.length < 6) return null;
      let ts = cells[0]?.textContent?.trim() || '';
      ts = ts.replace('T', ' ');
      let date = '', time = '';
      if (ts) {
        const parts = ts.split(/\s+/);
        if (parts.length >= 2) { date = parts[0]; time = parts[1]; }
        else {
          const m = ts.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)/);
          if (m) { date = m[1]; time = m[2]; } else { date = ts; }
        }
      }
      const depth = cells[3]?.textContent?.trim?.() || '';
      const mag = (cells[5] || cells[4])?.textContent?.trim?.() || '';
      const title = (cells[6] || cells[5])?.textContent?.trim?.() || '';
      return { ts, date, time, mag, depth, title };
    })
    .filter(Boolean);

  if (parsed.length === 0) {
    const lines = String(htmlString).split(/\r?\n/);
    parsed = lines
      .filter(l => l.startsWith('|') && /\d{4}-\d{2}-\d{2}/.test(l))
      .map(l => l.replace(/^\|\s*/, '').replace(/\s*\|\s*$/, ''))
      .map(l => l.split(/\s*\|\s*/))
      .map(cols => {
        if (cols.length < 7) return null;
        const ts = (cols[0] || '').trim().replace('T', ' ');
        const parts = ts.split(/\s+/);
        const date = parts[0] || '';
        const time = parts[1] || '';
        const depth = (cols[3] || '').trim();
        const mag = (cols[5] || '').trim();
        const title = (cols[6] || '').trim();
        return { ts, date, time, mag, depth, title };
      })
      .filter(Boolean);
  }
  return parsed;
}

export default function Last100({ lang = LANG.TR }) {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(quakes.length / perPage);

  useEffect(() => {
    async function fetchQuakes() {
      try {
        // Birincil: AFAD Son Depremler
        const { data: html } = await axios.get('https://r.jina.ai/https://deprem.afad.gov.tr/last-earthquakes.html');
        const parsed = parseAfadFromHtml(String(html));
        if (parsed.length > 0) {
          const normalized = parsed.slice(0, 100).map(q => ({
            ts: q.ts || `${q.date || ''} ${q.time || ''}`.trim(),
            date: q.date || '',
            time: q.time || '',
            mag: q.magnitude || q.mag || '',
            depth: q.depth || '',
            title: q.location || q.title || ''
          }));
          setQuakes(normalized);
          return;
        }
        throw new Error('AFAD empty');
      } catch (err) {
        // Fallback: Kandilli JSON
        try {
          const { data } = await axios.get(
            "https://api.orhanaydogdu.com.tr/deprem/kandilli/live"
          );
          const normalized = Array.isArray(data?.result) ? data.result.slice(0, 100).map(q => {
            const dateStr = String(q?.date || "");
            const parts = dateStr.split(" ");
            return {
              ts: dateStr,
              date: parts[0] || "",
              time: parts[1] || "",
              mag: q?.mag ?? "",
              depth: q?.depth ?? "",
              title: q?.title ?? ""
            };
          }) : [];
          setQuakes(normalized);
        } catch (err2) {
          setQuakes([]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchQuakes();
  }, []);

  useEffect(() => {
    // Sayfa değişince tabloyu yukarı kaydır
    const el = document.querySelector('.last100-container');
    if (el) el.scrollTop = 0;
  }, [page]);

  const pagedQuakes = quakes.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="last100-container">
      <div className="quake-card">
        <h2 style={{textAlign:'center',margin:'14px 0 10px 0',fontWeight:800,fontSize:26,color:'#a83232',letterSpacing:0.5}}>{texts[lang].last100Title}</h2>
        {loading ? (
          <p style={{textAlign:'center',margin:'32px 0'}}>Yükleniyor...</p>
        ) : (
          <>
          <table className="quake-table" style={{width:'100%',borderCollapse:'separate',borderSpacing:0}}>
            <thead>
              <tr style={{background:'#f7f7fa'}}>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>{texts[lang].date}</th>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>{texts[lang].time}</th>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>{texts[lang].magnitude}</th>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>{texts[lang].depthKm}</th>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>{texts[lang].location}</th>
              </tr>
            </thead>
            <tbody>
              {pagedQuakes.map((q, i) => (
                <tr key={i} style={{transition:'background .13s',cursor:'pointer'}}>
                  <td style={{padding:'8px 6px',fontSize:15}}>{q.date || (q.ts ? q.ts.split(' ')[0] : '')}</td>
                  <td style={{padding:'8px 6px',fontSize:15}}>{q.time || (q.ts ? q.ts.split(' ')[1] : '')}</td>
                  <td style={{padding:'8px 6px',fontSize:15}}>
                    {(() => {
                      const mag = parseFloat(q.mag);
                      let bg = '#eceff4', color = '#555';
                      if (mag >= 3 && mag < 4) { bg = '#fff3c0'; color = '#bfa600'; }
                      else if (mag >= 4 && mag < 5) { bg = '#ffe0c0'; color = '#e67e22'; }
                      else if (mag >= 5) { bg = '#ffe5e5'; color = '#a83232'; }
                      return (
                        <span className="mag-badge" style={{background:bg,color}}>{q.mag}</span>
                      );
                    })()}
                  </td>
                  <td style={{padding:'8px 6px',fontSize:15}}>{q.depth}</td>
                  <td style={{padding:'8px 6px',fontSize:15}}>{q.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:14,marginTop:18}}>
            <button
              onClick={()=>setPage(p=>Math.max(1,p-1))}
              disabled={page===1}
              style={{padding:'8px 18px',borderRadius:10,border:'1px solid #e6eaf1',background:page===1?'#f1f1f1':'#fff',color:'#2a2a2a',fontWeight:700,boxShadow:'0 2px 8px #0001',fontSize:15,cursor:page===1?'not-allowed':'pointer',transition:'all .15s'}}
            >← {texts[lang].prev}</button>
            <span style={{fontSize:16,fontWeight:800,color:'#a83232',letterSpacing:0.2}}>{texts[lang].pageXofY(page,totalPages)}</span>
            <button
              onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
              disabled={page===totalPages}
              style={{padding:'8px 18px',borderRadius:10,border:'1px solid #e6eaf1',background:page===totalPages?'#f1f1f1':'#fff',color:'#2a2a2a',fontWeight:700,boxShadow:'0 2px 8px #0001',fontSize:15,cursor:page===totalPages?'not-allowed':'pointer',transition:'all .15s'}}
            >{texts[lang].next} →</button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

