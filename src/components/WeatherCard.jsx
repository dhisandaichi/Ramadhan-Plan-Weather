import { WiThermometer, WiHumidity, WiStrongWind, WiRaindrop, WiDaySunny } from 'react-icons/wi';
import { getWeatherDescription } from '../utils/calculators';

const WeatherCard = ({ weatherData, location }) => {
    if (!weatherData || !weatherData.current) return null;

    const current = weatherData.current;
    const weather = getWeatherDescription(current.weather_code);

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

                {/* Main Weather Display */}
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                    {/* Temperature & Condition */}
                    <div className="flex items-center gap-6">
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

                    {/* Weather Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Humidity */}
                        <div className="bg-ramadhan-950/50 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center gap-2 text-primary-300/80 mb-1">
                                <WiHumidity className="text-2xl" />
                                <span className="text-sm font-medium">Kelembaban</span>
                            </div>
                            <div className="text-3xl font-bold">{current.relative_humidity_2m}%</div>
                        </div>

                        {/* Wind Speed */}
                        <div className="bg-ramadhan-950/50 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center gap-2 text-primary-300/80 mb-1">
                                <WiStrongWind className="text-2xl" />
                                <span className="text-sm font-medium">Kec. Angin</span>
                            </div>
                            <div className="text-3xl font-bold">{Math.round(current.wind_speed_10m)}</div>
                            <div className="text-xs text-white/50">km/jam</div>
                        </div>

                        {/* Precipitation */}
                        <div className="bg-ramadhan-950/50 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center gap-2 text-primary-300/80 mb-1">
                                <WiRaindrop className="text-2xl" />
                                <span className="text-sm font-medium">Curah Hujan</span>
                            </div>
                            <div className="text-3xl font-bold">{current.precipitation || 0}</div>
                            <div className="text-xs text-white/50">mm</div>
                        </div>

                        {/* Cloud Cover */}
                        <div className="bg-ramadhan-950/50 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center gap-2 text-primary-300/80 mb-1">
                                <WiDaySunny className="text-2xl" />
                                <span className="text-sm font-medium">Awan</span>
                            </div>
                            <div className="text-3xl font-bold">{current.cloud_cover}%</div>
                        </div>
                    </div>
                </div>

                {/* Hourly Forecast Preview */}
                <div className="bg-ramadhan-950/50 rounded-2xl p-4 mt-4 border border-white/5">
                    <h3 className="font-semibold mb-3 text-primary-300">Prediksi Per Jam (Hari Ini)</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {weatherData.hourly.time.slice(0, 12).map((time, index) => {
                            const hour = new Date(time).getHours();
                            const temp = weatherData.hourly.temperature_2m[index];
                            const code = weatherData.hourly.weather_code[index];
                            const hourWeather = getWeatherDescription(code);

                            return (
                                <div
                                    key={index}
                                    className="flex-shrink-0 text-center bg-ramadhan-900/50 rounded-xl p-3 min-w-[70px] hover:bg-primary-900/30 transition-all border border-white/5"
                                >
                                    <div className="text-sm font-semibold text-white/70 mb-1">
                                        {hour.toString().padStart(2, '0')}:00
                                    </div>
                                    <div className="text-3xl my-2">{hourWeather.icon}</div>
                                    <div className="text-lg font-bold">{Math.round(temp)}°</div>
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
