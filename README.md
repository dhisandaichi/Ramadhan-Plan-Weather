# 🌙 RamadhanPlan

> **Cuaca Bukan Sekadar Angka, Tapi Rencana**

Sistem Pendukung Keputusan Berbasis Cuaca dan Data Geospasial untuk Perencanaan Aktivitas Harian dan Gizi Ramadhan di Indonesia.

![RamadhanPlan Banner](https://img.shields.io/badge/Version-1.0.0-blue) ![React](https://img.shields.io/badge/React-v18-61DAFB?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-v3-38B2AC?logo=tailwind-css) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Penggunaan](#-penggunaan)
- [Struktur Proyek](#-struktur-proyek)
- [API & Data Sources](#-api--data-sources)
- [Deployment](#-deployment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🎯 Tentang Proyek

**RamadhanPlan** adalah aplikasi web Progressive Web App (PWA) yang dirancang khusus untuk masyarakat Indonesia. Aplikasi ini menggabungkan:

- **Data Cuaca Real-Time** (Open-Meteo, BMKG)
- **Algoritma Keputusan Cerdas** (Heat Index, Hydration Calculator)
- **Rekomendasi Kontekstual** (Menu Sahur/Berbuka, Indeks Keamanan Aktivitas)

### Latar Belakang

Di Indonesia, kondisi cuaca sangat mempengaruhi aktivitas harian, terutama saat bulan Ramadhan:
- **Cuaca panas** → Dehidrasi → Pilihan menu sahur harus tinggi air
- **Hujan** → Banjir → Perencanaan perjalanan terganggu
- **Ombak tinggi** → Wisata bahari berbahaya

Aplikasi ini menjawab pertanyaan seperti:
> *"Cuaca hari ini **32°C**, lalu aku harus minum **berapa liter** saat sahur?"*  
> *"Ombak **1.5 meter**, boleh snorkeling **gak**?"*  
> *"Kelembaban **80%**, **bisa kering gak** kalau nyuci?"*

---

## ✨ Fitur Unggulan

### 🏠 Tab Harian (Daily Life)

#### 1. **Indeks Jemuran (Smart Laundry Index)**
- Menghitung skor jemuran (0-100) berdasarkan:
  - Suhu, Kelembaban, Kecepatan Angin, Curah Hujan, Tutupan Awan
- Status: **Sempurna** / **Cukup Baik** / **Jangan Cuci**
- Estimasi waktu kering pakaian

```javascript
// Contoh Algoritma
if (humidity > 80 || precipitation > 50%) → "JANGAN CUCI"
if (temp 25-35°C && wind 10-20 km/h) → "SEMPURNA"
```

#### 2. **Siap Jalan** (🚧 Coming Soon)
- Prediksi hujan per rute perjalanan motor
- Rekomendasi waktu berangkat/pulang aman

#### 3. **Validasi Netizen** (🚧 Coming Soon)
- Laporan kondisi cuaca real-time dari pengguna lain
- Koreksi data satelit yang lambat

---

### 🌙 Tab Ramadhan

#### 1. **Smart Sahur Planner**
Features:
- ⏰ **Countdown Timer** ke waktu Imsak
- 💧 **Kalkulator Hidrasi** (berdasarkan Heat Index & berat badan)
- 🍽️ **Rekomendasi Menu Sahur** berdasarkan:
  - Waktu tersisa sebelum Imsak (Prep Time Logic)
  - Suhu maksimal hari ini (cuaca panas = menu tinggi air)
  - Kondisi hujan/dingin (menu hangat vs dingin)

**Contoh Output:**
```
Heat Index: 34°C (Panas Ekstrem)
Target Hidrasi: 3.5 liter (14 gelas)
  - Sahur: 6 gelas
  - Buka: 5 gelas
  - Malam: 3 gelas

Waktu: 15 menit ke Imsak
Menu Rekomendasi:
  1. Smoothie Kurma & Pisang (3 menit) ⭐ Terbaik
  2. Overnight Oats (2 menit)
```

#### 2. **Smart Iftar Planner**
Features:
- 🕌 **Indeks Kenyamanan Tarawih** (prediksi jam 19:00)
  - Suhu + Kelembaban → Saran pakaian
  - Probabilitas hujan → Bawa payung?
- 🍛 **Rekomendasi Menu Berbuka** dengan tag:
  - ✅ **Tarawih Safe** (ringan, cepat dicerna)
  - ⚠️ **Berat untuk Tarawih** (santan, gorengan)
- 💡 Tips: *"Makan 1.5 jam sebelum Tarawih agar tidak begah"*

---

### 🌊 Tab Bahari (Marine Activity)

#### 1. **Snorkeling Safety Index**
Menghitung skor keamanan (0-100) berdasarkan:
- Tinggi ombak (Wave Height)
- Kecepatan angin
- Tutupan awan (visibilitas)
- Probabilitas hujan

**Status:**
- **80-100**: EXCELLENT (kondisi sempurna)
- **60-79**: GOOD (aman untuk pemula)
- **40-59**: MODERATE (hanya berpengalaman)
- **0-39**: DANGEROUS (CANCEL aktivitas)

#### 2. **Rekomendasi Aktivitas Lain**
- 🏊 Berenang
- 🏄 Surfing (berdasarkan tinggi ombak)
- 🚶 Jalan di pantai
- 🎣 Memancing

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite) - Fast build tool
- **Tailwind CSS 3** - Utility-first styling
- **React Icons** - Icon library

### Backend-as-a-Service (BaaS)
- **Supabase** - PostgreSQL database (untuk user data)
- **Firebase Hosting** - Deployment & CDN

### APIs (Free & Open Source)
| Data | Provider | Endpoint |
|------|----------|----------|
| Cuaca Real-time | Open-Meteo | `https://api.open-meteo.com/v1/forecast` |
| Data Historis (5 tahun) | Open-Meteo Archive | `/v1/archive` |
| Data Maritim | Open-Meteo Marine | `https://marine-api.open-meteo.com` |
| Data BMKG (opsional) | BMKG | `https://data.bmkg.go.id` |

### Styling Philosophy
- **Glassmorphism** (backdrop blur effects)
- **Gradient Animations** (smooth color transitions)
- **Micro-animations** (hover effects, floating icons)
- **Dark Mode** default (easier on eyes during night)

---

## 📖 Penggunaan

### Mengubah Lokasi
1. Klik tombol **Lokasi** di header
2. Pilih kota dari dropdown atau gunakan **GPS**

### Mengatur Waktu Imsak (Sahur Planner)
1. Buka tab **Ramadhan**
2. Klik **⚙️ Pengaturan**
3. Atur waktu Imsak & berat badan Anda

### Mengatur Prep Time (Iftar Planner)
1. Pilih waktu masak: **15, 30, 60, atau 90 menit**
2. Sistem akan filter menu yang sesuai

---

## 📁 Struktur Proyek

```
ramadhanplan/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icon-*.png             # App icons
├── src/
│   ├── components/
│   │   ├── LoadingScreen.jsx
│   │   ├── LocationSelector.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── LaundryIndex.jsx
│   │   ├── SahurPlanner.jsx
│   │   ├── IftarPlanner.jsx
│   │   └── MarineActivity.jsx
│   ├── services/
│   │   └── weatherService.js  # API integrations
│   ├── utils/
│   │   ├── calculators.js     # Heat Index, Hydration, etc.
│   │   └── mealPlanner.js     # Meal algorithms
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Tailwind + custom styles
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🌐 API & Data Sources

### Open-Meteo API

**Endpoint Cuaca:**
```javascript
GET https://api.open-meteo.com/v1/forecast?
  latitude=-6.2088&
  longitude=106.8456&
  current=temperature_2m,humidity,precipitation&
  hourly=temperature_2m,precipitation_probability&
  daily=temperature_2m_max,uv_index_max&
  timezone=Asia/Jakarta
```

**Parameters Penting:**
- `current`: Data cuaca saat ini
- `hourly`: Per jam (24 jam ke depan)
- `daily`: Harian (7 hari ke depan)
- `timezone`: **Asia/Jakarta** (WIB)

**Endpoint Maritim:**
```javascript
GET https://marine-api.open-meteo.com/v1/marine?
  latitude=-8.65&
  longitude=115.22&
  current=wave_height,wave_direction
```

### Algoritma Kunci

#### Heat Index Formula
```javascript
function calculateHeatIndex(temp, humidity) {
  // Rothfusz regression (NWS formula)
  const adjustedHI = ...complex math...
  return adjustedHI;
}
```

#### Hydration Calculator
```javascript
baseWater = bodyWeight * 35ml

if (heatIndex > 32°C) baseWater *= 1.5  // +50%
if (heatIndex > 28°C) baseWater *= 1.3  // +30%

// Distribution for Ramadan
sahur: 40% of total
iftar: 30% of total
night: 30% of total
```

---

## 🚢 Deployment

### 🚀 Quick Start (Deploy ke Firebase)

**Prerequisites:**
- Akun Firebase (gratis di https://firebase.google.com)
- Firebase CLI installed

```bash
# 1. Install Firebase CLI (jika belum)
npm install -g firebase-tools

# 2. Login ke Firebase
firebase login

# 3. Inisialisasi project Firebase (pilih "Hosting")
firebase init hosting
# - Pilih: Create a new project atau Use an existing project
# - Public directory: dist
# - Configure as single-page app: Yes
# - Set up automatic builds: No

# 4. Build aplikasi
npm run build

# 5. Deploy ke Firebase
firebase deploy
```

**✅ Done!** Aplikasi Anda akan live di: `https://your-project-name.web.app`

---

### 📝 Deployment Step-by-Step Detail

#### 1. **Build Production**

```bash
npm run build
```

Ini akan membuat folder `/dist` yang berisi:
- HTML, CSS, JS yang sudah di-minify
- Assets yang sudah di-optimize
- PWA manifest & service worker

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Main app bundle
│   ├── index-[hash].css   # Styles
│   └── vendor-[hash].js   # Dependencies
└── manifest.json
```

#### 2. **Test Production Build Locally**

```bash
npx vite preview
```

Buka `http://localhost:4173` untuk test versi production sebelum deploy.

#### 3. **Deploy ke Firebase Hosting**

Setelah `firebase login` dan `firebase init hosting`:

```bash
firebase deploy --only hosting
```

**Output:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/ramadhanplan
Hosting URL: https://ramadhanplan.web.app
```

#### 4. **Custom Domain (Opsional)**

Di Firebase Console:
1. Buka **Hosting** → **Add custom domain**
2. Masukkan domain Anda (misal: `ramadhanplan.id`)
3. Ikuti instruksi DNS verification
4. Tunggu SSL certificate (auto, 24 jam)

---

### 🔄 Update & Re-deploy

Setiap kali ada perubahan code:

```bash
npm run build && firebase deploy
```

Atau buat script di `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && firebase deploy --only hosting"
  }
}
```

Lalu jalankan:
```bash
npm run deploy
```

---

### 🌐 Alternatif Deployment Platform

#### 1. **Vercel** (Recommended - Paling Mudah)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (satu command!)
vercel
```

**Keuntungan:**
- Auto-deploy dari GitHub (CI/CD gratis)
- Analytics built-in
- Preview deployment untuk setiap commit

#### 2. **Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login & Deploy
netlify login
netlify deploy --prod
```

**Keuntungan:**
- Form handling (untuk fitur feedback)
- Split testing (A/B testing)

#### 3. **GitHub Pages** (Gratis, tapi perlu setup)

Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Push ke GitHub, otomatis deploy!

---

### ⚠️ Environment Variables di Production

Untuk deployment, pastikan environment variables sudah diset:

**Firebase:**
```bash
# Tidak perlu! Vite membaca .env saat build
# Variabel VITE_* sudah di-bundle ke dalam dist/
```

**Vercel/Netlify:**
- Buka Dashboard → Settings → Environment Variables
- Tambahkan variabel (jika pakai Supabase)

**PENTING:** API keys Open-Meteo & BMKG tidak perlu disimpan sebagai secret karena gratis dan publik!

---

### 📊 Monitoring Deployment

| Platform | Analytics | Logs | Custom Domain |
|----------|-----------|------|---------------|
| Firebase | Via Google Analytics | ✅ | ✅ Gratis SSL |
| Vercel | Built-in | ✅ | ✅ Gratis SSL |
| Netlify | Built-in | ✅ | ✅ Gratis SSL |
| GitHub Pages | Manual (GA) | ❌ | ✅ Manual SSL |

**Recommendation:** Firebase atau Vercel (keduanya excellent untuk React apps).

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Roadmap Fitur
- [ ] Integrasi dengan kalender untuk notifikasi sahur
- [ ] Mode offline (PWA cache data terakhir)
- [ ] Fitur "Siap Jalan" dengan prediksi rute
- [ ] Laporan cuaca dari warga (crowdsourcing)
- [ ] Export meal plan ke shopping list
- [ ] Integrasi dengan jadwal sholat otomatis (per kota)

---

## 📄 Lisensi

MIT License - Anda bebas menggunakan untuk project pribadi maupun komersial.

---

## 👨‍💻 Author

Dibuat dengan ❤️ untuk masyarakat Indonesia oleh **Tim RamadhanPlan**

**Contact:**
- Email: support@ramadhanplan.id
- GitHub: [@ramadhanplan](https://github.com/ramadhanplan)

---

## 🙏 Acknowledgments

- **Open-Meteo** untuk API cuaca gratis yang powerful
- **BMKG** untuk data meteorologi Indonesia
- **Tailwind CSS** untuk framework styling yang luar biasa
- **React Community** untuk dokumentasi & ecosystem

---

**⭐ Jika project ini membantu Anda, berikan star di GitHub!**

