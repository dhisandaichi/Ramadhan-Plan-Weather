import { MdWaves, MdWarning } from 'react-icons/md';
import { calculateSnorkelingScore } from '../utils/calculators';

const MarineActivity = ({ weatherData, marineData }) => {
    if (!weatherData?.current) {
        return (
            <div className="card-premium">
                <div className="text-center py-8">
                    <MdWaves className="text-6xl text-blue-400 mx-auto mb-4 opacity-50" />
                    <p className="text-white/70">Data laut tidak tersedia untuk lokasi ini</p>
                    <p className="text-sm text-white/50 mt-2">Fitur ini hanya tersedia untuk wilayah pesisir</p>
                </div>
            </div>
        );
    }

    const current = weatherData.current;

    // Use marine data if available, otherwise estimate from weather data
    const waveHeight = marineData?.current?.wave_height || (current.wind_speed_10m > 20 ? 1.5 : current.wind_speed_10m > 10 ? 0.8 : 0.3);
    const windSpeed = current.wind_speed_10m;
    const cloudCover = current.cloud_cover;
    const precipitation = weatherData.hourly?.precipitation_probability[new Date().getHours()] || 0;

    // Calculate snorkeling safety score
    const snorkelingScore = calculateSnorkelingScore(waveHeight, windSpeed, cloudCover, precipitation);

    const getColorClass = (color) => {
        switch (color) {
            case 'success':
                return 'from-green-500 to-emerald-600';
            case 'warning':
                return 'from-yellow-500 to-orange-500';
            case 'danger':
                return 'from-red-500 to-pink-600';
            default:
                return 'from-blue-500 to-cyan-500';
        }
    };

    const getBorderColor = (color) => {
        switch (color) {
            case 'success':
                return 'border-green-500/50';
            case 'warning':
                return 'border-yellow-500/50';
            case 'danger':
                return 'border-red-500/50';
            default:
                return 'border-blue-500/50';
        }
    };

    return (
        <div className="space-y-4">
            {/* Snorkeling Safety Score */}
            <div className="card-premium bg-gradient-to-br from-blue-900/40 to-cyan-900/40">
                <div className="flex items-center gap-3 mb-6">
                    <div className="text-5xl animate-float">🤿</div>
                    <div>
                        <h2 className="text-2xl font-bold font-display">Snorkeling Safety Index</h2>
                        <p className="text-sm text-white/60">Aman gak buat main ke laut?</p>
                    </div>
                </div>

                {/* Score Display */}
                <div className={`glass-dark rounded-2xl p-6 mb-4 border-2 ${getBorderColor(snorkelingScore.color)}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm text-white/60 mb-1">Skor Keamanan</div>
                            <div className="text-6xl font-bold text-shadow-lg">{snorkelingScore.score}</div>
                            <div className="text-sm text-white/50 mt-1">dari 100</div>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getColorClass(snorkelingScore.color)} text-white font-bold text-lg`}>
                                {snorkelingScore.icon}
                                {snorkelingScore.status}
                            </div>
                            <div className="text-sm text-white/60 mt-2">
                                Ombak: <span className="font-semibold text-white">{snorkelingScore.waveStatus}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                        <div
                            className={`h-full bg-gradient-to-r ${getColorClass(snorkelingScore.color)} transition-all duration-1000 rounded-full`}
                            style={{ width: `${snorkelingScore.score}%` }}
                        ></div>
                    </div>

                    {/* Warning/Advice */}
                    {snorkelingScore.score < 60 && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/20 border border-red-500/50 mb-4">
                            <MdWarning className="text-2xl text-red-300 flex-shrink-0 mt-1" />
                            <div>
                                <div className="font-semibold text-red-300 mb-1">⚠️ PERINGATAN KESELAMATAN</div>
                                <div className="text-sm text-white/90">{snorkelingScore.advice}</div>
                            </div>
                        </div>
                    )}

                    <div className="glass rounded-2xl p-4">
                        <div className="font-semibold mb-2">💡 Rekomendasi</div>
                        <div className="text-white/90 mb-2">{snorkelingScore.advice}</div>
                        <div className={`px-3 py-2 rounded-lg text-center font-semibold ${snorkelingScore.color === 'success' ? 'bg-green-500/30 text-green-200' :
                                snorkelingScore.color === 'warning' ? 'bg-yellow-500/30 text-yellow-200' :
                                    'bg-red-500/30 text-red-200'
                            }`}>
                            {snorkelingScore.recommendation}
                        </div>
                    </div>
                </div>

                {/* Marine Conditions Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="glass-dark rounded-xl p-3 text-center">
                        <div className="text-2xl mb-2">🌊</div>
                        <div className="text-xs text-white/60 mb-1">Tinggi Ombak</div>
                        <div className="text-2xl font-bold">{waveHeight.toFixed(1)}m</div>
                        <div className="text-xs text-white/50 mt-1">
                            {waveHeight < 0.5 ? '✅ Tenang' : waveHeight < 1.0 ? '⚠️ Sedang' : '❌ Tinggi'}
                        </div>
                    </div>

                    <div className="glass-dark rounded-xl p-3 text-center">
                        <div className="text-2xl mb-2">💨</div>
                        <div className="text-xs text-white/60 mb-1">Kecepatan Angin</div>
                        <div className="text-2xl font-bold">{Math.round(windSpeed)}</div>
                        <div className="text-xs text-white/50 mt-1">km/jam</div>
                    </div>

                    <div className="glass-dark rounded-xl p-3 text-center">
                        <div className="text-2xl mb-2">☁️</div>
                        <div className="text-xs text-white/60 mb-1">Tutupan Awan</div>
                        <div className="text-2xl font-bold">{cloudCover}%</div>
                        <div className="text-xs text-white/50 mt-1">
                            {cloudCover < 30 ? '✅ Cerah' : cloudCover < 70 ? '⚠️ Berawan' : '❌ Mendung'}
                        </div>
                    </div>

                    <div className="glass-dark rounded-xl p-3 text-center">
                        <div className="text-2xl mb-2">🌧️</div>
                        <div className="text-xs text-white/60 mb-1">Kemungkinan Hujan</div>
                        <div className="text-2xl font-bold">{precipitation}%</div>
                        <div className="text-xs text-white/50 mt-1">
                            {precipitation < 20 ? '✅ Kecil' : precipitation < 50 ? '⚠️ Sedang' : '❌ Tinggi'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Beach Activities Suggestions */}
            <div className="card-premium">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <span>🏖️</span>
                    Aktivitas Pantai Lainnya
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Swimming */}
                    <div className="glass-dark rounded-xl p-4 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="text-3xl">🏊</div>
                            <div>
                                <div className="font-bold">Berenang</div>
                                <div className="text-xs text-white/60">Safety Score: {snorkelingScore.score > 70 ? 'Aman ✅' : snorkelingScore.score > 40 ? 'Hati-hati ⚠️' : 'Bahaya 🚫'}</div>
                            </div>
                        </div>
                        <p className="text-sm text-white/70">
                            {snorkelingScore.score > 70
                                ? 'Kondisi bagus untuk berenang. Tetap di area yang diawasi lifeguard.'
                                : snorkelingScore.score > 40
                                    ? 'Hanya untuk perenang berpengalaman. Waspadai arus.'
                                    : 'Tidak disarankan. Ombak terlalu berbahaya.'}
                        </p>
                    </div>

                    {/* Surfing */}
                    <div className="glass-dark rounded-xl p-4 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="text-3xl">🏄</div>
                            <div>
                                <div className="font-bold">Surfing</div>
                                <div className="text-xs text-white/60">Wave: {waveHeight.toFixed(1)}m</div>
                            </div>
                        </div>
                        <p className="text-sm text-white/70">
                            {waveHeight > 1.2
                                ? 'Ombak tinggi! Cocok untuk surfer berpengalaman. 🔥'
                                : waveHeight > 0.6
                                    ? 'Ombak sedang. Bagus untuk pemula hingga menengah.'
                                    : 'Ombak terlalu kecil untuk surfing. Coba besok.'}
                        </p>
                    </div>

                    {/* Beach Walk */}
                    <div className="glass-dark rounded-xl p-4 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="text-3xl">🚶</div>
                            <div>
                                <div className="font-bold">Jalan di Pantai</div>
                                <div className="text-xs text-white/60">Cuaca: {current.temperature_2m}°C</div>
                            </div>
                        </div>
                        <p className="text-sm text-white/70">
                            {precipitation < 20 && current.temperature_2m < 33
                                ? 'Cuaca sempurna untuk jalan santai di pantai! ✅'
                                : precipitation > 50
                                    ? 'Akan hujan. Bawa payung atau tunda. ☔'
                                    : 'Panas terik. Mending pagi atau sore hari. ☀️'}
                        </p>
                    </div>

                    {/* Fishing */}
                    <div className="glass-dark rounded-xl p-4 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="text-3xl">🎣</div>
                            <div>
                                <div className="font-bold">Memancing</div>
                                <div className="text-xs text-white/60">Angin: {Math.round(windSpeed)} km/h</div>
                            </div>
                        </div>
                        <p className="text-sm text-white/70">
                            {windSpeed < 15 && waveHeight < 1.0
                                ? 'Kondisi tenang. Bagus untuk mancing! 🎯'
                                : windSpeed > 25
                                    ? 'Angin kencang. Sulit kontrol pancing. ⚠️'
                                    : 'Cukup baik, tapi waspadai ombak.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Safety Tips */}
            <div className="glass-dark rounded-2xl p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span>🛟</span>
                    Tips Keselamatan di Laut
                </h3>
                <ul className="space-y-2 text-sm text-white/80">
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Selalu berenang di area yang diawasi lifeguard</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Jangan berenang sendirian, selalu bersama teman</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Perhatikan rambu dan bendera peringatan di pantai</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Jika terjebak arus, jangan melawan. Berenang sejajar pantai.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Gunakan sunscreen SPF 30+ untuk melindungi kulit dari UV</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MarineActivity;
