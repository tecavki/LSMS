'use client';
import { useState, useEffect } from 'react';

export default function PersonelListesi() {
  const [personeller, setPersoneller] = useState<any[]>([]);
  const [aktifNobetler, setAktifNobetler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Veri çekme fonksiyonu
  const fetchData = async () => {
    try {
      // Her iki API'den de veriyi paralel çekiyoruz (daha hızlı)
      const [personelRes, nobetRes] = await Promise.all([
        fetch('/api/personel').then(res => res.json()),
        fetch('/api/nobet').then(res => res.json())
      ]);

      setPersoneller(Array.isArray(personelRes) ? personelRes : []);
      setAktifNobetler(Array.isArray(nobetRes) ? nobetRes : []);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // İlk yükleme

    // 10 saniyede bir otomatik yenileme
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Personel görevde mi kontrolü
  const isDuty = (name: string) => aktifNobetler.some((n: any) => n.personelName === name && n.isActive);

  return (
    <div className="p-8 min-h-screen bg-[#0a0a0a] text-white">
      <h1 className="text-3xl font-black mb-8 border-l-4 border-blue-600 pl-4 uppercase tracking-wider">Kadro Yönetimi</h1>
      
      {loading ? (
        <div className="text-zinc-500 animate-pulse">Kadro yükleniyor...</div>
      ) : (
        <div className="grid gap-4">
          {personeller.length === 0 ? (
            <p className="text-zinc-500">Kayıtlı personel bulunamadı.</p>
          ) : (
            personeller.map((p) => (
              <div 
                key={p._id} 
                className="bg-[#0f0f11] border border-zinc-800 p-6 rounded-2xl flex justify-between items-center hover:border-zinc-700 transition-all shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {/* Görev Durumu Göstergesi */}
                  <div className={`w-3 h-3 rounded-full ${isDuty(p.name) ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-zinc-700'}`}></div>
                  <div>
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-0.5">{p.code || 'KOD YOK'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <p className="text-blue-400 font-bold">{p.rank}</p>
                  <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${isDuty(p.name) ? 'bg-green-900/30 text-green-500' : 'bg-zinc-900 text-zinc-600'}`}>
                    {isDuty(p.name) ? 'Görevde' : 'İstirahat'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}