"use client";
import { useState, useEffect } from 'react';

export default function KadroYonetimi() {
  const [staff, setStaff] = useState([]);
  const rütbeler = ["Stajyer Paramedik", "Paramedik", "Kıdemli Paramedik", "Uzman Doktor", "Başhekim Yardımcısı", "Başhekim"];

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/admin/personel/list');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setStaff(data);
      }
    } catch (err) {
      console.error("Kadro çekme hatası:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleUpdate = async (personel: any) => {
    const targetId = personel._id?.$oid || personel._id;

    if (!targetId) {
      alert("Hata: Personel ID'si okunamadı.");
      return;
    }

    try {
      const res = await fetch('/api/admin/personel/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: targetId, 
          rank: personel.rank, 
          salary: Number(personel.salary || 0) 
        }),
      });

      const responseData = await res.json().catch(() => ({}));

      if (res.ok && responseData.success) {
        alert("✨ LSMS Personel Bilgisi Başarıyla Güncellendi!");
        fetchStaff();
      } else {
        alert(`Güncelleme Başarısız: ${responseData.error || responseData.detay || 'Sunucu Hatası'}`);
      }
    } catch (err) {
      alert("Ağ bağlantı hatası veya NextAuth session kilitlenmesi yaşandı.");
    }
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500 border-b border-zinc-800 pb-3">LSMS KADRO & RÜTBE YÖNETİMİ</h1>
      <div className="overflow-x-auto bg-zinc-900 rounded-xl border border-zinc-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800 text-zinc-300 border-b border-zinc-700">
              <th className="p-4">Personel Adı</th>
              <th className="p-4">Discord ID</th>
              <th className="p-4">Mevcut Rütbe</th>
              <th className="p-4">Haftalık Maaş ($)</th>
              <th className="p-4 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((p: any) => {
              const currentId = p._id?.$oid || p._id;
              return (
                <tr key={currentId} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4 font-mono text-zinc-400 text-sm">{p.discordId}</td>
                  <td className="p-4">
                    <select
                      value={p.rank}
                      onChange={(e) => {
                        const updated = staff.map(item => (item._id?.$oid || item._id) === currentId ? { ...item, rank: e.target.value } : item);
                        setStaff(updated);
                      }}
                      className="bg-zinc-950 border border-zinc-700 rounded p-1 text-white focus:outline-none"
                    >
                      {rütbeler.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={p.salary || 0}
                      onChange={(e) => {
                        const updated = staff.map(item => (item._id?.$oid || item._id) === currentId ? { ...item, salary: e.target.value } : item);
                        setStaff(updated);
                      }}
                      className="bg-zinc-950 border border-zinc-700 rounded p-1 text-white w-24 text-center"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleUpdate(p)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition"
                    >
                      💾 GÜNCELLE
                    </button>
                    
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}