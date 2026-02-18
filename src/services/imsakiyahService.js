/**
 * Imsakiyah Service
 * API: https://equran.id/api/v2/imsakiyah
 * Jadwal Imsakiyah Ramadhan 1447H / 2026M
 */

const BASE_URL = 'https://equran.id/api/v2/imsakiyah';

/**
 * Fetch list of all provinces
 * @returns {Promise<string[]>} Array of province names
 */
export const getProvinsi = async () => {
    const response = await fetch(`${BASE_URL}/provinsi`);
    if (!response.ok) throw new Error(`Gagal mengambil daftar provinsi: ${response.statusText}`);
    const result = await response.json();
    return result.data || [];
};

/**
 * Fetch list of kabupaten/kota for a given province
 * @param {string} provinsi - Province name
 * @returns {Promise<string[]>} Array of kabkota names
 */
export const getKabKota = async (provinsi) => {
    const response = await fetch(`${BASE_URL}/kabkota`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provinsi }),
    });
    if (!response.ok) throw new Error(`Gagal mengambil daftar kabupaten/kota: ${response.statusText}`);
    const result = await response.json();
    return result.data || [];
};

/**
 * Fetch full imsakiyah schedule for a given province + kabkota
 * @param {string} provinsi - Province name
 * @param {string} kabkota - Kabupaten/Kota name
 * @returns {Promise<object>} Imsakiyah data object
 */
export const getImsakiyah = async (provinsi, kabkota) => {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provinsi, kabkota }),
    });
    if (!response.ok) throw new Error(`Gagal mengambil jadwal imsakiyah: ${response.statusText}`);
    const result = await response.json();
    return result.data || null;
};

/**
 * Get today's imsakiyah schedule
 * @param {string} provinsi
 * @param {string} kabkota
 * @returns {Promise<object|null>} Today's schedule or null
 */
export const getTodayImsakiyah = async (provinsi, kabkota) => {
    const data = await getImsakiyah(provinsi, kabkota);
    if (!data || !data.imsakiyah) return null;

    const today = new Date();
    const dayOfMonth = today.getDate();

    // Ramadhan 2026 starts around March 1, 2026 (1 Ramadhan 1447H)
    // The API returns 30 days of Ramadhan. tanggal = 1..30 (day of Ramadhan)
    // We need to map current date to Ramadhan day
    // Rough start: March 1, 2026 (adjust if needed)
    const ramadhanStart = new Date('2026-03-01');
    const diffMs = today - ramadhanStart;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const ramadhanDay = diffDays + 1; // 1-indexed

    const todaySchedule = data.imsakiyah.find(d => d.tanggal === ramadhanDay);
    return todaySchedule || data.imsakiyah[0]; // fallback to day 1
};
