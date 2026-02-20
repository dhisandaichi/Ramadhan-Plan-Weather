
import React, { useMemo } from 'react';
import { getMergedIbadahData } from '../utils/ibadahData';
import HadithDisplay from './HadithDisplay';
import QuranDisplay from './QuranDisplay';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DailyIbadahPlanner = () => {
    const ibadahList = useMemo(() => getMergedIbadahData(), []);
    const [expandedIds, setExpandedIds] = React.useState({});
    const [visibleCount, setVisibleCount] = React.useState(7);

    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="space-y-4">
            <div className="bg-ramadhan-900/50 border border-primary-500/30 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">📅</span>
                    <div>
                        <h2 className="text-2xl font-bold font-display gradient-text">Panduan Ibadah 24 Jam</h2>
                        <p className="text-sm text-white/60">Rencana aktifitas harian Ramadhan</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {ibadahList.slice(0, visibleCount).map((item) => {
                        const isExpanded = expandedIds[item.id];
                        const hasRef = item.api_path || item.quran_api_path;

                        return (
                            <div
                                key={item.id}
                                className={`glass-dark rounded-xl transition-all duration-300 border border-white/5 hover:border-white/10 ${isExpanded ? 'bg-white/5' : ''}`}
                            >
                                <div
                                    className="p-4 cursor-pointer flex items-start gap-4"
                                    onClick={() => toggleExpand(item.id)}
                                >
                                    <div className="flex-shrink-0 w-16 text-center">
                                        <div className="text-lg font-bold text-primary-300">{item.jam_estimasi}</div>
                                        <div className="text-xs text-white/40 uppercase tracking-wider">{item.fase}</div>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg mb-1">{item.judul}</h3>
                                        <p className="text-sm text-white/70 line-clamp-2">{item.deskripsi}</p>

                                        {(hasRef || item.dalil) && (
                                            <div className="mt-2 flex items-center gap-2 text-xs text-primary-400">
                                                <span>{isExpanded ? 'Sembunyikan Dalil' : 'Lihat Dalil'}</span>
                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="px-4 pb-4 pl-24 animate-fade-in">
                                        {item.dalil && !hasRef && (
                                            <div className="bg-white/5 p-3 rounded-lg text-sm text-white/80 italic border-l-2 border-white/20">
                                                "{item.dalil}"
                                            </div>
                                        )}

                                        {item.api_path && (
                                            <div className="mt-2">
                                                <HadithDisplay apiPath={item.api_path} />
                                            </div>
                                        )}

                                        {item.quran_api_path && (
                                            <div className="mt-2">
                                                <QuranDisplay
                                                    apiPath={item.quran_api_path}
                                                    suratNomor={item.surat_nomor}
                                                    ayatNomor={item.ayat_nomor}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Pagination / Load More Controls */}
                    <div className="flex justify-center mt-6 gap-3">
                        {visibleCount < ibadahList.length && (
                            <button
                                onClick={() => setVisibleCount(prev => Math.min(prev + 7, ibadahList.length))}
                                className="btn-secondary px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
                            >
                                Tampilkan Lebih Banyak ({ibadahList.length - visibleCount} lagi)
                            </button>
                        )}

                        {visibleCount > 7 && (
                            <button
                                onClick={() => setVisibleCount(7)}
                                className="text-white/50 hover:text-white/80 text-sm underline px-4"
                            >
                                Kembali ke Awal
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyIbadahPlanner;
