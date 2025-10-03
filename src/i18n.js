export const LANG = {
  TR: 'tr',
  EN: 'en'
};

export const texts = {
  tr: {
    lastQuakes: 'Son Depremler',
    history: 'Geçmiş Depremler',
    about: 'Hakkımızda',
    riskBand: 'Risk Bandı',
    loading: 'Yükleniyor...',
    date: 'Tarih',
    time: 'Saat',
    magnitude: 'Büyüklük',
    depthKm: 'Derinlik (km)',
    location: 'Lokasyon',
    deaths: 'Ölü',
    description: 'Açıklama',
    wikipedia: 'Vikipedi',
    turkeyFlag: 'TR',
    last100Title: 'Son 100 Deprem',
    historyTitle: 'Türkiye - Büyük Depremler',
    prev: 'Önceki',
    next: 'Sonraki',
    pageXofY: (x,y)=>`Sayfa ${x} / ${y}`
  },
  en: {
    lastQuakes: 'Recent Quakes',
    history: 'Past Earthquakes',
    about: 'About',
    riskBand: 'Risk Band',
    loading: 'Loading...',
    date: 'Date',
    time: 'Time',
    magnitude: 'Magnitude',
    depthKm: 'Depth (km)',
    location: 'Location',
    deaths: 'Deaths',
    description: 'Description',
    wikipedia: 'Wikipedia',
    turkeyFlag: 'EN',
    last100Title: 'Last 100 Earthquakes',
    historyTitle: 'Turkey - Major Earthquakes',
    prev: 'Previous',
    next: 'Next',
    pageXofY: (x,y)=>`Page ${x} / ${y}`
  }
};

export function getText(lang, key) {
  return texts[lang]?.[key] || texts.tr[key] || key;
}

