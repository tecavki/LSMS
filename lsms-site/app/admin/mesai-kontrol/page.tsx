// app/admin/mesai-kontrol/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function AdminMesaiKontrol() {
  const [staff, setStaff] = useState<any[]>([]);
  const [load, setLoad] = useState(true);

  const loadStaff = () => {
    fetch('/api/admin/personel/toggle-duty', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.success) setStaff(d.staff); })
      .catch(console.error).finally(() => setLoad(false));
  };

  useEffect(() => { loadStaff(); }, []);

  const adminToggleDuty = async (discordId: string, currentDuty: boolean) => {
    try {
      const res = await fetch('/api/admin/personel/toggle-duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId, action: currentDuty ? 'stop' : 'start' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("🔒 Personel mesai durumu başarıyla güncellendi ve loglandı!");
        loadStaff(); // Listeyi canlı güncelle
      } else { alert(`Hata: ${data.error}`); }
    } catch { alert("Bağlantı hatası!"); }
  };

  if (load) return <div className="min-h-screen bg-slate-950 text-cyan-400 flex items-center justify-center font-mono text-xs">MESAİ MERKEZİ YÜKLENİYOR...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 font-sans text-xs antialiased">
      <div className="max-w-3xl mx-auto border border-slate-800 bg-slate-900/40 p-4 rounded-xl shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <div>
            <h1 className="text-base font-black text-cyan-400 tracking-wider">LSMS MESAİ KOMUTA MERKEZİ</h1>
            <p className="text-slate-500 text-[9px] font-mono">PERSONEL CANLI GÖREV TAKİBİ</p>
          </div>
          <button onClick={loadStaff} className="bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold hover:bg-slate-700 transition-all">🔄 LİSTEYİ YENİLE</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px]">
                <th className="pb-2">PERSONEL ADI</th>
                <th className="pb-2">RÜTBE</th>
                <th className="pb-2">DURUM</th>
                <th className="pb-2 text-right">YÖNETİM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {staff.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-center text-slate-600 font-mono">SİSTEMDE KAYITLI PERSONEL BULUNMADI</td></tr>
              ) : (
                staff.map((p: any) => (
                  <tr key={p._id || p.discordId} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-2.5 font-bold text-slate-200">{p.name}</td>
                    <td className="py-2.5 text-slate-400 font-mono">{p.role || p.rank || 'Stajyer'}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${p.onDuty ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {p.onDuty ? "● GÖREVDE" : "○ GÖREV DIŞI"}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button 
                        onClick={() => adminToggleDuty(p.discordId, p.onDuty)} 
                        className={`px-2 py-1 rounded font-black text-[9px] transition-all ${p.onDuty ? 'bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white' : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'}`}
                      >
                        {p.onDuty ? "MESAİYİ KES" : "MESAİ BAŞLAT"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}