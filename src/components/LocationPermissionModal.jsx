import { MdLocationOn, MdClose } from 'react-icons/md';

const LocationPermissionModal = ({ onAllow, onDecline }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="card-premium max-w-md w-full text-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 islamic-pattern opacity-20"></div>

                <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-green">
                        <MdLocationOn className="text-5xl text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold font-display gradient-text mb-3">
                        Izinkan Akses Lokasi
                    </h2>

                    {/* Description */}
                    <p className="text-white/70 mb-6 leading-relaxed">
                        RamadhanPlan memerlukan akses lokasi Anda untuk memberikan:
                    </p>

                    {/* Benefits list */}
                    <div className="glass-dark rounded-xl p-4 mb-6 text-left space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🌙</span>
                            <span className="text-sm text-white/80">Jadwal shalat akurat sesuai lokasi</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🌦️</span>
                            <span className="text-sm text-white/80">Prakiraan cuaca real-time</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🍽️</span>
                            <span className="text-sm text-white/80">Rekomendasi menu sahur & berbuka</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onAllow}
                            className="flex-1 btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2"
                        >
                            <MdLocationOn className="text-xl" />
                            Izinkan Lokasi
                        </button>
                        <button
                            onClick={onDecline}
                            className="flex-1 btn-secondary py-3 text-lg font-semibold"
                        >
                            Gunakan Jakarta
                        </button>
                    </div>

                    {/* Privacy note */}
                    <p className="text-xs text-white/40 mt-4">
                        Lokasi Anda hanya digunakan untuk memberikan layanan dan tidak disimpan di server.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LocationPermissionModal;
