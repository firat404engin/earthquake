import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';
import BlinkingMarker, { GreenBlinkingIcon } from './BlinkingMarker';
import Last100 from './Last100';

import TurkeyHeatLayer from './TurkeyHeatLayer';


// Varsayılan marker ikonunu düzelt
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function parseAFADTable(htmlString) {
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table tbody tr'));
  return rows.map(row => {
    const cells = row.querySelectorAll('td');
    return {
      date: cells[0]?.textContent.trim(),
      time: cells[1]?.textContent.trim(),
      latitude: parseFloat(cells[2]?.textContent.replace(',', '.')),
      longitude: parseFloat(cells[3]?.textContent.replace(',', '.')),
      depth: cells[4]?.textContent.trim(),
      magnitude: cells[5]?.textContent.trim(),
      location: cells[6]?.textContent.trim(),
      type: cells[7]?.textContent.trim(),
    };
  });
}

function Home() {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuakes() {
      try {
        const { data } = await axios.get('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
        data.result.slice(0, 3).forEach((q, i) => {
          console.log(`Deprem ${i+1}: coordinates=`, q.geojson.coordinates, 'title=', q.title);
        });
        const parsed = data.result.map(q => ({
          date: q.date.split(' ')[0],
          time: q.date.split(' ')[1],
          latitude: q.geojson.coordinates[1],
          longitude: q.geojson.coordinates[0],
          depth: q.depth,
          magnitude: q.mag,
          location: q.title,
          type: q.provider
        }));
        parsed.slice(0, 3).forEach((q, i) => {
          console.log(`Parsed ${i+1}: lat=`, q.latitude, 'lng=', q.longitude, 'title=', q.location);
        });
        setQuakes(parsed);
      } catch (err) {
        setQuakes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuakes();
    const interval = setInterval(fetchQuakes, 12000); // 12 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  const last5 = quakes.slice(0, 5).filter(q => typeof q.latitude === 'number' && typeof q.longitude === 'number' && !isNaN(q.latitude) && !isNaN(q.longitude));
  const others = quakes.slice(5, 30).filter(q => typeof q.latitude === 'number' && typeof q.longitude === 'number' && !isNaN(q.latitude) && !isNaN(q.longitude));

  // Fay hattı göster/gizle state

  const [showRiskBand, setShowRiskBand] = useState(true);
  const [showDepremPopup, setShowDepremPopup] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);

  // ESC ve arkaplan tıklamasıyla popup kapama fonksiyonu
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setShowDepremPopup(false);
        setShowAboutPopup(false);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function closeAllPopups() {
    setShowDepremPopup(false);
    setShowAboutPopup(false);
  }

// Büyük kırmızı marker
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [1, -38],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  shadowSize: [48, 48],
  shadowAnchor: [16, 48],
});

  // Mobilde mi?
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App">

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
         <div style={{position:'fixed', inset:0, zIndex:0}}>
            {/* Katman kontrol butonu overlay */}
            {/* Tüm butonlar sade kutuda, sağ üstte overlay */}
            {/* Modern floating action card for controls */}
            {isMobile ? (
              <div
                style={{
                  position:'fixed',
                  top:12,
                  right:10,
                  zIndex:2500,
                  background:'linear-gradient(135deg,rgba(255,255,255,0.92) 60%,rgba(240,244,255,0.99) 100%)',
                  borderRadius:18,
                  boxShadow:'0 4px 32px 0 #295c8a22, 0 1.5px 0 #fff8',
                  padding:'10px 8px',
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  gap:9,
                  backdropFilter:'blur(12px)',
                  border:'2px solid #e6eaf1',
                  fontFamily:'Inter,Segoe UI,sans-serif',
                  transition:'all .28s cubic-bezier(.4,1.4,.5,1)',
                  willChange:'transform',
                  overflow:'visible',
                }}
              >
                <button
                  style={{
                    background:'#f7f7f9',
                    color:'#2a2a2a',
                    border:'1.5px solid #d6d6d6',
                    borderRadius:12,
                    fontWeight:600,
                    fontSize:20,
                    padding:'10px',
                    cursor:'pointer',
                    textDecoration:'none',
                    boxShadow:'0 2px 8px #0001',
                    transition:'all .18s',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    width:44,
                    height:44,
                  }}
                  aria-label="Son Depremler"
                  onClick={()=>setShowDepremPopup(true)}
                >
                  <span style={{fontSize:26}}>🕑</span>
                </button>
                <button
                  style={{
                    background:'#f7f7f9',
                    color:'#2a2a2a',
                    border:'1.5px solid #d6d6d6',
                    borderRadius:12,
                    fontWeight:600,
                    fontSize:20,
                    padding:'10px',
                    cursor:'pointer',
                    textDecoration:'none',
                    boxShadow:'0 2px 8px #0001',
                    transition:'all .18s',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    width:44,
                    height:44,
                  }}
                  aria-label="Hakkımızda"
                  onClick={()=>setShowAboutPopup(true)}
                >
                  <span style={{fontSize:26}}>ℹ️</span>
                </button>
                <button
                  style={{
                    background:'#f7f7f9',
                    color:'#2a2a2a',
                    border:'1.5px solid #d6d6d6',
                    borderRadius:12,
                    fontWeight:600,
                    fontSize:20,
                    padding:'10px',
                    cursor:'pointer',
                    textDecoration:'none',
                    boxShadow:'0 2px 8px #0001',
                    transition:'all .18s',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    width:44,
                    height:44,
                  }}
                  aria-label="Risk Bandı"
                  onClick={()=>setShowRiskBand(v=>!v)}
                >
                  <span style={{fontSize:26}}>🌫️</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  position:'fixed',
                  top:32,
                  right:32,
                  zIndex:2500,
                  minWidth:180,
                  background:'rgba(255,255,255,0.68)',
                  borderRadius:18,
                  boxShadow:'0 4px 24px 0 #295c8a18',
                  padding:'10px 16px',
                  display:'flex',
                  flexDirection:'row',
                  alignItems:'center',
                  gap:14,
                  backdropFilter:'blur(10px)',
                  border:'1.5px solid #e6eaf1',
                  fontFamily:'Inter,Segoe UI,sans-serif',
                  transition:'all .22s cubic-bezier(.4,1.4,.5,1)',
                  willChange:'transform',
                  overflow:'visible',
                }}
                onMouseOver={e=>e.currentTarget.style.transform='scale(1.04)'}
                onMouseOut={e=>e.currentTarget.style.transform='none'}
              >
                <span style={{fontSize:22,marginRight:6,marginLeft:-4,opacity:0.92,filter:'drop-shadow(0 1px 4px #a8323222)'}} role="img" aria-label="Türkiye">🇹🇷</span>
                <button
                  style={{
                    background:'rgba(255,255,255,0.38)',
                    color:'#a83232',
                    border:'1px solid #e6eaf1',
                    borderRadius:10,
                    fontWeight:600,
                    fontSize:14,
                    padding:'7px 13px',
                    cursor:'pointer',
                    textDecoration:'none',
                    boxShadow:'0 1px 4px #0001',
                    transition:'all .15s',
                    display:'flex',
                    alignItems:'center',
                    gap:5
                  }}
                  onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.55)';e.currentTarget.style.transform='translateY(-1px) scale(1.03)';}}
                  onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.38)';e.currentTarget.style.transform='none';}}
                  onClick={()=>setShowDepremPopup(true)}
                >
                  <span style={{fontSize:16,marginRight:2}}>🕑</span> Son Depremler
                </button>
                <button
                  style={{
                    background:'rgba(255,255,255,0.38)',
                    color:'#a83232',
                    border:'1px solid #e6eaf1',
                    borderRadius:10,
                    fontWeight:600,
                    fontSize:14,
                    padding:'7px 13px',
                    cursor:'pointer',
                    textDecoration:'none',
                    boxShadow:'0 1px 4px #0001',
                    transition:'all .15s',
                    display:'flex',
                    alignItems:'center',
                    gap:5
                  }}
                  onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.55)';e.currentTarget.style.transform='translateY(-1px) scale(1.03)';}}
                  onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.38)';e.currentTarget.style.transform='none';}}
                  onClick={()=>setShowAboutPopup(true)}
                >
                  <span style={{fontSize:16,marginRight:2}}>ℹ️</span> Hakkımızda
                </button>
                <button
                  style={{
                    background:'rgba(255,255,255,0.38)',
                    color:'#a83232',
                    border:'1px solid #e6eaf1',
                    borderRadius:10,
                    fontWeight:600,
                    fontSize:14,
                    padding:'7px 13px',
                    cursor:'pointer',
                    boxShadow:'0 1px 4px #0001',
                    transition:'all .15s',
                    minWidth:90,
                    display:'flex',
                    alignItems:'center',
                    gap:5
                  }}
                  onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.55)';e.currentTarget.style.transform='translateY(-1px) scale(1.03)';}}
                  onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.38)';e.currentTarget.style.transform='none';}}
                  onClick={()=>setShowRiskBand(v=>!v)}
                >
                  <span style={{fontSize:16,marginRight:2}}>🌫️</span> {showRiskBand ? 'Risk Bandı' : 'Risk Bandı'}
                </button>
              </div>
            )}

            {/* Modern popup overlay */}
            {(showDepremPopup || showAboutPopup) && (
              <div
                style={{
                  position:'fixed',
                  inset:0,
                  zIndex:50000,
                  background:'rgba(0,0,0,0.28)',
                  backdropFilter:'blur(3px)',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  animation:'fadeIn .18s',
                }}
                onClick={closeAllPopups}
              >
                <div
                  style={{
                    minWidth:320,
                    maxWidth:'96vw',
                    minHeight:showDepremPopup?220:120,
                    background:'linear-gradient(135deg,#fff 85%,#f3f5fa 100%)',
                    borderRadius:22,
                    boxShadow:'0 8px 60px #0004',
                    padding: showDepremPopup ? '12px 2vw 10px 2vw' : '28px 28px 18px 28px',
                    position:'relative',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    animation:'popIn .22s cubic-bezier(.4,1.4,.5,1)',
                    // maxHeight ve overflowY kaldırıldı
                    // maxHeight: showDepremPopup ? '60vh' : '80vh',
                    // overflowY:'auto',
                  }}
                  onClick={e=>e.stopPropagation()}
                >
                  {/* showAboutPopup aktifken dışarıdaki çarpı butonunu gösterme */}
                  {!showAboutPopup && (
                    <button
                      onClick={closeAllPopups}
                      style={{
                        position:'absolute',
                        top:18,
                        right:18,
                        background:'rgba(240,240,240,0.8)',
                        border:'none',
                        borderRadius:8,
                        fontSize:22,
                        cursor:'pointer',
                        boxShadow:'0 2px 8px #0001',
                        width:36,
                        height:36,
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        transition:'background .12s',
                      }}
                      onMouseOver={e=>e.currentTarget.style.background='#ffe4e4'}
                      onMouseOut={e=>e.currentTarget.style.background='rgba(240,240,240,0.8)'}
                      aria-label="Kapat"
                    >✕</button>
                  )}
                  {showDepremPopup && (
                    <div style={{width:'100%',maxWidth:540}}>
                      <h2 style={{margin:'0 0 18px 0',fontWeight:700,fontSize:26,color:'#a83232',letterSpacing:0.5}}></h2>
                      <Last100 />
                    </div>
                  )}
                  {showAboutPopup && (
  <div style={{
    width: '100%',
    maxWidth: 370,
    margin: '0 auto',
    padding: '32px 26px 24px 26px',
    background: 'linear-gradient(135deg,#fff 85%,#f7fafd 100%)',
    borderRadius: 22,
    boxShadow: '0 6px 36px 0 #a8323233, 0 1.5px 0 #fff8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 220,
    gap: 0,
    zIndex: 1
  }}>
    {/* Kapat (çarpı) butonu */}
    <button
      onClick={closeAllPopups}
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        background: 'rgba(240,240,240,0.9)',
        border: 'none',
        borderRadius: 8,
        fontSize: 22,
        cursor: 'pointer',
        boxShadow: '0 2px 8px #0001',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background .12s',
        zIndex: 10
      }}
      onMouseOver={e => e.currentTarget.style.background='#ffe4e4'}
      onMouseOut={e => e.currentTarget.style.background='rgba(240,240,240,0.9)'}
      aria-label="Kapat"
    >✕</button>
    <div style={{
      width: 74,
      height: 74,
      borderRadius: '50%',
      background: 'linear-gradient(135deg,#fff1f1 70%,#f7fafd 100%)',
      boxShadow: '0 2px 12px #a8323222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      marginTop: -34
    }}>
      <svg width="44" height="44" viewBox="0 0 24 24" fill="#a83232"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </div>
    <div style={{fontWeight:800, fontSize:22, color:'#a83232', letterSpacing:0.2, marginBottom:4}}></div>
    <div style={{fontSize:16, color:'#444', textAlign:'center', marginBottom:18, lineHeight:1.6}}>
      Bu uygulama <span style={{fontWeight:600}}>Fırat Engin</span> tarafından tasarlanmıştır.<br/>
      Deprem verilerini harita üzerinde anlık ve görsel olarak sunar.
    </div>
    <a
      href="https://firatengin-henna.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
        padding: '12px 26px',
        background: 'linear-gradient(90deg,#ffebee 60%,#fff 100%)',
        borderRadius: 13,
        fontWeight: 700,
        color: '#a83232',
        textDecoration: 'none',
        fontSize: 18,
        boxShadow: '0 2px 10px #a8323222',
        border: '1.5px solid #f7eaea',
        transition: 'all .18s',
        letterSpacing: 0.2,
      }}
      onMouseOver={e => {e.currentTarget.style.background='#fff0f3';e.currentTarget.style.color='#e53935';}}
      onMouseOut={e => {e.currentTarget.style.background='linear-gradient(90deg,#ffebee 60%,#fff 100%)';e.currentTarget.style.color='#a83232';}}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#e53935" style={{marginRight:4}}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </a>
  </div>
)}
                </div>
              </div>
            )}
            <MapContainer center={[39.0, 35.0]} zoom={5} style={{ height: '100vh', width: '100vw' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Risk bandı PNG overlay (toggle) */}
              {showRiskBand && (
                <ImageOverlay
                  url="https://i.hizliresim.com/5db380d.png"
                  bounds={[[35.5, 25.3], [42.5, 45.4]]}
                  opacity={0.48}
                  zIndex={500}
                />
              )}

              {/* Türkiye deprem ısı dağılımı katmanı */}
              <TurkeyHeatLayer data={quakes.slice(0, 100).map(q => [q.latitude, q.longitude, Math.max(Number(q.magnitude)||1, 1)])} />
             {/* Son 5 deprem için dalga animasyonu */}
             {last5.map((q, idx) => {
  const mag = Number(q.magnitude);
  const isSmall = !isNaN(mag) && mag < 3.0;
  return (
    <BlinkingMarker
      key={idx}
      position={[q.latitude, q.longitude]}
      popupContent={{
        title: q.location,
        date: q.date,
        time: q.time,
        mag: q.magnitude,
        depth: q.depth
      }}
      icon={isSmall ? GreenBlinkingIcon : undefined}
    />
  );
})} 
             {/* Diğer depremler için de dalga animasyonu */}
             {others.map((q, idx) => {
  const mag = Number(q.magnitude);
  const isSmall = !isNaN(mag) && mag < 3.0;
  return (
    <BlinkingMarker
      key={idx}
      position={[q.latitude, q.longitude]}
      popupContent={{
        title: q.location,
        date: q.date,
        time: q.time,
        mag: q.magnitude,
        depth: q.depth
      }}
      icon={isSmall ? GreenBlinkingIcon : undefined}
    />
  );
})} 
           </MapContainer>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/last100" element={<Last100 />} />
      </Routes>
    </Router>
  );
}

export default App;
