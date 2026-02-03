import { getWeatherDescription } from '../utils/calculators';

const WeatherCard = ({ weatherData, location }) => {
    if (!weatherData || !weatherData.current) return null;

    const current = weatherData.current;
    const weather = getWeatherDescription(current.weather_code);
    const currentHour = new Date().getHours();

    // Get next 24 hours of forecast data
    const getNext24Hours = () => {
        const hourly = weatherData.hourly;
        const result = [];

        // Calculate total hours available today
        const hoursLeftToday = 24 - currentHour;

        // Get hours from today (remaining hours)
        for (let i = 0; i < hoursLeftToday && i < 24; i++) {
            const hourIndex = currentHour + i;
            if (hourIndex < hourly.time.length) {
                result.push({
                    time: hourly.time[hourIndex],
                    temp: hourly.temperature_2m[hourIndex],
                    code: hourly.weather_code[hourIndex],
                    isToday: true
                });
            }
        }

        // Get hours from tomorrow to complete 24 hours
        const hoursNeededFromTomorrow = 24 - result.length;
        for (let i = 0; i < hoursNeededFromTomorrow; i++) {
            const hourIndex = 24 + i; // Tomorrow's hours start at index 24
            if (hourIndex < hourly.time.length) {
                result.push({
                    time: hourly.time[hourIndex],
                    temp: hourly.temperature_2m[hourIndex],
                    code: hourly.weather_code[hourIndex],
                    isToday: false
                });
            }
        }

        return result;
    };

    const next24Hours = getNext24Hours();

    return (
        <div className="relative overflow-hidden rounded-3xl bg-ramadhan-900/60 border border-primary-500/30">
            {/* Animated background gradient - Green theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-ramadhan-600/20 to-gold-600/10 animate-pulse-slow"></div>

            {/* Islamic pattern overlay */}
            <div className="absolute inset-0 islamic-pattern opacity-30"></div>

            <div className="relative z-10 p-6 md:p-8">
                {/* Location & Date */}
                <div className="mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold gradient-text font-display mb-1">
                        {location.name}
                    </h2>
                    <p className="text-white/60">
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Main Weather Display - Simplified */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="text-8xl md:text-9xl animate-float">
                        {weather.icon}
                    </div>
                    <div>
                        <div className="text-6xl md:text-7xl font-bold text-shadow-lg">
                            {Math.round(current.temperature_2m)}°
                        </div>
                        <div className="text-xl md:text-2xl font-semibold mt-2 text-white/90">
                            {weather.desc}
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                            Terasa seperti {Math.round(current.apparent_temperature)}°C
                        </div>
                    </div>
                </div>

                {/* 24-Hour Forecast */}
                <div className="bg-ramadhan-950/50 rounded-2xl p-4 border border-white/5">
                    <h3 className="font-semibold mb-3 text-primary-300">Prediksi 24 Jam ke Depan</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                        {next24Hours.map((hourData, index) => {
                            const hour = new Date(hourData.time).getHours();
                            const hourWeather = getWeatherDescription(hourData.code);
                            const isNow = index === 0;

                            return (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 text-center rounded-xl p-3 min-w-[70px] transition-all border ${isNow
                                            ? 'bg-primary-600/30 border-primary-500/50'
                                            : 'bg-ramadhan-900/50 border-white/5 hover:bg-primary-900/30'
                                        }`}
                                >
                                    <div className={`text-sm font-semibold mb-1 ${isNow ? 'text-primary-300' : 'text-white/70'}`}>
                                        {isNow ? 'Skg' : `${hour.toString().padStart(2, '0')}:00`}
                                    </div>
                                    <div className="text-3xl my-2">{hourWeather.icon}</div>
                                    <div className={`text-lg font-bold ${isNow ? 'text-primary-300' : ''}`}>
                                        {Math.round(hourData.temp)}°
                                    </div>
                                    {!hourData.isToday && index > 0 && new Date(hourData.time).getHours() === 0 && (
                                        <div className="text-xs text-gold-400 mt-1">Besok</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
