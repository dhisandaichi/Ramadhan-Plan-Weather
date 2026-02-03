import { useState } from 'react';
import { MdBeachAccess, MdTerrain, MdDirectionsCar, MdRestaurant, MdGroups } from 'react-icons/md';
import { WiDaySunny, WiRain, WiCloudy, WiStrongWind } from 'react-icons/wi';
import { calculateHeatIndex } from '../utils/calculators';

const TourismPlanner = ({ weatherData, marineData }) => {
    const [selectedActivity, setSelectedActivity] = useState('pantai');

    if (!weatherData?.current) return null;

    const current = weatherData.current;
    const heatIndex = calculateHeatIndex(current.temperature_2m, current.relative_humidity_2m);

    // Activity options
    const activities = [
        { id: 'pantai', name: 'Pantai', icon: <MdBeachAccess />, emoji: '🏖️' },
        { id: 'gunung', name: 'Gunung', icon: <MdTerrain />, emoji: '🏔️' },
        { id: 'mobilitas', name: 'Mobilitas', icon: <MdDirectionsCar />, emoji: '🚗' },
        { id: 'bukber', name: 'Buka Bersama', icon: <MdGroups />, emoji: '🍽️' },
    ];

    // Calculate scores for each activity
    const calculateActivityScore = (activityId) => {
        const temp = current.temperature_2m;
        const precipitation = weatherData.hourly?.precipitation_probability[new Date().getHours()] || 0;
        const wind = current.wind_speed_10m;
        const cloudCover = current.cloud_cover;
        const waveHeight = marineData?.current?.wave_height || 0.5;

        let score = 100;
        let tips = [];
        let status = '';

        switch (activityId) {
            case 'pantai':
                // Beach/marine activity scoring
                if (waveHeight > 2.0) { score -= 40; tips.push('Ombak tinggi, berbahaya untuk berenang'); }
                else if (waveHeight > 1.5) { score -= 25; tips.push('Ombak sedang, hati-hati berenang'); }

                if (precipitation > 50) { score -= 30; tips.push('Kemungkinan hujan tinggi'); }
                else if (precipitation > 30) { score -= 15; tips.push('Siapkan payung untuk jaga-jaga'); }

                if (wind > 30) { score -= 20; tips.push('Angin kencang, hati-hati aktivitas air'); }

                if (heatIndex > 35) { score -= 15; tips.push('Cuaca sangat panas, pakai sunscreen SPF 50+'); }
                else if (heatIndex > 30) { tips.push('Cuaca panas, bawa banyak air minum'); }

                if (cloudCover < 30) { score += 10; tips.push('Langit cerah, cocok untuk snorkeling!'); }

                if (score >= 75) status = 'SEMPURNA';
                else if (score >= 50) status = 'CUKUP BAIK';
                else if (score >= 30) status = 'KURANG IDEAL';
                else status = 'TIDAK DISARANKAN';
                break;

            case 'gunung':
                // Mountain/hiking scoring
                if (precipitation > 50) { score -= 40; tips.push('Hujan tinggi, jalur licin berbahaya'); }
                else if (precipitation > 30) { score -= 20; tips.push('Kemungkinan hujan, bawa jas hujan'); }

                if (wind > 40) { score -= 30; tips.push('Angin sangat kencang di puncak'); }
                else if (wind > 25) { score -= 15; tips.push('Angin kencang, bawa jaket windbreaker'); }

                if (temp < 15) { tips.push('Suhu dingin, bawa pakaian tebal'); }
                else if (temp > 30) { score -= 10; tips.push('Cuaca panas, bawa air ekstra'); }

                if (cloudCover > 80) { score -= 10; tips.push('Mendung tebal, view mungkin tertutup'); }
                else if (cloudCover < 30) { score += 10; tips.push('Langit cerah, view akan bagus!'); }

                if (score >= 75) status = 'SEMPURNA';
                else if (score >= 50) status = 'CUKUP BAIK';
                else if (score >= 30) status = 'PERLU PERSIAPAN EKSTRA';
                else status = 'TUNDA PENDAKIAN';
                break;

            case 'mobilitas':
                // Travel/mobility scoring
                if (precipitation > 60) { score -= 35; tips.push('Hujan lebat, hati-hati berkendara'); }
                else if (precipitation > 30) { score -= 15; tips.push('Kemungkinan hujan, waspadai genangan'); }

                if (wind > 50) { score -= 25; tips.push('Angin kencang berbahaya untuk motor'); }

                if (cloudCover > 90) { score -= 5; tips.push('Mendung gelap, nyalakan lampu'); }

                if (heatIndex > 35) { score -= 10; tips.push('AC mobil ON, hindari motor siang'); }

                if (score >= 80) status = 'LANCAR';
                else if (score >= 60) status = 'NORMAL';
                else if (score >= 40) status = 'WASPADA';
                else status = 'TUNDA PERJALANAN';
                break;

            case 'bukber': {
                // Buka bersama / outdoor dining scoring
                if (precipitation > 40) { score -= 30; tips.push('Risiko hujan, pilih tempat indoor'); }

                if (heatIndex > 33) { score -= 15; tips.push('Cuaca panas, pilih tempat ber-AC'); }
                else if (heatIndex < 26) { score += 10; tips.push('Cuaca sejuk, outdoor dining nyaman!'); }

                if (wind > 25) { score -= 10; tips.push('Angin kencang, hindari meja outdoor'); }

                // Evening forecast for iftar time (around 18:00)
                const iftarHour = 18;
                const eveningPrecip = weatherData.hourly?.precipitation_probability[iftarHour] || 0;
                if (eveningPrecip > 50) { score -= 20; tips.push('Prediksi hujan saat berbuka'); }

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
                    🗺️ Planner Wisata
                </h2>

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
                        Skor Kelayakan Wisata
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

                {marineData?.current && selectedActivity === 'pantai' && (
                    <div className="mt-3 glass-dark rounded-xl p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">🌊 Tinggi Ombak:</span>
                            <span className={`font-bold ${marineData.current.wave_height > 1.5 ? 'text-red-400' :
                                marineData.current.wave_height > 1.0 ? 'text-yellow-400' :
                                    'text-primary-400'
                                }`}>
                                {marineData.current.wave_height}m
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tips & Recommendations */}
            <div className="card-premium">
                <h3 className="font-bold text-lg mb-3">💡 Tips & Rekomendasi</h3>
                <div className="space-y-2">
                    {currentActivity.tips.length > 0 ? (
                        currentActivity.tips.map((tip, index) => (
                            <div key={index} className="glass-dark rounded-xl p-3 flex items-start gap-3">
                                <span className="text-lg">
                                    {tip.includes('berbahaya') || tip.includes('tinggi') ? '⚠️' :
                                        tip.includes('cocok') || tip.includes('bagus') ? '✅' : 'ℹ️'}
                                </span>
                                <span className="text-sm text-white/80">{tip}</span>
                            </div>
                        ))
                    ) : (
                        <div className="glass-dark rounded-xl p-3 text-center text-primary-300">
                            ✅ Kondisi cuaca ideal untuk aktivitas ini!
                        </div>
                    )}
                </div>

                {/* Packing Suggestions */}
                <div className="mt-4 glass-dark rounded-xl p-4">
                    <div className="font-semibold text-gold-300 mb-2">🎒 Barang yang Perlu Dibawa:</div>
                    <div className="flex flex-wrap gap-2">
                        {selectedActivity === 'pantai' && (
                            <>
                                <span className="badge-info">Sunscreen</span>
                                <span className="badge-info">Kacamata</span>
                                <span className="badge-info">Sandal</span>
                                <span className="badge-info">Air Minum</span>
                                {current.cloud_cover < 50 && <span className="badge-warning">Payung</span>}
                            </>
                        )}
                        {selectedActivity === 'gunung' && (
                            <>
                                <span className="badge-info">Jaket</span>
                                <span className="badge-info">Sepatu Hiking</span>
                                <span className="badge-info">Air 2L+</span>
                                <span className="badge-info">Snack</span>
                                <span className="badge-warning">Jas Hujan</span>
                            </>
                        )}
                        {selectedActivity === 'mobilitas' && (
                            <>
                                <span className="badge-info">Charger HP</span>
                                <span className="badge-info">Dompet</span>
                                {weatherData.hourly?.precipitation_probability[new Date().getHours()] > 30 && (
                                    <span className="badge-warning">Jas Hujan</span>
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
            </div>
        </div>
    );
};

export default TourismPlanner;
