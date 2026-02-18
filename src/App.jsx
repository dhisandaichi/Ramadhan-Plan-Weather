import { useState, useEffect, useCallback } from 'react';
import { MdExplore, MdHome } from 'react-icons/md';
import { FaMosque } from 'react-icons/fa';

// Services
import { getWeatherData, getMarineData, getCurrentLocation, INDONESIAN_CITIES } from './services/weatherService';

// Components
import LoadingScreen from './components/LoadingScreen';
import LocationPermissionModal from './components/LocationPermissionModal';
import LocationSelector from './components/LocationSelector';
import WeatherCard from './components/WeatherCard';
import PrayerTimesCard from './components/PrayerTimesCard';
import HydrationCard from './components/HydrationCard';
import RainRadar from './components/RainRadar';
import SahurPlanner from './components/SahurPlanner';
import IftarPlanner from './components/IftarPlanner';
import NgabuburitPlanner from './components/NgabuburitPlanner';
import DoaExplorer from './components/DoaExplorer';
import DailyIbadahPlanner from './components/DailyIbadahPlanner';
import UpcomingIbadah from './components/UpcomingIbadah';
import ImsakiyahCard from './components/ImsakiyahCard';

function App() {
  const [activeTab, setActiveTab] = useState('ramadhan');
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [marineData, setMarineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationDecided, setLocationDecided] = useState(false);

  // Show location modal on mount
  useEffect(() => {
    // Check if location was already decided (e.g., from a previous session)
    const savedLocation = localStorage.getItem('ramadhanplan_location');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
        setLocationDecided(true);
      } catch {
        setShowLocationModal(true);
      }
    } else {
      // Show modal to ask for permission
      setShowLocationModal(true);
    }
  }, []);

  // Handle user allowing location access
  const handleAllowLocation = async () => {
    setShowLocationModal(false);
    setLocationDecided(true);

    try {
      const coords = await getCurrentLocation();
      const newLocation = {
        name: 'Lokasi Saya',
        latitude: coords.latitude,
        longitude: coords.longitude
      };
      setLocation(newLocation);
      localStorage.setItem('ramadhanplan_location', JSON.stringify(newLocation));
    } catch {
      // If GPS request fails or is denied, default to Jakarta
      const jakartaCity = INDONESIAN_CITIES[0];
      const jakarta = {
        name: jakartaCity.name,
        latitude: jakartaCity.lat,
        longitude: jakartaCity.lon
      };
      setLocation(jakarta);
      localStorage.setItem('ramadhanplan_location', JSON.stringify(jakarta));
    }
  };

  // Handle user declining location access
  const handleDeclineLocation = () => {
    setShowLocationModal(false);
    setLocationDecided(true);

    // Default to Jakarta
    const jakartaCity = INDONESIAN_CITIES[0];
    const jakarta = {
      name: jakartaCity.name,
      latitude: jakartaCity.lat,
      longitude: jakartaCity.lon
    };
    setLocation(jakarta);
    localStorage.setItem('ramadhanplan_location', JSON.stringify(jakarta));
  };

  // Load weather data function
  const loadWeatherData = useCallback(async () => {
    if (!location) return;

    try {
      setLoading(true);
      setError(null);

      const [weather, marine] = await Promise.all([
        getWeatherData(location.latitude, location.longitude),
        getMarineData(location.latitude, location.longitude).catch(() => null)
      ]);

      setWeatherData(weather);
      setMarineData(marine);
    } catch (err) {
      setError('Gagal memuat data cuaca. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Fetch weather when location changes
  useEffect(() => {
    if (location) {
      loadWeatherData();
    }
  }, [location, loadWeatherData]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('ramadhanplan_location', JSON.stringify(newLocation));
  };

  // Show location permission modal
  if (showLocationModal) {
    return (
      <LocationPermissionModal
        onAllow={handleAllowLocation}
        onDecline={handleDeclineLocation}
      />
    );
  }

  // Show loading screen while waiting for location or weather data
  if (!locationDecided || loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-premium text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <button onClick={loadWeatherData} className="btn-primary">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'ramadhan', name: 'Ramadhan', icon: <FaMosque />, emoji: '🌙' },
    { id: 'harian', name: 'Beranda', icon: <MdHome />, emoji: '🏠' },
    { id: 'ngabuburit', name: 'Ngabuburit', icon: <MdExplore />, emoji: '🌅' },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-ramadhan-950/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌙</div>
              <div>
                <h1 className="text-xl font-bold font-display gradient-text">RamadhanPlan</h1>
                <p className="text-xs text-white/50">Cuaca Bukan Sekadar Angka</p>
              </div>
            </div>
            <LocationSelector
              currentLocation={location}
              onLocationChange={handleLocationChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Weather Card - Always visible */}
        <WeatherCard weatherData={weatherData} location={location} />

        {/* Tab Content */}
        {activeTab === 'harian' && (
          <div className="space-y-6 animate-fade-in">
            {/* 0. Agenda 1 Jam Ke Depan */}
            <UpcomingIbadah />

            {/* 1. Shalat Berikutnya (Prayer Times Card) */}
            <PrayerTimesCard
              latitude={location.latitude}
              longitude={location.longitude}
              cityName={location.name}
            />

            {/* 2. Target Hidrasi Hari Ini */}
            <HydrationCard weatherData={weatherData} />

            {/* 3. Siap Jalan (Rain Radar) */}
            <RainRadar weatherData={weatherData} />
          </div>
        )}

        {activeTab === 'ramadhan' && (
          <div className="space-y-6 animate-fade-in">
            {/* Imsakiyah Schedule */}
            <ImsakiyahCard locationName={location.name} />
            {/* Daily Ibadah Planner */}
            <DailyIbadahPlanner />
            {/* Doa & Dzikir Explorer */}
            <DoaExplorer />
            {/* Sahur & Iftar Planners */}
            <SahurPlanner weatherData={weatherData} />
            <IftarPlanner weatherData={weatherData} />
          </div>
        )}

        {activeTab === 'ngabuburit' && (
          <div className="animate-fade-in">
            <NgabuburitPlanner weatherData={weatherData} marineData={marineData} />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-ramadhan-950/95 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all ${activeTab === tab.id
                  ? 'bg-primary-600/30 text-primary-300 scale-105'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
              >
                <span className="text-2xl mb-1">{tab.emoji}</span>
                <span className="text-xs font-semibold">{tab.name}</span>
                {activeTab === tab.id && (
                  <div className="w-8 h-1 bg-gradient-to-r from-primary-400 to-gold-400 rounded-full mt-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer - Data Sources */}
      <footer className="max-w-4xl mx-auto px-4 py-4 mb-20">
        <div className="text-center text-xs text-white/30">
          <p>Cuaca: Open-Meteo | Shalat: Aladhan | Imsakiyah & Doa: EQuran.id | Hadits: Gading.dev</p>
          <p className="mt-1">© 2026 RamadhanPlan - Made with ❤️ for Indonesia</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
