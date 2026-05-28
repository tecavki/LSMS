"use client";
import { useState, useEffect } from 'react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', type: 'IC' });

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/admin/announcements');
    if (res.ok) setAnnouncements(await res.json());
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return alert("Lütfen tüm alanları doldurun.");

    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("📢 Duyuru başarıyla telsizden geçildi ve yayınlandı!");
      setForm({ title: '', content: '', type: 'IC' });
      fetchAnnouncements();
    }
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-red-500 border-b border-zinc-800 pb-3">LSMS RESMİ DUYURU / EMİR MERKEZİ</h1>
      
      {/* Duyuru Ekleme Formu */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col gap-4 max-w-xl">
        <h2 className="text-xl font-bold text-zinc-200">Yeni Emir / Duyuru Yayınla</h2>
        <input 
          type="text" placeholder="Duyuru Başlığı (Örn: Ambulans Park Düzeni)"
          value={form.title} onChange={e => setForm({...form, title: e.target.value})}
          className="bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:outline-none focus:border-red-500"
        />
        <textarea 
          placeholder="Duyuru içeriğini buraya detaylıca yazın..." rows={4}
          value={form.content} onChange={e => setForm({...form, content: e.target.value})}
          className="bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:outline-none focus:border-red-500"
        />
        <select 
          value={form.type} onChange={e => setForm({...form, type: e.target.value})}
          className="bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:outline-none"
        >
          <option value="IC">IC (Oyun İçi Telsiz Emri)</option>
          <option value="OOC">OOC (Oyun Dışı Toplantı / Bilgilendirme)</option>
        </select>
        <button type="submit" className="bg-red-600 hover:bg-red-700 py-2.5 rounded-lg font-bold transition">
          📢 DUYURUYU YAYINLA
        </button>
      </form>

      {/* Eski Duyurular Listesi */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-zinc-300">Geçmiş Duyurular & Takip</h2>
        {announcements.map((a: any) => (
          <div key={a._id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex justify-between items-center">
            <div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold mr-2 ${a.type === 'IC' ? 'bg-blue-900 text-blue-200' : 'bg-purple-900 text-purple-200'}`}>{a.type}</span>
              <strong className="text-lg">{a.title}</strong>
              <p className="text-zinc-400 mt-1 text-sm max-w-2xl">{a.content}</p>
            </div>
            <div className="text-right">
              <span className="bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800 text-sm font-semibold text-green-400 block">
                👁️ {a.readBy?.length || 0} Personel Okudu
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}