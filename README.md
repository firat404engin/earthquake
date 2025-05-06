# Deprem Harita Uygulaması

Bu proje, AFAD'ın sağladığı son depremleri harita üzerinde gösteren bir web uygulamasıdır.

## Kullanılan Teknolojiler
- React (CRA PWA template)
- Leaflet (harita için)
- Axios (veri çekmek için)

## Başlangıç

1. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   npm install leaflet react-leaflet axios
   ```
2. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## Özellikler
- Son depremler otomatik olarak AFAD'dan çekilir.
- Harita üzerinde depremler işaretlenir ve tıklanınca detaylar gösterilir.
