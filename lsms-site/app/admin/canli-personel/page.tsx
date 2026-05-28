// app/admin/canli-personel/page.tsx
"use client";
import { useState, useEffect } from 'react';

export default function CanliPersonelTakip() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveStaff = async () => {
    try {
      const res = await fetch('/api/admin/personel/list', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (err) {
      console.error("Kadro çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStaff();
    // Her 10 saniyede bir sayfayı arka planda otomatik yeniler (Canlı Takip)
    const interval = setInterval(fetchLiveStaff, 10000);
    return () => clearInterval(interval);
  }, []);

  // Aktif mesaide olanların sayısını hesapla
  const activeDutyCount = staff.filter((p: any) => p.onDuty).length;

  if (loading) {
    return <div className="p-8 text-white text-center">Canlı LSMS Telsiz Frekansları taranıyor...</div>;
  }

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">🚑 CANLI TELSİZ & GÖREV MASASI</h1>
          <p className="text-zinc-400 text-xs mt-1">Şehirdeki aktif sağlık personellerinin anlık takibi</p>
        </div>
        
        {/* Canlı Sayaç Kutusu */}
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold">Aktif Görevde: <strong className="text-emerald-400 text-lg">{activeDutyCount}</strong> / {staff.length}</span>
        </div>
      </div>

      {/* Kadro Kartları Izgarası (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((p: any) => (
          <div 
            key={p._id} 
            className={`p-5 rounded-xl border transition-all duration-300 bg-zinc-900 ${
              p.onDuty 
                ? 'border-emerald-600/50 shadow-lg shadow-emerald-950/10' 
                : 'border-zinc-800 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-zinc-100">{p.name}</h3>
                <p className="text-sm text-zinc-400 font-medium mt-0.5">{p.rank}</p>
                <p className="text-xs text-zinc-600 font-mono mt-2">ID: {p.discordId}</p>
              </div>
              
              {/* Canlı Durum Rozeti */}
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                p.onDuty 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : 'bg-zinc-950 text-zinc-500 border-zinc-800'
              }`}>
                {p.onDuty ? '● DUTY (10-8)' : '○ OFF-DUTY (10-10)'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}