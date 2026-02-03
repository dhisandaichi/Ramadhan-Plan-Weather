import { useState, useEffect } from 'react';
import { MdTimer, MdWaterDrop, MdRestaurantMenu } from 'react-icons/md';
import { FaMoon } from 'react-icons/fa';
import { getSahurPlan } from '../utils/mealPlanner';
import { calculateHeatIndex, calculateHydrationNeeds } from '../utils/calculators';

const SahurPlanner = ({ weatherData }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [imsakTime, setImsakTime] = useState('04:30'); // Default, user can change
    const [bodyWeight, setBodyWeight] = useState(70);
    const [showSettings, setShowSettings] = useState(false);

    // Update time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    if (!weatherData?.current || !weatherData?.daily) return null;

    const current = weatherData.current;
    const todayMax = weatherData.daily.temperature_2m_max[0];

    // Calculate heat index for today's peak
    const heatIndex = calculateHeatIndex(todayMax, current.relative_humidity_2m);

    // Calculate hydration needs
    const hydration = calculateHydrationNeeds(heatIndex, bodyWeight, true);

    // Get sahur meal recommendations
    const isRainy = current.precipitation > 0 || weatherData.daily.precipitation_probability_max[0] > 50;
    const sahurPlan = getSahurPlan(currentTime, imsakTime, current.temperature_2m, heatIndex, isRainy);

    return (
        <div className="space-y-4">
            {/* Header Card */}
            <div className="bg-ramadhan-900/50 border border-primary-500/30 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <FaMoon className="text-4xl text-yellow-300 animate-pulse-slow" />
                        <div>
                            <h2 className="text-2xl font-bold font-display">Smart Sahur Planner</h2>
                            <p className="text-sm text-white/60">Optimasi gizi & hidrasi untuk puasa Anda</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="btn-secondary text-sm"
                    >
                        ⚙️ Pengaturan
                    </button>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="glass-dark rounded-2xl p-4 mb-4 space-y-3">
                        <div>
                            <label className="block text-sm font-semibold mb-2">⏰ Waktu Imsak</label>
                            <input
                                type="time"
                                value={imsakTime}
                                onChange={(e) => setImsakTime(e.target.value)}
                                className="input-field w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">⚖️ Berat Badan (kg)</label>
                            <input
                                type="number"
                                value={bodyWeight}
                                onChange={(e) => setBodyWeight(Number(e.target.value))}
                                className="input-field w-full"
                                min="40"
                                max="150"
                            />
                            <p className="text-xs text-white/50 mt-1">Untuk perhitungan kebutuhan air</p>
                        </div>
                    </div>
                )}

                {/* Countdown Timer */}
                <div className="glass rounded-2xl p-6 text-center mb-4 border-2 border-yellow-500/50">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <MdTimer className="text-3xl text-yellow-300" />
                        <div className="text-sm font-semibold text-yellow-300">WAKTU TERSISA HINGGA IMSAK</div>
                    </div>
                    <div className="text-6xl font-bold text-shadow-lg mb-2">
                        {sahurPlan.minutesLeft > 0 ? (
                            <>
                                <span className="text-yellow-300">{Math.floor(sahurPlan.minutesLeft / 60)}</span>
                                <span className="text-white/50">:</span>
                                <span className="text-yellow-300">{(sahurPlan.minutesLeft % 60).toString().padStart(2, '0')}</span>
                            </>
                        ) : (
                            <span className="text-red-400">IMSAK!</span>
                        )}
                    </div>
                    <div className="text-xl font-semibold">
                        <span className="text-4xl mr-2">{sahurPlan.icon}</span>
                        {sahurPlan.message}
                    </div>
                </div>

                {/* Hydration Plan */}
                <div className="glass-dark rounded-2xl p-4 border-l-4 border-blue-400">
                    <div className="flex items-center gap-3 mb-3">
                        <MdWaterDrop className="text-3xl text-blue-400" />
                        <div>
                            <h3 className="font-bold text-lg">Target Hidrasi Hari Ini</h3>
                            <p className="text-xs text-white/60">Berdasarkan suhu maksimal {Math.round(todayMax)}°C (Heat Index: {Math.round(heatIndex)}°C)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="glass rounded-xl p-3 text-center">
                            <div className="text-2xl mb-1">🌙</div>
                            <div className="text-2xl font-bold text-blue-400">{Math.round(hydration.sahurAmount / 250)}</div>
                            <div className="text-xs text-white/60">Gelas (Sahur)</div>
                        </div>
                        <div className="glass rounded-xl p-3 text-center">
                            <div className="text-2xl mb-1">🌅</div>
                            <div className="text-2xl font-bold text-orange-400">{Math.round(hydration.iftarAmount / 250)}</div>
                            <div className="text-xs text-white/60">Gelas (Buka)</div>
                        </div>
                        <div className="glass rounded-xl p-3 text-center">
                            <div className="text-2xl mb-1">✨</div>
                            <div className="text-2xl font-bold text-primary-400">{Math.round(hydration.nightAmount / 250)}</div>
                            <div className="text-xs text-white/60">Gelas (Malam)</div>
                        </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl text-center font-semibold ${heatIndex > 32 ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
                        heatIndex > 28 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
                            'bg-green-500/20 text-green-300 border border-green-500/50'
                        }`}>
                        {hydration.recommendation}
                    </div>
                </div>
            </div>

            {/* Meal Recommendations */}
            <div className="card-premium">
                <div className="flex items-center gap-3 mb-4">
                    <MdRestaurantMenu className="text-3xl text-green-400" />
                    <div>
                        <h3 className="font-bold text-xl">Rekomendasi Menu Sahur</h3>
                        <p className="text-sm text-white/60">Disesuaikan dengan waktu & cuaca</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {sahurPlan.recommendations.map((meal, index) => (
                        <div
                            key={index}
                            className={`glass-dark rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer border-2 ${index === 0 ? 'border-green-500/50' : 'border-white/10'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-lg">{meal.name}</h4>
                                        {index === 0 && <span className="badge-success">⭐ Terbaik</span>}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <span>⏱️ {meal.prepTime} menit</span>
                                        <span>🔥 {meal.calories} kal</span>
                                        <span>💧 Hidrasi: {meal.hydration === 'high' ? 'Tinggi ✅' : meal.hydration === 'medium' ? 'Sedang ⚠️' : 'Rendah ❌'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-white/80 mb-2">
                                <span className="font-semibold text-white">Bahan:</span> {meal.ingredients.join(', ')}
                            </div>

                            <div className="glass rounded-xl p-3 text-sm mb-2">
                                <div className="font-semibold text-green-300 mb-1">💚 Manfaat:</div>
                                <div className="text-white/80">{meal.benefits}</div>
                            </div>

                            <div className="glass rounded-xl p-3 text-sm">
                                <div className="font-semibold text-blue-300 mb-1">💡 Tips:</div>
                                <div className="text-white/80">{meal.tips}</div>
                            </div>

                            {meal.weatherAdvice && (
                                <div className="mt-2 px-3 py-2 rounded-lg bg-gold-500/20 border border-gold-500/50 text-sm text-gold-200">
                                    🌤️ {meal.weatherAdvice}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SahurPlanner;
