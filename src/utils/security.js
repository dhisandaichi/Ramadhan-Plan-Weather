/**
 * Security Utilities for RamadhanPlan
 * Provides protection against common web vulnerabilities
 */

// ============================================
// RATE LIMITING (Client-side)
// ============================================

/**
 * Rate limiter class to prevent excessive API requests
 * Default: 2 requests per second (2 RPS)
 */
class RateLimiter {
    constructor(maxRequests = 2, windowMs = 1000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
        this.blocked = false;
        this.blockUntil = 0;
    }

    /**
     * Check if request is allowed
     * @returns {object} { allowed: boolean, waitTime: number }
     */
    checkLimit() {
        const now = Date.now();

        // Check if currently blocked
        if (this.blocked && now < this.blockUntil) {
            return {
                allowed: false,
                waitTime: Math.ceil((this.blockUntil - now) / 1000),
                reason: 'RATE_LIMITED'
            };
        }

        // Reset block status if time has passed
        if (this.blocked && now >= this.blockUntil) {
            this.blocked = false;
            this.requests = [];
        }

        // Remove old requests outside the window
        this.requests = this.requests.filter(
            timestamp => now - timestamp < this.windowMs
        );

        // Check if limit exceeded
        if (this.requests.length >= this.maxRequests) {
            // Block for 5 seconds as penalty
            this.blocked = true;
            this.blockUntil = now + 5000;

            console.warn('[Security] Rate limit exceeded. Blocking requests for 5 seconds.');

            return {
                allowed: false,
                waitTime: 5,
                reason: 'RATE_LIMITED'
            };
        }

        // Record this request
        this.requests.push(now);

        return {
            allowed: true,
            waitTime: 0,
            reason: null
        };
    }

    /**
     * Reset the rate limiter
     */
    reset() {
        this.requests = [];
        this.blocked = false;
        this.blockUntil = 0;
    }
}

// Create singleton instances for different API endpoints
export const weatherRateLimiter = new RateLimiter(2, 1000); // 2 RPS for weather
export const prayerRateLimiter = new RateLimiter(2, 1000);  // 2 RPS for prayer times
export const generalRateLimiter = new RateLimiter(5, 1000); // 5 RPS for general actions


// ============================================
// INPUT VALIDATION & SANITIZATION
// ============================================

/**
 * Dangerous patterns that could indicate prompt injection or XSS
 */
const DANGEROUS_PATTERNS = [
    // XSS patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick=, onerror=, etc.
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<link/gi,
    /<style/gi,
    /data:/gi,
    /vbscript:/gi,

    // SQL Injection patterns
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
    /('|"|;|--)/g,

    // Prompt Injection patterns (for AI-related inputs)
    /ignore\s+(previous|all|above)\s+instructions/gi,
    /disregard\s+(previous|all|above)/gi,
    /forget\s+(everything|all|previous)/gi,
    /new\s+instructions?:/gi,
    /system\s*:\s*/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<\|.*?\|>/gi,
    /###\s*(instruction|system|human|assistant)/gi,

    // Path traversal
    /\.\.\//g,
    /\.\.\\/,

    // Command injection
    /[;&|`$()]/g,
];

/**
 * Validate and sanitize user input
 * @param {string} input - User input to validate
 * @param {object} options - Validation options
 * @returns {object} { isValid: boolean, sanitized: string, threats: string[] }
 */
export const sanitizeInput = (input, options = {}) => {
    const {
        maxLength = 500,
        allowedChars = null,
        stripHtml = true,
        checkPromptInjection = true,
    } = options;

    if (typeof input !== 'string') {
        return {
            isValid: false,
            sanitized: '',
            threats: ['INVALID_TYPE']
        };
    }

    const threats = [];
    let sanitized = input.trim();

    // Check length
    if (sanitized.length > maxLength) {
        threats.push('MAX_LENGTH_EXCEEDED');
        sanitized = sanitized.substring(0, maxLength);
    }

    // Check for dangerous patterns
    if (checkPromptInjection) {
        for (const pattern of DANGEROUS_PATTERNS) {
            if (pattern.test(sanitized)) {
                threats.push('DANGEROUS_PATTERN_DETECTED');
                // Remove the dangerous pattern
                sanitized = sanitized.replace(pattern, '');
            }
            // Reset regex lastIndex for global patterns
            pattern.lastIndex = 0;
        }
    }

    // Strip HTML tags if required
    if (stripHtml) {
        const htmlPattern = /<[^>]*>/g;
        if (htmlPattern.test(sanitized)) {
            threats.push('HTML_STRIPPED');
            sanitized = sanitized.replace(/<[^>]*>/g, '');
        }
    }

    // Apply allowed characters filter
    if (allowedChars) {
        const allowedPattern = new RegExp(`[^${allowedChars}]`, 'g');
        if (allowedPattern.test(sanitized)) {
            threats.push('DISALLOWED_CHARS_REMOVED');
            sanitized = sanitized.replace(allowedPattern, '');
        }
    }

    // Encode special characters for safety
    sanitized = encodeSpecialChars(sanitized);

    return {
        isValid: threats.length === 0,
        sanitized,
        threats,
        original: input
    };
};

/**
 * Encode special HTML characters
 */
const encodeSpecialChars = (str) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    // Only encode if not already encoded
    return str.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Validate coordinates (latitude/longitude)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {object} { isValid: boolean, reason: string | null }
 */
export const validateCoordinates = (lat, lon) => {
    if (typeof lat !== 'number' || typeof lon !== 'number') {
        return { isValid: false, reason: 'Koordinat harus berupa angka' };
    }

    if (isNaN(lat) || isNaN(lon)) {
        return { isValid: false, reason: 'Koordinat tidak valid' };
    }

    if (lat < -90 || lat > 90) {
        return { isValid: false, reason: 'Latitude harus antara -90 dan 90' };
    }

    if (lon < -180 || lon > 180) {
        return { isValid: false, reason: 'Longitude harus antara -180 dan 180' };
    }

    // Indonesia bounds check (optional, for this specific app)
    const INDONESIA_BOUNDS = {
        minLat: -11.0,
        maxLat: 6.5,
        minLon: 95.0,
        maxLon: 141.0
    };

    const isInIndonesia =
        lat >= INDONESIA_BOUNDS.minLat &&
        lat <= INDONESIA_BOUNDS.maxLat &&
        lon >= INDONESIA_BOUNDS.minLon &&
        lon <= INDONESIA_BOUNDS.maxLon;

    return {
        isValid: true,
        reason: null,
        isInIndonesia,
        warning: !isInIndonesia ? 'Lokasi berada di luar wilayah Indonesia' : null
    };
};

/**
 * Validate city name from selection
 * @param {string} cityName 
 * @param {Array} allowedCities 
 * @returns {boolean}
 */
export const validateCitySelection = (cityName, allowedCities) => {
    if (!cityName || typeof cityName !== 'string') {
        return false;
    }
    return allowedCities.some(city => city.name === cityName);
};


// ============================================
// REQUEST SECURITY
// ============================================

/**
 * Create a secure API request wrapper with rate limiting
 * @param {Function} apiCall - The API call function
 * @param {RateLimiter} rateLimiter - Rate limiter instance
 * @returns {Function} Wrapped function with security
 */
export const secureApiCall = (apiCall, rateLimiter = generalRateLimiter) => {
    return async (...args) => {
        // Check rate limit
        const limitCheck = rateLimiter.checkLimit();

        if (!limitCheck.allowed) {
            throw new Error(
                `Terlalu banyak permintaan. Silakan tunggu ${limitCheck.waitTime} detik.`
            );
        }

        // Execute the original API call
        return apiCall(...args);
    };
};

/**
 * Create a debounced function to prevent rapid consecutive calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Create a throttled function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 500) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};


// ============================================
// STORAGE SECURITY
// ============================================

/**
 * Securely store data in localStorage with validation
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {object} options - Options
 */
export const secureStore = (key, value, options = {}) => {
    const { expiresIn = null } = options;

    try {
        const data = {
            value,
            timestamp: Date.now(),
            expiresAt: expiresIn ? Date.now() + expiresIn : null
        };

        // Validate key
        if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
            console.error('[Security] Invalid storage key format');
            return false;
        }

        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('[Security] Failed to store data:', error);
        return false;
    }
};

/**
 * Securely retrieve data from localStorage
 * @param {string} key - Storage key
 * @returns {any} Stored value or null
 */
export const secureRetrieve = (key) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const data = JSON.parse(item);

        // Check expiration
        if (data.expiresAt && Date.now() > data.expiresAt) {
            localStorage.removeItem(key);
            return null;
        }

        return data.value;
    } catch (error) {
        console.error('[Security] Failed to retrieve data:', error);
        return null;
    }
};


// ============================================
// LOGGING & MONITORING
// ============================================

/**
 * Security event logger
 */
export const securityLog = {
    _logs: [],
    _maxLogs: 100,

    log(event, details = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            event,
            details,
            url: window.location.href
        };

        this._logs.push(entry);

        // Keep only recent logs
        if (this._logs.length > this._maxLogs) {
            this._logs.shift();
        }

        // Log to console in development
        if (import.meta.env.DEV) {
            console.log(`[Security Event] ${event}`, details);
        }
    },

    getLogs() {
        return [...this._logs];
    },

    clearLogs() {
        this._logs = [];
    }
};


// ============================================
// ANTI-AUTOMATION DETECTION
// ============================================

/**
 * Detect potential bot/automation behavior
 * @returns {object} Detection result
 */
export const detectAutomation = () => {
    const signals = [];

    // Check for WebDriver
    if (navigator.webdriver) {
        signals.push('WEBDRIVER_DETECTED');
    }

    // Check for headless browser indicators
    if (!window.chrome && /Chrome/.test(navigator.userAgent)) {
        signals.push('HEADLESS_CHROME_SUSPECTED');
    }

    // Check for automation frameworks
    if (window._phantom || window.callPhantom) {
        signals.push('PHANTOM_DETECTED');
    }

    if (window.__nightmare) {
        signals.push('NIGHTMARE_DETECTED');
    }

    // Check for unusual screen dimensions (common in bots)
    if (window.outerWidth === 0 || window.outerHeight === 0) {
        signals.push('ZERO_DIMENSIONS');
    }

    // Check plugins (bots often have none)
    if (navigator.plugins && navigator.plugins.length === 0) {
        signals.push('NO_PLUGINS');
    }

    const isBot = signals.length >= 2; // Multiple signals suggest automation

    if (isBot) {
        securityLog.log('AUTOMATION_DETECTED', { signals });
    }

    return {
        isBot,
        signals,
        confidence: signals.length / 5 // 0 to 1 scale
    };
};


// ============================================
// EXPORTS
// ============================================

export default {
    // Rate limiting
    RateLimiter,
    weatherRateLimiter,
    prayerRateLimiter,
    generalRateLimiter,

    // Validation
    sanitizeInput,
    validateCoordinates,
    validateCitySelection,

    // Request security
    secureApiCall,
    debounce,
    throttle,

    // Storage
    secureStore,
    secureRetrieve,

    // Logging
    securityLog,

    // Anti-automation
    detectAutomation
};
