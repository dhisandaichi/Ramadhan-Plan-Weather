/**
 * Doa & Dzikir Service
 * API: https://equran.id/api/doa
 * Response format: { status: "success", data: { id, grup, nama, ar, tr, idn, tentang, tag } }
 */

const BASE_URL = 'https://equran.id/api';

/**
 * Fetch all doa list
 * @param {string} [grup] - Optional filter by grup
 * @param {string} [tag]  - Optional filter by tag
 * @returns {Promise<Array>} Array of doa objects
 */
export const getAllDoa = async (grup = '', tag = '') => {
    let url = `${BASE_URL}/doa`;
    const params = new URLSearchParams();
    if (grup) params.append('grup', grup);
    if (tag) params.append('tag', tag);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Gagal mengambil doa: ${response.statusText}`);
    const result = await response.json();

    // API returns { status: "success", data: [...] }
    if (result && Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
};

/**
 * Fetch detail of a specific doa by ID
 * @param {number} id - Doa ID (1-228)
 * @returns {Promise<object>} Doa detail object
 */
export const getDoaById = async (id) => {
    const response = await fetch(`${BASE_URL}/doa/${id}`);
    if (!response.ok) throw new Error(`Gagal mengambil detail doa: ${response.statusText}`);
    const result = await response.json();

    // API returns { status: "success", data: { ... } }
    return result?.data || result;
};
