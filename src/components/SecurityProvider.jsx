import { useEffect, useState, createContext, useContext } from 'react';
import { detectAutomation, securityLog } from '../utils/security';

// Create Security Context
const SecurityContext = createContext({
    isBlocked: false,
    securityWarning: null,
    clearWarning: () => { },
});

/**
 * Security Provider Component
 * Wraps the app and provides security monitoring
 */
export const SecurityProvider = ({ children }) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [securityWarning, setSecurityWarning] = useState(null);

    // Run automation detection on mount
    useEffect(() => {
        const detection = detectAutomation();

        if (detection.isBot) {
            securityLog.log('BOT_DETECTED', detection);
            setSecurityWarning({
                type: 'automation',
                message: 'Terdeteksi aktivitas mencurigakan. Beberapa fitur mungkin dibatasi.',
                severity: 'high'
            });

            // Block if confidence is very high
            if (detection.confidence >= 0.8) {
                setIsBlocked(true);
            }
        }
    }, []);

    // Listen for rate limit errors globally
    useEffect(() => {
        const handleRateLimitError = (event) => {
            if (event.detail?.type === 'RATE_LIMITED') {
                setSecurityWarning({
                    type: 'rateLimit',
                    message: `Terlalu banyak permintaan. Silakan tunggu ${event.detail.waitTime} detik.`,
                    severity: 'medium',
                    autoHide: true
                });
            }
        };

        window.addEventListener('securityWarning', handleRateLimitError);
        return () => window.removeEventListener('securityWarning', handleRateLimitError);
    }, []);

    // Auto-hide warnings
    useEffect(() => {
        if (securityWarning?.autoHide) {
            const timer = setTimeout(() => {
                setSecurityWarning(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [securityWarning]);

    const clearWarning = () => setSecurityWarning(null);

    // If completely blocked, show block screen
    if (isBlocked) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-red-950 to-black">
                <div className="card-premium text-center max-w-md border-red-500/50">
                    <div className="text-6xl mb-4">🛡️</div>
                    <h2 className="text-2xl font-bold mb-2 text-red-400">Akses Diblokir</h2>
                    <p className="text-white/70 mb-4">
                        Sistem mendeteksi aktivitas yang mencurigakan dari perangkat Anda.
                        Jika Anda adalah pengguna sah, silakan refresh halaman atau coba lagi nanti.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary bg-red-600 hover:bg-red-700"
                    >
                        Refresh Halaman
                    </button>
                </div>
            </div>
        );
    }

    return (
        <SecurityContext.Provider value={{ isBlocked, securityWarning, clearWarning }}>
            {/* Security Warning Banner */}
            {securityWarning && (
                <div
                    className={`fixed top-0 left-0 right-0 z-[100] p-3 text-center text-sm font-medium animate-fade-in
                        ${securityWarning.severity === 'high'
                            ? 'bg-red-600/95 text-white'
                            : 'bg-amber-500/95 text-black'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <span>{securityWarning.severity === 'high' ? '🛡️' : '⚠️'}</span>
                        <span>{securityWarning.message}</span>
                        <button
                            onClick={clearWarning}
                            className="ml-4 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Main App Content */}
            <div className={securityWarning ? 'pt-12' : ''}>
                {children}
            </div>
        </SecurityContext.Provider>
    );
};

/**
 * Hook to use security context
 */
export const useSecurity = () => useContext(SecurityContext);

export default SecurityProvider;
