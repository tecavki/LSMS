'use client';
import { useState } from 'react';

export default function PersonelMesaiTerminal() {
  const [discordId, setDiscordId] = useState('');
  const [personData, setPersonData] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/personel/mesai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId })
      });
      const result = await res.json();
      if (res.ok) setPersonData(result.data);
      else setStatusMsg({ type: 'error', text: '🔴 HATA: ' + result.error });
    } catch (err) {
      setStatusMsg({ type: 'error', text: '🔴 BAĞLANTI HATASI' });
    }
  };

  const toggleDuty = async (action: 'start' | 'stop') => {
    try {
      const res = await fetch('/api/personel/mesai', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId: personData.discordId, action })
      });
      const result = await res.json();
      if (res.ok) setPersonData(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '--:--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 font-sans flex flex-col items-center pt-12 pb-20">
      
      {/* BAŞLIK */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-widest flex items-center justify-center gap-3">
          <span className="text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">📟</span> DUTY TERMİNALİ
        </h1>
        <p className="text-zinc-500 text-xs font-bold tracking-widest mt-2 uppercase">LSMS Personel Kart Basma Sistemi</p>
      </div>

      <div className="w-full max-w-md bg-[#0a0a0c] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative">
        
        {!personData ? (
          <div className="p-8">
            <h2 className="text-zinc-300 font-bold mb-6 text-sm tracking-widest uppercase border-b border-zinc-800 pb-3">KİMLİK DOĞRULAMA (MD-LOGIN)</h2>
            {statusMsg.text && <div className="mb-4 bg-rose-900/20 border border-rose-500/50 p-3 rounded text-rose-500 text-xs font-bold">{statusMsg.text}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-500 font-black tracking-widest uppercase mb-2">Discord ID</label>
                <input required className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-4 rounded-xl outline-none focus:border-violet-500 transition-all font-mono text-sm" placeholder="ID'nizi Girin" value={discordId} onChange={e => setDiscordId(e.target.value)} />
              </div>
              <button className="w-full bg-zinc-800 hover:bg-violet-600 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all">SİSTEME GİRİŞ YAP</button>
            </form>
          </div>
        ) : (
          
          <div className="p-8 flex flex-col items-center">
            {/* MESAİ EKRANI YORUM SATIRI İÇERİ ALINDI */}
            <button onClick={() => setPersonData(null)} className="absolute top-4 right-4 text-zinc-600 hover:text-white text-[10px] font-black tracking-widest uppercase transition-all bg-zinc-900 px-3 py-1 rounded">ÇIKIŞ YAP ✕</button>

            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 border-2 transition-all ${personData.isDutyActive ? 'bg-violet-900/20 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse' : 'bg-zinc-900 border-zinc-800'}`}>
               {personData.isDutyActive ? '🩺' : '💤'}
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase tracking-wider text-center">{personData.name}</h2>
            <div className="bg-zinc-900 px-3 py-1 rounded mt-2 text-xs font-mono text-zinc-500 border border-zinc-800">{personData.rank}</div>

            <div className="w-full mt-8 space-y-4">
              
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center">
                <span className="text-[10px] font-black tracking-widest uppercase mb-3 block text-zinc-500">Mevcut Mesai Durumu</span>
                
                {personData.isDutyActive ? (
                  <div>
                    <div className="text-violet-400 font-black text-xl tracking-widest mb-1">🟢 AKTİF (ON DUTY)</div>
                    <div className="text-zinc-400 text-xs mt-2 font-mono bg-zinc-900 py-2 rounded border border-zinc-800">
                      GİRİŞ SAATİ: <span className="text-white font-bold">{formatTime(personData.dutyStartTime)}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-zinc-600 font-black text-xl tracking-widest mb-1">🔴 PASİF (OFF DUTY)</div>
                    <div className="text-zinc-500 text-xs mt-2 font-mono bg-zinc-900/50 py-2 rounded border border-zinc-800/50">
                      GİRİŞ BEKLENİYOR...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Toplam Kariyer Mesaisi</span>
                <span className="text-sm font-black text-zinc-300 font-mono">{personData.totalDutyMinutes || 0} DK</span>
              </div>

              <div className="pt-4">
                {personData.isDutyActive ? (
                  <button onClick={() => toggleDuty('stop')} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-5 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                     💳 KART BAS VE ÇIK (DUTY OFF)
                  </button>
                ) : (
                  <button onClick={() => toggleDuty('start')} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-5 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                     💳 KART BAS VE GİRİŞ YAP (DUTY ON)
                  </button>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}