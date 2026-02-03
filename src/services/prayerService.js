import axios from 'axios';

const ALADHAN_BASE = 'https://api.aladhan.com/v1';

/**
 * Get prayer times for a specific location and date
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {Date} date - defaults to today
 * @param {number} method - calculation method (default: 20 = KEMENAG Indonesia)
 * @returns {Promise<object>} Prayer times data
 */
export const getPrayerTimes = async (latitude, longitude, date = new Date(), method = 20) => {
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    try {
        const response = await axios.get(`${ALADHAN_BASE}/timings/${dateStr}`, {
            params: {
                latitude,
                longitude,
                method, // 20 = Kementerian Agama Indonesia
                tune: '2,2,2,2,2,2,2,2,2', // Fine-tuning in minutes
                school: 0, // Standard (Shafi)
            }
        });

        if (response.data.code === 200) {
            const data = response.data.data;
            return {
                timings: {
                    imsak: data.timings.Imsak,
                    fajr: data.timings.Fajr,
                    sunrise: data.timings.Sunrise,
                    dhuhr: data.timings.Dhuhr,
                    asr: data.timings.Asr,
                    sunset: data.timings.Sunset,
                    maghrib: data.timings.Maghrib,
                    isha: data.timings.Isha,
                    midnight: data.timings.Midnight,
                },
                date: {
                    readable: data.date.readable,
                    timestamp: data.date.timestamp,
                    gregorian: {
                        date: data.date.gregorian.date,
                        day: data.date.gregorian.day,
                        weekday: data.date.gregorian.weekday.en,
                        month: data.date.gregorian.month.en,
                        monthNumber: data.date.gregorian.month.number,
                        year: data.date.gregorian.year,
                    },
                    hijri: {
                        date: data.date.hijri.date,
                        day: data.date.hijri.day,
                        weekday: data.date.hijri.weekday.ar,
                        weekdayEn: data.date.hijri.weekday.en,
                        month: data.date.hijri.month.ar,
                        monthEn: data.date.hijri.month.en,
                        monthNumber: data.date.hijri.month.number,
                        year: data.date.hijri.year,
                        designation: data.date.hijri.designation.abbreviated,
                        holidays: data.date.hijri.holidays || [],
                    }
                },
                meta: {
                    timezone: data.meta.timezone,
                    method: data.meta.method.name,
                }
            };
        }
        throw new Error('Failed to fetch prayer times');
    } catch (error) {
        console.error('Prayer times API error:', error);
        throw error;
    }
};

/**
 * Get Islamic calendar for a specific Gregorian month
 * @param {number} month - Gregorian month (1-12)
 * @param {number} year - Gregorian year
 * @returns {Promise<object>} Calendar data
 */
export const getIslamicCalendar = async (month, year) => {
    try {
        const response = await axios.get(`${ALADHAN_BASE}/gToHCalendar/${month}/${year}`);

        if (response.data.code === 200) {
            return response.data.data.map(day => ({
                gregorian: {
                    date: day.gregorian.date,
                    day: day.gregorian.day,
                    weekday: day.gregorian.weekday.en,
                    month: day.gregorian.month.en,
                    year: day.gregorian.year,
                },
                hijri: {
                    date: day.hijri.date,
                    day: day.hijri.day,
                    weekday: day.hijri.weekday.ar,
                    weekdayEn: day.hijri.weekday.en,
                    month: day.hijri.month.ar,
                    monthEn: day.hijri.month.en,
                    year: day.hijri.year,
                    holidays: day.hijri.holidays || [],
                }
            }));
        }
        throw new Error('Failed to fetch Islamic calendar');
    } catch (error) {
        console.error('Islamic calendar API error:', error);
        throw error;
    }
};

/**
 * Get next prayer time from current time
 * @param {object} timings - Prayer timings object
 * @returns {object} Next prayer info
 */
export const getNextPrayer = (timings) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
        { name: 'Imsak', time: timings.imsak, nameId: 'Imsak' },
        { name: 'Fajr', time: timings.fajr, nameId: 'Subuh' },
        { name: 'Sunrise', time: timings.sunrise, nameId: 'Terbit' },
        { name: 'Dhuhr', time: timings.dhuhr, nameId: 'Dzuhur' },
        { name: 'Asr', time: timings.asr, nameId: 'Ashar' },
        { name: 'Maghrib', time: timings.maghrib, nameId: 'Maghrib' },
        { name: 'Isha', time: timings.isha, nameId: 'Isya' },
    ];

    for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;

        if (prayerMinutes > currentTime) {
            const diffMinutes = prayerMinutes - currentTime;
            const hours = Math.floor(diffMinutes / 60);
            const mins = diffMinutes % 60;

            return {
                name: prayer.name,
                nameId: prayer.nameId,
                time: prayer.time,
                countdown: hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`,
                countdownMinutes: diffMinutes,
            };
        }
    }

    // If all prayers have passed, next is Imsak tomorrow
    return {
        name: 'Imsak',
        nameId: 'Imsak',
        time: timings.imsak,
        countdown: 'Besok',
        countdownMinutes: 0,
    };
};

/**
 * Indonesian month names for Hijri calendar
 */
export const HIJRI_MONTHS_ID = {
    1: 'Muharram',
    2: 'Safar',
    3: 'Rabiul Awal',
    4: 'Rabiul Akhir',
    5: 'Jumadil Awal',
    6: 'Jumadil Akhir',
    7: 'Rajab',
    8: 'Syaban',
    9: 'Ramadhan',
    10: 'Syawal',
    11: 'Dzulqaidah',
    12: 'Dzulhijjah',
};

/**
 * Indonesian day names
 */
export const DAYS_ID = {
    'Sunday': 'Ahad',
    'Monday': 'Senin',
    'Tuesday': 'Selasa',
    'Wednesday': 'Rabu',
    'Thursday': 'Kamis',
    'Friday': 'Jumat',
    'Saturday': 'Sabtu',
};

export default {
    getPrayerTimes,
    getIslamicCalendar,
    getNextPrayer,
    HIJRI_MONTHS_ID,
    DAYS_ID,
};
