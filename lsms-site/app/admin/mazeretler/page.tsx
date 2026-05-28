'use client';
import { useState, useEffect } from 'react';

export default function AdminMazeretler() {
  const [excuses, setExcuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchExcuses();
  }, []);

  const fetchExcuses = async () => {
    try {
      // API adresimizle birebir eşleşen yol
      const res = await fetch('/api/admin/excuses');
      
      if (!res.ok) throw new Error(`API Ulaşılamadı! Hata Kodu: ${res.status}`);
      
      const data = await res.json();
      if (data.success) {
        setExcuses(data.data);
      } else {
        throw new Error(data.error || "Bilinmeyen API Hatası");
      }
    } catch (error: any) {
      console.error("VERİ ÇEKME HATASI:", error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/excuses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) fetchExcuses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-10 font-sans">
      <header className="mb-10 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <span className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">⚠️</span> MAZERET ONAY MERKEZİ
        </h1>
        <p className="text-zinc-500 text-sm tracking-widest mt-1 font-bold">LSMS // BAŞHEKİMLİK YETKİSİ</p>
      </header>

      <div className="space-y-4 max-w-4xl">
        {loading ? (
          <div className="text-cyan-500 font-bold animate-pulse tracking-widest">SİSTEM VERİLERİ YÜKLENİYOR...</div>
        ) : errorMsg ? (
          <div className="bg-rose-900/20 border border-rose-500 p-6 rounded-xl text-rose-500 text-sm font-bold tracking-widest uppercase">
            🔴 BAĞLANTI HATASI: {errorMsg}
          </div>
        ) : excuses.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl text-zinc-500 text-sm font-bold tracking-widest">
            KAYITLI MAZERET BULUNAMADI.
          </div>
        ) : (
          excuses.map((excuse) => (
            <div key={excuse._id} className="bg-[#0a0a0c] border border-zinc-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-cyan-900/50 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white font-black uppercase tracking-wider">{excuse.name}</span>
                  <span className="text-zinc-600 text-[10px] bg-zinc-900 px-2 py-1 rounded font-mono">ID: {excuse.discordId}</span>
                  <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                    excuse.status === 'Onaylandı' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' : 
                    excuse.status === 'Reddedildi' ? 'bg-rose-900/30 text-rose-400 border border-rose-500/20' : 
                    'bg-amber-900/30 text-amber-400 border border-amber-500/20 animate-pulse'
                  }`}>
                    {excuse.status}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-zinc-800 pl-3">{excuse.reason}</p>
                <div className="text-zinc-600 text-[10px] mt-2 font-bold">{new Date(excuse.createdAt).toLocaleString('tr-TR')}</div>
              </div>

              {excuse.status === 'Bekliyor' && (
                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button onClick={() => handleStatusUpdate(excuse._id, 'Onaylandı')} className="flex-1 md:flex-none bg-emerald-900/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-900/50 hover:border-emerald-500 text-[10px] font-black px-4 py-3 rounded uppercase tracking-widest transition-all">ONAYLA</button>
                  <button onClick={() => handleStatusUpdate(excuse._id, 'Reddedildi')} className="flex-1 md:flex-none bg-rose-900/20 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-900/50 hover:border-rose-500 text-[10px] font-black px-4 py-3 rounded uppercase tracking-widest transition-all">REDDET</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}