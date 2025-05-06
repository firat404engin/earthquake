# 🌍 Türkiye Deprem Haritası - Proje Kuralları ve Özellikler

Next.js, TypeScript ve Tailwind CSS teknolojileriyle geliştirilecek bu projede, Türkiye haritası üzerinde **fay hatları** ve **anlık depremler** gösterilecektir. Deprem verileri resmi kaynaklar olan **AFAD (https://deprem.afad.gov.tr/)** ve **Kandilli Rasathanesi (https://deprem.kandilli.edu.tr/)** üzerinden çekilecektir.

---

## 🔐 Kurallar ve Standartlar

### 1. Kod Kalitesi
- Proje dili: **TypeScript**
- `any` kullanımı yasaktır, tüm tipler açık tanımlanmalı.
- Fonksiyonlar ve bileşenler yorumlanmalı, değişkenler anlamlı isimlendirilmeli.
- Kod tekrarı önlenmeli, reusable component yapısı benimsenmeli.

### 2. Stil Rehberi
- Stil yönetimi tamamen **Tailwind CSS** ile yapılmalı.
- Koyu tema (dark mode) desteği opsiyonel olarak eklenebilir.
- Tüm sayfalar mobil öncelikli olacak şekilde responsive olmalı.

### 3. Harita Kullanımı
- Harita, ana sayfada (`/`) geniş ve modern tasarımlı bir bileşen olarak yer almalı.
- Türkiye haritası, zoom yapılabilir, tıklanabilir ve bölgelere ayrılabilir olmalı.
- Fay hatları `.geojson` formatında renklendirilerek gösterilecek.
- Deprem lokasyonları ⚠️ ikonları ile vurgulanmalı.

### 4. Veri Güncellemeleri
- Deprem verileri **AFAD** ve **Kandilli** kaynaklarından alınacak.
- Veriler 60 saniyelik periyotlarla güncellenmeli.
- WebSocket destekleniyorsa **anlık deprem bildirimi** sunulmalı.
- Tüm API istekleri `try/catch` blokları ile yönetilmeli ve önbellekleme yapılmalı.

### 5. Performans ve Erişilebilirlik
- Sayfa yüklenme süresi: **< 2 saniye** hedeflenmeli.
- Lighthouse skoru: **%90+**
- Harita düşük internet bağlantısında da hızlı ve sorunsuz yüklenmeli.
- Renk kontrastı, etiketler ve butonlar erişilebilirlik standartlarına uygun olmalı (WCAG).

---

## ✅ Versiyonlama ve Geliştirme Süreci

- Ana dal: `main`
- Her yeni özellik için `feature/özellik-ismi` şeklinde branch açılmalı.
- Kodlar PR ile review sürecinden geçirilmeli.
- Commit mesajları anlaşılır olmalı (`feat: harita katmanı eklendi`).

---

## 🔐 Güvenlik
- Kullanıcı konumu kullanılacaksa açık izin politikası gösterilmeli.
- API anahtarları `.env.local` içinde saklanmalı, dışa aktarılmamalı.
- Rate limit ve hata yönetimi API katmanında sağlanmalı.

---

türkiye-deprem-haritasi/
├── public/
│   ├── icons/                     # PWA için ikonlar
│   ├── geojson/                  # Fay hatları için .geojson dosyaları
│   └── locale/                   # Dil dosyaları (i18n)
│       ├── tr/
│       │   └── common.json
│       └── en/
│           └── common.json
│
├── src/
│   ├── app/                      # Next.js 13+ App Router yapısı
│   │   ├── layout.tsx
│   │   └── page.tsx             # Ana sayfa (Harita)
│
│   ├── components/              # Reusable bileşenler
│   │   ├── Map/
│   │   │   ├── Map.tsx
│   │   │   └── EarthquakeIcon.tsx
│   │   ├── StatsPanel.tsx
│   │   ├── FilterBar.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   └── NotificationButton.tsx
│
│   ├── lib/                     # Yardımcı fonksiyonlar, API veri çekme
│   │   ├── api/
│   │   │   ├── afad.ts
│   │   │   └── kandilli.ts
│   │   └── utils.ts
│
│   ├── hooks/                   # Custom React hook'lar
│   │   └── useEarthquakes.ts
│
│   ├── services/                # WebSocket & API servis katmanı
│   │   ├── socket.ts
│   │   └── earthquakeService.ts
│
│   ├── store/                   # Global state yönetimi (Zustand / Redux)
│   │   └── earthquakeStore.ts
│
│   ├── styles/
│   │   └── globals.css
│
│   ├── types/                   # TypeScript tip tanımlamaları
│   │   ├── earthquake.ts
│   │   └── faultLine.ts
│
│   └── middleware.ts            # i18n routing middleware (opsiyonel)
│
├── .env.local                   # API anahtarları (gizli)
├── next.config.js               # Next.js yapılandırması
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md


# 🚀 Eklenebilecek Özellikler

## 📊 1. Deprem İstatistik Panosu
- **Canlı Dashboard**: Günlük / haftalık / aylık deprem sayısı
- **En Büyük 10 Deprem**: Lokasyon, derinlik, büyüklük bilgileriyle
- **Ortalama Derinlik ve Büyüklük**
- **Veri Görselleştirme**: Chart.js, Recharts ile mini grafikler ve çizelgeler

## 🧭 2. Filtreleme ve Akıllı Arama
- Şehre göre filtreleme
- Büyüklüğe ve derinliğe göre sınıflandırma
- Tarih aralığına göre arama (örnek: 01.01.2024 - 01.03.2024)
- Harita üzerinden şehir seçimiyle detay listeleme

## 📱 3. Mobil Uyum ve PWA Desteği
- Uygulama tamamen mobil uyumlu ve PWA özellikli olmalı
- Kullanıcılar uygulamayı ana ekranlarına yükleyebilmeli
- Offline destek (opsiyonel)

## 🛰️ 4. Fay Hattı Detayları
- Fay hattına tıklanıldığında:
  - Fay tipi: Doğrultu atımlı, bindirme, normal fay vb.
  - Bulunduğu bölge ve uzunluk bilgisi
  - Olası kırılma potansiyeli
- Farklı renkler ile fay türü görselleştirme

## 🔔 5. Gerçek Zamanlı Bildirim Sistemi
- Kullanıcı belirli bölgeleri seçebilir
- O bölgeye ait deprem olursa **anlık uyarı** çıkar
- Opsiyonel olarak Web Push Notification desteği (izinli sistem)

## 🌐 6. Çoklu Dil Desteği (i18n)
- UI'da dil değiştirici: Türkçe / İngilizce
- Next.js i18n routing desteği kullanılmalı

## 🧩 7. Kullanıcı Paneli (Opsiyonel)
- Kullanıcılar favori şehirleri/ilçeleri kaydedebilir
- Son 1 ayda seçilen şehirdeki depremleri listeleme
- Takip edilen bölgelerde günlük bildirim özelliği

---

## 🎨 Modern Tasarım Notları
- Modern UI Kit: [Shadcn/ui](https://ui.shadcn.dev/) veya Tailwind UI önerilir.
- Kart yapısı, gradient butonlar, saydamlık ve animasyonlu geçiş efektleri tercih edilmeli.
- Ana sayfa: Geniş harita, sağda istatistik paneli, üstte filtre çubuğu.
- Kullanıcı deneyimi ön planda tutulmalı.

---

Bu belge, projeye katılan tüm ekip üyeleri için ortak geliştirme rehberi niteliğindedir. Yeni özellik talepleri veya güncellemeler için bu dosya güncellenmelidir.
