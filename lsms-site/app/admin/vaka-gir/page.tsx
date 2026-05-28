'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VakaGir() {
  const router = useRouter();
  const [formData, setFormData] = useState({ hastaIsmi: '', tani: '', mudahale: '', personelAdi: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/vaka/ekle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Vaka başarıyla kaydedildi!");
      router.push('/admin'); // İş bitince dashboard'a dön
    } else {
      alert("Hata oluştu.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-zinc-900 border border-zinc-800 rounded-xl mt-10">
      <h1 className="text-2xl font-bold text-white mb-6">Yeni Vaka Raporu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-3 bg-zinc-800 rounded text-white" placeholder="Hasta İsmi" onChange={(e) => setFormData({...formData, hastaIsmi: e.target.value})} required />
        <input className="w-full p-3 bg-zinc-800 rounded text-white" placeholder="Tanı" onChange={(e) => setFormData({...formData, tani: e.target.value})} required />
        <textarea className="w-full p-3 bg-zinc-800 rounded text-white h-32" placeholder="Yapılan Müdahale" onChange={(e) => setFormData({...formData, mudahale: e.target.value})} required />
        <input className="w-full p-3 bg-zinc-800 rounded text-white" placeholder="Raporlayan Personel" onChange={(e) => setFormData({...formData, personelAdi: e.target.value})} required />
        <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-all">Raporu Gönder</button>
      </form>
    </div>
  );
}