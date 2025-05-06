import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Last100.css";

export default function Last100() {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(quakes.length / perPage);

  useEffect(() => {
    async function fetchQuakes() {
      try {
        const { data } = await axios.get(
          "https://api.orhanaydogdu.com.tr/deprem/kandilli/live"
        );
        setQuakes(data.result.slice(0, 100));
      } catch (err) {
        setQuakes([]);
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
    <div className="last100-container" style={{maxWidth:520,margin:'0 auto',padding:'0',background:'none'}}>
      <div style={{
        background:'#fff',
        borderRadius:18,
        boxShadow:'0 6px 32px #0001',
        padding:'16px 8px 8px 8px',
        margin:'0 auto',
        width:'100%',
        minWidth:260,
      }}>
        <h2 style={{textAlign:'center',margin:'0 0 18px 0',fontWeight:800,fontSize:26,color:'#a83232',letterSpacing:0.5}}>Son 100 Deprem</h2>
        {loading ? (
          <p style={{textAlign:'center',margin:'32px 0'}}>Yükleniyor...</p>
        ) : (
          <>
          <table className="quake-table" style={{width:'100%',borderCollapse:'separate',borderSpacing:0}}>
            <thead>
              <tr style={{background:'#f7f7fa'}}>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>Tarih</th>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>Saat</th>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>Büyüklük</th>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>Derinlik (km)</th>
                <th style={{fontWeight:700,fontSize:16,padding:'10px 6px'}}>Lokasyon</th>
              </tr>
            </thead>
            <tbody>
              {pagedQuakes.map((q, i) => (
                <tr key={i} style={{transition:'background .13s',borderRadius:12,boxShadow:'none',cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.background='#f8fafd'} onMouseOut={e=>e.currentTarget.style.background=''}>
                  <td style={{padding:'8px 6px',fontSize:15}}>{q.date.split(" ")[0]}</td>
                  <td style={{padding:'8px 6px',fontSize:15}}>{q.date.split(" ")[1]}</td>
                  <td style={{padding:'8px 6px',fontSize:15}}>
                    {(() => {
                      const mag = parseFloat(q.mag);
                      let bg = '#e0e0e0', color = '#888';
                      if (mag >= 3 && mag < 4) { bg = '#fff3c0'; color = '#bfa600'; }
                      else if (mag >= 4 && mag < 5) { bg = '#ffe0c0'; color = '#e67e22'; }
                      else if (mag >= 5) { bg = '#ffeaea'; color = '#a83232'; }
                      return (
                        <span style={{display:'inline-block',minWidth:38,padding:'4px 0',borderRadius:8,background:bg,color, fontWeight:700,fontSize:15,boxShadow:'0 1px 4px #0001',textAlign:'center'}}>{q.mag}</span>
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
              style={{padding:'8px 18px',borderRadius:10,border:'none',background:page===1?'#f1f1f1':'#f7f7fa',color:'#a83232',fontWeight:700,boxShadow:'0 2px 8px #0001',fontSize:15,cursor:page===1?'not-allowed':'pointer',transition:'all .15s'}}
            >← Önceki</button>
            <span style={{fontSize:16,fontWeight:700,color:'#a83232',letterSpacing:0.2}}>Sayfa {page} / {totalPages}</span>
            <button
              onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
              disabled={page===totalPages}
              style={{padding:'8px 18px',borderRadius:10,border:'none',background:page===totalPages?'#f1f1f1':'#f7f7fa',color:'#a83232',fontWeight:700,boxShadow:'0 2px 8px #0001',fontSize:15,cursor:page===totalPages?'not-allowed':'pointer',transition:'all .15s'}}
            >Sonraki →</button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

