import axios from 'axios';
import {
    weatherRateLimiter,
    validateCoordinates,
    securityLog
} from '../utils/security';

const OPEN_METEO_API = import.meta.env.VITE_OPEN_METEO_API || 'https://api.open-meteo.com/v1';

/**
 * Get current weather and forecast data with security measures
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Weather data
 */
export const getWeatherData = async (latitude, longitude) => {
    // Rate limit check (2 RPS max)
    const limitCheck = weatherRateLimiter.checkLimit();
    if (!limitCheck.allowed) {
        securityLog.log('RATE_LIMIT_EXCEEDED', {
            service: 'weather',
            waitTime: limitCheck.waitTime
        });
        throw new Error(`Terlalu banyak permintaan. Tunggu ${limitCheck.waitTime} detik.`);
    }

    // Validate coordinates
    const coordValidation = validateCoordinates(latitude, longitude);
    if (!coordValidation.isValid) {
        securityLog.log('INVALID_COORDINATES', { latitude, longitude, reason: coordValidation.reason });
        throw new Error(coordValidation.reason);
    }

    try {
        const response = await axios.get(`${OPEN_METEO_API}/forecast`, {
            params: {
                latitude,
                longitude,
                current: [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'apparent_temperature',
                    'precipitation',
                    'weather_code',
                    'cloud_cover',
                    'wind_speed_10m',
                    'wind_direction_10m'
                ].join(','),
                hourly: [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'precipitation_probability',
                    'precipitation',
                    'weather_code',
                    'cloud_cover',
                    'uv_index',
                    'wind_speed_10m'
                ].join(','),
                daily: [
                    'weather_code',
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'precipitation_sum',
                    'precipitation_probability_max',
                    'wind_speed_10m_max',
                    'uv_index_max'
                ].join(','),
                timezone: 'Asia/Jakarta',
                forecast_days: 7
            },
            timeout: 10000 // 10 second timeout for security
        });

        securityLog.log('API_SUCCESS', { service: 'weather' });
        return response.data;
    } catch (error) {
        securityLog.log('API_ERROR', { service: 'weather', error: error.message });
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

/**
 * Get marine/ocean data for beach activities with security measures
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Marine data
 */
export const getMarineData = async (latitude, longitude) => {
    // Rate limit check (shares with weather limiter)
    const limitCheck = weatherRateLimiter.checkLimit();
    if (!limitCheck.allowed) {
        securityLog.log('RATE_LIMIT_EXCEEDED', {
            service: 'marine',
            waitTime: limitCheck.waitTime
        });
        throw new Error(`Terlalu banyak permintaan. Tunggu ${limitCheck.waitTime} detik.`);
    }

    // Validate coordinates
    const coordValidation = validateCoordinates(latitude, longitude);
    if (!coordValidation.isValid) {
        securityLog.log('INVALID_COORDINATES', { latitude, longitude, reason: coordValidation.reason });
        throw new Error(coordValidation.reason);
    }

    try {
        const response = await axios.get('https://marine-api.open-meteo.com/v1/marine', {
            params: {
                latitude,
                longitude,
                current: [
                    'wave_height',
                    'wave_direction',
                    'wave_period',
                    'wind_wave_height',
                    'swell_wave_height'
                ].join(','),
                hourly: [
                    'wave_height',
                    'wave_direction',
                    'wave_period',
                    'wind_wave_height',
                    'swell_wave_height',
                    'ocean_current_velocity',
                    'ocean_current_direction'
                ].join(','),
                timezone: 'Asia/Jakarta',
                forecast_days: 3
            },
            timeout: 10000 // 10 second timeout for security
        });

        securityLog.log('API_SUCCESS', { service: 'marine' });
        return response.data;
    } catch (error) {
        securityLog.log('API_ERROR', { service: 'marine', error: error.message });
        console.error('Error fetching marine data:', error);
        throw error;
    }
};

/**
 * Get historical weather data for AI training
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} startDate - Format: YYYY-MM-DD
 * @param {string} endDate - Format: YYYY-MM-DD
 * @returns {Promise<Object>} Historical data
 */
export const getHistoricalData = async (latitude, longitude, startDate, endDate) => {
    try {
        const response = await axios.get(`${OPEN_METEO_API}/archive`, {
            params: {
                latitude,
                longitude,
                start_date: startDate,
                end_date: endDate,
                daily: [
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'precipitation_sum',
                    'wind_speed_10m_max'
                ].join(','),
                timezone: 'Asia/Jakarta'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
};

/**
 * Get user's current location
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
};

/**
 * Indonesian major cities coordinates for quick selection
 */
export const INDONESIAN_CITIES = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456, region: 'DKI Jakarta' },
    { name: 'Bandung', lat: -6.9175, lon: 107.6191, region: 'Jawa Barat' },
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521, region: 'Jawa Timur' },
    { name: 'Yogyakarta', lat: -7.7956, lon: 110.3695, region: 'DI Yogyakarta' },
    { name: 'Semarang', lat: -6.9667, lon: 110.4167, region: 'Jawa Tengah' },
    { name: 'Medan', lat: 3.5952, lon: 98.6722, region: 'Sumatera Utara' },
    { name: 'Palembang', lat: -2.9833, lon: 104.7500, region: 'Sumatera Selatan' },
    { name: 'Makassar', lat: -5.1477, lon: 119.4327, region: 'Sulawesi Selatan' },
    { name: 'Denpasar (Bali)', lat: -8.6500, lon: 115.2167, region: 'Bali' },
    { name: 'Balikpapan', lat: -1.2379, lon: 116.8529, region: 'Kalimantan Timur' },
    { name: 'Manado', lat: 1.4748, lon: 124.8421, region: 'Sulawesi Utara' },
    { name: 'Banjarmasin', lat: -3.3194, lon: 114.5906, region: 'Kalimantan Selatan' },
    { name: 'Batam', lat: 1.0456, lon: 104.0305, region: 'Kepulauan Riau' },
    { name: 'Pekanbaru', lat: 0.5071, lon: 101.4478, region: 'Riau' },
    { name: 'Jambi', lat: -1.6101, lon: 103.6131, region: 'Jambi' },
];

export default {
    getWeatherData,
    getMarineData,
    getHistoricalData,
    getCurrentLocation,
    INDONESIAN_CITIES
};
