
import React, { useState, useEffect } from 'react';
import { getNextHourActivities } from '../utils/ibadahData';
import { MdAccessTime } from 'react-icons/md';

const UpcomingIbadah = () => {
    // Lazy initializer avoids setState-in-effect for the initial load
    const [activities, setActivities] = useState(() => getNextHourActivities());

    useEffect(() => {
        // Update every minute to catch time changes
        const interval = setInterval(() => {
            setActivities(getNextHourActivities());
        }, 60000);

        return () => clearInterval(interval);
    }, []);




    if (activities.length === 0) {
        return (
            <div className="card-premium py-4 px-6 flex items-center gap-4 opacity-70">
                <div className="bg-white/10 p-2 rounded-full">
                    <MdAccessTime className="text-xl text-white/50" />
                </div>
                <div>
                    <h3 className="font-bold text-white/80">Tidak ada agenda khusus</h3>
                    <p className="text-xs text-white/50">Agenda ibadah berikutnya &gt; 1 jam lagi</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <MdAccessTime className="text-xl text-amber-300" />
                    <h3 className="font-bold text-lg">Agenda 1 Jam Ke Depan</h3>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full animate-pulse border border-amber-500/30">
                    Segera Dikerjakan
                </span>
            </div>

            <div className="space-y-3 relative z-10">
                {activities.map((item, index) => (
                    <div key={index} className="glass-dark p-3 rounded-xl border border-white/10 flex items-start gap-3">
                        <div className="bg-primary-900/50 text-primary-300 font-bold text-sm px-2 py-1 rounded text-center min-w-[3.5rem] border border-primary-500/20">
                            {item.jam_estimasi}
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-white/90">{item.judul}</h4>
                            <p className="text-xs text-white/60 line-clamp-1">{item.deskripsi}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingIbadah;
