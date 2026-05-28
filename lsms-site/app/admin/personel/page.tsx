'use client';
import { useState, useEffect } from 'react';

export default function PersonelListesi() {
  const [personeller, setPersoneller] = useState<any[]>([]);
  const [aktifNobetler, setAktifNobetler] = useState<any[]>([]);

  // Verileri ve mesai durumlarını güncelleyen fonksiyon
  const fetchData = async () => {
    try {
      // 1. Personelleri Çek
      const res = await fetch('/api/personel');
      if (!res.ok) throw new Error('Personeller alınamadı');
      const data = await res.json();
      setPersoneller(data);

      // 2. Mesai (Nöbet) Durumlarını Çek
      const nobetRes = await fetch('/api/nobet');
      const nobetData = await nobetRes.json();
      setAktifNobetler(nobetData);
    } catch (err) {
      console.error("Fetch Hatası:", err);
      setPersoneller([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Kullanıcı Silme Fonksiyonu
  const deletePersonel = async (id: string) => {
    if (!confirm("Bu personeli silmek istediğine emin misin?")) return;
    
    try {
      const res = await fetch(`/api/personel/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Personel silindi.");
        fetchData(); // Listeyi güncelle
      } else {
        alert("Silme işlemi başarısız.");
      }
    } catch (err) {
      console.error("Silme Hatası:", err);
    }
  };

  // Kişi şu an nöbette mi?
  const isDuty = (name: string) => aktifNobetler.some((n: any) => n.personelName === name && n.isActive);

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-black mb-8 border-l-4 border-blue-600 pl-4 uppercase">Kadro Yönetimi</h1>
      
      {personeller.length === 0 ? (
        <p className="text-zinc-500">Henüz personel bulunmuyor.</p>
      ) : (
        <div className="grid gap-6">
          {personeller.map((p) => (
            <div key={p._id} className="bg-[#0f0f11] border border-zinc-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold">{p.name}</h3>
                <p className="text-zinc-500 text-xs">{p.rank}</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* MESAİ DURUMU */}
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  isDuty(p.name) ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'
                }`}>
                  {isDuty(p.name) ? 'Mesaide' : 'İstirahat'}
                </span>

                {/* SİLME BUTONU */}
                <button 
                  onClick={() => deletePersonel(p._id)}
                  className="bg-red-900/20 text-red-500 px-4 py-2 rounded-lg hover:bg-red-800 transition-all"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}