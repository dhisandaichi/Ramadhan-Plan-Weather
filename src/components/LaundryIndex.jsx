import { calculateLaundryScore } from '../utils/calculators';

const LaundryIndex = ({ weatherData }) => {
    if (!weatherData?.current) return null;

    const current = weatherData.current;
    const hourly = weatherData.hourly;

    // Get current hour index
    const now = new Date();
    const currentHourIndex = now.getHours();

    // Calculate laundry score for current conditions
    const laundryScore = calculateLaundryScore(
        current.temperature_2m,
        current.relative_humidity_2m,
        current.wind_speed_10m,
        hourly.precipitation_probability[currentHourIndex] || 0,
        current.cloud_cover
    );

    // Get color classes based on status
    const getColorClass = (color) => {
        switch (color) {
            case 'success':
                return 'from-primary-500 to-emerald-600';
            case 'warning':
                return 'from-yellow-500 to-orange-500';
            case 'danger':
                return 'from-red-500 to-pink-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getBorderColor = (color) => {
        switch (color) {
            case 'success':
                return 'border-primary-500/50';
            case 'warning':
                return 'border-yellow-500/50';
            case 'danger':
                return 'border-red-500/50';
            default:
                return 'border-gray-500/50';
        }
    };

    return (
        <div className="bg-ramadhan-900/50 border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-5xl animate-float">👕</div>
                    <div>
                        <h2 className="text-2xl font-bold font-display">Indeks Jemuran</h2>
                        <p className="text-sm text-white/60">Boleh nyuci gak hari ini?</p>
                    </div>
                </div>
                <div className={`w-4 h-4 rounded-full animate-pulse ${laundryScore.color === 'success' ? 'bg-primary-400' :
                        laundryScore.color === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
            </div>

            {/* Score Display */}
            <div className={`bg-ramadhan-950/50 rounded-2xl p-6 mb-4 border-2 ${getBorderColor(laundryScore.color)}`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm text-white/60 mb-1">Skor Jemuran</div>
                        <div className="text-6xl font-bold">{laundryScore.score}</div>
                        <div className="text-sm text-white/50 mt-1">dari 100</div>
                    </div>
                    <div className="text-right">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getColorClass(laundryScore.color)} text-white font-bold text-lg`}>
                            {laundryScore.icon}
                            {laundryScore.status}
                        </div>
                        <div className="text-sm text-white/60 mt-2">
                            Waktu kering: <span className="font-semibold text-white">{laundryScore.dryingTime}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getColorClass(laundryScore.color)} transition-all duration-1000 rounded-full`}
                        style={{ width: `${laundryScore.score}%` }}
                    ></div>
                </div>
            </div>

            {/* Advice Box - Changed from purple to primary (green) */}
            <div className="bg-primary-900/30 rounded-2xl p-4 border-l-4 border-primary-500">
                <div className="flex items-start gap-3">
                    <div className="text-2xl">{laundryScore.icon}</div>
                    <div>
                        <div className="font-semibold mb-1 text-primary-300">Saran</div>
                        <div className="text-white/80 text-sm leading-relaxed">
                            {laundryScore.advice}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-ramadhan-950/50 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-white/60 mb-1">Suhu</div>
                    <div className="text-lg font-bold">{Math.round(current.temperature_2m)}°C</div>
                    <div className="text-xs text-white/50">
                        {current.temperature_2m >= 25 && current.temperature_2m <= 35 ? '✅ Ideal' : '⚠️ Kurang'}
                    </div>
                </div>

                <div className="bg-ramadhan-950/50 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-white/60 mb-1">Kelembaban</div>
                    <div className="text-lg font-bold">{current.relative_humidity_2m}%</div>
                    <div className="text-xs text-white/50">
                        {current.relative_humidity_2m < 60 ? '✅ Bagus' : current.relative_humidity_2m < 70 ? '⚠️ Sedang' : '❌ Tinggi'}
                    </div>
                </div>

                <div className="bg-ramadhan-950/50 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-white/60 mb-1">Angin</div>
                    <div className="text-lg font-bold">{Math.round(current.wind_speed_10m)} km/h</div>
                    <div className="text-xs text-white/50">
                        {current.wind_speed_10m >= 10 && current.wind_speed_10m <= 20 ? '✅ Sempurna' : '⚠️ Cukup'}
                    </div>
                </div>

                <div className="bg-ramadhan-950/50 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-white/60 mb-1">Tutupan Awan</div>
                    <div className="text-lg font-bold">{current.cloud_cover}%</div>
                    <div className="text-xs text-white/50">
                        {current.cloud_cover < 50 ? '✅ Cerah' : current.cloud_cover < 80 ? '⚠️ Berawan' : '❌ Mendung'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaundryIndex;
