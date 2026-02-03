# 🌐 Panduan API & Konfigurasi RamadhanPlan

## 📌 Ringkasan

**RamadhanPlan** menggunakan **100% API Gratis** tanpa memerlukan API Key berbayar. Semua data diambil dari sumber terbuka dan publik.

---

## 🔑 Daftar API yang Digunakan

### 1. **Open-Meteo API** (Cuaca Global)

**Status:** ✅ GRATIS, TIDAK PERLU API KEY

**Deskripsi:** Penyedia data cuaca global berbasis model meteorologi ERA5 (European Centre for Medium-Range Weather Forecasts).

**Base URL:** `https://api.open-meteo.com/v1`

**Endpoints yang Digunakan:**

#### A. Weather Forecast (Prediksi Cuaca)
```
GET https://api.open-meteo.com/v1/forecast
```

**Parameters:**
| Parameter | Nilai | Deskripsi |
|-----------|-------|-----------|
| `latitude` | `-6.2088` (Jakarta) | Latitude lokasi |
| `longitude` | `106.8456` (Jakarta) | Longitude lokasi |
| `current` | `temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m` | Data cuaca saat ini |
| `hourly` | `temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,cloud_cover,uv_index,wind_speed_10m` | Data per jam |
| `daily` | `weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max` | Data harian (7 hari) |
| `timezone` | `Asia/Jakarta` | Timezone Indonesia |
| `forecast_days` | `7` | Prediksi 7 hari |

**Contoh Request:**
```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Asia/Jakarta&forecast_days=7"
```

**Response Example:**
```json
{
  "latitude": -6.2,
  "longitude": 106.8,
  "timezone": "Asia/Jakarta",
  "current": {
    "time": "2026-02-03T10:00",
    "temperature_2m": 32.5,
    "relative_humidity_2m": 75,
    "apparent_temperature": 38.2,
    "precipitation": 0,
    "weather_code": 3,
    "cloud_cover": 65,
    "wind_speed_10m": 12.5
  },
  "hourly": {
    "time": ["2026-02-03T00:00", "2026-02-03T01:00", ...],
    "temperature_2m": [28.0, 27.5, ...],
    "precipitation_probability": [10, 15, ...]
  },
  "daily": {
    "time": ["2026-02-03", "2026-02-04", ...],
    "temperature_2m_max": [33.5, 34.0, ...],
    "temperature_2m_min": [24.0, 23.5, ...],
    "uv_index_max": [8, 9, ...]
  }
}
```

---

#### B. Marine/Ocean Forecast (Data Laut)
```
GET https://marine-api.open-meteo.com/v1/marine
```

**Parameters:**
| Parameter | Nilai | Deskripsi |
|-----------|-------|-----------|
| `latitude` | `-8.65` (Bali) | Latitude lokasi pantai |
| `longitude` | `115.22` (Bali) | Longitude lokasi pantai |
| `current` | `wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height` | Data laut saat ini |
| `hourly` | `wave_height,wave_direction,ocean_current_velocity` | Data per jam |
| `timezone` | `Asia/Jakarta` | Timezone |
| `forecast_days` | `3` | Prediksi 3 hari |

**Contoh Request:**
```bash
curl "https://marine-api.open-meteo.com/v1/marine?latitude=-8.65&longitude=115.22&current=wave_height,wave_direction,wave_period&hourly=wave_height&timezone=Asia/Jakarta&forecast_days=3"
```

**Response Example:**
```json
{
  "latitude": -8.65,
  "longitude": 115.22,
  "current": {
    "wave_height": 0.8,
    "wave_direction": 120,
    "wave_period": 6.5
  },
  "hourly": {
    "wave_height": [0.7, 0.8, 0.9, ...]
  }
}
```

---

#### C. Historical Archive (Data Historis 5 Tahun)
```
GET https://api.open-meteo.com/v1/archive
```

**Parameters:**
| Parameter | Nilai | Deskripsi |
|-----------|-------|-----------|
| `latitude` | `-6.2088` | Latitude |
| `longitude` | `106.8456` | Longitude |
| `start_date` | `2021-01-01` | Tanggal mulai |
| `end_date` | `2026-01-01` | Tanggal akhir |
| `daily` | `temperature_2m_max,temperature_2m_min,precipitation_sum` | Data harian historis |
| `timezone` | `Asia/Jakarta` | Timezone |

**Contoh Request:**
```bash
curl "https://api.open-meteo.com/v1/archive?latitude=-6.2088&longitude=106.8456&start_date=2021-01-01&end_date=2026-01-01&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Jakarta"
```

**Use Case:** Training data untuk analisis pola cuaca Ramadhan tahun-tahun sebelumnya.

---

### 2. **BMKG API** (Cuaca Indonesia)

**Status:** ✅ GRATIS, DATA PUBLIK, TIDAK PERLU API KEY

**Deskripsi:** Badan Meteorologi, Klimatologi, dan Geofisika Indonesia. Data resmi pemerintah.

**Base URL:** `https://data.bmkg.go.id`

**Endpoints yang Digunakan:**

#### A. Digital Forecast per Provinsi
```
GET https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-{Provinsi}.xml
```

**Provinsi yang Tersedia:**
- `JawaBarat.xml`
- `JawaTimur.xml`
- `JawaTengah.xml`
- `DKIJakarta.xml`
- `Bali.xml`
- `SumateraUtara.xml`
- dll. (33 provinsi)

**Contoh Request:**
```bash
curl "https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml"
```

**Format Response:** XML

**Parsing:**
```javascript
// Di weatherService.js, kita bisa parsing XML ini jika diperlukan
// Namun untuk MVP, kita prioritaskan Open-Meteo yang lebih mudah (JSON)
```

**Use Case:** Validasi data Open-Meteo dengan sumber resmi BMKG Indonesia.

---

#### B. Gempa Terkini
```
GET https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json
```

**Contoh Response:**
```json
{
  "Infogempa": {
    "gempa": {
      "Tanggal": "03 Feb 2026",
      "Jam": "10:30:15 WIB",
      "Magnitude": "5.2",
      "Kedalaman": "10 km",
      "Wilayah": "Pusat gempa berada di laut 52 km BaratDaya Kota-Bengkulu"
    }
  }
}
```

**Use Case:** Safety alert jika ada gempa besar yang berpotensi tsunami (penting untuk fitur Bahari).

---

### 3. **BIG (Badan Informasi Geospasial)** - OPSIONAL

**Status:** ⚠️ GRATIS, tapi endpoint unstable

**Deskripsi:** Peta dasar Indonesia & data pasang surut.

**Base URL:** `https://tanahair.indonesia.go.id` (WMS Service)

**Use Case:** Overlay peta Indonesia di fitur Marine (future enhancement).

---

## 🛠️ Cara Menggunakan API di Aplikasi

### Konfigurasi Environment Variables

File: `.env`

```env
# Open-Meteo (No Key Needed!)
VITE_OPEN_METEO_API=https://api.open-meteo.com/v1
VITE_OPEN_METEO_MARINE=https://marine-api.open-meteo.com/v1

# BMKG (No Key Needed!)
VITE_BMKG_API=https://data.bmkg.go.id

# App Config
VITE_APP_NAME=RamadhanPlan
VITE_APP_TAGLINE=Cuaca Bukan Sekadar Angka, Tapi Rencana
```

**⚠️ PENTING:** Tidak ada API Key yang perlu didaftarkan! Semua API bersifat publik dan gratis.

---

## 📊 Data Flow Aplikasi

```
┌─────────────────┐
│   User Opens    │
│   RamadhanPlan  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  1. Deteksi Lokasi (GPS)    │
│     atau Pilih Kota Manual  │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  2. Fetch Weather Data               │
│     GET /forecast?lat=...&lon=...    │
│     (Open-Meteo API)                 │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  3. Kalkulasi Client-Side:           │
│     - Heat Index (Formula NWS)       │
│     - Hydration Needs                │
│     - Laundry Score                  │
│     - Snorkeling Safety              │
│     - Meal Recommendations           │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  4. Tampilkan Hasil di UI            │
│     - Weather Card                   │
│     - Sahur/Iftar Planner            │
│     - Laundry Index                  │
│     - Marine Activity                │
└──────────────────────────────────────┘
```

**Tidak Ada AI/LLM** yang digunakan! Semua rekomendasi berbasis algoritma deterministik.

---

## 🔍 Testing API Manual

### Test 1: Weather Forecast Jakarta
```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,relative_humidity_2m&timezone=Asia/Jakarta"
```

**Expected Output:** JSON dengan data cuaca Jakarta saat ini.

### Test 2: Marine Data Bali
```bash
curl "https://marine-api.open-meteo.com/v1/marine?latitude=-8.65&longitude=115.22&current=wave_height&timezone=Asia/Jakarta"
```

**Expected Output:** JSON dengan tinggi ombak di Bali.

### Test 3: Gempa BMKG
```bash
curl "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
```

**Expected Output:** JSON dengan info gempa terkini (jika ada).

---

## 📝 Rate Limiting

| API | Rate Limit | Batasan |
|-----|------------|---------|
| Open-Meteo | **10,000 requests/day** (Free tier) | Cukup untuk ~500 users aktif/hari |
| BMKG | **Tidak ada** (Public data) | Unlimited, tapi jangan spam |

**Strategi untuk Scale:**
1. Implementasi caching di browser (LocalStorage, 15 menit TTL)
2. Batasi request: 1x per user per 10 menit
3. Jika > 10k users, gunakan backend caching (Supabase Edge Functions)

---

## 🚨 Error Handling

### Jika API Down:
```javascript
// Di weatherService.js
try {
  const response = await axios.get(API_URL);
  return response.data;
} catch (error) {
  // Fallback ke data default atau cache terakhir
  console.error('API Error:', error);
  return getCachedData(); // Ambil dari localStorage
}
```

### Fallback Strategy:
1. **Primary:** Open-Meteo
2. **Fallback 1:** BMKG (jika Open-Meteo error)
3. **Fallback 2:** Cached data (dari localStorage)
4. **Fallback 3:** Mock data (data simulasi untuk demo)

---

## 📚 Dokumentasi Resmi

- **Open-Meteo:** https://open-meteo.com/en/docs
- **BMKG:** https://www.bmkg.go.id
- **Marine API:** https://open-meteo.com/en/docs/marine-weather-api

---

## 🎯 Kesimpulan

✅ Aplikasi **100% gratis** untuk dijalankan  
✅ **Tidak perlu registrasi** API Key  
✅ **Tidak ada biaya** operasional untuk API  
✅ **Tidak menggunakan AI/LLM** (semua kalkulasi client-side)  
✅ Data akurat dari **sumber resmi**

**Ready to deploy!** 🚀
