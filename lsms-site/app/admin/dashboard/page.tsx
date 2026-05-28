'use client';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    toplamVaka: 0,
    toplamGelir: 0,
    aktifPersonel: 0,
    toplamPersonel: 0
  });
  const [sonVakalar, setSonVakalar] = useState<any[]>([]); // 🚀 Son vakalar listesi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vakaRes, personelRes, nobetRes] = await Promise.all([
          fetch('/api/vaka').then(r => r.json()),
          fetch('/api/personel').then(r => r.json()),
          fetch('/api/nobet').then(r => r.json())
        ]);

        const gelir = vakaRes.reduce((acc: number, curr: any) => acc + (Number(curr.ucret) || 0), 0);
        const aktifler = nobetRes.filter((n: any) => n.isActive).length;

        setStats({
          toplamVaka: vakaRes.length,
          toplamGelir: gelir,
          aktifPersonel: aktifler,
          toplamPersonel: personelRes.length
        });
        
        // En son eklenen 5 vakayı al
        setSonVakalar(vakaRes.slice(-5).reverse());
      } catch (e) {
        console.error("Dashboard verisi çekilemedi", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-[#0a0a0a] text-white font-sans">
      <h1 className="text-3xl font-black mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-wider">Hastaneler Yönetim Paneli</h1>
      
      {loading ? (
        <div className="text-zinc-500 animate-pulse">Veriler işleniyor...</div>
      ) : (
        <div className="space-y-8">
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Toplam Vaka" value={stats.toplamVaka} color="text-blue-500" />
            <StatCard title="Toplam Gelir" value={`$${stats.toplamGelir.toLocaleString()}`} color="text-emerald-500" />
            <StatCard title="Aktif Personel" value={stats.aktifPersonel} color="text-green-500" />
            <StatCard title="Toplam Kadro" value={stats.toplamPersonel} color="text-purple-500" />
          </div>

          {/* Son Aktiviteler Listesi */}
          <div className="bg-[#0f0f11] border border-zinc-800 p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               🚨 Son Vaka Hareketleri
            </h2>
            <div className="space-y-4">
              {sonVakalar.map((vaka: any) => (
                <div key={vaka._id} className="flex justify-between items-center p-4 border border-zinc-800 rounded-2xl bg-[#151518]">
                  <div>
                    <p className="font-bold">{vaka.hastaIsmi}</p>
                    <p className="text-xs text-zinc-500">{vaka.tedaviTuru} • {vaka.personelName}</p>
                  </div>
                  <p className="text-emerald-400 font-bold">${vaka.ucret}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: any, color: string }) {
  return (
    <div className="bg-[#0f0f11] border border-zinc-800 p-6 rounded-3xl hover:border-zinc-700 hover:bg-[#151518] transition-all">
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">{title}</p>
      <h2 className={`text-3xl font-black ${color}`}>{value}</h2>
    </div>
  );
}