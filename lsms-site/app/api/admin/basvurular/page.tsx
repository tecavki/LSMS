'use client';
import { useState, useEffect } from 'react';

export default function AdminBasvurular() {
  const [basvurular, setBasvurular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verileri API'den çekme
  const fetchBasvurular = async () => {
    try {
      const res = await fetch('/api/admin/basvuru');
      if (res.ok) {
        const data = await res.json();
        setBasvurular(data);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasvurular();
  }, []);

  // ONAY / RED İŞLEMİ
  const handleAction = async (id: string, newStatus: string) => {
    const islemAdi = newStatus === 'onaylandi' ? 'ONAYLAMAK' : 'REDDETMEK';
    const onay = confirm(`Bu başvuruyu ${islemAdi} istediğinize emin misiniz?`);
    
    if (!onay) return;

    try {
      const res = await fetch('/api/admin/basvuru', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, status: newStatus })
      });

      if (res.ok) {
        fetchBasvurular(); // Tabloyu anında yenile
      } else {
        alert("Bir hata oluştu, işlem yapılamadı.");
      }
    } catch (error) {
      alert("Sunucu ile bağlantı kurulamadı.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 font-sans selection:bg-red-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="w-2 h-8 bg-red-600 rounded-full"></span>
              Başvuru Değerlendirme Merkezi
            </h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">Gelen personel başvurularını buradan inceleyip karara bağlayabilirsiniz.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-lg text-center">
            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Toplam Başvuru</p>
            <p className="text-2xl font-black text-white">{basvurular.length}</p>
          </div>
        </div>

        {/* İÇERİK (YÜKLENİYOR / BOŞ / LİSTE) */}
        {loading ? (
          <div className="text-center py-20 text-zinc-500 animate-pulse font-bold tracking-widest">DOSYALAR GETİRİLİYOR...</div>
        ) : basvurular.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 font-bold">İnceleme bekleyen yeni iş başvurusu bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {basvurular.map((b: any) => (
              <div key={b._id} className="bg-[#0f0f11] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden hover:border-zinc-700 transition-colors shadow-xl">
                
                {/* 1. Üst Kısım: ID ve İsim */}
                <div className="flex justify-between items-start mb-6 border-b border-zinc-800 pb-4">
                  <div>
                    <p className="text-red-500 font-mono text-sm font-black tracking-widest mb-1">{b.basvuruId}</p>
                    <h3 className="text-xl font-black text-white uppercase">{b.icIsim} <span className="text-sm text-zinc-500 font-medium capitalize">(IC: {b.icYas} Yaş | OOC: {b.oocYas} Yaş)</span></h3>
                  </div>
                  <div>
                    {b.status === 'bekliyor' && <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black tracking-widest rounded border border-yellow-500/20">⏳ İNCELEMEDE</span>}
                    {b.status === 'onaylandi' && <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black tracking-widest rounded border border-green-500/20">✅ ONAYLANDI</span>}
                    {b.status === 'reddedildi' && <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black tracking-widest rounded border border-red-500/20">❌ REDDEDİLDİ</span>}
                  </div>
                </div>

                {/* 2. Orta Kısım: Soru ve Cevaplar */}
                <div className="space-y-4 text-sm text-zinc-300">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Neden EMS?</p>
                    <p className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 italic">"{b.nedenEms}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Önceki Tecrübe</p>
                      <p className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50 line-clamp-2" title={b.deneyim}>{b.deneyim || "Belirtilmemiş"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Günlük Aktiflik</p>
                      <p className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">{b.gunlukAktiflik || "Belirtilmemiş"}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Alt Kısım: Aksiyon Butonları (Sadece 'bekliyor' ise görünür) */}
                {b.status === 'bekliyor' && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-zinc-800">
                    <button 
                      onClick={() => handleAction(b._id, 'onaylandi')} 
                      className="flex-1 py-3 bg-green-500/10 hover:bg-green-600 text-green-500 hover:text-white font-black uppercase tracking-widest rounded-lg border border-green-500/20 hover:border-green-600 transition-all"
                    >
                      KABUL ET
                    </button>
                    <button 
                      onClick={() => handleAction(b._id, 'reddedildi')} 
                      className="flex-1 py-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white font-black uppercase tracking-widest rounded-lg border border-red-500/20 hover:border-red-600 transition-all"
                    >
                      REDDET
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}