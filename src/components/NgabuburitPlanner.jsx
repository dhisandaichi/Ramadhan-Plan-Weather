import { useState } from 'react';
import { MdBeachAccess, MdTerrain, MdDirectionsCar, MdGroups, MdCoffee } from 'react-icons/md';
import { calculateHeatIndex } from '../utils/calculators';

const NgabuburitPlanner = ({ weatherData }) => {
    const [selectedActivity, setSelectedActivity] = useState('jalan');

    if (!weatherData?.current) return null;

    const current = weatherData.current;
    const heatIndex = calculateHeatIndex(current.temperature_2m, current.relative_humidity_2m);

    // Activity options - focused on Ngabuburit activities
    const activities = [
        { id: 'jalan', name: 'Jalan-Jalan', icon: <MdDirectionsCar />, emoji: '🚶' },
        { id: 'kuliner', name: 'Berburu Takjil', icon: <MdCoffee />, emoji: '🍹' },
        { id: 'taman', name: 'Taman/Alun-Alun', icon: <MdTerrain />, emoji: '🌳' },
        { id: 'bukber', name: 'Buka Bersama', icon: <MdGroups />, emoji: '🍽️' },
    ];

    // Calculate scores for each activity
    const calculateActivityScore = (activityId) => {
        const precipitation = weatherData.hourly?.precipitation_probability[new Date().getHours()] || 0;
        const wind = current.wind_speed_10m;
        const cloudCover = current.cloud_cover;

        let score = 100;
        let tips = [];
        let status = '';

        switch (activityId) {
            case 'jalan':
                // Jalan-jalan/strolling scoring (afternoon before iftar)
                if (precipitation > 50) { score -= 35; tips.push('Kemungkinan hujan tinggi, siapkan payung'); }
                else if (precipitation > 30) { score -= 15; tips.push('Kemungkinan gerimis, bawa payung lipat'); }

                if (heatIndex > 35) { score -= 25; tips.push('Cuaca sangat panas, tunggu menjelang Maghrib'); }
                else if (heatIndex > 32) { score -= 15; tips.push('Masih panas, hindari jalan kaki terlalu lama'); }
                else if (heatIndex < 28) { score += 10; tips.push('Cuaca sejuk, cocok untuk jalan kaki santai'); }

                if (wind > 30) { score -= 15; tips.push('Angin cukup kencang'); }

                if (cloudCover > 70) { score += 5; tips.push('Mendung, tidak terlalu terik'); }

                if (score >= 75) status = 'SANGAT COCOK';
                else if (score >= 50) status = 'CUKUP NYAMAN';
                else if (score >= 30) status = 'KURANG IDEAL';
                else status = 'TIDAK DISARANKAN';
                break;

            case 'kuliner': {
                // Berburu takjil scoring
                if (precipitation > 60) { score -= 40; tips.push('Hujan deras, pilih takjil drive-thru atau pesan online'); }
                else if (precipitation > 30) { score -= 20; tips.push('Kemungkinan hujan, pilih tempat takjil indoor'); }

                if (heatIndex > 34) { score -= 15; tips.push('Cuaca panas, beli es buah atau es kelapa muda!'); }
                else if (heatIndex < 28) { score += 10; tips.push('Cuaca sejuk, cocok beli gorengan hangat'); }

                if (wind > 25) { score -= 10; tips.push('Angin kencang, hati-hati bawa makanan'); }

                // Check weather around 5-6 PM (peak takjil time)
                const takjilHour = 17;
                const takjilPrecip = weatherData.hourly?.precipitation_probability[takjilHour] || 0;
                if (takjilPrecip > 50) { score -= 15; tips.push('Prediksi hujan jam 5 sore, berangkat lebih awal'); }

                if (score >= 80) status = 'WAKTU IDEAL BERBURU';
                else if (score >= 60) status = 'COCOK';
                else if (score >= 40) status = 'PERLU PERSIAPAN';
                else status = 'PESAN ONLINE SAJA';
                break;
            }

            case 'taman':
                // Taman/Alun-alun scoring
                if (precipitation > 50) { score -= 40; tips.push('Risiko hujan tinggi, tidak cocok ke taman'); }
                else if (precipitation > 30) { score -= 20; tips.push('Kemungkinan hujan, bawa payung'); }

                if (heatIndex > 35) { score -= 30; tips.push('Masih sangat panas, tunggu menjelang Maghrib'); }
                else if (heatIndex > 32) { score -= 15; tips.push('Cuaca masih panas, cari spot teduh'); }
                else if (heatIndex < 28) { score += 15; tips.push('Cuaca sejuk, sempurna untuk ngabuburit di taman!'); }

                if (wind > 35) { score -= 15; tips.push('Angin kencang, hati-hati dekat pohon besar'); }

                if (cloudCover > 60 && precipitation < 30) { score += 10; tips.push('Mendung tapi tidak hujan, sejuk!'); }

                if (score >= 75) status = 'SEMPURNA';
                else if (score >= 50) status = 'CUKUP NYAMAN';
                else if (score >= 30) status = 'KURANG IDEAL';
                else status = 'TIDAK DISARANKAN';
                break;

            case 'bukber': {
                // Buka bersama / outdoor dining scoring
                if (precipitation > 40) { score -= 30; tips.push('Risiko hujan, pilih tempat bukber indoor'); }

                if (heatIndex > 33) { score -= 15; tips.push('Cuaca panas, pilih tempat ber-AC'); }
                else if (heatIndex < 26) { score += 10; tips.push('Cuaca sejuk, outdoor dining nyaman!'); }

                if (wind > 25) { score -= 10; tips.push('Angin kencang, hindari meja outdoor'); }

                // Evening forecast for iftar time (around 18:00)
                const iftarHour = 18;
                const eveningPrecip = weatherData.hourly?.precipitation_probability[iftarHour] || 0;
                if (eveningPrecip > 50) { score -= 20; tips.push('Prediksi hujan saat berbuka'); }
                else if (eveningPrecip < 20) { score += 5; tips.push('Cuaca cerah saat berbuka, outdoor aman'); }

                if (score >= 80) status = 'SANGAT COCOK';
                else if (score >= 60) status = 'COCOK';
                else if (score >= 40) status = 'PERTIMBANGKAN INDOOR';
                else status = 'PILIH INDOOR';
                break;
            }
            default:
                break;
        }

        return { score: Math.max(0, Math.min(100, score)), status, tips };
    };

    const currentActivity = calculateActivityScore(selectedActivity);

    const getScoreColor = (score) => {
        if (score >= 75) return 'primary';
        if (score >= 50) return 'yellow';
        if (score >= 30) return 'orange';
        return 'red';
    };

    const scoreColor = getScoreColor(currentActivity.score);

    return (
        <div className="space-y-4">
            {/* Activity Selector */}
            <div className="card-premium">
                <h2 className="text-2xl font-bold font-display mb-4 gradient-text">
                    🌙 Planner Ngabuburit
                </h2>
                <p className="text-white/60 text-sm mb-4">
                    Rencanakan aktivitas sore menjelang berbuka berdasarkan kondisi cuaca
                </p>

                <div className="grid grid-cols-4 gap-2 mb-4">
                    {activities.map((activity) => (
                        <button
                            key={activity.id}
                            onClick={() => setSelectedActivity(activity.id)}
                            className={`p-3 rounded-xl transition-all ${selectedActivity === activity.id
                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                                : 'glass hover:bg-white/20'
                                }`}
                        >
                            <div className="text-2xl mb-1">{activity.emoji}</div>
                            <div className="text-xs font-semibold">{activity.name}</div>
                        </button>
                    ))}
                </div>

                {/* Score Display */}
                <div className={`glass-dark rounded-2xl p-6 text-center border-2 ${scoreColor === 'primary' ? 'border-primary-500/50' :
                    scoreColor === 'yellow' ? 'border-yellow-500/50' :
                        scoreColor === 'orange' ? 'border-orange-500/50' :
                            'border-red-500/50'
                    }`}>
                    <div className="text-6xl mb-2">
                        {activities.find(a => a.id === selectedActivity)?.emoji}
                    </div>
                    <div className={`text-5xl font-bold mb-2 ${scoreColor === 'primary' ? 'text-primary-400' :
                        scoreColor === 'yellow' ? 'text-yellow-400' :
                            scoreColor === 'orange' ? 'text-orange-400' :
                                'text-red-400'
                        }`}>
                        {currentActivity.score}
                    </div>
                    <div className="text-lg font-semibold text-white/80 mb-1">
                        {currentActivity.status}
                    </div>
                    <div className="text-sm text-white/60">
                        Skor Kelayakan Ngabuburit
                    </div>
                </div>
            </div>

            {/* Weather Conditions */}
            <div className="card-premium">
                <h3 className="font-bold text-lg mb-3">📊 Kondisi Cuaca Saat Ini</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="glass-dark rounded-xl p-3 text-center">
                        <div className="text-2xl">🌡️</div>
                        <div className="text-xs text-white/50">Suhu</div>
                        <div className="font-bold">{Math.round(current.temperature_2m)}°C</div>
                    </div>
                    <div className="glass-dark rounded-xl p-3 text-center">
                        <div className="text-2xl">💧</div>
                        <div className="text-xs text-white/50">Kelembaban</div>
                        <div className="font-bold">{current.relative_humidity_2m}%</div>
                    </div>
                    <div className="glass-dark rounded-xl p-3 text-center">
                        <div className="text-2xl">💨</div>
                        <div className="text-xs text-white/50">Angin</div>
                        <div className="font-bold">{Math.round(current.wind_speed_10m)} km/h</div>
                    </div>
                    <div className="glass-dark rounded-xl p-3 text-center">
                        <div className="text-2xl">☁️</div>
                        <div className="text-xs text-white/50">Awan</div>
                        <div className="font-bold">{current.cloud_cover}%</div>
                    </div>
                </div>

                {/* Time suggestion */}
                <div className="mt-3 glass-dark rounded-xl p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-white/70">⏰ Waktu terbaik ngabuburit:</span>
                        <span className="font-bold text-gold-300">
                            {heatIndex > 32 ? '16:30 - 18:00' : '15:30 - 18:00'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tips & Recommendations */}
            <div className="card-premium">
                <h3 className="font-bold text-lg mb-3">💡 Tips Ngabuburit</h3>
                <div className="space-y-2">
                    {currentActivity.tips.length > 0 ? (
                        currentActivity.tips.map((tip, index) => (
                            <div key={index} className="glass-dark rounded-xl p-3 flex items-start gap-3">
                                <span className="text-lg">
                                    {tip.includes('tidak') || tip.includes('deras') ? '⚠️' :
                                        tip.includes('cocok') || tip.includes('sempurna') || tip.includes('ideal') ? '✅' : 'ℹ️'}
                                </span>
                                <span className="text-sm text-white/80">{tip}</span>
                            </div>
                        ))
                    ) : (
                        <div className="glass-dark rounded-xl p-3 text-center text-primary-300">
                            ✅ Cuaca sempurna untuk ngabuburit!
                        </div>
                    )}
                </div>

                {/* Packing Suggestions */}
                <div className="mt-4 glass-dark rounded-xl p-4">
                    <div className="font-semibold text-gold-300 mb-2">🎒 Barang yang Perlu Dibawa:</div>
                    <div className="flex flex-wrap gap-2">
                        {selectedActivity === 'jalan' && (
                            <>
                                <span className="badge-info">Dompet</span>
                                <span className="badge-info">HP</span>
                                <span className="badge-info">Air Minum</span>
                                {heatIndex > 30 && <span className="badge-warning">Kipas Lipat</span>}
                                {weatherData.hourly?.precipitation_probability[new Date().getHours()] > 30 && (
                                    <span className="badge-warning">Payung</span>
                                )}
                            </>
                        )}
                        {selectedActivity === 'kuliner' && (
                            <>
                                <span className="badge-info">Dompet/E-Wallet</span>
                                <span className="badge-info">Kantong Plastik</span>
                                <span className="badge-info">Hand Sanitizer</span>
                                <span className="badge-gold">Dus Makanan</span>
                                {weatherData.hourly?.precipitation_probability[new Date().getHours()] > 30 && (
                                    <span className="badge-warning">Payung</span>
                                )}
                            </>
                        )}
                        {selectedActivity === 'taman' && (
                            <>
                                <span className="badge-info">Tikar</span>
                                <span className="badge-info">Snack/Takjil</span>
                                <span className="badge-info">Air Minum</span>
                                <span className="badge-info">Speaker Kecil</span>
                                {weatherData.hourly?.precipitation_probability[new Date().getHours()] > 30 && (
                                    <span className="badge-warning">Payung</span>
                                )}
                            </>
                        )}
                        {selectedActivity === 'bukber' && (
                            <>
                                <span className="badge-info">Dompet</span>
                                <span className="badge-info">HP</span>
                                <span className="badge-gold">Kurma</span>
                                <span className="badge-gold">Air Mineral</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Ramadhan Reminder */}
                <div className="mt-4 glass-dark rounded-xl p-4 border border-gold-500/30">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🌙</span>
                        <div>
                            <div className="font-semibold text-gold-300">Reminder Ramadhan</div>
                            <p className="text-sm text-white/70 mt-1">
                                {selectedActivity === 'kuliner'
                                    ? 'Berburu takjil adalah tradisi yang penuh berkah. Jangan lupa berbagi dengan sesama!'
                                    : selectedActivity === 'bukber'
                                        ? 'Buka bersama adalah momen menjalin silaturahmi. Jangan berlebihan saat berbuka!'
                                        : selectedActivity === 'taman'
                                            ? 'Nikmati ngabuburit di taman dengan dzikir dan tadabur alam.'
                                            : 'Manfaatkan waktu ngabuburit untuk refreshing sebelum berbuka dan Tarawih.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NgabuburitPlanner;
