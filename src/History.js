import React from 'react';
import { texts, LANG } from './i18n';

const MAJOR_EARTHQUAKES_TR = [
  {
    date: '1939-12-27', time: '01:57', magnitude: 7.8, deaths: 32868, location: 'Erzincan',
    desc: 'Cumhuriyet tarihinin en büyük depremlerinden biri; geniş yıkım ve ağır can kaybı.',
    wiki: 'https://tr.wikipedia.org/wiki/1939_Erzincan_depremi',
    news: null
  },
  {
    date: '1999-08-17', time: '03:02', magnitude: 7.6, deaths: 17480, location: 'Gölcük (Kocaeli)',
    desc: 'Marmara bölgesinde büyük yıkım; sanayi ve konut bölgelerinde ağır hasar.',
    wiki: 'https://tr.wikipedia.org/wiki/1999_G%C3%B6lc%C3%BCk_depremi',
    news: null
  },
  {
    date: '1999-11-12', time: '18:57', magnitude: 7.2, deaths: 845, location: 'Düzce',
    desc: '17 Ağustos’un ardından bölgede ikinci büyük deprem; artçı değil bağımsız kırılma.',
    wiki: 'https://tr.wikipedia.org/wiki/1999_D%C3%BCzce_depremi',
    news: null
  },
  {
    date: '2011-10-23', time: '13:41', magnitude: 7.2, deaths: 604, location: 'Van (Erciş)',
    desc: 'Van ve Erciş’te çok sayıda yapı hasarı; kış şartları yardım çalışmalarını zorlaştırdı.',
    wiki: 'https://tr.wikipedia.org/wiki/2011_Van_depremi',
    news: null
  },
  {
    date: '2020-10-30', time: '14:51', magnitude: 6.9, deaths: 117, location: 'İzmir (Seferihisar-Sığacık Körfezi)',
    desc: 'Ege Denizi açıklarında; özellikle Bayraklı ve Bornova’da çok katlı binalarda yıkım.',
    wiki: 'https://tr.wikipedia.org/wiki/2020_%C4%B0zmir_depremi',
    news: null
  },
  {
    date: '2023-02-06', time: '04:17', magnitude: 7.8, deaths: 50000, location: 'Kahramanmaraş (Pazarcık)',
    desc: 'On ilde etkili “Asrın Felaketi”nin ilk büyük kırılması; geniş coğrafyada ağır yıkım.',
    wiki: 'https://tr.wikipedia.org/wiki/2023_Kahramanmara%C5%9F_depremleri',
    news: null
  },
  {
    date: '2023-02-06', time: '13:24', magnitude: 7.5, deaths: 50000, location: 'Kahramanmaraş (Elbistan)',
    desc: 'İkinci büyük deprem; bölgedeki hasarı artıran bağımsız kırılma.',
    wiki: 'https://tr.wikipedia.org/wiki/2023_Kahramanmara%C5%9F_depremleri',
    news: null
  }
];

export default function History({ lang = LANG.TR }) {
  return (
    <div style={{padding:'16px',maxWidth:900,margin:'0 auto'}}>
      <h2 style={{textAlign:'center',margin:'8px 0 16px 0',fontWeight:800,fontSize:26,color:'#a83232'}}>{texts[lang].historyTitle}</h2>
      <div style={{background:'#fff',border:'1px solid #eef1f6',borderRadius:14,boxShadow:'0 6px 24px rgba(0,0,0,0.06)',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0}}>
          <thead style={{position:'sticky',top:0,background:'linear-gradient(180deg,#f8faff 0%,#f1f4fb 100%)'}}>
            <tr>
              <th style={{textAlign:'left',padding:'12px'}}>{texts[lang].date}</th>
              <th style={{textAlign:'left',padding:'12px'}}>{texts[lang].time}</th>
              <th style={{textAlign:'left',padding:'12px'}}>{texts[lang].magnitude}</th>
              <th style={{textAlign:'left',padding:'12px'}}>{texts[lang].deaths}</th>
              <th style={{textAlign:'left',padding:'12px'}}>{texts[lang].location}</th>
              <th style={{textAlign:'left',padding:'12px'}}>{texts[lang].description}</th>
              <th style={{textAlign:'left',padding:'12px'}}>{texts[lang].wikipedia}</th>
            </tr>
          </thead>
          <tbody>
            {MAJOR_EARTHQUAKES_TR.map((e,i)=>{
              const mag = e.magnitude;
              let bg = '#eceff4', color = '#555';
              if (mag >= 7.5) { bg = '#ffe5e5'; color = '#a83232'; }
              else if (mag >= 7.0) { bg = '#ffe0c0'; color = '#e67e22'; }
              else if (mag >= 6.0) { bg = '#fff3c0'; color = '#bfa600'; }
              return (
                <tr key={i} style={{background:i%2? '#fafcff':'#fff'}}>
                  <td style={{padding:'10px 12px'}}>{e.date}</td>
                  <td style={{padding:'10px 12px'}}>{e.time}</td>
                  <td style={{padding:'10px 12px'}}>
                    <span style={{display:'inline-block',minWidth:46,padding:'6px 10px',borderRadius:10,background:bg,color,fontWeight:800}}>{e.magnitude}</span>
                  </td>
                  <td style={{padding:'10px 12px'}}>{e.deaths.toLocaleString('tr-TR')}</td>
                  <td style={{padding:'10px 12px'}}>{e.location}</td>
                  <td style={{padding:'10px 12px',color:'#444'}}>{e.desc}</td>
                  <td style={{padding:'10px 12px'}}>
                    <a href={e.wiki} target="_blank" rel="noreferrer" style={{color:'#1f6feb',textDecoration:'none',fontWeight:700}}>Vikipedi</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


