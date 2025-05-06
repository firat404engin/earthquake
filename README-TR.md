# Deprem Haritası (Earthquake Map)

## Proje Amacı
Bu proje, Türkiye ve çevresindeki son depremleri modern, interaktif ve tamamen responsive bir harita üzerinde görselleştirmek için geliştirilmiştir. Kullanıcılar, harita üzerinde gerçekleşen son depremleri canlı olarak takip edebilir, detaylarına ulaşabilir ve deprem risk bantlarını görüntüleyebilir.

## Kullanılan Teknolojiler
- **React**: Modern kullanıcı arayüzü ve bileşen yönetimi için.
- **React-Leaflet**: Harita ve marker gösterimi için (Leaflet tabanlı).
- **Axios**: Deprem verilerini harici API'den çekmek için.
- **CSS (modern, responsive)**: Tüm cihazlarda uyumlu, sade ve modern bir görünüm için.

## Temel Özellikler
- **Canlı Deprem Takibi:** Son depremler harita üzerinde canlı olarak gösterilir.
- **Responsive Tasarım:** Mobil, tablet ve masaüstü için optimize edilmiş, tüm bileşenler uyumlu.
- **Popup ve Tablo:** Marker tıklanınca detay popup açılır, ayrıca son 100 deprem tablo halinde incelenebilir.
- **Fay/Risk Bantları:** Türkiye fay hatları ve risk bantları harita üzerinde gösterilebilir/gizlenebilir.
- **Modern UX:** Butonlar, popup'lar ve tüm arayüz modern ve kullanıcı dostu.

## Klasör Yapısı ve Yayınlama (Vercel için)
Vercel'de projeyi yayınlamak için aşağıdaki dosya ve klasörleri yüklemeniz yeterli:

```
/deprem-map
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── robots.txt
│   └── turkey_fault_lines.geojson
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── BlinkingMarker.js
│   ├── FaultHeatBandLayer.js
│   ├── Last100.css
│   ├── Last100.js
│   ├── TurkeyFaultLayer.js
│   ├── TurkeyHeatLayer.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── service-worker.js
│   ├── serviceWorkerRegistration.js
│   └── setupTests.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md (veya bu README-TR.md)
```

### Yayınlama Adımları (Vercel)
1. **Vercel hesabı açın** ve yeni bir proje oluşturun.
2. Bu klasörlerin tamamını (özellikle `public` ve `src` klasörleri ile `package.json`, `package-lock.json`) Vercel'e yükleyin veya GitHub'a pushlayıp Vercel'e bağlayın.
3. Vercel otomatik olarak React (CRA) projesini algılayacak ve build/deploy işlemini başlatacaktır.
4. Yayın sonrası, uygulamanızın URL'sini alıp kullanabilirsiniz.

## Ek Bilgiler
- Harici deprem verisi için [orhanaydogdu.com.tr](https://api.orhanaydogdu.com.tr/deprem/kandilli/live) API'si kullanılmaktadır.
- Fay hattı verisi `public/turkey_fault_lines.geojson` dosyasındadır.
- Proje tamamen açık kaynaklıdır ve modern web standartlarına uygundur.

---
Her türlü katkı, öneri ve hata bildirimi için iletişime geçebilirsiniz!
