/**
 * Calculate Heat Index based on temperature and humidity
 * Formula: Combines temperature and relative humidity to determine "feels like" temperature
 * @param {number} temp - Temperature in Celsius
 * @param {number} humidity - Relative humidity (0-100)
 * @returns {number} Heat index in Celsius
 */
export const calculateHeatIndex = (temp, humidity) => {
    // Convert to Fahrenheit for calculation
    const tempF = (temp * 9 / 5) + 32;
    const rh = humidity;

    // Simplified heat index formula
    let hi = -42.379 +
        2.04901523 * tempF +
        10.14333127 * rh -
        0.22475541 * tempF * rh -
        0.00683783 * tempF * tempF -
        0.05481717 * rh * rh +
        0.00122874 * tempF * tempF * rh +
        0.00085282 * tempF * rh * rh -
        0.00000199 * tempF * tempF * rh * rh;

    // Convert back to Celsius
    const hiC = (hi - 32) * 5 / 9;

    return Math.round(hiC * 10) / 10;
};

/**
 * Calculate hydration needs based on heat index and body weight
 * @param {number} heatIndex - Heat index in Celsius
 * @param {number} bodyWeight - Body weight in kg (default: 70kg)
 * @param {boolean} isFasting - Is the person fasting?
 * @returns {object} Hydration recommendations
 */
export const calculateHydrationNeeds = (heatIndex, bodyWeight = 70, isFasting = true) => {
    // Base water need: 35ml per kg body weight
    let baseWater = bodyWeight * 35; // in ml

    let pattern = "2-4-2";
    let patternDesc = "2 Sahur - 4 Buka - 2 Malam";
    let sahurG = 2;
    let iftarG = 4;
    let nightG = 2;

    // Adjust for heat
    if (heatIndex > 32) {
        baseWater *= 1.5; // +50% for extreme heat
        // Change pattern for extreme heat (e.g., 3-5-4 or 4-4-4 to meet high intake)
        // Let's aim for ~12 glasses or more if heavy
        pattern = "3-5-4";
        patternDesc = "3 Sahur - 5 Buka - 4 Malam";
        sahurG = 3;
        iftarG = 5;
        nightG = 4;
    } else if (heatIndex > 28) {
        baseWater *= 1.3; // +30% for high heat
        // Change pattern for hot weather
        pattern = "3-4-3";
        patternDesc = "3 Sahur - 4 Buka - 3 Malam";
        sahurG = 3;
        iftarG = 4;
        nightG = 3;
    } else {
        // Normal 2-4-2
        pattern = "2-4-2";
        patternDesc = "2 Sahur - 4 Buka - 2 Malam";
        sahurG = 2;
        iftarG = 4;
        nightG = 2;
    }

    // Ensure accurate ml distribution based on glasses (approx 250ml per glass)
    // or keep the strict ml calculation and just advise glasses? 
    // The user wants the PATTERN. So we emphasize the pattern.

    // Recalculate total glasses to match the ml needs roughly, or stick to the pattern?
    // If baseWater is very high (heavy person), 2-4-2 (8 glasses = 2L) might not be enough.
    // So we should scale the glasses if weight requires it, but keep the RATIO/Pattern philosophy.

    const singleGlass = 250;
    const totalGlassesNeeded = Math.ceil(baseWater / singleGlass);

    // If calculated need is much higher than standard pattern, scale it up
    // Standard 2-4-2 is 8 glasses (2L).
    if (totalGlassesNeeded > 8) {
        // Distribute extra glasses
        const extra = totalGlassesNeeded - (sahurG + iftarG + nightG);
        if (extra > 0) {
            // Add to iftar and night mostly, maybe 1 to sahur
            // Simple distribution logic
            const addSahur = Math.floor(extra * 0.2);
            const addIftar = Math.floor(extra * 0.4);
            const addNight = extra - addSahur - addIftar;

            sahurG += addSahur;
            iftarG += addIftar;
            nightG += addNight;

            // Update pattern string
            pattern = `${sahurG}-${iftarG}-${nightG}`;
            patternDesc = `${sahurG} Sahur - ${iftarG} Buka - ${nightG} Malam`;
        }
    }

    if (isFasting) {
        return {
            totalNeeded: Math.round(baseWater),
            sahurAmount: sahurG * 250,
            iftarAmount: iftarG * 250,
            nightAmount: nightG * 250,
            sahurGlasses: sahurG,
            iftarGlasses: iftarG,
            nightGlasses: nightG,
            pattern: pattern,
            patternDesc: patternDesc,
            recommendation: heatIndex > 32
                ? 'CRITICAL: Cuaca sangat panas. Gunakan pola minum agresif.'
                : heatIndex > 28
                    ? 'WARNING: Udara panas. Tingkatkan asupan air saat sahur.'
                    : 'NORMAL: Gunakan pola standar 2-4-2.'
        };
    }

    return {
        totalNeeded: Math.round(baseWater),
        recommendation: 'Minum air teratur sepanjang hari'
    };
};

/**
 * Calculate laundry drying score based on weather conditions
 * @param {number} temp - Temperature in Celsius
 * @param {number} humidity - Relative humidity (0-100)
 * @param {number} windSpeed - Wind speed in km/h
 * @param {number} precipitation - Precipitation probability (0-100)
 * @param {number} cloudCover - Cloud cover (0-100)
 * @returns {object} Laundry recommendation
 */
export const calculateLaundryScore = (temp, humidity, windSpeed, precipitation, cloudCover) => {
    let score = 100;

    // Temperature factor (best: 25-35°C)
    if (temp < 20) score -= 20;
    else if (temp >= 35) score -= 10;

    // Humidity factor (lower is better)
    if (humidity > 80) score -= 30;
    else if (humidity > 70) score -= 20;
    else if (humidity > 60) score -= 10;

    // Wind factor (moderate wind is best)
    if (windSpeed < 5) score -= 10; // Too calm
    else if (windSpeed > 30) score -= 15; // Too strong
    else if (windSpeed >= 10 && windSpeed <= 20) score += 10; // Perfect

    // Precipitation (rain kills laundry)
    if (precipitation > 50) score -= 40;
    else if (precipitation > 20) score -= 25;

    // Cloud cover
    if (cloudCover > 80) score -= 15;

    score = Math.max(0, Math.min(100, score));

    let status, color, icon, advice;

    if (score >= 75) {
        status = 'SEMPURNA';
        color = 'success';
        icon = '☀️';
        advice = 'Kering dalam 2-3 jam. Cuci apa aja, gas!';
    } else if (score >= 50) {
        status = 'CUKUP BAIK';
        color = 'warning';
        icon = '⛅';
        advice = 'Bisa kering, tapi mungkin sedikit lembab. Jemur sebelum jam 2 siang.';
    } else if (score >= 25) {
        status = 'KURANG BAIK';
        color = 'warning';
        icon = '🌧️';
        advice = 'Risiko tidak kering atau bau apek. Pertimbangkan tunda mencuci.';
    } else {
        status = 'JANGAN CUCI';
        color = 'danger';
        icon = '⛈️';
        advice = 'Hujan/Lembab tinggi. Pakaian pasti tidak akan kering!';
    }

    return {
        score: Math.round(score),
        status,
        color,
        icon,
        advice,
        dryingTime: score >= 75 ? '2-3 jam' : score >= 50 ? '4-6 jam' : score >= 25 ? '6+ jam' : 'Tidak akan kering'
    };
};

/**
 * Calculate snorkeling safety score
 * @param {number} waveHeight - Wave height in meters
 * @param {number} windSpeed - Wind speed in km/h
 * @param {number} visibility - Visibility/Cloud cover (0-100, lower is better for sun)
 * @param {number} precipitation - Rain probability (0-100)
 * @returns {object} Snorkeling safety recommendation
 */
export const calculateSnorkelingScore = (waveHeight, windSpeed, visibility, precipitation) => {
    let score = 100;

    // Wave height (critical factor)
    if (waveHeight > 2.0) score -= 50;
    else if (waveHeight > 1.5) score -= 35;
    else if (waveHeight > 1.0) score -= 20;
    else if (waveHeight > 0.5) score -= 10;

    // Wind speed
    if (windSpeed > 30) score -= 25;
    else if (windSpeed > 20) score -= 15;

    // Visibility (cloud cover - we want sun for good underwater visibility)
    if (visibility > 80) score -= 20; // Too cloudy
    else if (visibility < 30) score += 10; // Clear sky

    // Rain
    if (precipitation > 50) score -= 30;
    else if (precipitation > 20) score -= 15;

    score = Math.max(0, Math.min(100, score));

    let status, color, icon, advice, recommendation;

    if (score >= 80) {
        status = 'EXCELLENT';
        color = 'success';
        icon = '🤿';
        advice = 'Kondisi sempurna! Air jernih, ombak tenang. Waktu terbaik untuk snorkeling.';
        recommendation = 'GO! Bawa kamera underwater.';
    } else if (score >= 60) {
        status = 'GOOD';
        color = 'success';
        icon = '🏊';
        advice = 'Kondisi bagus untuk snorkeling. Pastikan tetap di area yang aman.';
        recommendation = 'Aman untuk pemula dan keluarga.';
    } else if (score >= 40) {
        status = 'MODERATE';
        color = 'warning';
        icon = '⚠️';
        advice = 'Kondisi cukup menantang. Hanya untuk yang berpengalaman.';
        recommendation = 'Pertimbangkan menunda jika pemula.';
    } else {
        status = 'DANGEROUS';
        color = 'danger';
        icon = '🚫';
        advice = 'Ombak tinggi dan kondisi buruk. JANGAN snorkeling!';
        recommendation = 'CANCEL. Terlalu berbahaya.';
    }

    return {
        score: Math.round(score),
        status,
        color,
        icon,
        advice,
        recommendation,
        waveStatus: waveHeight > 1.5 ? 'Tinggi' : waveHeight > 0.8 ? 'Sedang' : 'Tenang'
    };
};

/**
 * Calculate mosque comfort index for Tarawih
 * @param {number} temp - Temperature in Celsius
 * @param {number} humidity - Relative humidity (0-100)
 * @param {number} precipitation - Rain probability
 * @returns {object} Mosque comfort recommendation
 */
export const calculateMosqueComfort = (temp, humidity, precipitation) => {
    const heatIndex = calculateHeatIndex(temp, humidity);

    let comfort = 'NYAMAN';
    let clothingAdvice = 'Pakaian biasa';
    let icon = '🕌';
    let color = 'success';

    if (heatIndex > 32 && humidity > 70) {
        comfort = 'PENGAP';
        clothingAdvice = 'Pakai baju tipis & bawa kipas. Sejadah yang menyerap keringat.';
        icon = '🥵';
        color = 'danger';
    } else if (heatIndex > 28) {
        comfort = 'SEDIKIT GERAH';
        clothingAdvice = 'Baju berbahan katun. Bawa air minum.';
        icon = '😅';
        color = 'warning';
    } else if (temp < 22) {
        comfort = 'SEJUK/DINGIN';
        clothingAdvice = 'Bawa jaket tipis atau mukena tebal.';
        icon = '🧥';
        color = 'info';
    }

    const rainAdvice = precipitation > 50
        ? 'Bawa payung & sandal cadangan (akan hujan).'
        : precipitation > 20
            ? 'Siapkan payung (mungkin hujan ringan).'
            : 'Cuaca cerah.';

    return {
        comfort,
        heatIndex: Math.round(heatIndex),
        clothingAdvice,
        rainAdvice,
        icon,
        color,
        overallAdvice: `${comfort}. ${clothingAdvice} ${rainAdvice}`
    };
};

/**
 * Determine weather code description in Indonesian
 * @param {number} code - WMO Weather code
 * @returns {object} Weather description and icon
 */
export const getWeatherDescription = (code) => {
    const weatherCodes = {
        0: { desc: 'Cerah', icon: '☀️', color: 'yellow' },
        1: { desc: 'Cerah Berawan', icon: '🌤️', color: 'yellow' },
        2: { desc: 'Berawan Sebagian', icon: '⛅', color: 'gray' },
        3: { desc: 'Berawan', icon: '☁️', color: 'gray' },
        45: { desc: 'Berkabut', icon: '🌫️', color: 'gray' },
        48: { desc: 'Kabut Tebal', icon: '🌫️', color: 'gray' },
        51: { desc: 'Gerimis Ringan', icon: '🌦️', color: 'blue' },
        53: { desc: 'Gerimis', icon: '🌦️', color: 'blue' },
        55: { desc: 'Gerimis Lebat', icon: '🌧️', color: 'blue' },
        61: { desc: 'Hujan Ringan', icon: '🌧️', color: 'blue' },
        63: { desc: 'Hujan Sedang', icon: '🌧️', color: 'blue' },
        65: { desc: 'Hujan Lebat', icon: '⛈️', color: 'blue' },
        71: { desc: 'Salju Ringan', icon: '🌨️', color: 'white' },
        73: { desc: 'Salju', icon: '🌨️', color: 'white' },
        75: { desc: 'Salju Lebat', icon: '❄️', color: 'white' },
        80: { desc: 'Hujan Rintik', icon: '🌦️', color: 'blue' },
        81: { desc: 'Hujan Deras', icon: '⛈️', color: 'blue' },
        82: { desc: 'Hujan Sangat Deras', icon: '⛈️', color: 'blue' },
        95: { desc: 'Badai Petir', icon: '⛈️', color: 'purple' },
        96: { desc: 'Badai Petir + Hujan Es', icon: '⛈️', color: 'purple' },
        99: { desc: 'Badai Petir Kuat', icon: '⛈️', color: 'purple' },
    };

    return weatherCodes[code] || { desc: 'Tidak Diketahui', icon: '❓', color: 'gray' };
};

export default {
    calculateHeatIndex,
    calculateHydrationNeeds,
    calculateLaundryScore,
    calculateSnorkelingScore,
    calculateMosqueComfort,
    getWeatherDescription
};
