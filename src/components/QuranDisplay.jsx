import { useState, useEffect } from 'react';

const QuranDisplay = ({ apiPath, ayatNomor, suratNomor }) => {
    const [ayatData, setAyatData] = useState(null);
    const [surahName, setSurahName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!apiPath) return;

        const fetchQuran = async () => {
            try {
                setLoading(true);
                // apiPath example: /api/v2/surat/2
                // Full URL: https://equran.id/api/v2/surat/2
                const response = await fetch(`https://equran.id${apiPath}`);
                if (!response.ok) throw new Error('Gagal mengambil data Quran');
                const result = await response.json();

                if (result.data) {
                    // Extract Surah Name
                    setSurahName(result.data.namaLatin);

                    if (result.data.ayat) {
                        const found = result.data.ayat.find(a => a.nomorAyat === ayatNomor);
                        if (found) {
                            setAyatData(found);
                        } else {
                            throw new Error(`Ayat ${ayatNomor} tidak ditemukan`);
                        }
                    } else {
                        throw new Error('Data ayat tidak ditemukan');
                    }
                } else {
                    throw new Error('Format data tidak dikenali');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuran();
    }, [apiPath, ayatNomor]);

    if (loading) return <div className="text-center p-4 text-white/50 animate-pulse">Memuat Ayat...</div>;
    if (error) return <div className="text-center p-4 text-red-400 text-sm">Gagal memuat ayat: {error}</div>;
    if (!ayatData) return null;

    return (
        <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-4 mt-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded">AL-QURAN</span>
                <span className="text-xs text-amber-200/70 font-semibold">
                    QS. {surahName || suratNomor} [{suratNomor}]: {ayatNomor}
                </span>
            </div>
            <p className="text-right font-arabic text-2xl leading-loose mb-3 text-amber-100">{ayatData.teksArab}</p>
            <p className="text-sm text-white/80 italic">"{ayatData.teksIndonesia}"</p>
        </div>
    );
};

export default QuranDisplay;
