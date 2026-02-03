import { useState } from 'react';
import { MdRestaurantMenu } from 'react-icons/md';
import { WiSunset } from 'react-icons/wi';
import { FaMosque } from 'react-icons/fa';
import { getIftarPlan } from '../utils/mealPlanner';
import { calculateHeatIndex, calculateMosqueComfort } from '../utils/calculators';

const IftarPlanner = ({ weatherData }) => {
    const [prepTimeAvailable, setPrepTimeAvailable] = useState(60); // Default 1 hour

    if (!weatherData?.current || !weatherData?.hourly) return null;

    const current = weatherData.current;

    // Get data for evening (around 18:00 - 19:00 for Tarawih time)
    const eveningHour = 19;
    const eveningTemp = weatherData.hourly.temperature_2m[eveningHour] || current.temperature_2m;
    const eveningHumidity = weatherData.hourly.relative_humidity_2m[eveningHour] || current.relative_humidity_2m;
    const eveningPrecipitation = weatherData.hourly.precipitation_probability[eveningHour] || 0;

    const heatIndex = calculateHeatIndex(current.temperature_2m, current.relative_humidity_2m);
    const isRainy = current.precipitation > 0 || eveningPrecipitation > 30;

    // Get iftar meal recommendations
    const iftarPlan = getIftarPlan(prepTimeAvailable, current.temperature_2m, heatIndex, isRainy);

    // Calculate mosque comfort for Tarawih
    const mosqueComfort = calculateMosqueComfort(eveningTemp, eveningHumidity, eveningPrecipitation);

    return (
        <div className="space-y-4">
            {/* Header Card */}
            <div className="bg-ramadhan-900/50 border border-gold-500/30 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <WiSunset className="text-4xl text-gold-400 animate-pulse-slow" />
                    <div>
                        <h2 className="text-2xl font-bold font-display">Smart Iftar Planner</h2>
                        <p className="text-sm text-white/60">Menu berbuka & persiapan Tarawih</p>
                    </div>
                </div>

                {/* Prep Time Selector */}
                <div className="glass-dark rounded-2xl p-4 mb-4">
                    <label className="block text-sm font-semibold mb-3">
                        ⏱️ Berapa lama Anda punya waktu untuk masak?
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {[15, 30, 60, 90].map((time) => (
                            <button
                                key={time}
                                onClick={() => setPrepTimeAvailable(time)}
                                className={`py-3 rounded-xl font-semibold transition-all ${prepTimeAvailable === time
                                    ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg scale-105'
                                    : 'glass hover:bg-white/20 text-white/80'
                                    }`}
                            >
                                {time} min
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                        Pilih waktu yang realistis agar tidak terburu-buru
                    </p>
                </div>

                {/* Tarawih Comfort Index */}
                <div className="glass rounded-2xl p-4 border-l-4 border-green-400">
                    <div className="flex items-center gap-3 mb-3">
                        <FaMosque className="text-3xl text-green-400" />
                        <div>
                            <h3 className="font-bold text-lg">Indeks Kenyamanan Tarawih</h3>
                            <p className="text-xs text-white/60">Prediksi jam 19:00 ({Math.round(eveningTemp)}°C, Kelembaban {eveningHumidity}%)</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div className={`glass-dark rounded-xl p-4 text-center border-2 ${mosqueComfort.color === 'success' ? 'border-green-500/50' :
                            mosqueComfort.color === 'warning' ? 'border-yellow-500/50' :
                                mosqueComfort.color === 'danger' ? 'border-red-500/50' :
                                    'border-blue-500/50'
                            }`}>
                            <div className="text-4xl mb-2">{mosqueComfort.icon}</div>
                            <div className="text-2xl font-bold mb-1">{mosqueComfort.comfort}</div>
                            <div className="text-sm text-white/60">Status Kenyamanan</div>
                        </div>

                        <div className="glass-dark rounded-xl p-4">
                            <div className="text-sm font-semibold text-green-300 mb-2">👕 Saran Pakaian:</div>
                            <div className="text-white/90 text-sm mb-3">{mosqueComfort.clothingAdvice}</div>

                            <div className="text-sm font-semibold text-blue-300 mb-2">☔ Info Cuaca:</div>
                            <div className="text-white/90 text-sm">{mosqueComfort.rainAdvice}</div>
                        </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl text-center font-semibold text-sm ${mosqueComfort.color === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/50' :
                        mosqueComfort.color === 'warning' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
                            mosqueComfort.color === 'danger' ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
                                'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                        }`}>
                        {mosqueComfort.overallAdvice}
                    </div>
                </div>
            </div>

            {/* Meal Recommendations */}
            <div className="card-premium">
                <div className="flex items-center gap-3 mb-4">
                    <MdRestaurantMenu className="text-3xl text-orange-400" />
                    <div>
                        <h3 className="font-bold text-xl">Rekomendasi Menu Berbuka</h3>
                        <p className="text-sm text-white/60">Cocok untuk waktu masak {prepTimeAvailable} menit</p>
                    </div>
                </div>

                {/* Tarawih Timing Advice */}
                <div className="glass-dark rounded-xl p-4 mb-4 border-l-4 border-purple-500">
                    <div className="font-semibold text-purple-300 mb-2">🕌 Tips Tarawih</div>
                    <div className="text-sm text-white/80 mb-2">
                        ⏰ <strong>Tarawih dimulai:</strong> ~{iftarPlan.tarawihAdvice.startTime}
                    </div>
                    <div className="text-sm text-white/80 mb-2">
                        💡 <strong>Strategi:</strong> {iftarPlan.tarawihAdvice.message}
                    </div>
                    <div className="text-sm text-white/80">
                        <strong>Makanan yang sebaiknya dihindari:</strong> {iftarPlan.tarawihAdvice.foodTips}
                    </div>
                </div>

                {/* Meal Cards */}
                <div className="space-y-3">
                    {iftarPlan.recommendations.map((meal, index) => {
                        // Check if meal is "Tarawih Safe"
                        const isTarawihSafe =
                            meal.name.includes('Ikan') ||
                            meal.name.includes('Salad') ||
                            meal.name.includes('Sayur') ||
                            meal.name.includes('Capcay');

                        const isTarawihRisky =
                            meal.name.includes('Rendang') ||
                            meal.name.includes('Opor') ||
                            meal.name.includes('Santan');

                        return (
                            <div
                                key={index}
                                className={`glass-dark rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer border-2 ${index === 0 ? 'border-orange-500/50' : 'border-white/10'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h4 className="font-bold text-lg">{meal.name}</h4>
                                            {index === 0 && <span className="badge-success">⭐ Rekomendasi Utama</span>}
                                            {isTarawihSafe && <span className="badge-success">✅ Tarawih Safe</span>}
                                            {isTarawihRisky && <span className="badge-warning">⚠️ Berat untuk Tarawih</span>}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-white/60 flex-wrap">
                                            <span>⏱️ {meal.prepTime} menit</span>
                                            <span>🔥 {meal.calories} kal</span>
                                            <span>💧 {meal.hydration === 'very_high' ? 'Sangat Berair 💦' : meal.hydration === 'high' ? 'Berair ✅' : meal.hydration === 'medium' ? 'Cukup ⚠️' : 'Kurang Air ❌'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm text-white/80 mb-2">
                                    <span className="font-semibold text-white">Bahan:</span> {meal.ingredients.join(', ')}
                                </div>

                                <div className="grid md:grid-cols-2 gap-2 mb-2">
                                    <div className="glass rounded-xl p-3 text-sm">
                                        <div className="font-semibold text-green-300 mb-1">💚 Manfaat:</div>
                                        <div className="text-white/80">{meal.benefits}</div>
                                    </div>

                                    <div className="glass rounded-xl p-3 text-sm">
                                        <div className="font-semibold text-blue-300 mb-1">💡 Tips Masak:</div>
                                        <div className="text-white/80">{meal.tips}</div>
                                    </div>
                                </div>

                                {meal.weatherAdvice && (
                                    <div className="mt-2 px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-sm text-orange-200">
                                        {meal.weatherAdvice}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default IftarPlanner;
