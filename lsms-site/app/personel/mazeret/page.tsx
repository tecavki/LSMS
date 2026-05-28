'use client';
import { useState } from 'react';

export default function PersonelMazeret() {
  const [form, setForm] = useState({ discordId: '', name: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // API adresimiz backend ile milimetrik aynı olmalı
      const res = await fetch('/api/personel/excuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: '🟢 BAŞARILI: Mazeret talebiniz Başhekimliğe iletildi.' });
        // Sebebi temizle, ama bir sonraki form için isim ve ID'yi tut
        setForm({ ...form, reason: '' }); 
      } else {
        setStatus({ type: 'error', message: '🔴 HATA: ' + (result.error || 'İşlem Başarısız.') });
      }
    } catch (err) {
      setStatus({ type: 'error', message: '🔴 KRİTİK HATA: Sunucu ile bağlantı kurulamadı.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-10 font-sans flex items-center justify-center">
      <div className="w-full max-w-xl bg-[#0a0a0c] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Üst Başlık */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-transparent p-6 border-b border-cyan-900/50">
          <h1 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <span className="text-cyan-500 drop-shadow-[0_0_8px_rgba(8,145,178,0.8)]">📋</span> YENİ MAZERET BİLDİRİMİ
          </h1>
          <p className="text-cyan-600/80 text-[10px] font-bold tracking-widest mt-1">LSMS // PERSONEL İZİN PORTALI</p>
        </div>

        {/* Form İçeriği */}
        <div className="p-8 space-y-6">
          
          {/* Canlı Sistem Bildirimi */}
          {status.message && (
            <div className={`p-4 rounded-lg text-xs font-bold uppercase tracking-widest border ${
              status.type === 'success' 
                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' 
                : 'bg-rose-900/20 border-rose-500/50 text-rose-400'
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] text-zinc-500 font-black tracking-widest uppercase mb-2">Discord ID</label>
              <input 
                required 
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded-lg outline-none focus:border-cyan-500 transition-all font-mono text-sm" 
                placeholder="Örn: 123456789012345678" 
                value={form.discordId} 
                onChange={e => setForm({...form, discordId: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-black tracking-widest uppercase mb-2">Ad Soyad</label>
              <input 
                required 
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded-lg outline-none focus:border-cyan-500 transition-all text-sm" 
                placeholder="Örn: John Doe" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-black tracking-widest uppercase mb-2">Mazeret Detayı</label>
              <textarea 
                required 
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded-lg h-32 outline-none focus:border-cyan-500 transition-all text-sm" 
                placeholder="Mazeret veya izin sebebinizi detaylıca açıklayın..." 
                value={form.reason} 
                onChange={e => setForm({...form, reason: e.target.value})} 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black py-4 rounded-lg uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)]"
            >
              {loading ? 'SİSTEME YÜKLENİYOR...' : 'TALEBİ BAŞHEKİMLİĞE İLET'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}