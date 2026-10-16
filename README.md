# Türkiye Deprem İzleyici

[Canlı uygulama](https://earthquaketurkiye.vercel.app/) · [Geliştirici](https://firatengindev.vercel.app/)

Türkiye ve yakın çevresindeki deprem kayıtlarını eş zamanlı harita ve liste görünümünde inceleyen, Türkçe/İngilizce arayüzlü React uygulaması.

## Özellikler

- Birlikte çalışan harita, deprem listesi ve detay kartı.
- Şehir/bölge araması, minimum büyüklük ve 1 saat / 24 saat / 7 gün filtreleri.
- En yeni veya en büyük olaya göre sıralama.
- Mobilde açılır, sürüklenebilir ve genişletilebilir alt panel.
- Tarih aralığıyla AFAD arşiv sorgusu (en fazla 31 gün).
- Koyu/açık harita, büyüklük lejantı ve isteğe bağlı olay yoğunluğu katmanı.
- Seçilen olay, arşiv tarihleri ve harita konumuyla paylaşılabilir bağlantılar.
- Kaynak, veri alınma zamanı, bağlantı hataları ve eski kayıt uyarıları.

## Veri ve kapsam

Vercel üzerindeki `/api/earthquakes` fonksiyonu [AFAD'ın resmi olay servisini](https://deprem.afad.gov.tr/event-service) kullanır. Son olaylarda AFAD'a erişilemezse Orhan Aydoğdu API'sinin Kandilli verileri yedek kaynak olur ve bu değişiklik arayüzde belirtilir. Arşivde yedek kaynak kullanılmaz.

AFAD zamanları UTC, Kandilli zamanları Türkiye yerel saati olarak normalize edilir; arayüz tüm zamanları `Europe/Istanbul` ile gösterir. Büyüklük türü kaynakta mevcutsa korunur. Harita ve liste aynı veri kümesini kullanır; yeni veri alınamazsa son başarılı kayıtlar işaretlenerek korunur.

- Canlı görünüm: son 7 gün, en fazla 5.000 kayıt; açık sekmede 60 saniyede bir yenileme.
- Arşiv: Türkiye saatine göre başlangıç ve bitiş günleri dahil, en fazla 31 gün / 5.000 kayıt.
- Coğrafi kapsam: 34-43° K, 24-46° D.
- Filtreler ve özetler alınan kayıtlar üzerinde hesaplanır. 5.000 kayıt sınırına ulaşıldığında uyarı gösterilir.
- Veriler sonradan değişebilir. Bu uygulama deprem tahmini veya erken uyarı hizmeti değildir.
- Yoğunluk katmanı olayların dağılımını gösterir; tehlike veya risk haritası değildir. Önceki kaynağı/tarihi doğrulanamayan PNG risk katmanı kaldırılmıştır.

Harita: Leaflet ve OpenStreetMap. Koyu görünüm aynı harita döşemelerine görsel filtre uygular; ayrı bir ücretli harita anahtarı gerektirmez.

## Yerel çalıştırma

Node.js 22 veya üzeri ile:

```bash
npm ci
npm run build
node preview.cjs
```

`http://localhost:3101` adresini açın. Bu önizleme hem üretim dosyalarını hem API fonksiyonunu çalıştırır. `npm start` yalnızca CRA arayüz sunucusunu açar; API için bu önizlemeyi veya Vercel yerel geliştirme ortamını kullanın.

## Kontroller

```bash
npm test -- --watchAll=false --runInBand
node --test quake-utils.test.cjs api.test.cjs
npm run build
```

## Vercel

Mevcut Create React App ayarları korunur: `npm run build`, çıktı dizini `build`. `api/earthquakes.js` sunucusuz fonksiyondur. Gizli anahtar gerekmez. `vercel.json`, eski `/last100` ve `/history` bağlantılarını uygulamaya yönlendirir.
