import { useState, useEffect } from 'react';
import { FaMosque } from 'react-icons/fa';
import { WiSunrise, WiSunset, WiMoonAltWaningCrescent4 } from 'react-icons/wi';
import { getPrayerTimes, getNextPrayer, HIJRI_MONTHS_ID, DAYS_ID } from '../services/prayerService';

const PrayerTimesCard = ({ latitude, longitude, cityName }) => {
    const [prayerData, setPrayerData] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                setLoading(true);
                const data = await getPrayerTimes(latitude, longitude);
                setPrayerData(data);
                setNextPrayer(getNextPrayer(data.timings));
                setError(null);
            } catch (err) {
                setError('Gagal memuat jadwal shalat');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (latitude && longitude) {
            fetchPrayerTimes();
        }
    }, [latitude, longitude]);

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            if (prayerData?.timings) {
                setNextPrayer(getNextPrayer(prayerData.timings));
            }
        }, 60000);

        return () => clearInterval(timer);
    }, [prayerData]);

    if (loading) {
        return (
            <div className="card-gold animate-pulse">
                <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 bg-white/10 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card-gold">
                <p className="text-red-400 text-center">{error}</p>
            </div>
        );
    }

    if (!prayerData) return null;

    const { timings, date } = prayerData;
    const hijriMonthId = HIJRI_MONTHS_ID[date.hijri.monthNumber] || date.hijri.monthEn;
    const dayId = DAYS_ID[date.gregorian.weekday] || date.gregorian.weekday;

    const prayers = [
        { name: 'Imsak', time: timings.imsak, icon: '🌙', key: 'imsak' },
        { name: 'Subuh', time: timings.fajr, icon: '🌅', key: 'fajr' },
        { name: 'Terbit', time: timings.sunrise, icon: '☀️', key: 'sunrise' },
        { name: 'Dzuhur', time: timings.dhuhr, icon: '🌞', key: 'dhuhr' },
        { name: 'Ashar', time: timings.asr, icon: '🌤️', key: 'asr' },
        { name: 'Maghrib', time: timings.maghrib, icon: '🌅', key: 'maghrib' },
        { name: 'Isya', time: timings.isha, icon: '🌙', key: 'isha' },
    ];

    return (
        <div className="card-gold islamic-pattern">
            {/* Header with Islamic Date */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gold-500/20 border border-gold-400/50">
                        <FaMosque className="text-3xl text-gold-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-display gradient-text-gold">
                            Jadwal Shalat
                        </h2>
                        <p className="text-sm text-white/70">{cityName}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-gold-300">
                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>

            {/* Date Display */}
            <div className="glass-dark rounded-2xl p-4 mb-4">
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Gregorian Date */}
                    <div className="text-center md:text-left">
                        <div className="text-sm text-white/50 mb-1">Masehi</div>
                        <div className="text-lg font-semibold">
                            {dayId}, {date.gregorian.day} {date.gregorian.month} {date.gregorian.year}
                        </div>
                    </div>
                    {/* Hijri Date */}
                    <div className="text-center md:text-right">
                        <div className="text-sm text-gold-400/70 mb-1">Hijriyah</div>
                        <div className="text-lg font-semibold text-gold-300">
                            {date.hijri.day} {hijriMonthId} {date.hijri.year} H
                        </div>
                        {date.hijri.holidays.length > 0 && (
                            <div className="text-xs text-gold-400 mt-1">
                                🌙 {date.hijri.holidays.join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Next Prayer Highlight */}
            {nextPrayer && (
                <div className="prayer-next rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-primary-300">Shalat Berikutnya</div>
                            <div className="text-2xl font-bold">{nextPrayer.nameId}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-primary-300">{nextPrayer.time}</div>
                            <div className="text-sm text-white/70">{nextPrayer.countdown} lagi</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Prayer Times Grid */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {prayers.map((prayer) => {
                    // eslint-disable-next-line no-unused-vars
                    const isNext = nextPrayer?.name.toLowerCase() === prayer.key.replace('fajr', 'Fajr');

                    return (
                        <div
                            key={prayer.key}
                            className={`rounded-xl p-3 text-center transition-all ${prayer.name === nextPrayer?.nameId
                                ? 'bg-primary-600/30 border-2 border-primary-400 shadow-glow-green'
                                : 'glass-dark hover:bg-white/10'
                                }`}
                        >
                            <div className="text-2xl mb-1">{prayer.icon}</div>
                            <div className="text-xs text-white/70 mb-1">{prayer.name}</div>
                            <div className={`text-sm font-bold ${prayer.name === nextPrayer?.nameId ? 'text-primary-300' : ''}`}>
                                {prayer.time.replace(' (WIB)', '')}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ramadhan Special Info (if in Ramadhan) */}
            {date.hijri.monthNumber === 9 && (
                <div className="mt-4 p-3 rounded-xl bg-gold-500/20 border border-gold-400/50 text-center">
                    <div className="text-gold-300 font-semibold">
                        🌙 Ramadhan ke-{date.hijri.day} | Selamat Berpuasa!
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrayerTimesCard;
