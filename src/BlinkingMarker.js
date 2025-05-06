import React, { useRef, useEffect } from "react";
import L from "leaflet";
import { Marker, Popup, useMap } from "react-leaflet";

// Daha büyük ve dikkat çekici yanıp sönen marker
const BlinkingIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E@keyframes wave1{0%25{r:10;opacity:0.5;}100%25{r:22;opacity:0;}}@keyframes wave2{0%25{r:6;opacity:0.5;}100%25{r:16;opacity:0;}}.wave1{stroke:%23f44e4e;stroke-width:2;fill:none;animation:wave1 1.5s infinite;}.wave2{stroke:%23f44e4e;stroke-width:2;fill:none;animation:wave2 1.5s infinite 0.4s;}%3C/style%3E%3C/defs%3E%3Ccircle class='wave1' cx='24' cy='24' r='10'/%3E%3Ccircle class='wave2' cx='24' cy='24' r='6'/%3E%3Ccircle cx='24' cy='24' r='5' fill='%23f44e4e'/%3E%3C/svg%3E",
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24],
});

// Küçük depremler için yeşil ikon
const GreenBlinkingIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E@keyframes wave1{0%25{r:10;opacity:0.5;}100%25{r:22;opacity:0;}}@keyframes wave2{0%25{r:6;opacity:0.5;}100%25{r:16;opacity:0;}}.wave1{stroke:%23007f3f;stroke-width:2;fill:none;animation:wave1 1.5s infinite;}.wave2{stroke:%23007f3f;stroke-width:2;fill:none;animation:wave2 1.5s infinite 0.4s;}%3C/style%3E%3C/defs%3E%3Ccircle class='wave1' cx='24' cy='24' r='10'/%3E%3Ccircle class='wave2' cx='24' cy='24' r='6'/%3E%3Ccircle cx='24' cy='24' r='5' fill='%23007f3f'/%3E%3C/svg%3E",
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24],
});

export { GreenBlinkingIcon };

export default function BlinkingMarker({ position, popupContent, icon }) {
  const markerRef = useRef();
  const map = useMap();

  // Marker'a otomatik popup aç
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [position]);

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return (
    <Marker icon={icon || BlinkingIcon} position={position} ref={markerRef}>
      <Popup autoPan={false} closeButton={false} className="big-popup">
        {popupContent && typeof popupContent === 'object' ? (
  <div style={{
    minWidth: 185,
    maxWidth: 270,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 6px 24px 0 #a8323233',
    padding: '16px 16px 12px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    border: '1.5px solid #f7eaea',
    fontFamily: 'Inter,Segoe UI,sans-serif'
  }}>
    {/* Başlık ve ikon */}
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#a83232" style={{flexShrink:0}}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      <span style={{fontWeight:800,fontSize:18,color:'#a83232',whiteSpace:'pre-line',flex:1,letterSpacing:0.1}}>{popupContent.title}</span>
    </div>
    {/* Tarih ve saat tek satırda */}
    <div style={{display:'flex',alignItems:'center',gap:10,fontSize:14,color:'#666',fontWeight:500,margin:'2px 0 2px 0'}}>
      <svg width="16" height="16" fill="#888" viewBox="0 0 24 24" style={{marginRight:2,flexShrink:0}}><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/></svg>
      <span>{popupContent.date}</span>
      <svg width="16" height="16" fill="#888" viewBox="0 0 24 24" style={{marginLeft:7,marginRight:2,flexShrink:0}}><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.76-.3-7.88-2.42C2.37 15.76 1.59 12.83 2.07 10H4v2h2V8H4c-.47 0-.93.06-1.38.18C3.07 6.13 7.17 3.01 12 3.07V5h2V3.07c.46.01.91.05 1.36.13C18.93 6.13 21.63 10.06 20.93 14H20v-2h-2v4h2c.47 0 .93-.06 1.38-.18-.57 2.05-2.67 5.17-7.38 5.11z"/></svg>
      <span>{popupContent.time}</span>
    </div>
    {/* Büyüklük ve derinlik hizalı, sade */}
    <div style={{display:'flex',alignItems:'center',gap:12,margin:'4px 0 0 0',width:'100%'}}>
      <span style={{display:'flex',alignItems:'center',gap:5,fontSize:15,color:'#333',fontWeight:700}}>
        <svg width="17" height="17" fill="#e67e22" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
        <span>Büyüklük:</span>
        <span style={{minWidth:32,padding:'3px 0',borderRadius:8,background:'#ffe0c0',color:'#a83232',fontWeight:800,fontSize:15,boxShadow:'0 1px 4px #0001',textAlign:'center',border:'1.2px solid #e67e22',marginLeft:2}}>{popupContent.mag}</span>
      </span>
      <span style={{display:'flex',alignItems:'center',gap:5,fontSize:15,color:'#333',fontWeight:700}}>
        <svg width="17" height="17" fill="#1976d2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
        <span>Derinlik:</span>
        <span style={{minWidth:28,padding:'3px 0',borderRadius:7,background:'#e3f3ff',color:'#1976d2',fontWeight:700,fontSize:14,boxShadow:'0 1px 3px #0001',textAlign:'center',border:'1.1px solid #b3e0ff',marginLeft:2}}>{popupContent.depth} km</span>
      </span>
    </div>
  </div>
) : (
          <div style={{minWidth:220, maxWidth:320, background:'linear-gradient(120deg,#fff6f6 70%,#f7faff 100%)', borderRadius:18, boxShadow:'0 8px 32px #f44e4e22', padding:'18px 18px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:11, border:'1.5px solid #f7eaea', color:'#a83232', fontWeight:700, fontSize:17}}>
            {popupContent ? popupContent : (
              <>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="#f44e4e" style={{marginBottom:4}}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span>Deprem bilgisi bulunamadı.</span>
              </>
            )}
          </div>
        )}
      </Popup>
    </Marker>
  );
}
