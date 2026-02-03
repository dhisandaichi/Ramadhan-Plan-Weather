import { MdTwoWheeler, MdUmbrella, MdCheckCircle, MdWarning } from 'react-icons/md';
import { WiRain, WiDaySunny, WiCloudy } from 'react-icons/wi';

const RainRadar = ({ weatherData }) => {
    if (!weatherData?.hourly) return null;

    const hourly = weatherData.hourly;
    const currentHour = new Date().getHours();

    // Get next 6 hours of forecast
    const next6Hours = [];
    for (let i = 0; i < 6; i++) {
        const hourIndex = currentHour + i;
        if (hourIndex < 24 && hourly.time[hourIndex]) {
            next6Hours.push({
                hour: hourIndex,
                time: `${String(hourIndex).padStart(2, '0')}:00`,
                precipitation: hourly.precipitation_probability[hourIndex] || 0,
                rainAmount: hourly.precipitation[hourIndex] || 0,
                weatherCode: hourly.weather_code[hourIndex] || 0,
                temp: hourly.temperature_2m[hourIndex] || 0,
            });
        }
    }

    // Find first rain occurrence
    const rainWarning = next6Hours.find(h => h.precipitation > 40);
    const heavyRain = next6Hours.find(h => h.precipitation > 70);

    // Calculate overall safety
    const avgPrecipitation = next6Hours.reduce((sum, h) => sum + h.precipitation, 0) / next6Hours.length;
    const isSafe = avgPrecipitation < 30;
    const isModerate = avgPrecipitation >= 30 && avgPrecipitation < 60;
    const isDangerous = avgPrecipitation >= 60;

    // Get status
    let status, statusIcon, advice;
    if (isDangerous) {
        status = 'TIDAK AMAN';
        statusIcon = '🚫';
        advice = 'Hujan deras diprediksi. Tunda perjalanan atau gunakan transportasi tertutup!';
    } else if (isModerate) {
        status = 'WASPADA';
        statusIcon = '⚠️';
        advice = 'Kemungkinan hujan. Siapkan jas hujan dan berhati-hati di jalan!';
    } else {
        status = 'AMAN';
        statusIcon = '✅';
        advice = 'Cuaca cerah untuk berkendara. Tetap waspada dan hati-hati!';
    }

    const getWeatherIcon = (code) => {
        if (code >= 61 && code <= 82) return <WiRain className="text-blue-400" />;
        if (code >= 1 && code <= 3) return <WiCloudy className="text-gray-400" />;
        return <WiDaySunny className="text-yellow-400" />;
    };

    return (
        <div className={`card-premium border-2 ${isDangerous ? 'border-red-500/50' :
            isModerate ? 'border-yellow-500/50' :
                'border-primary-500/50'
            }`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-2xl ${isDangerous ? 'bg-red-500/20' :
                    isModerate ? 'bg-yellow-500/20' :
                        'bg-primary-500/20'
                    }`}>
                    <MdTwoWheeler className={`text-3xl ${isDangerous ? 'text-red-400' :
                        isModerate ? 'text-yellow-400' :
                            'text-primary-400'
                        }`} />
                </div>
                <div>
                    <h3 className="text-xl font-bold font-display">Siap Jalan</h3>
                    <p className="text-sm text-white/60">Aman naik motor?</p>
                </div>
            </div>

            {/* Main Status */}
            <div className={`glass-dark rounded-2xl p-4 mb-4 text-center border-2 ${isDangerous ? 'border-red-500/50' :
                isModerate ? 'border-yellow-500/50' :
                    'border-primary-500/50'
                }`}>
                <div className="text-5xl mb-2">{statusIcon}</div>
                <div className={`text-2xl font-bold mb-1 ${isDangerous ? 'text-red-400' :
                    isModerate ? 'text-yellow-400' :
                        'text-primary-400'
                    }`}>
                    {status}
                </div>
                <div className="text-sm text-white/70">{advice}</div>
            </div>

            {/* Rain Warning Alert */}
            {rainWarning && (
                <div className={`rounded-xl p-3 mb-4 flex items-center gap-3 ${heavyRain ? 'bg-red-500/20 border border-red-500/50' : 'bg-yellow-500/20 border border-yellow-500/50'
                    }`}>
                    <MdUmbrella className={`text-3xl ${heavyRain ? 'text-red-400' : 'text-yellow-400'}`} />
                    <div>
                        <div className={`font-semibold ${heavyRain ? 'text-red-300' : 'text-yellow-300'}`}>
                            {heavyRain ? '🌧️ Hujan Deras!' : '🌦️ Akan Hujan!'}
                        </div>
                        <div className="text-sm text-white/80">
                            Sekitar pukul <strong>{rainWarning.time}</strong> ({rainWarning.precipitation}% kemungkinan)
                            {heavyRain && ' - Siapkan jas hujan!'}
                        </div>
                    </div>
                </div>
            )}

            {/* 6-Hour Forecast */}
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-white/70 mb-2">Prediksi 6 Jam ke Depan:</h4>
                <div className="grid grid-cols-6 gap-2">
                    {next6Hours.map((hour, index) => (
                        <div
                            key={index}
                            className={`glass-dark rounded-xl p-2 text-center ${hour.precipitation > 70 ? 'border border-red-500/50' :
                                hour.precipitation > 40 ? 'border border-yellow-500/50' :
                                    'border border-transparent'
                                }`}
                        >
                            <div className="text-xs text-white/50">{hour.time}</div>
                            <div className="text-xl my-1">{getWeatherIcon(hour.weatherCode)}</div>
                            <div className={`text-xs font-semibold ${hour.precipitation > 70 ? 'text-red-400' :
                                hour.precipitation > 40 ? 'text-yellow-400' :
                                    'text-primary-300'
                                }`}>
                                {hour.precipitation}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="glass-dark rounded-xl p-3">
                <div className="text-sm font-semibold text-white/80 mb-2">💡 Tips Berkendara:</div>
                <ul className="text-xs text-white/70 space-y-1">
                    {isSafe ? (
                        <>
                            <li>✅ Cuaca mendukung untuk berkendara</li>
                            <li>✅ Tetap pakai helm dan safety gear</li>
                            <li>✅ Perhatikan rambu lalu lintas</li>
                        </>
                    ) : isModerate ? (
                        <>
                            <li>⚠️ Bawa jas hujan untuk jaga-jaga</li>
                            <li>⚠️ Kurangi kecepatan jika hujan</li>
                            <li>⚠️ Hati-hati jalanan licin</li>
                        </>
                    ) : (
                        <>
                            <li>🚫 Pertimbangkan naik transportasi umum</li>
                            <li>🚫 Jika harus naik motor, gunakan jas hujan lengkap</li>
                            <li>🚫 Hindari genangan air dan jalan rusak</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default RainRadar;
