
import panduanIbadahBase from '../data/panduanIbadah.js';
import panduanIbadahApiRef from '../data/panduanIbadah_with_api_ref.js';
import panduanIbadahQuranRef from '../data/panduanIbadah_quran_ref_for_api_ref.js';

export const getMergedIbadahData = () => {
    const baseMap = new Map();
    // Use base first
    panduanIbadahBase.forEach(item => baseMap.set(item.id, { ...item, type: 'general' }));

    // Merge API ref (Hadith)
    panduanIbadahApiRef.forEach(item => {
        if (baseMap.has(item.id)) {
            const current = baseMap.get(item.id);
            // Add api_path if present
            if (item.api_path) {
                current.api_path = item.api_path;
                current.hadithRef = true;
            }
        } else {
            // Add new if not present
            baseMap.set(item.id, { ...item, type: 'hadith', hadithRef: !!item.api_path });
        }
    });

    // Merge Quran ref
    panduanIbadahQuranRef.forEach(item => {
        if (baseMap.has(item.id)) {
            const current = baseMap.get(item.id);
            if (item.quran_api_path) {
                current.quran_api_path = item.quran_api_path;
                current.surat_nomor = item.surat_nomor;
                current.ayat_nomor = item.ayat_nomor;
                current.quranRef = true;
            }
        } else {
            baseMap.set(item.id, {
                ...item,
                type: 'quran',
                quranRef: true
            });
        }
    });

    // Sort by time
    // Convert jam_estimasi to sortable
    const sorted = Array.from(baseMap.values()).sort((a, b) => {
        if (!a.jam_estimasi) return 1;
        if (!b.jam_estimasi) return -1;

        // Handle fase sort order if needed, but time is usually sufficient
        // 03:00 (Sahur) vs 18:00 (Maghrib). Standard sort puts 03:00 first.
        // User's phase order starts at Maghrib. But standard timeline starts at 00:00.
        // For a general planner view, sorted by time is best.
        return a.jam_estimasi.localeCompare(b.jam_estimasi);
    });

    return sorted;
};

export const getNextHourActivities = () => {
    const all = getMergedIbadahData();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMin;

    // 1 Hour window
    const windowDuration = 60;

    // We want activities STARTING in the next hour? Or HAPPENING?
    // Usually "Agenda 1 jam ke depan" means starting soon.

    const windowEnd = (currentTimeMinutes + windowDuration) % (24 * 60);

    return all.filter(item => {
        if (!item.jam_estimasi) return false;
        const [h, m] = item.jam_estimasi.split(':').map(Number);
        const itemTime = h * 60 + m;

        // Simple range check handling midnight wrap
        if (windowEnd >= currentTimeMinutes) {
            // e.g. 10:00 to 11:00
            // Check if item time is >= now AND <= end
            return itemTime >= currentTimeMinutes && itemTime <= windowEnd;
        } else {
            // e.g. 23:30 to 00:30
            // Check if item time is >= now OR <= end
            return itemTime >= currentTimeMinutes || itemTime <= windowEnd;
        }
    });
};
