import { useEffect, useState } from 'react';

const LoadingScreen = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6">
                {/* Animated Logo */}
                <div className="relative">
                    <div className="w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse"></div>
                        <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                            <span className="text-4xl animate-float">🌙</span>
                        </div>
                    </div>
                    {/* Orbiting elements */}
                    <div className="absolute top-0 left-0 w-24 h-24 animate-spin" style={{ animationDuration: '3s' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <span className="text-2xl">☀️</span>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-24 h-24 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                            <span className="text-2xl">💧</span>
                        </div>
                    </div>
                </div>

                {/* App Name */}
                <div>
                    <h1 className="text-4xl font-bold gradient-text-gold font-display mb-2">
                        RamadhanPlan
                    </h1>
                    <p className="text-white/70">Cuaca Bukan Sekadar Angka, Tapi Rencana</p>
                </div>

                {/* Loading Text */}
                <div className="glass rounded-2xl px-8 py-4">
                    <p className="text-lg font-semibold text-white">
                        Memuat data cuaca{dots}
                    </p>
                    <p className="text-sm text-white/60 mt-1">
                        Mengambil informasi terkini untuk Anda
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 shimmer rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
