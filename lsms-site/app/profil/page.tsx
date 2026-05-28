'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [vakalar, setVakalar] = useState<any[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDuty, setIsDuty] = useState(false); // 🚀 Mesai Durumu
  const [vakaData, setVakaData] = useState({ hastaIsmi: '', tedaviTuru: '', ucret: '', aciklama: '' });
  const router = useRouter();

  // 1. Kullanıcıyı, Vakaları ve Nöbet Durumunu yükle
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (isAuth !== 'true') { router.push('/'); return; }
    
    const activeUser = localStorage.getItem('active_user');
    if (activeUser) {
      const parsedUser = JSON.parse(activeUser);
      setUser(parsedUser);
      fetchVakalar(parsedUser.name);
      checkDutyStatus(parsedUser.name);
    }
  }, [router]);

  // Vakaları API'den çek
  const fetchVakalar = async (name: string) => {
    try {
      const res = await fetch('/api/vaka');
      const data = await res.json();
      setVakalar(data.filter((v: any) => v.personelName === name));
    } catch (e) { console.error("Vakalar çekilemedi", e); }
  };

  // Nöbet durumunu kontrol et
  const checkDutyStatus = async (name: string) => {
    try {
      const res = await fetch('/api/nobet');
      const data = await res.json();
      const aktif = data.some((n: any) => n.personelName === name && n.isActive);
      setIsDuty(aktif);
    } catch (e) { console.error("Nöbet durumu alınamadı", e); }
  };

  // Nöbet Başlat/Bitir
  const toggleDuty = async () => {
    const action = isDuty ? 'end' : 'start';
    await fetch('/api/nobet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personelName: user.name, action })
    });
    setIsDuty(!isDuty);
  };

  const handleVakaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/vaka', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...vakaData, personelName: user.name }),
    });

    if (res.ok) {
      alert("Vaka başarıyla kaydedildi!");
      setIsModalOpen(false);
      setVakaData({ hastaIsmi: '', tedaviTuru: '', ucret: '', aciklama: '' });
      fetchVakalar(user.name); 
    }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/'); };

  if (!user) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Üst Bölüm: Profil ve Aksiyonlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 rounded-3xl flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-3xl font-bold">{user.name.charAt(0)}</div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-red-400 font-medium">{user.rank}</p>
              {/* 🚀 MESAİ DURUMU ROZETİ */}
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${isDuty ? 'bg-green-900/30 text-green-500' : 'bg-zinc-800 text-zinc-400'}`}>
                {isDuty ? '🟢 MESAİDE' : '⚪ İSTİRAHAT'}
              </span>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 p-6 rounded-3xl flex flex-col gap-3">
            <button 
              onClick={toggleDuty}
              className={`w-full py-3 rounded-xl font-bold transition-all ${isDuty ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
            >
              {isDuty ? 'Nöbeti Bitir' : 'Nöbeti Başlat'}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all">Hızlı Vaka Girişi</button>
            <button onClick={() => window.open('https://lsms.rf.gd/', '_blank')} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all border border-emerald-900/50">Rapor Yaz</button>
            <button onClick={handleLogout} className="w-full py-3 text-red-400 hover:bg-red-900/20 rounded-xl font-bold transition-all border border-red-900/50">Çıkış Yap</button>
          </div>
        </div>

        {/* Geçmiş Vakalar Listesi */}
        <section className="bg-zinc-900/20 border border-white/5 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-4">🩺 Geçmiş Vaka Raporlarım</h3>
          <div className="space-y-3">
            {vakalar.map((vaka: any) => (
              <div key={vaka._id} className="p-4 bg-white/5 rounded-xl flex justify-between items-center border border-white/5">
                <div>
                  <p className="font-bold text-white">{vaka.hastaIsmi}</p>
                  <p className="text-sm text-zinc-400">{vaka.tedaviTuru}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-bold">${vaka.ucret}</p>
                  <p className="text-xs text-zinc-500">{new Date(vaka.tarih).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Vaka Kayıt Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 p-8 rounded-3xl w-full max-w-md border border-zinc-700">
            <h2 className="text-2xl font-bold mb-6">Hızlı Vaka Raporu</h2>
            <form onSubmit={handleVakaSubmit} className="space-y-4">
              <input required placeholder="Hasta İsmi" className="w-full p-3 bg-black rounded-lg border border-zinc-700" onChange={e => setVakaData({...vakaData, hastaIsmi: e.target.value})} />
              <input required placeholder="Tedavi Türü" className="w-full p-3 bg-black rounded-lg border border-zinc-700" onChange={e => setVakaData({...vakaData, tedaviTuru: e.target.value})} />
              <input type="number" required placeholder="Ücret" className="w-full p-3 bg-black rounded-lg border border-zinc-700" onChange={e => setVakaData({...vakaData, ucret: e.target.value})} />
              <textarea placeholder="Açıklama" className="w-full p-3 bg-black rounded-lg border border-zinc-700" onChange={e => setVakaData({...vakaData, aciklama: e.target.value})} />
              <div className="flex gap-2 mt-4">
                <button type="submit" className="w-full py-3 bg-blue-600 rounded-lg font-bold">Kaydet</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-3 bg-zinc-800 rounded-lg">İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}