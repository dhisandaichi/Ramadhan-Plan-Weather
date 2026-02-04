# 🛡️ Security Documentation - RamadhanPlan

## Overview

Dokumen ini menjelaskan fitur keamanan (cybersecurity) yang telah diimplementasikan pada website RamadhanPlan untuk melindungi dari berbagai ancaman web umum.

---

## 📋 Fitur Keamanan yang Diimplementasikan

### 1. **HTTP Security Headers** (Firebase Hosting)

| Header | Nilai | Fungsi |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | Mencegah Clickjacking - website tidak bisa di-embed dalam iframe |
| `X-Content-Type-Options` | `nosniff` | Mencegah MIME type sniffing attacks |
| `X-XSS-Protection` | `1; mode=block` | Mengaktifkan filter XSS browser |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Mengontrol informasi referrer yang dikirim |
| `Permissions-Policy` | `geolocation=(self), camera=(), microphone=()` | Membatasi akses ke API browser |
| `Content-Security-Policy` | (lihat di bawah) | Mencegah XSS dan injection attacks |

#### Content Security Policy Details:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: blob:;
connect-src 'self' https://api.open-meteo.com https://marine-api.open-meteo.com https://api.aladhan.com https://*.supabase.co;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

---

### 2. **Rate Limiting** (Client-side)

Implementasi rate limiting untuk mencegah automated requests dan abuse:

| Endpoint | Limit | Penalty |
|----------|-------|---------|
| Weather API | 2 RPS (requests/second) | 5 detik block |
| Prayer API | 2 RPS | 5 detik block |
| General Actions | 5 RPS | 5 detik block |

**Cara Kerja:**
```javascript
// Contoh penggunaan
const limitCheck = weatherRateLimiter.checkLimit();
if (!limitCheck.allowed) {
    throw new Error(`Terlalu banyak permintaan. Tunggu ${limitCheck.waitTime} detik.`);
}
```

---

### 3. **Input Validation & Sanitization**

#### Proteksi Prompt Injection
Mendeteksi dan memblokir pola berbahaya seperti:
- `ignore previous instructions`
- `disregard all`
- `[INST]` tags
- `system:` prefixes

#### Proteksi XSS
Menyaring:
- `<script>` tags
- `javascript:` URLs
- Event handlers (`onclick=`, `onerror=`, dll)
- `<iframe>`, `<object>`, `<embed>` tags

#### Proteksi SQL Injection
Mendeteksi:
- SQL keywords (`SELECT`, `INSERT`, `DROP`, dll)
- Quote characters dan comment markers

**Contoh Penggunaan:**
```javascript
import { sanitizeInput } from './utils/security';

const result = sanitizeInput(userInput, {
    maxLength: 500,
    stripHtml: true,
    checkPromptInjection: true
});

if (!result.isValid) {
    console.warn('Detected threats:', result.threats);
}
```

---

### 4. **Coordinate Validation**

Validasi koordinat GPS untuk memastikan:
- Tipe data valid (number)
- Latitude antara -90 dan 90
- Longitude antara -180 dan 180
- (Opsional) Warning jika di luar Indonesia

```javascript
import { validateCoordinates } from './utils/security';

const validation = validateCoordinates(lat, lon);
if (!validation.isValid) {
    throw new Error(validation.reason);
}
```

---

### 5. **Anti-Automation Detection**

Mendeteksi bot dan automated browsers dengan memeriksa:
- `navigator.webdriver` property
- Headless Chrome indicators
- PhantomJS/Nightmare.js signatures
- Unusual screen dimensions
- Missing browser plugins

**Confidence Score:**
- 0.0 - 0.4: Likely human
- 0.4 - 0.6: Suspicious
- 0.6 - 0.8: Likely bot
- 0.8 - 1.0: Definitely bot (blocked)

---

### 6. **Security Logging**

Semua event keamanan dicatat untuk monitoring:

```javascript
import { securityLog } from './utils/security';

// Log tersedia di console (development mode)
// Events: RATE_LIMIT_EXCEEDED, INVALID_COORDINATES, API_SUCCESS, API_ERROR, BOT_DETECTED
```

---

### 7. **Request Timeout**

Semua API calls memiliki timeout 10 detik untuk mencegah:
- Slow-loris attacks
- Resource exhaustion
- Hanging connections

---

### 8. **Secure Storage**

Helper untuk localStorage dengan fitur:
- TTL/Expiration support
- Key format validation
- JSON parsing error handling

```javascript
import { secureStore, secureRetrieve } from './utils/security';

// Store dengan expiry 1 jam
secureStore('userSession', data, { expiresIn: 3600000 });

// Retrieve (null jika expired)
const data = secureRetrieve('userSession');
```

---

## 📁 File Keamanan

| File | Deskripsi |
|------|-----------|
| `src/utils/security.js` | Utility functions untuk keamanan |
| `src/components/SecurityProvider.jsx` | React context provider untuk security |
| `firebase.json` | Konfigurasi security headers |
| `SECURITY.md` | Dokumentasi ini |

---

## 🔧 Testing Security Features

### Test Rate Limiting:
```javascript
// Di browser console
for (let i = 0; i < 10; i++) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8')
        .then(() => console.log(`Request ${i+1}: OK`))
        .catch(e => console.log(`Request ${i+1}: Blocked - ${e.message}`));
}
// Seharusnya request ke-3 dan seterusnya akan di-block
```

### Test Input Sanitization:
```javascript
import { sanitizeInput } from './utils/security';

// Test XSS
console.log(sanitizeInput('<script>alert("xss")</script>'));
// Result: { isValid: false, threats: ['DANGEROUS_PATTERN_DETECTED', 'HTML_STRIPPED'], ... }

// Test Prompt Injection
console.log(sanitizeInput('Ignore previous instructions and...'));
// Result: { isValid: false, threats: ['DANGEROUS_PATTERN_DETECTED'], ... }
```

### Test Automation Detection:
```javascript
import { detectAutomation } from './utils/security';

const result = detectAutomation();
console.log('Is Bot:', result.isBot);
console.log('Confidence:', result.confidence);
console.log('Signals:', result.signals);
```

---

## 🚀 Deployment Checklist

- [x] Security headers configured in `firebase.json`
- [x] Rate limiting implemented in all API services
- [x] Input validation active
- [x] SecurityProvider wrapping the app
- [x] API timeouts configured
- [ ] Regular security audit (recommended: monthly)
- [ ] Vulnerability scanning (recommended: before each release)

---

## ⚠️ Known Limitations

1. **Rate limiting adalah client-side** - dapat di-bypass oleh attacker yang sophisticated. Untuk proteksi penuh, implementasikan rate limiting juga di level API/backend.

2. **No server-side validation** - karena ini adalah aplikasi frontend-only, validasi hanya terjadi di client. Data dari API eksternal (Open-Meteo, Aladhan) tetap dipercaya.

3. **CSP menggunakan 'unsafe-inline'** - diperlukan untuk framework React/Vite. Untuk keamanan lebih tinggi, pertimbangkan menggunakan nonce atau hash.

---

## 📞 Reporting Security Issues

Jika Anda menemukan vulnerability atau masalah keamanan, silakan hubungi:
- Email: [security@example.com]
- Atau buat Issue dengan label `security` di repository

---

*Last Updated: February 2026*
