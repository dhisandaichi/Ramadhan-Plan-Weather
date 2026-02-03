import { MdWaterDrop } from 'react-icons/md';
import { calculateHeatIndex, calculateHydrationNeeds } from '../utils/calculators';

const HydrationCard = ({ weatherData, bodyWeight = 70 }) => {
    if (!weatherData?.current) return null;

    const current = weatherData.current;
    const heatIndex = calculateHeatIndex(current.temperature_2m, current.relative_humidity_2m);
    const hydration = calculateHydrationNeeds(heatIndex, bodyWeight, true);

    // Convert ml to glasses (1 glass = 250ml)
    const totalGlasses = Math.round(hydration.totalNeeded / 250);
    const sahurGlasses = Math.round(hydration.sahurAmount / 250);
    const iftarGlasses = Math.round(hydration.iftarAmount / 250);
    const nightGlasses = Math.round(hydration.nightAmount / 250);

    // Determine urgency level
    const isExtreme = heatIndex > 32;
    const isHigh = heatIndex > 28;

    return (
        <div className={`card-premium ${isExtreme ? 'border-2 border-red-500/50' : isHigh ? 'border-2 border-yellow-500/50' : 'border-2 border-primary-500/50'}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-2xl ${isExtreme ? 'bg-red-500/20' : isHigh ? 'bg-yellow-500/20' : 'bg-primary-500/20'}`}>
                    <MdWaterDrop className={`text-3xl ${isExtreme ? 'text-red-400' : isHigh ? 'text-yellow-400' : 'text-primary-400'}`} />
                </div>
                <div>
                    <h3 className="text-xl font-bold font-display">Target Hidrasi Hari Ini</h3>
                    <p className="text-sm text-white/60">Berdasarkan Heat Index: {Math.round(heatIndex)}°C</p>
                </div>
            </div>

            {/* Total Target */}
            <div className="glass-dark rounded-2xl p-4 mb-4 text-center">
                <div className="text-5xl font-bold gradient-text mb-1">
                    {(hydration.totalNeeded / 1000).toFixed(1)}L
                </div>
                <div className="text-lg text-white/70">
                    ≈ {totalGlasses} gelas air
                </div>
                <div className={`text-sm mt-2 font-semibold ${isExtreme ? 'text-red-400' : isHigh ? 'text-yellow-400' : 'text-primary-400'}`}>
                    {isExtreme ? '🔥 CUACA EKSTREM - Tingkatkan Hidrasi!' :
                        isHigh ? '☀️ CUACA PANAS - Perbanyak Minum' :
                            '✅ CUACA NORMAL - Hidrasi Standar'}
                </div>
            </div>

            {/* Distribution */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass-dark rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">🌙</div>
                    <div className="text-xs text-white/50 mb-1">Sahur</div>
                    <div className="text-lg font-bold text-primary-300">{sahurGlasses} gelas</div>
                    <div className="text-xs text-white/50">{hydration.sahurAmount}ml</div>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">🌅</div>
                    <div className="text-xs text-white/50 mb-1">Buka</div>
                    <div className="text-lg font-bold text-gold-300">{iftarGlasses} gelas</div>
                    <div className="text-xs text-white/50">{hydration.iftarAmount}ml</div>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">🌃</div>
                    <div className="text-xs text-white/50 mb-1">Malam</div>
                    <div className="text-lg font-bold text-blue-300">{nightGlasses} gelas</div>
                    <div className="text-xs text-white/50">{hydration.nightAmount}ml</div>
                </div>
            </div>

            {/* Recommendation */}
            <div className={`rounded-xl p-3 text-sm ${isExtreme ? 'bg-red-500/20 border border-red-500/50 text-red-200' :
                    isHigh ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-200' :
                        'bg-primary-500/20 border border-primary-500/50 text-primary-200'
                }`}>
                <div className="font-semibold mb-1">💡 Tips Hidrasi:</div>
                <div>{hydration.recommendation}</div>
            </div>

            {/* Progress indicator based on time of day */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Progress Hari Ini</span>
                    <span>Sisa waktu puasa: sesuaikan minum!</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-gold-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((new Date().getHours() / 24) * 100, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default HydrationCard;
