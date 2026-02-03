/**
 * Meal database with nutritional info and prep time
 */
export const MEAL_DATABASE = {
    sahur: {
        quick: [ // < 10 minutes
            {
                name: 'Smoothie Kurma & Pisang',
                prepTime: 3,
                ingredients: ['Kurma 5 buah', 'Pisang 2 buah', 'Susu 200ml', 'Es batu'],
                calories: 350,
                hydration: 'high',
                energy: 'instant',
                benefits: 'Energi cepat, potasium tinggi (anti dehidrasi)',
                tips: 'Blender semua bahan. Minum perlahan.'
            },
            {
                name: 'Overnight Oats',
                prepTime: 2,
                ingredients: ['Oats 50g (direndam semalam)', 'Chia seeds', 'Buah potong', 'Madu'],
                calories: 320,
                hydration: 'medium',
                energy: 'sustained',
                benefits: 'Serat tinggi, tahan lapar hingga dzuhur',
                tips: 'Siapkan malam sebelumnya. Tinggal dimakan pagi.'
            },
            {
                name: 'Roti Gandum + Selai Kacang + Pisang',
                prepTime: 5,
                ingredients: ['Roti gandum 2 lembar', 'Selai kacang', 'Pisang', 'Susu'],
                calories: 380,
                hydration: 'medium',
                energy: 'sustained',
                benefits: 'Protein + karbohidrat kompleks',
                tips: 'Tambah segelas susu untuk protein.'
            }
        ],
        medium: [ // 10-20 minutes
            {
                name: 'Nasi Goreng Telur',
                prepTime: 15,
                ingredients: ['Nasi putih', 'Telur 2 butir', 'Sayuran', 'Kecap'],
                calories: 450,
                hydration: 'low',
                energy: 'sustained',
                benefits: 'Mengenyangkan, protein dari telur',
                tips: 'Jangan terlalu banyak garam. Minum air putih 2 gelas.'
            },
            {
                name: 'Telur Orak-Arik + Roti + Sayur',
                prepTime: 12,
                ingredients: ['Telur 2 butir', 'Tomat', 'Bawang', 'Roti gandum', 'Bayam'],
                calories: 400,
                hydration: 'medium',
                energy: 'sustained',
                benefits: 'Protein tinggi, vitamin dari sayuran',
                tips: 'Tumis sayur dengan minyak sedikit.'
            }
        ],
        slow: [ // > 20 minutes
            {
                name: 'Bubur Ayam Komplit',
                prepTime: 30,
                ingredients: ['Beras', 'Ayam suwir', 'Telur rebus', 'Kerupuk', 'Kaldu ayam'],
                calories: 500,
                hydration: 'medium',
                energy: 'sustained',
                benefits: 'Lengkap: Karbo, protein, lemak sehat',
                tips: 'Hangat, mudah dicerna, bikin kuat puasa.'
            }
        ]
    },

    iftar: {
        quick: [ // < 15 minutes
            {
                name: 'Es Buah Segar',
                prepTime: 10,
                ingredients: ['Melon', 'Semangka', 'Nanas', 'Kelapa muda', 'Sirup'],
                calories: 200,
                hydration: 'very_high',
                energy: 'instant',
                benefits: 'Hidrasi maksimal, gula alami',
                tips: 'Makan dulu 3 kurma, lalu es buah, baru sholat.'
            },
            {
                name: 'Kolak Pisang',
                prepTime: 12,
                ingredients: ['Pisang kepok', 'Santan', 'Gula merah', 'Daun pandan'],
                calories: 280,
                hydration: 'medium',
                energy: 'instant',
                benefits: 'Energi cepat, tradisional Indonesia',
                tips: 'Jangan terlalu manis. Tambah ubi untuk serat.'
            },
            {
                name: 'Salad Sayur + Grilled Chicken',
                prepTime: 15,
                ingredients: ['Ayam panggang', 'Selada', 'Tomat', 'Mentimun', 'Olive oil'],
                calories: 350,
                hydration: 'high',
                energy: 'sustained',
                benefits: 'Ringan, tidak bikin ngantuk saat Tarawih',
                tips: 'Protein tinggi, sayur menyegarkan.'
            }
        ],
        medium: [ // 15-45 minutes
            {
                name: 'Sop Ayam Jahe',
                prepTime: 35,
                ingredients: ['Ayam', 'Jahe', 'Wortel', 'Kentang', 'Seledri'],
                calories: 400,
                hydration: 'high',
                energy: 'sustained',
                benefits: 'Hangat, cocok cuaca dingin, jahe anti masuk angin',
                tips: 'Kuah banyak = hidrasi. Bikin badan hangat.'
            },
            {
                name: 'Ikan Bakar + Nasi + Lalapan',
                prepTime: 25,
                ingredients: ['Ikan (gurame/nila)', 'Nasi', 'Timun', 'Tomat', 'Sambal'],
                calories: 480,
                hydration: 'medium',
                energy: 'sustained',
                benefits: 'Protein ikan cepat dicerna, aman untuk Tarawih',
                tips: 'Hindari gorengan, pilih bakar/panggang.'
            },
            {
                name: 'Capcay Kuah Telur',
                prepTime: 20,
                ingredients: ['Sayuran campur', 'Telur', 'Kaldu ayam', 'Bawang putih'],
                calories: 320,
                hydration: 'high',
                energy: 'medium',
                benefits: 'Sayuran melimpah, kuah hangat, ringan',
                tips: 'Sayuran membantu pencernaan sebelum Tarawih.'
            }
        ],
        slow: [ // > 45 minutes
            {
                name: 'Opor Ayam Lebaran Style',
                prepTime: 60,
                ingredients: ['Ayam', 'Santan', 'Bumbu opor', 'Kentang', 'Telur rebus'],
                calories: 550,
                hydration: 'low',
                energy: 'sustained',
                benefits: 'Mewah, cocok weekend atau acara keluarga',
                tips: 'Santan tinggi lemak. Sebaiknya untuk hari libur saja.'
            },
            {
                name: 'Rendang Daging',
                prepTime: 90,
                ingredients: ['Daging sapi', 'Santan kental', 'Bumbu rendang', 'Cabai'],
                calories: 600,
                hydration: 'low',
                energy: 'very_sustained',
                benefits: 'Protein tinggi, mengenyangkan lama',
                tips: 'Tinggi lemak. Tidak cocok jika cuaca panas. Minum banyak air.'
            }
        ]
    }
};

/**
 * Calculate time remaining until Imsak
 * @param {Date} currentTime 
 * @param {string} imsakTime - Format: "HH:MM"
 * @returns {number} Minutes remaining
 */
export const getTimeUntilImsak = (currentTime, imsakTime) => {
    const [hours, minutes] = imsakTime.split(':').map(Number);
    const imsak = new Date(currentTime);
    imsak.setHours(hours, minutes, 0, 0);

    // If imsak has passed, it's for tomorrow
    if (imsak < currentTime) {
        imsak.setDate(imsak.getDate() + 1);
    }

    const diff = imsak - currentTime;
    return Math.floor(diff / (1000 * 60)); // Convert to minutes
};

/**
 * Get meal recommendations based on weather and time constraints
 * @param {string} mealType - 'sahur' or 'iftar'
 * @param {number} prepTimeAvailable - Minutes available for cooking
 * @param {number} temperature - Current/forecasted temperature in Celsius
 * @param {number} heatIndex - Calculated heat index
 * @param {boolean} isRainy - Is it raining/forecasted rain?
 * @returns {Array} Recommended meals
 */
export const getMealRecommendations = (mealType, prepTimeAvailable, temperature, heatIndex, isRainy = false) => {
    const meals = MEAL_DATABASE[mealType];
    let category;

    // Determine prep time category
    if (mealType === 'sahur') {
        if (prepTimeAvailable < 10) category = 'quick';
        else if (prepTimeAvailable < 20) category = 'medium';
        else category = 'slow';
    } else { // iftar
        if (prepTimeAvailable < 15) category = 'quick';
        else if (prepTimeAvailable < 45) category = 'medium';
        else category = 'slow';
    }

    let availableMeals = meals[category] || [];

    // Filter based on weather
    const weatherFiltered = availableMeals.map(meal => {
        let score = 100;
        let weatherAdvice = '';

        // Hot weather logic
        if (heatIndex > 32) {
            if (meal.hydration === 'very_high' || meal.hydration === 'high') {
                score += 20;
                weatherAdvice = '⭐ Sangat cocok untuk cuaca panas! Hidrasi tinggi.';
            } else if (meal.hydration === 'low') {
                score -= 30;
                weatherAdvice = '⚠️ Kurang cocok untuk panas. Tambah sayur/buah.';
            }

            // Avoid heavy/oily food in hot weather
            if (meal.name.includes('Rendang') || meal.name.includes('Opor') || meal.name.includes('Santan')) {
                score -= 25;
                weatherAdvice = '🔥 Terlalu berat untuk cuaca panas. Pilih yang lebih ringan.';
            }
        }

        // Cold/Rainy weather logic
        if (isRainy || temperature < 24) {
            if (meal.name.includes('Sop') || meal.name.includes('Jahe') || meal.name.includes('Bubur')) {
                score += 25;
                weatherAdvice = '☔ Cocok! Kuah hangat pas untuk hujan/dingin.';
            } else if (meal.name.includes('Es') || meal.name.includes('Smoothie')) {
                score -= 20;
                weatherAdvice = '❄️ Kurang cocok untuk cuaca dingin. Pilih yang hangat.';
            }
        }

        // Tarawih-friendly (for iftar)
        if (mealType === 'iftar') {
            if (meal.name.includes('Ikan') || meal.name.includes('Salad') || meal.name.includes('Sayur')) {
                score += 15;
                weatherAdvice += ' ✅ Ringan, aman untuk Tarawih.';
            } else if (meal.name.includes('Rendang') || meal.name.includes('Santan')) {
                score -= 10;
                weatherAdvice += ' ⚠️ Berat. Bisa bikin ngantuk saat Tarawih.';
            }
        }

        return {
            ...meal,
            weatherScore: score,
            weatherAdvice
        };
    });

    // Sort by weather score
    weatherFiltered.sort((a, b) => b.weatherScore - a.weatherScore);

    return weatherFiltered;
};

/**
 * Get sahur recommendations with countdown
 * @param {Date} currentTime 
 * @param {string} imsakTime - Format: "HH:MM"
 * @param {number} temperature 
 * @param {number} heatIndex 
 * @param {boolean} isRainy 
 * @returns {object} Sahur plan
 */
export const getSahurPlan = (currentTime, imsakTime, temperature, heatIndex, isRainy) => {
    const minutesLeft = getTimeUntilImsak(currentTime, imsakTime);

    let urgency, icon, message;

    if (minutesLeft > 60) {
        urgency = 'relaxed';
        icon = '😌';
        message = 'Masih santai! Bisa masak yang agak lama.';
    } else if (minutesLeft > 30) {
        urgency = 'moderate';
        icon = '⏰';
        message = 'Waktu cukup, tapi jangan terlalu lama ya!';
    } else if (minutesLeft > 15) {
        urgency = 'hurry';
        icon = '🏃';
        message = 'Mepet! Pilih menu yang cepat!';
    } else {
        urgency = 'critical';
        icon = '🚨';
        message = 'SEKARANG! Smoothie/Roti saja, cepat!';
    }

    const recommendations = getMealRecommendations('sahur', minutesLeft - 10, temperature, heatIndex, isRainy);

    return {
        minutesLeft,
        urgency,
        icon,
        message,
        imsakTime,
        recommendations: recommendations.slice(0, 3) // Top 3 recommendations
    };
};

/**
 * Get iftar recommendations
 * @param {number} prepTimeAvailable 
 * @param {number} temperature 
 * @param {number} heatIndex 
 * @param {boolean} isRainy 
 * @returns {object} Iftar plan
 */
export const getIftarPlan = (prepTimeAvailable, temperature, heatIndex, isRainy) => {
    const recommendations = getMealRecommendations('iftar', prepTimeAvailable, temperature, heatIndex, isRainy);

    // Tarawih timing advice
    const tarawihAdvice = {
        startTime: '19:00',
        message: 'Makan 1.5 jam sebelum Tarawih agar tidak begah.',
        foodTips: 'Hindari: Santan kental, gorengan banyak, makanan pedas. Pilih: Protein ringan (ikan/ayam), sayur, buah.'
    };

    return {
        prepTimeAvailable,
        recommendations: recommendations.slice(0, 5),
        tarawihAdvice
    };
};

export default {
    MEAL_DATABASE,
    getTimeUntilImsak,
    getMealRecommendations,
    getSahurPlan,
    getIftarPlan
};
