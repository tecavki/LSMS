'use client';
import { useState, useEffect } from 'react';

export default function AdminMesaiPage() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Her 1 dakikada bir "Aktif Süre (Dk)" sayacını yeniler
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => setNow(Date.now()), 60000); 
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/mesai');
      const result = await res.json();
      if (result.success) setPersonnel(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDuty = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/mesai', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: currentStatus ? 'stop' : 'start' })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Mesai değiştirme hatası:", err);
    }
  };

  // Saat Formatlayıcı (Örn: 14:35)
  const formatTime = (dateString: string) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  // Aktif Dakika Hesaplayıcı
  const getActiveMinutes = (startTime: string) => {
    if (!startTime) return 0;
    const startMs = new Date(startTime).getTime();
    const diffMins = Math.floor((now - startMs) / 60000);
    return diffMins > 0 ? diffMins : 0;
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-10 font-sans">
      <header className="mb-10 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <span className="text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">⏱️</span> MESAİ & NÖBET TAKİBİ
        </h1>
        <p className="text-zinc-500 text-sm tracking-widest mt-1 font-bold">LSMS // CANLI DUTY LOGLARI</p>
      </header>

      <div className="max-w-6xl">
        {loading ? (
          <div className="text-cyan-500 font-bold animate-pulse tracking-widest">PERSONEL VERİLERİ YÜKLENİYOR...</div>
        ) : personnel.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl text-zinc-500 font-bold tracking-widest">SİSTEMDE KAYITLI PERSONEL YOK.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {personnel.map((p) => {
              const activeMins = getActiveMinutes(p.dutyStartTime);
              return (
                <div key={p._id} className={`bg-[#0a0a0c] border p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${p.isDutyActive ? 'border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-zinc-800'}`}>
                  
                  {/* Personel Bilgileri */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-white font-black uppercase tracking-wider">{p.name}</span>
                      <span className="text-zinc-600 text-[10px] bg-zinc-900 px-2 py-1 rounded font-mono border border-zinc-800">{p.rank}</span>
                      {p.isDutyActive ? (
                        <span className="text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest bg-violet-900/30 text-violet-400 border border-violet-500/20 animate-pulse">
                          AKTİF GÖREVDE
                        </span>
                      ) : (
                        <span className="text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest bg-zinc-800/50 text-zinc-500">
                          PASİF
                        </span>
                      )}
                    </div>
                    
                    {/* Saat ve Süre Sayaçları */}
                    <div className="flex flex-wrap gap-4 mt-2">
                      {p.isDutyActive ? (
                         <>
                           <div className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800/80">
                             Giriş: <span className="text-zinc-300 ml-1">{formatTime(p.dutyStartTime)}</span>
                           </div>
                           <div className="text-[10px] font-bold text-violet-400 tracking-widest uppercase bg-violet-900/10 px-3 py-1.5 rounded border border-violet-900/30">
                             Süre: <span className="text-white ml-1">{activeMins} Dk</span>
                           </div>
                         </>
                      ) : (
                         <div className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800/50">
                           GİRİŞ BEKLENİYOR
                         </div>
                      )}
                      
                      <div className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800/50 ml-auto">
                        Toplam Sicil: <span className="text-zinc-300 ml-1">{p.totalDutyMinutes || 0} Dk</span>
                      </div>
                    </div>
                  </div>

                  {/* Yetkili Müdahale Butonları */}
                  <div className="w-full md:w-auto mt-2 md:mt-0">
                    {p.isDutyActive ? (
                      <button onClick={() => toggleDuty(p._id, p.isDutyActive)} className="w-full md:w-auto bg-rose-900/20 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-900/50 text-[10px] font-black px-6 py-4 rounded-xl uppercase tracking-widest transition-all">
                        ZORLA BİTİR
                      </button>
                    ) : (
                      <button onClick={() => toggleDuty(p._id, p.isDutyActive)} className="w-full md:w-auto bg-violet-900/20 hover:bg-violet-600 text-violet-400 hover:text-white border border-violet-900/50 text-[10px] font-black px-6 py-4 rounded-xl uppercase tracking-widest transition-all">
                        ZORLA BAŞLAT
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}