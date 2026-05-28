'use client';
import { useState, useEffect } from 'react';

export default function VakaArsiv() {
  const [vakalar, setVakalar] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVakalar = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/vaka');
        if (!res.ok) throw new Error(`Sunucu Hatası: ${res.status}`);
        
        const data = await res.json();
        setVakalar(data);
      } catch (err: any) {
        console.error("Veri çekme hatası:", err);
        setError(err.message || "Bilinmeyen bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchVakalar();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          Vaka Arşivi
        </h1>

        {/* 1. Yükleniyor Durumu */}
        {loading && <div className="text-zinc-500">Kayıtlar çekiliyor...</div>}

        {/* 2. Hata Durumu */}
        {error && <div className="p-4 bg-red-900/20 border border-red-900 text-red-400 rounded-xl">Hata: {error}</div>}

        {/* 3. Veri Listeleme (Tablo Tasarımı) */}
        {!loading && !error && (
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {vakalar.length === 0 ? (
              <p className="p-10 text-center text-zinc-500">Arşivde henüz kayıtlı vaka bulunmuyor.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-zinc-400 font-medium">Personel</th>
                    <th className="p-4 text-zinc-400 font-medium">Hasta</th>
                    <th className="p-4 text-zinc-400 font-medium">Tedavi</th>
                    <th className="p-4 text-zinc-400 font-medium">Ücret</th>
                    <th className="p-4 text-zinc-400 font-medium">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vakalar.map((vaka: any) => (
                    <tr key={vaka._id || Math.random()} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-blue-400">{vaka.personelName || "Bilinmiyor"}</td>
                      <td className="p-4">{vaka.hastaIsmi}</td>
                      <td className="p-4">{vaka.tedaviTuru}</td>
                      <td className="p-4 font-mono">${vaka.ucret}</td>
                      <td className="p-4 text-zinc-500 text-sm">{new Date(vaka.tarih).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </main>
  );
}