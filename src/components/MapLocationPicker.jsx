import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MdClose, MdCheck, MdMyLocation, MdSearch, MdRefresh } from 'react-icons/md';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon with green color
const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map click events
const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} icon={customIcon} /> : null;
};

// Component to recenter map
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

// Helper to format coordinates as location name
const formatCoordName = (lat, lng) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};

// Main MapLocationPicker component
const MapLocationPicker = ({ isOpen, onClose, onSelectLocation, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition || [-6.248770, 106.869164]);
    const [locationInfo, setLocationInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [geocodeError, setGeocodeError] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Reverse geocoding using Nominatim API with timeout
    const reverseGeocode = useCallback(async (lat, lng) => {
        setIsLoading(true);
        setGeocodeError(false);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'id',
                        'User-Agent': 'RamadhanPlan/1.0'
                    },
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;

                // Get the best available location name
                const village = addr.village || addr.suburb || addr.neighbourhood || addr.hamlet || '';
                const district = addr.city_district || addr.district || addr.town || addr.subdistrict || '';
                const city = addr.city || addr.county || addr.municipality || addr.regency || '';
                const province = addr.state || addr.province || '';

                // Build display name from available parts
                const displayParts = [village, district, city, province].filter(Boolean);
                const displayName = displayParts.length > 0
                    ? displayParts.join(', ')
                    : data.display_name || formatCoordName(lat, lng);

                setLocationInfo({
                    displayName: displayName,
                    village: village,
                    district: district,
                    city: city,
                    province: province,
                    country: addr.country || 'Indonesia',
                    postcode: addr.postcode || '',
                    // Store best name for location title
                    bestName: district || city || village || formatCoordName(lat, lng)
                });
            } else {
                // No address data returned - use coordinates as name
                const coordName = formatCoordName(lat, lng);
                setLocationInfo({
                    displayName: coordName,
                    village: '',
                    district: '',
                    city: '',
                    province: '',
                    country: 'Indonesia',
                    postcode: '',
                    bestName: coordName
                });
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Reverse geocoding error:', error);
            setGeocodeError(true);

            // Use coordinates as fallback - more user friendly than "Lokasi Tidak Diketahui"
            const coordName = formatCoordName(lat, lng);
            setLocationInfo({
                displayName: coordName,
                village: '',
                district: '',
                city: '',
                province: '',
                country: 'Indonesia',
                postcode: '',
                bestName: coordName
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Retry geocoding
    const handleRetryGeocode = () => {
        if (position) {
            reverseGeocode(position[0], position[1]);
        }
    };

    // Search location using Nominatim API
    const searchLocation = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'id',
                        'User-Agent': 'RamadhanPlan/1.0'
                    }
                }
            );
            const data = await response.json();
            setSearchResults(data || []);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Debounced search
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchLocation(query);
        }, 500);
    };

    // Handle search result selection
    const handleSearchResultClick = (result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setPosition([lat, lng]);
        setSearchQuery('');
        setSearchResults([]);
    };

    // Update location info when position changes
    useEffect(() => {
        if (position) {
            reverseGeocode(position[0], position[1]);
        }
    }, [position, reverseGeocode]);

    // Get current GPS location
    const handleUseGPS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                },
                (error) => {
                    console.error('GPS error:', error);
                    alert('Gagal mendapatkan lokasi GPS. Pastikan GPS aktif dan izin diberikan.');
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
            );
        } else {
            alert('Browser tidak mendukung geolokasi.');
        }
    };

    // Confirm location selection
    const handleConfirm = () => {
        if (position && locationInfo) {
            onSelectLocation({
                name: locationInfo.bestName,
                fullAddress: locationInfo.displayName,
                latitude: position[0],
                longitude: position[1],
                details: locationInfo
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-ramadhan-900 rounded-t-3xl sm:rounded-2xl w-full max-w-3xl max-h-[90vh] sm:max-h-[95vh] overflow-hidden shadow-2xl border-t sm:border border-primary-500/30 flex flex-col">
                {/* Header - Compact on mobile */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-gradient-to-r from-primary-900/50 to-ramadhan-900 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🗺️</span>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold font-display gradient-text">Pilih Lokasi</h2>
                            <p className="text-xs sm:text-sm text-white/60 hidden sm:block">Tap pada peta untuk memilih lokasi</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Tutup"
                    >
                        <MdClose className="text-2xl" />
                    </button>
                </div>

                {/* Search Bar - Sticky */}
                <div className="p-3 sm:p-4 border-b border-white/10 relative shrink-0">
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xl" />
                        <input
                            type="text"
                            placeholder="Cari lokasi..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full bg-ramadhan-950/50 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 pl-10 text-white placeholder-white/50 focus:border-primary-400 focus:outline-none text-sm sm:text-base"
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Search Results - Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute left-3 right-3 sm:left-4 sm:right-4 top-full mt-1 bg-ramadhan-950 border border-white/10 rounded-xl overflow-hidden z-[200] shadow-xl max-h-48 overflow-y-auto">
                            {searchResults.map((result, index) => (
                                <button
                                    key={result.place_id || index}
                                    onClick={() => handleSearchResultClick(result)}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-primary-900/30 transition-colors border-b border-white/5 last:border-0"
                                >
                                    <div className="font-medium text-sm truncate">{result.display_name}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Map Container - Flexible height */}
                <div className="relative flex-1 min-h-[200px] sm:min-h-[280px]">
                    <MapContainer
                        center={position}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={position} setPosition={setPosition} />
                        <RecenterMap center={position} />
                    </MapContainer>

                    {/* GPS Button - Floating */}
                    <button
                        onClick={handleUseGPS}
                        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-[1000] bg-white hover:bg-gray-100 text-primary-600 p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 border border-primary-200"
                        title="Gunakan lokasi GPS saya"
                        aria-label="Gunakan GPS"
                    >
                        <MdMyLocation className="text-xl sm:text-2xl" />
                    </button>
                </div>

                {/* Location Info - Compact card */}
                <div className="p-3 sm:p-4 border-t border-white/10 bg-ramadhan-950/50 shrink-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-3 text-white/60 py-2">
                            <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Memuat lokasi...</span>
                        </div>
                    ) : locationInfo ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shrink-0">
                                <span className="text-xl sm:text-2xl">📍</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-base sm:text-lg gradient-text truncate">
                                    {locationInfo.bestName}
                                </div>
                                <div className="text-xs sm:text-sm text-white/60 truncate">
                                    {locationInfo.displayName !== locationInfo.bestName
                                        ? locationInfo.displayName
                                        : `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`}
                                </div>
                            </div>
                            {geocodeError && (
                                <button
                                    onClick={handleRetryGeocode}
                                    className="p-2 rounded-full hover:bg-white/10 text-gold-400"
                                    title="Coba lagi"
                                >
                                    <MdRefresh className="text-xl" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-white/50 text-center py-2">Tap pada peta untuk memilih lokasi</div>
                    )}
                </div>

                {/* Actions - Bottom buttons */}
                <div className="p-3 sm:p-4 border-t border-white/10 flex gap-3 shrink-0 bg-ramadhan-900">
                    <button
                        onClick={onClose}
                        className="flex-1 btn-secondary py-2.5 sm:py-3 font-semibold text-sm sm:text-base"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!position || !locationInfo || isLoading}
                        className="flex-1 btn-primary py-2.5 sm:py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        <MdCheck className="text-lg sm:text-xl" />
                        Pilih Lokasi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapLocationPicker;
