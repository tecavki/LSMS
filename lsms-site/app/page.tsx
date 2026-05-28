'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🚀 DİNAMİK ARKA PLAN RESİMLERİ
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1587559070757-f72a388edbba?q=80&w=2070",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070"
];

export default function Home() {
  // GİRİŞ & BAŞVURU STATE'LERİ
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appForm, setAppForm] = useState({
    icIsim: '', icYas: '', oocYas: '', deneyim: '', legalSaat: '', emsRutbe: '', 
    gunlukAktiflik: '', primeSaat: 'Evet', hiyerarsi: 'Kabul Ediyorum', 
    nedenEms: '', mesaiKabul: 'Kabul Ediyorum'
  });
  const [isAppLoading, setIsAppLoading] = useState(false);
  
  // EKRAN VE ARKA PLAN STATE'LERİ
  const [showApply, setShowApply] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showCheck, setShowCheck] = useState(false); 
  const [bgIndex, setBgIndex] = useState(0); 

  // 🚀 SORGULAMA VE POPUP STATE'LERİ
  const [checkId, setCheckId] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  // YENİ: Özel Başarı Popup'ı ve Kopyalama State'i
  const [successPopup, setSuccessPopup] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const savedRole = localStorage.getItem('lsms_role');
    if (isAuth === 'true') {
      router.push(savedRole === 'admin' ? '/admin' : '/profil');
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      
      if (res.ok && data.user) {
        localStorage.setItem('isAuthenticated', 'true'); 
        localStorage.setItem('active_user', JSON.stringify(data.user)); 
        const userRole = data.user.role || 'personnel';
        localStorage.setItem('lsms_role', userRole);
        localStorage.setItem('lsms_name', name); 
        router.push(userRole === 'admin' ? '/admin' : '/profil');
      } else {
        alert(data.error || "Giriş başarısız. İsim veya Key hatalı.");
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAppLoading(true);
    try {
      const res = await fetch('/api/basvuru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appForm),
      });
      const data = await res.json(); 

      if (res.ok) {
        // 🚀 İŞTE BURASI DEĞİŞTİ: İlkel 'alert' yerine özel popup'ı açıyoruz
        setSuccessPopup(data.basvuruId);
        
        if(data.basvuruId) setCheckId(data.basvuruId);
        setShowApply(false);
        setShowRules(false);
        setShowCheck(true); // Arka planda sorgula ekranına atıyoruz
        
        setAppForm({ icIsim: '', icYas: '', oocYas: '', deneyim: '', legalSaat: '', emsRutbe: '', gunlukAktiflik: '', primeSaat: 'Evet', hiyerarsi: 'Kabul Ediyorum', nedenEms: '', mesaiKabul: 'Kabul Ediyorum' });
      } else {
        alert(data.error || "Başvuru gönderilemedi.");
      }
    } catch (error) {
      alert("Sunucu ile iletişim kurulamadı.");
    } finally {
      setIsAppLoading(false);
    }
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setCheckResult(null);
    try {
      const res = await fetch('/api/basvuru/sorgula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basvuruId: checkId })
      });
      const data = await res.json();
      if (res.ok) {
        setCheckResult(data);
      } else {
        alert(data.error || "Başvuru bulunamadı.");
      }
    } catch (err) { 
      alert("Bağlantı hatası"); 
    } finally { 
      setIsChecking(false); 
    }
  };

  // 🚀 YENİ: Kopyalama İşlevi
  const handleCopy = () => {
    if (successPopup) {
      navigator.clipboard.writeText(successPopup);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2 saniye sonra yazıyı "Kopyala"ya geri çevir
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center font-sans selection:bg-red-500/30 overflow-hidden">
      
      {/* 🚀 YENİ: ÖZEL BAŞARI POPUP (MODAL) */}
      {successPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(34,197,94,0.15)] text-center relative flex flex-col items-center">
            
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase mb-2">BAŞVURUNUZ ALINDI!</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Los Santos Medical Service iş başvurunuz başarıyla iletildi. Lütfen aşağıdaki takip numaranızı kopyalayın. Durumunuzu 'Sorgula' menüsünden takip edebilirsiniz.
            </p>

            <div className="w-full flex items-center justify-between bg-black border border-zinc-800 rounded-lg p-2 mb-6 shadow-inner">
              <span className="text-white font-mono text-lg font-bold tracking-widest pl-4">{successPopup}</span>
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 ${copied ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
              >
                {copied ? 'KOPYALANDI ✔' : 'KOPYALA'}
              </button>
            </div>

            <button
              onClick={() => setSuccessPopup(null)}
              className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              TAMAM, ANLADIM
            </button>
          </div>
        </div>
      )}

      {/* 1. DİNAMİK ARKA PLAN */}
      <div className="absolute inset-0 z-0 bg-black">
        {BACKGROUND_IMAGES.map((img, index) => (
          <div key={index} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url('${img}')` }} />
        ))}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[6px] z-0"></div>
      </div>

      {/* 2. ÜST MENÜ (NAVBAR) */}
      <nav className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-6 lg:px-12 py-5 bg-black/40 backdrop-blur-md border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => {setShowApply(false); setShowRules(false); setShowCheck(false);}}>
          <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <span className="text-white font-black tracking-widest uppercase text-sm md:text-base drop-shadow-md hidden sm:block">
            Los Santos <span className="text-red-500">Medical Service</span>
          </span>
        </div>

        <ul className="flex items-center gap-6 md:gap-10 text-[11px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest">
          <li onClick={() => {setShowApply(false); setShowRules(false); setShowCheck(false);}} className={`relative cursor-pointer transition-colors hover:text-white ${!showApply && !showRules && !showCheck ? 'text-white' : ''}`}>
            Ana Sayfa
            {!showApply && !showRules && !showCheck && <span className="absolute -bottom-6 left-0 w-full h-[3px] bg-red-600 rounded-t-md shadow-[0_-3px_10px_rgba(220,38,38,0.8)]"></span>}
          </li>
          
          <li onClick={() => {setShowRules(true); setShowApply(false); setShowCheck(false);}} className={`relative cursor-pointer transition-colors hover:text-white ${showRules ? 'text-white' : ''}`}>
            Kurallar
            {showRules && <span className="absolute -bottom-6 left-0 w-full h-[3px] bg-red-600 rounded-t-md shadow-[0_-3px_10px_rgba(220,38,38,0.8)]"></span>}
          </li>
          
          <li onClick={() => {setShowCheck(true); setShowApply(false); setShowRules(false);}} className={`relative cursor-pointer transition-colors hover:text-white ${showCheck ? 'text-yellow-500' : ''}`}>
            Sorgula
            {showCheck && <span className="absolute -bottom-6 left-0 w-full h-[3px] bg-yellow-500 rounded-t-md shadow-[0_-3px_10px_rgba(234,179,8,0.8)]"></span>}
          </li>

          <li onClick={() => {setShowApply(true); setShowRules(false); setShowCheck(false);}} className={`relative cursor-pointer transition-colors hover:text-white ${showApply ? 'text-red-500' : 'text-red-600'}`}>
            Başvuru Yap
            {showApply && <span className="absolute -bottom-6 left-0 w-full h-[3px] bg-red-600 rounded-t-md shadow-[0_-3px_10px_rgba(220,38,38,0.8)]"></span>}
          </li>
        </ul>
      </nav>

      {/* 3. ANA İÇERİK KONTEYNERİ */}
      <div className="relative z-10 w-full max-w-7xl px-4 pt-24 pb-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 flex-1">
        
        {/* SOL KISIM */}
        <div className="hidden lg:flex flex-1 flex-col items-start text-left drop-shadow-2xl">
          <h1 className="text-5xl xl:text-7xl font-black tracking-tighter text-white uppercase leading-none">
            Los Santos
            <span className="block text-red-600 mt-2">Medical Service</span>
          </h1>
          <p className="text-zinc-400 mt-6 text-lg max-w-lg tracking-wide border-l-4 border-red-600 pl-4">
            Merkezi Sağlık Otomasyon Ağı kamu portalına hoş geldiniz. Sistem üzerinden rapor sorgulayabilir veya başvuruda bulunabilirsiniz.
          </p>

          <a href="https://discord.gg/bxbFSJzvkR" target="_blank" rel="noopener noreferrer" className="mt-8 px-8 py-4 bg-[#f04747] hover:bg-[#d84040] text-white font-black tracking-widest text-sm rounded transition-all shadow-[0_0_20px_rgba(240,71,71,0.4)] flex items-center gap-2">
            <span>+</span> ARAMIZA KATIL (DISCORD)
          </a>
        </div>

        {/* SAĞ KISIM: PANELLER */}
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          
          {/* KURALLAR EKRANI */}
          {showRules && (
            <div className="bg-[#0f0f11]/90 backdrop-blur-2xl border-t-4 border-t-red-600 rounded-xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-x-white/5 border-b-white/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-wider border-l-4 border-red-600 pl-3">LSMS Kuralları</h2>
                <button onClick={() => setShowRules(false)} className="text-zinc-500 hover:text-white text-sm font-bold">KAPAT</button>
              </div>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar text-sm text-zinc-300 font-medium">
                <p><strong className="text-red-500">1.</strong> Hiyerarşiye kesinlikle uyulmalıdır. Üst rütbelilere saygısızlık tolere edilmez.</p>
                <p><strong className="text-red-500">2.</strong> Nöbet sırasında hastane dışına izinsiz çıkmak yasaktır.</p>
                <p><strong className="text-red-500">3.</strong> Telsiz (Radio) kanalları sadece operasyonel iletişim için kullanılmalıdır.</p>
                <p><strong className="text-red-500">4.</strong> Hastalara ve sivillere karşı her zaman profesyonel bir dil kullanılmalıdır.</p>
                <p><strong className="text-red-500">5.</strong> Mesai saati doldurma zorunluluğunu yerine getirmeyen personelin ilişiği kesilir.</p>
                <p className="text-xs text-zinc-500 mt-4 italic border-t border-zinc-800 pt-4">* Kuralları ihlal eden personeller uyarı almadan sistemden uzaklaştırılabilir.</p>
              </div>
            </div>
          )}

          {/* SORGULA EKRANI */}
          {showCheck && (
            <div className="bg-[#0f0f11]/90 backdrop-blur-2xl border-t-4 border-t-yellow-500 rounded-xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-x-white/5 border-b-white/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3">Başvuru Sorgulama</h2>
                <button onClick={() => setShowCheck(false)} className="text-zinc-500 hover:text-white text-sm font-bold">KAPAT</button>
              </div>
              
              <form onSubmit={handleCheck} className="space-y-4">
                <input type="text" value={checkId} onChange={(e) => setCheckId(e.target.value.toUpperCase())} className="w-full p-4 bg-black/50 border border-zinc-800 rounded-lg text-white focus:border-yellow-500 outline-none uppercase font-mono placeholder:text-zinc-700" placeholder="ÖRN: LSMS-8F2A" required />
                <button type="submit" disabled={isChecking} className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                  {isChecking ? "SORGULANIYOR..." : "DURUMU SORGULA"}
                </button>
              </form>

              {checkResult && (
                <div className="mt-6 p-6 border border-zinc-800 rounded-lg bg-black/40 animate-in fade-in zoom-in duration-300">
                  <p className="text-zinc-400 text-sm uppercase tracking-widest mb-1">Aday Kimliği</p>
                  <p className="text-white font-bold text-lg mb-4">{checkResult.icIsim}</p>
                  <p className="text-zinc-400 text-sm uppercase tracking-widest mb-1">Başvuru Durumu</p>
                  <div className="mt-2">
                    {checkResult.status === 'bekliyor' && <span className="px-4 py-2 bg-yellow-500/20 text-yellow-500 font-black rounded border border-yellow-500/50">⏳ İNCELEMEDE</span>}
                    {checkResult.status === 'onaylandi' && <span className="px-4 py-2 bg-green-500/20 text-green-500 font-black rounded border border-green-500/50">✅ ONAYLANDI</span>}
                    {checkResult.status === 'reddedildi' && <span className="px-4 py-2 bg-red-500/20 text-red-500 font-black rounded border border-red-500/50">❌ REDDEDİLDİ</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GİRİŞ VE BAŞVURU EKRANLARI */}
          {!showRules && !showCheck && (
            <div className="bg-[#0f0f11]/90 backdrop-blur-2xl border-t-4 border-t-red-600 rounded-xl p-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-x-white/5 border-b-white/5 relative overflow-hidden">
              
              {!showApply ? (
                // --- LOGIN FORMU ---
                <div className="animate-in fade-in zoom-in duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Personel Portalı</h2>
                    <p className="text-red-500 text-xs font-bold tracking-widest mt-1 uppercase">Sisteme Giriş Yapın</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 ml-1 uppercase">İsim Soyisim</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-black/50 border border-zinc-800 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-700 font-medium" placeholder="Örn: John Doe" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 ml-1 uppercase">Şifre (Key)</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-black/50 border border-zinc-800 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-700 font-medium" placeholder="Gizli Anahtarınız" required />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                      {isLoading ? "Bağlanıyor..." : "Sisteme Giriş Yap"}
                    </button>
                  </form>
                  <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-zinc-500 text-xs mb-3">Ekibe katılmak mı istiyorsun?</p>
                    <button onClick={() => setShowApply(true)} className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold uppercase text-xs tracking-widest rounded-lg transition-colors border border-zinc-800 hover:border-zinc-700">Personel Başvuru Formu</button>
                  </div>
                </div>

              ) : (
                // --- BAŞVURU FORMU ---
                <div className="animate-in fade-in slide-in-from-right duration-300">
                  <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider border-l-4 border-red-600 pl-3">İş Başvurusu</h2>
                  </div>
                  <form onSubmit={handleApply} className="space-y-4 max-h-[55vh] overflow-y-auto pr-3 custom-scrollbar">
                    <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-widest pt-1">IC Bilgiler</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input className="p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" placeholder="İsim Soyisim" required value={appForm.icIsim} onChange={e => setAppForm({...appForm, icIsim: e.target.value})} />
                      <input type="number" className="p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" placeholder="Yaş" required value={appForm.icYas} onChange={e => setAppForm({...appForm, icYas: e.target.value})} />
                    </div>
                    <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-widest pt-3 border-t border-zinc-800">OOC Bilgiler</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" className="p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" placeholder="OOC Yaş" required value={appForm.oocYas} onChange={e => setAppForm({...appForm, oocYas: e.target.value})} />
                      <input type="number" className="p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" placeholder="Legal Saat" required value={appForm.legalSaat} onChange={e => setAppForm({...appForm, legalSaat: e.target.value})} />
                    </div>
                    <textarea className="w-full p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none h-16 resize-none" placeholder="Daha Önce EMS/Legal Rol Yaptın Mı?" required value={appForm.deneyim} onChange={e => setAppForm({...appForm, deneyim: e.target.value})} />
                    <input className="w-full p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" placeholder="EMS Rütben Neydi? (Yoksa 'Yok')" required value={appForm.emsRutbe} onChange={e => setAppForm({...appForm, emsRutbe: e.target.value})} />
                    <input className="w-full p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" placeholder="Günlük Aktiflik (Örn: 5 Saat)" required value={appForm.gunlukAktiflik} onChange={e => setAppForm({...appForm, gunlukAktiflik: e.target.value})} />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase ml-1">Prime Saat (21-00)</label>
                        <select className="w-full p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" value={appForm.primeSaat} onChange={e => setAppForm({...appForm, primeSaat: e.target.value})}><option>Evet</option><option>Hayır</option><option>Bazen</option></select>
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase ml-1">Hiyerarşi Kabulü</label>
                        <select className="w-full p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" value={appForm.hiyerarsi} onChange={e => setAppForm({...appForm, hiyerarsi: e.target.value})}><option>Evet</option><option>Hayır</option></select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase ml-1">Acil mesai / 3-4 Saat Şartı</label>
                      <select className="w-full p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none" value={appForm.mesaiKabul} onChange={e => setAppForm({...appForm, mesaiKabul: e.target.value})}><option>Kabul Ediyorum</option><option>Kabul Etmiyorum</option></select>
                    </div>
                    <textarea className="w-full p-3 bg-black/50 border border-zinc-800 rounded-lg text-white text-sm focus:border-red-500 outline-none h-20 resize-none" placeholder="Neden EMS olmak istiyorsun?" required value={appForm.nedenEms} onChange={e => setAppForm({...appForm, nedenEms: e.target.value})} />
                    
                    <button type="submit" disabled={isAppLoading} className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(220,38,38,0.3)] mt-2">
                      {isAppLoading ? "GÖNDERİLİYOR..." : "BAŞVURUYU GÖNDER"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(220, 38, 38, 0.7); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(220, 38, 38, 1); }
      `}} />
    </main>
  );
}