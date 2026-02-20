import { useState } from 'react';
import { MdLocationOn, MdSearch, MdMyLocation, MdMap } from 'react-icons/md';
import { INDONESIAN_CITIES, getCurrentLocation } from '../services/weatherService';
import MapLocationPicker from './MapLocationPicker';

const LocationSelector = ({ currentLocation, onLocationChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMapPicker, setShowMapPicker] = useState(false);

    const filteredCities = INDONESIAN_CITIES.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCitySelect = (city) => {
        onLocationChange({
            name: city.name,
            latitude: city.lat,
            longitude: city.lon
        });
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleUseCurrentLocation = async () => {
        try {
            const coords = await getCurrentLocation();
            onLocationChange({
                name: 'Lokasi Anda',
                latitude: coords.latitude,
                longitude: coords.longitude
            });
            setIsOpen(false);
        } catch {
            alert('Gagal mendapatkan lokasi Anda. Pastikan GPS aktif dan izin lokasi diberikan.');
        }
    };

    const handleMapLocationSelect = (location) => {
        onLocationChange({
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            fullAddress: location.fullAddress,
            details: location.details
        });
        setIsOpen(false);
    };

    const handleOpenMapPicker = () => {
        setIsOpen(false);
        setShowMapPicker(true);
    };

    return (
        <div className="relative">
            {/* Current Location Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-ramadhan-900/50 border border-primary-500/30 rounded-full px-4 py-2 hover:bg-primary-900/30 transition-all"
            >
                <MdLocationOn className="text-xl text-primary-400" />
                <span className="font-semibold hidden sm:inline">{currentLocation?.name || 'Pilih Lokasi'}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-80 bg-ramadhan-900/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 border border-primary-500/30">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-white/10">
                            <div className="relative">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Cari kota..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-ramadhan-950/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/50 focus:border-primary-400 focus:outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Use Current Location */}
                        <button
                            onClick={handleUseCurrentLocation}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-900/30 transition-all border-b border-white/10"
                        >
                            <MdMyLocation className="text-2xl text-primary-400" />
                            <div className="text-left">
                                <div className="font-semibold">Gunakan Lokasi Saya</div>
                                <div className="text-xs text-white/60">Deteksi otomatis via GPS</div>
                            </div>
                        </button>

                        {/* Pick from Map */}
                        <button
                            onClick={handleOpenMapPicker}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-900/30 transition-all border-b border-white/10 bg-gradient-to-r from-primary-900/20 to-transparent"
                        >
                            <MdMap className="text-2xl text-gold-400" />
                            <div className="text-left">
                                <div className="font-semibold">Pilih dari Peta</div>
                                <div className="text-xs text-white/60">Geser pinpoint di OpenStreetMap</div>
                            </div>
                        </button>

                        {/* City List */}
                        <div className="max-h-96 overflow-y-auto">
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleCitySelect(city)}
                                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-primary-900/30 transition-all ${index !== filteredCities.length - 1 ? 'border-b border-white/5' : ''
                                            }`}
                                    >
                                        <div className="text-left">
                                            <div className="font-semibold">{city.name}</div>
                                            <div className="text-xs text-white/60">{city.region}</div>
                                        </div>
                                        {currentLocation?.latitude === city.lat && (
                                            <MdLocationOn className="text-xl text-primary-400" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-white/50">
                                    <MdSearch className="text-4xl mx-auto mb-2 opacity-50" />
                                    <p>Kota tidak ditemukan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Map Location Picker Modal */}
            <MapLocationPicker
                isOpen={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onSelectLocation={handleMapLocationSelect}
                initialPosition={currentLocation ? [parseFloat(currentLocation.latitude), parseFloat(currentLocation.longitude)] : [-6.248770, 106.869164]}
            />
        </div>
    );
};

export default LocationSelector;

