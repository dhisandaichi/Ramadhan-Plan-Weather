/**
 * DATA STATIS AMALAN BERSUMBER QURAN (RAMADHAN)
 * Terintegrasi dengan equran.id API v2.0
 * Sumber: Buku "24 Jam di Bulan Ramadhan" karya Muhammad Abduh Tuasikal
 */

const amalanQuranRamadhan = [
    {
        id: "dalil_puasa",
        fase: "pagi",
        jam_estimasi: "07:00",
        judul: "Kewajiban Puasa Ramadhan",
        deskripsi: "Perintah Allah bagi orang yang hadir di tempat tinggalnya pada bulan Ramadhan untuk menjalankan ibadah puasa.",
        surat_nomor: 2,
        ayat_nomor: 185,
        quran_api_path: "/api/v2/surat/2",
        halaman: 18
    },
    {
        id: 5,
        fase: "sahur",
        jam_estimasi: "04:15",
        judul: "Istighfar di Waktu Sahur",
        deskripsi: "Keutamaan orang-orang yang meminta ampun (beristighfar) kepada Allah di waktu sahur.",
        surat_nomor: 3,
        ayat_nomor: 17,
        quran_api_path: "/api/v2/surat/3",
        halaman: 12
    },
    {
        id: 6,
        fase: "sahur",
        jam_estimasi: "04:30",
        judul: "Batas Waktu Makan Sahur",
        deskripsi: "Perintah makan dan minum hingga terang bagimu benang putih dari benang hitam (fajar).",
        surat_nomor: 2,
        ayat_nomor: 187,
        quran_api_path: "/api/v2/surat/2",
        halaman: 13
    },
    {
        id: 19,
        fase: "pagi",
        jam_estimasi: "11:30",
        judul: "Membaca Al-Quran yang Mudah",
        deskripsi: "Perintah Allah untuk membaca apa saja yang mudah bagimu dari ayat-ayat Al-Quran.",
        surat_nomor: 73,
        ayat_nomor: 20,
        quran_api_path: "/api/v2/surat/73",
        halaman: 41
    },
    {
        id: "balasan_kebaikan",
        fase: "jelang_buka",
        jam_estimasi: "17:00",
        judul: "Balasan Memberi Buka Puasa",
        deskripsi: "Prinsip bahwa tidak ada balasan bagi kebaikan (seperti memberi makan orang lapar) kecuali kebaikan pula.",
        surat_nomor: 55,
        ayat_nomor: 60,
        quran_api_path: "/api/v2/surat/55",
        halaman: 56
    },
    {
        id: "pemberian_cukup",
        fase: "jelang_buka",
        jam_estimasi: "17:15",
        judul: "Pembalasan dari Rabbmu",
        deskripsi: "Setiap amal kebaikan yang dilakukan akan mendapatkan pembalasan dan pemberian yang cukup banyak dari Allah.",
        surat_nomor: 78,
        ayat_nomor: 36,
        quran_api_path: "/api/v2/surat/78",
        halaman: 56
    },
    {
        id: "lailatul_qadar",
        fase: "isya",
        jam_estimasi: "21:00",
        judul: "Keutamaan Malam Lailatul Qadar",
        deskripsi: "Malam kemuliaan yang lebih baik dari seribu bulan, di mana malaikat turun dengan izin Rabbnya.",
        surat_nomor: 97,
        ayat_nomor: 3, // Merujuk pada rentang ayat 3-5
        quran_api_path: "/api/v2/surat/97",
        halaman: 87
    }
];

export default amalanQuranRamadhan;