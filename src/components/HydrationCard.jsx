import { MdWaterDrop } from 'react-icons/md';
import { calculateHeatIndex, calculateHydrationNeeds } from '../utils/calculators';

const HydrationCard = ({ weatherData, bodyWeight = 70 }) => {
    if (!weatherData?.current) return null;

    const current = weatherData.current;
    const heatIndex = calculateHeatIndex(current.temperature_2m, current.relative_humidity_2m);
    const hydration = calculateHydrationNeeds(heatIndex, bodyWeight, true);

    // Convert ml to glasses (approx) for total display
    const totalGlasses = Math.round(hydration.totalNeeded / 250);

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
                <div className="mt-2 bg-white/5 rounded-lg py-1 px-3 inline-block">
                    <span className="text-sm font-mono text-primary-300">Pola: {hydration.pattern}</span>
                </div>
                <div className={`text-sm mt-3 font-semibold ${isExtreme ? 'text-red-400' : isHigh ? 'text-yellow-400' : 'text-primary-400'}`}>
                    {isExtreme ? '🔥 CUACA EKSTREM - Pola Minum Ditingkatkan!' :
                        isHigh ? '☀️ CUACA PANAS - Pola Minum Ekstra' :
                            '✅ CUACA NORMAL - Pola Standar 2-4-2'}
                </div>
            </div>

            {/* Distribution */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass-dark rounded-xl p-3 text-center border-t-4 border-primary-500/50">
                    <div className="text-2xl mb-1">🌙</div>
                    <div className="text-xs text-white/50 mb-1">Sahur</div>
                    <div className="text-xl font-bold text-white">{hydration.sahurGlasses}</div>
                    <div className="text-[10px] text-white/40">Gelas</div>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center border-t-4 border-gold-500/50">
                    <div className="text-2xl mb-1">🌅</div>
                    <div className="text-xs text-white/50 mb-1">Buka</div>
                    <div className="text-xl font-bold text-white">{hydration.iftarGlasses}</div>
                    <div className="text-[10px] text-white/40">Gelas</div>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center border-t-4 border-blue-500/50">
                    <div className="text-2xl mb-1">🌃</div>
                    <div className="text-xs text-white/50 mb-1">Malam</div>
                    <div className="text-xl font-bold text-white">{hydration.nightGlasses}</div>
                    <div className="text-[10px] text-white/40">Gelas</div>
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
