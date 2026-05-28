'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PersonelEkle() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    rank: 'Stajyer Doktor',
    password: '' 
  });

  const [loading, setLoading] = useState(false);
  const [mesaj, setMesaj] = useState('');
  const [hata, setHata] = useState('');

  // 🚀 ŞİFRE ÜRETİCİ FONKSİYON
  const generateKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Okunması kolay karakterler
    let key = 'LSMS-';
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({...formData, password: key});
  };

  // 🚀 KOPYALAMA FONKSİYONU
  const copyToClipboard = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      alert("Şifre panoya kopyalandı!");
    } else {
      alert("Önce şifre üretmelisin!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMesaj('');
    setHata('');

    try {
      const res = await fetch('/api/personel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Personel eklenemedi!');

      setMesaj('✅ Personel başarıyla sisteme eklendi!');
      setFormData({ name: '', code: '', rank: 'Stajyer Doktor', password: '' });
      setTimeout(() => router.push('/admin/personel'), 1500);

    } catch (err: any) {
      setHata('❌ Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 animate-fade-in p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Yeni Personel Kaydı</h1>
        <p className="text-zinc-400 mt-2">Ekibe yeni bir üye eklerken otomatik şifre oluşturun.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">İsim Soyisim</label>
            <input 
              type="text" required placeholder="John Doe"
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Rozet No</label>
            <input 
              type="text" required placeholder="104"
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
              value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
          </div>

          {/* 🚀 ŞİFRE ÜRETİCİ ALANI */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Sistem Giriş Key</label>
            <div className="flex gap-2">
              <input 
                type="text" required placeholder="Şifre üret butonuna bas..."
                className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-red-500 outline-none font-mono"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button type="button" onClick={generateKey} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg transition-all">
                🔄
              </button>
              <button type="button" onClick={copyToClipboard} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg transition-all">
                📋
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Rütbe</label>
            <select 
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
              value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})}
            >
              <option>Stajyer Doktor</option>
              <option>Pratisyen Doktor</option>
              <option>Uzman Doktor</option>
              <option>Başhekim</option>
            </select>
          </div>

          {mesaj && <div className="p-3 bg-green-900/30 border border-green-800 text-green-400 rounded-lg text-sm">{mesaj}</div>}
          {hata && <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">{hata}</div>}

          <button 
            type="submit" disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
          >
            {loading ? "Kaydediliyor..." : "Personeli Kaydet"}
          </button>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/admin/personel" className="text-zinc-500 hover:text-white text-sm">
          ← Personel Listesine Dön
        </Link>
      </div>
    </div>
  );
}