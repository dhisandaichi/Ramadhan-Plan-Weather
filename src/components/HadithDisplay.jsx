import { useState, useEffect } from 'react';

const HadithDisplay = ({ apiPath }) => {
    const [hadith, setHadith] = useState(null);
    const [sourceInfo, setSourceInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!apiPath) return;

        const fetchHadith = async () => {
            try {
                setLoading(true);
                // apiPath example: /books/muslim/384
                // Full URL: https://api.hadith.gading.dev/books/muslim/384
                const response = await fetch(`https://api.hadith.gading.dev${apiPath}`);
                if (!response.ok) throw new Error('Gagal mengambil data hadits');
                const result = await response.json();

                if (result.data) {
                    setHadith(result.data.contents);
                    setSourceInfo({
                        name: result.data.name,
                        number: result.data.contents.number
                    });
                } else {
                    throw new Error('Format data tidak dikenali');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHadith();
    }, [apiPath]);

    if (loading) return <div className="text-center p-4 text-white/50 animate-pulse">Memuat Hadits...</div>;
    if (error) return <div className="text-center p-4 text-red-400 text-sm">Gagal memuat hadits: {error}</div>;
    if (!hadith) return null;

    return (
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 mt-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded">HADITS</span>
                {sourceInfo && (
                    <span className="text-xs text-emerald-200/70 font-semibold">
                        HR. {sourceInfo.name} No. {sourceInfo.number}
                    </span>
                )}
            </div>
            <p className="text-right font-arabic text-xl leading-loose mb-3 text-emerald-100">{hadith.arab}</p>
            <p className="text-sm text-white/80 italic">"{hadith.id}"</p>
        </div>
    );
};

export default HadithDisplay;
