import React, { useState, useEffect } from 'react';
import { getProvinsi, getKabKota, getImsakiyah } from '../services/imsakiyahService';
import { MdLocationOn, MdCalendarToday } from 'react-icons/md';
import { FaMosque } from 'react-icons/fa';

const PRAYER_LABELS = [
    { key: 'imsak', label: 'Imsak', emoji: '🌙', color: 'text-blue-300' },
    { key: 'subuh', label: 'Subuh', emoji: '🌅', color: 'text-indigo-300' },
    { key: 'terbit', label: 'Terbit', emoji: '☀️', color: 'text-yellow-300' },
    { key: 'dhuha', label: 'Dhuha', emoji: '🌤️', color: 'text-amber-300' },
    { key: 'dzuhur', label: 'Dzuhur', emoji: '🕛', color: 'text-orange-300' },
    { key: 'ashar', label: 'Ashar', emoji: '🕒', color: 'text-red-300' },
    { key: 'maghrib', label: 'Maghrib', emoji: '🌇', color: 'text-pink-300' },
    { key: 'isya', label: 'Isya', emoji: '🌃', color: 'text-purple-300' },
];

// Ramadhan 1447H starts March 1, 2026
const RAMADHAN_START = new Date('2026-03-01');

const getRamadhanDay = () => {
    const today = new Date();
    const diff = Math.floor((today - RAMADHAN_START) / (1000 * 60 * 60 * 24));
    return Math.min(Math.max(diff + 1, 1), 30); // clamp to 1-30
};

const getNextPrayer = (schedule) => {
    if (!schedule) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const { key, label, emoji } of PRAYER_LABELS) {
        const time = schedule[key];
        if (!time) continue;
        const [h, m] = time.split(':').map(Number);
        const prayerMinutes = h * 60 + m;
        if (prayerMinutes > currentMinutes) {
            const diff = prayerMinutes - currentMinutes;
            return { key, label, emoji, time, minutesLeft: diff };
        }
    }
    // After Isya — next is Imsak tomorrow
    return { key: 'imsak', label: 'Imsak Besok', emoji: '🌙', time: schedule.imsak, minutesLeft: null };
};

const ImsakiyahCard = () => {
    const [provinsi, setProvinsi] = useState('');
    const [kabkota, setKabkota] = useState('');
    const [provinsiList, setProvinsiList] = useState([]);
    const [kabkotaList, setKabkotaList] = useState([]);
    const [imsakiyahData, setImsakiyahData] = useState(null);
    const [todaySchedule, setTodaySchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingKab, setLoadingKab] = useState(false);
    const [error, setError] = useState(null);
    const [showAllDays, setShowAllDays] = useState(false);
    const [nextPrayer, setNextPrayer] = useState(null);

    const ramadhanDay = getRamadhanDay();

    // Load provinces on mount
    useEffect(() => {
        const load = async () => {
            try {
                const list = await getProvinsi();
                setProvinsiList(list);
            } catch (e) {
                console.error('Failed to load provinsi:', e);
            }
        };
        load();
    }, []);

    // Load kabkota when provinsi changes
    useEffect(() => {
        if (!provinsi) { setKabkotaList([]); setKabkota(''); return; }
        const load = async () => {
            setLoadingKab(true);
            try {
                const list = await getKabKota(provinsi);
                setKabkotaList(list);
                setKabkota('');
            } catch (e) {
                console.error('Failed to load kabkota:', e);
            } finally {
                setLoadingKab(false);
            }
        };
        load();
    }, [provinsi]);

    // Fetch schedule when both selected
    const fetchSchedule = async () => {
        if (!provinsi || !kabkota) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getImsakiyah(provinsi, kabkota);
            setImsakiyahData(data);
            const today = data?.imsakiyah?.find(d => d.tanggal === ramadhanDay) || data?.imsakiyah?.[0];
            setTodaySchedule(today);
            setNextPrayer(getNextPrayer(today));
        } catch (_err) {
            setError('Gagal mengambil jadwal imsakiyah. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Update next prayer every minute
    useEffect(() => {
        if (!todaySchedule) return;
        const interval = setInterval(() => {
            setNextPrayer(getNextPrayer(todaySchedule));
        }, 60000);
        return () => clearInterval(interval);
    }, [todaySchedule]);

    return (
        <div className="bg-ramadhan-900/50 border border-primary-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-xl text-green-300">
                    <FaMosque className="text-2xl" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-display gradient-text">Jadwal Imsakiyah</h2>
                    <p className="text-sm text-white/60">Ramadhan 1447H / 2026M — Hari ke-{ramadhanDay}</p>
                </div>
            </div>

            {/* Location Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-white/50 mb-1 ml-1">Provinsi</label>
                    <select
                        value={provinsi}
                        onChange={e => setProvinsi(e.target.value)}
                        className="input-field w-full"
                    >
                        <option value="">-- Pilih Provinsi --</option>
                        {provinsiList.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-white/50 mb-1 ml-1">Kabupaten / Kota</label>
                    <select
                        value={kabkota}
                        onChange={e => setKabkota(e.target.value)}
                        disabled={!provinsi || loadingKab}
                        className="input-field w-full disabled:opacity-50"
                    >
                        <option value="">
                            {loadingKab ? 'Memuat...' : '-- Pilih Kab/Kota --'}
                        </option>
                        {kabkotaList.map(k => (
                            <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={fetchSchedule}
                disabled={!provinsi || !kabkota || loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memuat Jadwal...
                    </>
                ) : (
                    <>
                        <MdCalendarToday />
                        Tampilkan Jadwal
                    </>
                )}
            </button>

            {/* Error */}
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm text-center">
                    {error}
                </div>
            )}

            {/* Today's Schedule */}
            {todaySchedule && (
                <div className="space-y-4">
                    {/* Location Badge */}
                    <div className="flex items-center gap-2 text-sm text-white/60">
                        <MdLocationOn className="text-green-400" />
                        <span>{imsakiyahData?.kabkota}, {imsakiyahData?.provinsi}</span>
                    </div>

                    {/* Next Prayer Highlight */}
                    {nextPrayer && (
                        <div className="glass-dark rounded-2xl p-4 border border-green-500/30 bg-green-900/20">
                            <p className="text-xs text-white/50 mb-1">Waktu Shalat Berikutnya</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{nextPrayer.emoji}</span>
                                    <div>
                                        <p className="text-xl font-bold text-white">{nextPrayer.label}</p>
                                        <p className="text-2xl font-mono font-bold text-green-300">{nextPrayer.time}</p>
                                    </div>
                                </div>
                                {nextPrayer.minutesLeft !== null && (
                                    <div className="text-right">
                                        <p className="text-xs text-white/40">Dalam</p>
                                        <p className="text-lg font-bold text-amber-300">
                                            {nextPrayer.minutesLeft >= 60
                                                ? `${Math.floor(nextPrayer.minutesLeft / 60)}j ${nextPrayer.minutesLeft % 60}m`
                                                : `${nextPrayer.minutesLeft} menit`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Today's Full Schedule Grid */}
                    <div>
                        <p className="text-sm font-semibold text-white/70 mb-3">
                            📅 Jadwal Hari Ini — {todaySchedule.tanggal} Ramadhan 1447H
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {PRAYER_LABELS.map(({ key, label, emoji, color }) => {
                                const time = todaySchedule[key];
                                if (!time) return null;
                                const isNext = nextPrayer?.key === key;
                                return (
                                    <div
                                        key={key}
                                        className={`glass-dark rounded-xl p-3 text-center transition-all ${isNext ? 'border border-green-500/50 bg-green-900/20' : 'border border-white/5'
                                            }`}
                                    >
                                        <div className="text-xl mb-1">{emoji}</div>
                                        <div className="text-xs text-white/50 mb-1">{label}</div>
                                        <div className={`text-base font-bold font-mono ${isNext ? 'text-green-300' : color}`}>
                                            {time}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Toggle Full Month */}
                    <button
                        onClick={() => setShowAllDays(!showAllDays)}
                        className="w-full text-sm text-white/50 hover:text-white/80 py-2 border border-white/10 rounded-xl hover:border-white/20 transition-all"
                    >
                        {showAllDays ? '▲ Sembunyikan Jadwal Lengkap' : '▼ Lihat Jadwal 30 Hari Ramadhan'}
                    </button>

                    {/* Full Month Table */}
                    {showAllDays && imsakiyahData?.imsakiyah && (
                        <div className="overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-xs text-white/70">
                                <thead>
                                    <tr className="bg-white/5 text-white/50">
                                        <th className="p-2 text-left">Tgl</th>
                                        {PRAYER_LABELS.map(({ key, label }) => (
                                            <th key={key} className="p-2 text-center">{label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {imsakiyahData.imsakiyah.map(day => (
                                        <tr
                                            key={day.tanggal}
                                            className={`border-t border-white/5 hover:bg-white/5 transition-colors ${day.tanggal === ramadhanDay ? 'bg-green-900/20 text-green-300' : ''
                                                }`}
                                        >
                                            <td className="p-2 font-bold">{day.tanggal}</td>
                                            {PRAYER_LABELS.map(({ key }) => (
                                                <td key={key} className="p-2 text-center font-mono">{day[key] || '-'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Empty state */}
            {!todaySchedule && !loading && !error && (
                <div className="text-center py-6 text-white/30">
                    <p className="text-4xl mb-2">🕌</p>
                    <p className="text-sm">Pilih provinsi dan kab/kota untuk melihat jadwal imsakiyah</p>
                </div>
            )}
        </div>
    );
};

export default ImsakiyahCard;
