'use client';
import { useState, useEffect } from 'react';

export default function AdminBasvurular() {
  const [basvurular, setBasvurular] = useState<any[]>([]);

  const fetchBasvurular = async () => {
    const res = await fetch('/api/admin/basvuru');
    if (res.ok) {
      const data = await res.json();
      setBasvurular(data);
    }
  };

  useEffect(() => { fetchBasvurular(); }, []);

  const handleAction = async (id: string, status: string) => {
    await fetch('/api/admin/basvuru', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    fetchBasvurular(); // Tabloyu anında yenile
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8">
      <h1 className="text-3xl font-black mb-8 border-l-4 border-red-600 pl-3">Başvuru Değerlendirme Merkezi</h1>
      <div className="space-y-4">
        {basvurular.length === 0 ? <p className="text-zinc-500">Bekleyen başvuru yok.</p> : basvurular.map((b: any) => (
          <div key={b._id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-mono mb-1">ID: {b.basvuruId}</p>
              <h2 className="text-xl font-bold">{b.icIsim} <span className="text-sm text-zinc-400 font-normal">({b.oocYas} Yaş)</span></h2>
              <p className="text-sm text-zinc-400 mt-2 line-clamp-2">Deneyim: {b.deneyim}</p>
              
              <div className="mt-3">
                {b.status === 'bekliyor' && <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded">İnceleme Bekliyor</span>}
                {b.status === 'onaylandi' && <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded">Onaylandı</span>}
                {b.status === 'reddedildi' && <span className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded">Reddedildi</span>}
              </div>
            </div>
            
            {/* Onay/Ret Butonları (Sadece bekleyenlerde görünür) */}
            {b.status === 'bekliyor' && (
              <div className="flex flex-col gap-2">
                <button onClick={() => handleAction(b._id, 'onaylandi')} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded font-bold transition-all">Onayla</button>
                <button onClick={() => handleAction(b._id, 'reddedildi')} className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded font-bold transition-all">Reddet</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}