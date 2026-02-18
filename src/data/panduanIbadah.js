/**
 * DATA STATIS PANDUAN IBADAH 24 JAM RAMADHAN
 * Sumber: Buku "24 Jam di Bulan Ramadhan" karya Muhammad Abduh Tuasikal
 */

const panduanIbadahRamadhanUtuh = [
    // ============================================================
    // FASE 1: MAGHRIB (Awal Pergantian Hari)
    // ============================================================
    {
        id: 30,
        fase: "maghrib",
        jam_estimasi: "18:00",
        judul: "Menjawab Adzan Maghrib",
        deskripsi: "Mengucapkan seperti yang diucapkan muazin, bershalawat, dan meminta wasilah untuk Rasulullah.",
        dalil: "HR. Muslim no. 384",
        halaman: 67
    },
    {
        id: 29,
        fase: "maghrib",
        jam_estimasi: "18:05",
        judul: "Menyegerakan Berbuka (Ta'jil)",
        deskripsi: "Menyegerakan berbuka saat matahari terbenam dengan ruthab, tamer, atau air sebelum shalat.",
        doa: "Dzahabazh zhoma-u wabtallatil 'uruuqu wa tsabatal ajru insya Allah",
        dalil: "HR. Bukhari no. 1957 & HR. Abu Daud no. 2356",
        halaman: 58
    },
    {
        id: 31,
        fase: "maghrib",
        jam_estimasi: "18:20",
        judul: "Shalat Maghrib & Rawatib Ba'diyah",
        deskripsi: "Shalat Maghrib berjamaah di masjid (pria), dilanjutkan shalat sunnah rawatib ba'diyah Maghrib 2 rakaat.",
        dalil: "HR. Bukhari no. 1172",
        halaman: 67
    },
    {
        id: 32,
        fase: "maghrib",
        jam_estimasi: "18:45",
        judul: "Membaca Dzikir Petang",
        deskripsi: "Waktunya dari matahari tenggelam hingga pertengahan malam. Membaca doa perlindungan.",
        dalil: "HR. Muslim no. 2709",
        halaman: 68
    },
    {
        id: 33,
        fase: "maghrib",
        jam_estimasi: "19:00",
        judul: "Makan Malam Bersama Keluarga",
        deskripsi: "Makan dengan bersyukur, memuji makanan, dan tidak mencela makanan.",
        dalil: "HR. Muslim no. 2052",
        halaman: 69
    },

    // ============================================================
    // FASE 2: ISYA & TARAWIH
    // ============================================================
    {
        id: 34,
        fase: "isya",
        jam_estimasi: "19:15",
        judul: "Persiapan Shalat Isya & Tarawih",
        deskripsi: "Berwudhu, memakai wewangian (pria), dan berjalan menuju masjid.",
        dalil: "HR. An-Nasai no. 3939",
        halaman: 73
    },
    {
        id: 35,
        fase: "isya",
        jam_estimasi: "19:30",
        judul: "Shalat Isya & Rawatib Ba'diyah",
        deskripsi: "Menjawab muazin, shalat Isya berjamaah, dan shalat sunnah rawatib ba'diyah Isya 2 rakaat.",
        dalil: "HR. Tirmidzi no. 414",
        halaman: 73
    },
    {
        id: 36,
        fase: "isya",
        jam_estimasi: "20:00",
        judul: "Melaksanakan Shalat Tarawih",
        deskripsi: "Melaksanakan shalat tarawih berjamaah dengan iman dan mengharap pahala.",
        dalil: "HR. Bukhari no. 37",
        halaman: 73
    },
    {
        id: 37,
        fase: "isya",
        jam_estimasi: "21:00",
        judul: "Tarawih Hingga Selesai Bersama Imam",
        deskripsi: "Tidak pergi hingga imam selesai agar dituliskan pahala shalat semalam suntuk.",
        dalil: "HR. An-Nasai no. 1605",
        halaman: 74
    },
    {
        id: 38,
        fase: "isya",
        jam_estimasi: "21:15",
        judul: "Doa Setelah Shalat Witir",
        deskripsi: "Membaca 'Subhaanal malikil qudduus' (3x), 'Robbil malaaikati war ruuh', dan doa perlindungan.",
        dalil: "HR. Abu Daud no. 1427",
        halaman: 75
    },

    // ============================================================
    // FASE 3: MALAM HARI & TIDUR
    // ============================================================
    {
        id: 39,
        fase: "malam",
        jam_estimasi: "21:30",
        judul: "Tadarus Al-Quran",
        deskripsi: "Mempelajari dan membaca Al-Quran sebagaimana Nabi melakukannya bersama Jibril.",
        dalil: "HR. Bukhari no. 3554",
        halaman: 79
    },
    {
        id: 40,
        fase: "malam",
        jam_estimasi: "22:00",
        judul: "Tidur Lebih Awal & Adab Tidur",
        deskripsi: "Tidur awal agar bisa bangun sahur. Berwudhu, baca doa tidur, Ayat Kursi, dan 3 Qul.",
        dalil: "HR. Bukhari no. 5017",
        halaman: 79
    },

    // ============================================================
    // FASE 4: SAHUR (Sepertiga Malam Terakhir)
    // ============================================================
    {
        id: 1,
        fase: "sahur",
        jam_estimasi: "03:00",
        judul: "Bangun Sahur & Shalat",
        deskripsi: "Bangun segera berdzikir, berwudhu, dan shalat untuk melepas tiga ikatan setan.",
        dalil: "HR. Bukhari no. 1142",
        halaman: 9
    },
    {
        id: 2,
        fase: "sahur",
        jam_estimasi: "03:15",
        judul: "Shalat Tahajud & Witir",
        deskripsi: "Shalat malam (tahajud). Jika belum witir saat tarawih, tutup dengan witir.",
        dalil: "HR. Bukhari no. 990",
        halaman: 10
    },
    {
        id: 3,
        fase: "sahur",
        jam_estimasi: "03:45",
        judul: "Berdoa di Waktu Sahur",
        deskripsi: "Memperbanyak doa karena sepertiga malam terakhir adalah waktu terkabulnya doa.",
        dalil: "HR. Bukhari no. 1145",
        halaman: 11
    },
    {
        id: 4,
        fase: "sahur",
        jam_estimasi: "04:00",
        judul: "Menyantap Makan Sahur",
        deskripsi: "Makan sahur karena di dalamnya terdapat keberkahan.",
        dalil: "HR. Bukhari no. 1923",
        halaman: 12
    },
    {
        id: 5,
        fase: "sahur",
        jam_estimasi: "04:15",
        judul: "Istighfar & Tilawah Menjelang Shubuh",
        deskripsi: "Sambil menunggu azan, perbanyak istighfar dan membaca Al-Quran.",
        dalil: "QS. Ali Imran: 17",
        halaman: 12
    },
    {
        id: 6,
        fase: "sahur",
        jam_estimasi: "04:30",
        judul: "Batas Akhir Sahur (Imsak)",
        deskripsi: "Makan sahur berakhir tepat saat azan Shubuh berkumandang.",
        dalil: "QS. Al-Baqarah: 187",
        halaman: 13
    },
    {
        id: 7,
        fase: "sahur",
        jam_estimasi: "04:35",
        judul: "Mandi Wajib (Junub/Haidh)",
        deskripsi: "Segera mandi wajib. Boleh masuk waktu Shubuh dalam keadaan junub.",
        dalil: "HR. Muslim no. 1109",
        halaman: 14
    },

    // ============================================================
    // FASE 5: SHUBUH
    // ============================================================
    {
        id: 8,
        fase: "shubuh",
        jam_estimasi: "04:40",
        judul: "Amalan Saat Mendengar Azan",
        deskripsi: "Menjawab azan, bershalawat, meminta wasilah, membaca syahadat, dan berdoa.",
        dalil: "HR. Muslim no. 384",
        halaman: 19
    },
    {
        id: 9,
        fase: "shubuh",
        jam_estimasi: "04:45",
        judul: "Shalat Sunnah Fajar (Qabliyah)",
        deskripsi: "Melaksanakan 2 rakaat sebelum Shubuh. Lebih baik dari dunia dan seisinya.",
        dalil: "HR. Muslim no. 725",
        halaman: 22
    },
    {
        id: 11,
        fase: "shubuh",
        jam_estimasi: "05:00",
        judul: "Shalat Shubuh Berjamaah",
        deskripsi: "Pria berjamaah di masjid. Wanita lebih afdal di rumah.",
        dalil: "HR. Bukhari no. 645",
        halaman: 25
    },
    {
        id: 12,
        fase: "shubuh",
        jam_estimasi: "05:20",
        judul: "Doa & Tilawah Ba'da Shalat Sunnah",
        deskripsi: "Menyibukkan diri dengan doa dan membaca Al-Quran.",
        dalil: "HR. Ahmad 3:155",
        halaman: 28
    },
    {
        id: 13,
        fase: "shubuh",
        jam_estimasi: "05:30",
        judul: "Berdiam di Masjid & Dzikir Pagi",
        deskripsi: "Duduk berdzikir atau membaca Quran hingga matahari meninggi.",
        dalil: "HR. Tirmidzi no. 586",
        halaman: 29
    },

    // ============================================================
    // FASE 6: PAGI & DHUHA
    // ============================================================
    {
        id: "isyraq",
        fase: "pagi",
        jam_estimasi: "06:00",
        judul: "Shalat Isyraq",
        deskripsi: "Shalat 2 rakaat setelah matahari meninggi (15 menit ba'da terbit).",
        dalil: "HR. Tirmidzi no. 586",
        halaman: 30
    },
    {
        id: 14,
        fase: "pagi",
        jam_estimasi: "07:00",
        judul: "Menjaga Rukun Puasa",
        deskripsi: "Menahan diri dari pembatal puasa hingga maghrib.",
        dalil: "Al-Fiqh Al-Manhaji",
        halaman: 35
    },
    {
        id: 15,
        fase: "pagi",
        jam_estimasi: "08:00",
        judul: "Meninggalkan Hal Haram",
        deskripsi: "Menjauhi dusta, ghibah, namimah, memandang wanita tidak halal, dan musik.",
        dalil: "HR. Bukhari no. 1903",
        halaman: 36
    },
    {
        id: 16,
        fase: "pagi",
        jam_estimasi: "09:00",
        judul: "Melaksanakan Shalat Dhuha",
        deskripsi: "Minimal 2 rakaat. Mulai 15 menit ba'da terbit hingga 15 menit sebelum Zhuhur.",
        dalil: "HR. Muslim no. 748",
        halaman: 37
    },
    {
        id: 17,
        fase: "pagi",
        jam_estimasi: "10:00",
        judul: "Beraktivitas & Bekerja",
        deskripsi: "Tetap bekerja. Sebaik-baik pekerjaan adalah hasil tangan sendiri.",
        dalil: "HR. Ahmad 4:141",
        halaman: 39
    },
    {
        id: 18,
        fase: "pagi",
        jam_estimasi: "11:00",
        judul: "Memperbanyak Sedekah",
        deskripsi: "Semangat sedekah lebih membara di bulan Ramadhan.",
        dalil: "HR. Bukhari no. 3554",
        halaman: 40
    },
    {
        id: 19,
        fase: "pagi",
        jam_estimasi: "11:30",
        judul: "Tilawah di Waktu Senggang",
        deskripsi: "Memanfaatkan waktu luang untuk membaca Al-Quran.",
        dalil: "HR. Bukhari no. 5054",
        halaman: 41
    },

    // ============================================================
    // FASE 7: ZHUHUR
    // ============================================================
    {
        id: 20,
        fase: "zhuhur",
        jam_estimasi: "12:00",
        judul: "Tidur Siang (Qailulah)",
        deskripsi: "Tidur sejenak menjelang Zhuhur untuk menguatkan ibadah.",
        dalil: "HR. Abu Nu'aim",
        halaman: 43
    },
    {
        id: 21,
        fase: "zhuhur",
        jam_estimasi: "12:15",
        judul: "Menjawab Adzan Zhuhur",
        deskripsi: "Melakukan amalan menjawab adzan sebagaimana poin 8.",
        dalil: "Poin 21",
        halaman: 44
    },
    {
        id: 22,
        fase: "zhuhur",
        jam_estimasi: "12:30",
        judul: "Shalat Zhuhur & Rawatib",
        deskripsi: "4 rakaat qabliyah dan 2 rakaat ba'diyah Zhuhur.",
        dalil: "HR. Tirmidzi no. 414",
        halaman: 44
    },
    {
        id: 23,
        fase: "zhuhur",
        jam_estimasi: "13:30",
        judul: "Membantu Pekerjaan Rumah",
        deskripsi: "Suami membantu menyiapkan makanan berbuka atau pekerjaan keluarga.",
        dalil: "HR. Bukhari no. 6039",
        halaman: 46
    },

    // ============================================================
    // FASE 8: ASHAR
    // ============================================================
    {
        id: 24,
        fase: "ashar",
        jam_estimasi: "15:30",
        judul: "Shalat Ashar & Qabliyah",
        deskripsi: "Menjawab adzan dan shalat sunnah qabliyah ashar.",
        dalil: "HR. Abu Daud no. 1271",
        halaman: 49
    },
    {
        id: 25,
        fase: "ashar",
        jam_estimasi: "16:30",
        judul: "Larangan Shalat Ba'da Ashar",
        deskripsi: "Dilarang shalat sunnah mutlak setelah Ashar hingga maghrib.",
        dalil: "HR. Bukhari no. 586",
        halaman: 50
    },

    // ============================================================
    // FASE 9: MENJELANG BERBUKA (Jelang Maghrib)
    // ============================================================
    {
        id: 26,
        fase: "jelang_buka",
        jam_estimasi: "17:00",
        judul: "Menyiapkan Buka Puasa",
        deskripsi: "Memberi makan orang berpuasa atau membantu panitia masjid.",
        dalil: "HR. Tirmidzi no. 807",
        halaman: 55
    },
    {
        id: 27,
        fase: "jelang_buka",
        jam_estimasi: "17:30",
        judul: "Bermajelis Ilmu",
        deskripsi: "Mengisi waktu senggang menjelang berbuka dengan ilmu.",
        dalil: "HR. Muslim no. 2699",
        halaman: 57
    },
    {
        id: 28,
        fase: "jelang_buka",
        jam_estimasi: "17:45",
        judul: "Berdoa Menunggu Berbuka",
        deskripsi: "Doa orang yang berpuasa ketika berbuka tidak ditolak.",
        dalil: "HR. Tirmidzi no. 2526",
        halaman: 57
    }
];

export default panduanIbadahRamadhanUtuh;