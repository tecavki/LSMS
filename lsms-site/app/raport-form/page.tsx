'use client';
import { useState } from 'react';

export default function RaporFormu() {
  const [form, setForm] = useState({ hastaIsmi: '', tedaviTuru: '', notlar: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Vaka API'mize gönderiyoruz
    const res = await fetch('/api/vaka', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) alert("Rapor Başarıyla İletildi!");
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto glass-card p-8 rounded-2xl border border-blue-900/30">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-6 border-l-4 border-blue-600 pl-4">
          LSPD & LSMS Raporlama Portalı
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-4 bg-[#1a1f2e] border border-zinc-700 rounded-lg text-white" 
                 placeholder="Hasta İsmi" onChange={e => setForm({...form, hastaIsmi: e.target.value})} required />
          <input className="w-full p-4 bg-[#1a1f2e] border border-zinc-700 rounded-lg text-white" 
                 placeholder="Tedavi Türü" onChange={e => setForm({...form, tedaviTuru: e.target.value})} required />
          <textarea className="w-full p-4 bg-[#1a1f2e] border border-zinc-700 rounded-lg text-white h-32" 
                    placeholder="Vaka Notları..." onChange={e => setForm({...form, notlar: e.target.value})} />
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 font-bold uppercase rounded-lg">Raporu Kaydet</button>
        </form>
      </div>
    </div>
  );
}