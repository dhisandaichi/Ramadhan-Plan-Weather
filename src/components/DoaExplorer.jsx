import React, { useState, useEffect, useMemo } from 'react';
import { getAllDoa } from '../services/doaService';
import { MdSearch } from 'react-icons/md';
import { FaHandsHelping, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DoaExplorer = () => {
    const [allDoa, setAllDoa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('Semua');
    const [expandedDoa, setExpandedDoa] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getAllDoa();
                // API returns { status: "success", data: [...] }
                let data = [];
                if (Array.isArray(response)) {
                    data = response;
                } else if (response && Array.isArray(response.data)) {
                    data = response.data;
                }
                setAllDoa(data);
            } catch (err) {
                setError('Gagal memuat kumpulan doa. Periksa koneksi internet Anda.');
                console.error('DoaExplorer fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Extract unique tags from the data
    // API field: doa.tag = ["tidur", "malam"] (array)
    const availableTags = useMemo(() => {
        const tags = new Set();
        allDoa.forEach(doa => {
            if (!doa) return;
            if (Array.isArray(doa.tag)) {
                doa.tag.forEach(t => { if (t) tags.add(String(t).trim()); });
            } else if (typeof doa.tag === 'string' && doa.tag) {
                doa.tag.split(',').forEach(t => { if (t.trim()) tags.add(t.trim()); });
            }
        });
        return ['Semua', ...Array.from(tags).sort()];
    }, [allDoa]);

    // Filter logic — API uses `nama` as title field
    const filteredDoa = useMemo(() => {
        if (!Array.isArray(allDoa)) return [];
        return allDoa.filter(doa => {
            if (!doa) return false;

            // API field for title is `nama`
            const title = String(doa.nama || doa.judul || '');
            const safeSearch = String(searchTerm || '');
            const matchesSearch = title.toLowerCase().includes(safeSearch.toLowerCase());

            let matchesTag = false;
            if (selectedTag === 'Semua') {
                matchesTag = true;
            } else if (Array.isArray(doa.tag)) {
                matchesTag = doa.tag.map(t => String(t).trim()).includes(selectedTag);
            } else if (typeof doa.tag === 'string') {
                matchesTag = doa.tag.includes(selectedTag);
            }

            return matchesSearch && matchesTag;
        });
    }, [allDoa, searchTerm, selectedTag]);

    return (
        <div className="bg-ramadhan-900/50 border border-primary-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300">
                    <FaHandsHelping className="text-2xl" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-display gradient-text">Kumpulan Doa &amp; Dzikir</h2>
                    <p className="text-sm text-white/60">
                        {allDoa.length > 0 ? `${allDoa.length} doa tersedia` : 'Senjata orang mukmin dalam segala kondisi'}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="space-y-3">
                <div className="relative">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl" />
                    <input
                        type="text"
                        placeholder="Cari doa (contoh: tidur, makan, perjalanan)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-12 w-full"
                    />
                </div>

                {/* Tag Filter Chips */}
                {availableTags.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedTag === tag
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-3 min-h-[300px] max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-3">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white/50 text-sm">Sedang mengambil data doa...</p>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-300">
                        <p className="font-semibold mb-1">⚠️ Gagal Memuat</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : filteredDoa.length === 0 ? (
                    <div className="text-center py-10 text-white/40">
                        <p className="text-4xl mb-2">🔍</p>
                        <p>Tidak ada doa yang ditemukan untuk "{searchTerm}"</p>
                    </div>
                ) : (
                    filteredDoa.map((doa) => {
                        const isExpanded = expandedDoa === doa.id;
                        // Correct API field names: nama, ar, tr, idn, tentang, tag
                        const title = doa.nama || doa.judul || 'Doa Tanpa Judul';
                        const arabText = doa.ar || doa.arab || '';
                        const latinText = doa.tr || doa.latin || '';
                        const indoText = doa.idn || doa.indo || '';
                        const source = doa.tentang || doa.source || '';
                        const grup = doa.grup || '';

                        return (
                            <div
                                key={doa.id}
                                className={`glass-dark rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded
                                        ? 'border-purple-500/50 bg-white/5'
                                        : 'border-white/5 hover:border-purple-500/30 hover:bg-white/5'
                                    }`}
                            >
                                {/* Card Header */}
                                <div
                                    onClick={() => setExpandedDoa(isExpanded ? null : doa.id)}
                                    className="p-4 cursor-pointer flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300">
                                            {doa.id}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white/90 truncate">{title}</h3>
                                            {grup && <p className="text-xs text-purple-300/60 truncate">{grup}</p>}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-white/40 text-sm">
                                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div className="px-4 pb-5 pt-1 space-y-4 border-t border-white/10 bg-black/20">
                                        {/* Arabic */}
                                        {arabText && (
                                            <div className="text-right">
                                                <p className="font-arabic text-2xl leading-loose text-purple-100 py-2">
                                                    {arabText}
                                                </p>
                                            </div>
                                        )}

                                        {/* Latin */}
                                        {latinText && (
                                            <p className="text-purple-300/80 italic text-sm leading-relaxed">
                                                "{latinText}"
                                            </p>
                                        )}

                                        {/* Indonesian Translation */}
                                        {indoText && (
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <p className="text-xs text-white/40 mb-1">Artinya:</p>
                                                <p className="text-white/80 text-sm leading-relaxed">{indoText}</p>
                                            </div>
                                        )}

                                        {/* Source & Tags */}
                                        <div className="pt-2 border-t border-white/10 space-y-2">
                                            {source && (
                                                <p className="text-xs text-white/40 leading-relaxed">
                                                    📖 {source.split('\n')[0]}
                                                </p>
                                            )}
                                            {Array.isArray(doa.tag) && doa.tag.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {doa.tag.map(t => (
                                                        <span
                                                            key={t}
                                                            onClick={(e) => { e.stopPropagation(); setSelectedTag(t); }}
                                                            className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 cursor-pointer hover:bg-purple-500/40 transition-colors"
                                                        >
                                                            #{t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer count */}
            {!loading && !error && (
                <p className="text-center text-xs text-white/30">
                    Menampilkan {filteredDoa.length} dari {allDoa.length} doa
                </p>
            )}
        </div>
    );
};

export default DoaExplorer;
