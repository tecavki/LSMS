// app/personel/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function PersonelPage() {
  // 🚨 BURAYI KONTROL ET: Admin panelinden eklediğin KENDİ Discord ID'ni buraya yazmalısın!
  const uid = "910937297267097650"; 

  const [anns, setAnns] = useState<any[]>([]);
  const [duty, setDuty] = useState(false);
  const [load, setLoad] = useState(true);
  const [form, setForm] = useState({ patientName: '', injuryType: '', treatment: '', status: 'Stabil' });

  useEffect(() => {
    fetch('/api/admin/announcements', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setAnns(d.filter((a: any) => !a.readBy?.includes(uid))); })
      .catch(console.error).finally(() => setLoad(false));
  }, []);

  const toggleDuty = async () => {
    try {
      const res = await fetch('/api/personel/duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId: uid, action: duty ? 'stop' : 'start' })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setDuty(data.onDuty);
        alert(data.onDuty ? "🟢 10-8: Aktif Mesai Başladı" : "🔴 10-10: Mesai Sonlandırıldı");
      } else { 
        // Hata durumunda sessiz kalmıyor, sebebi tam olarak ekrana fırlatıyor:
        alert(`🚨 SİSTEM HATASI GRUBU:\n\nDurum Kodu: ${res.status}\nHata Mesajı: ${data.error}`); 
      }
    } catch { 
      alert("🚨 BAĞLANTI HATASI:\nSunucu kapalı veya istek atılan API adresi (/api/personel/duty) bulunamadı!"); 
    }
  };

  const subReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/personel/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, discordId: uid })
      });
      if (res.ok) { alert("✅ Rapor Arşive Gönderildi!"); setForm({ patientName: '', injuryType: '', treatment: '', status: 'Stabil' }); }
    } catch { alert("Sunucu hatası!"); }
  };

  if (load) return <div className="min-h-screen bg-slate-950 text-cyan-400 flex items-center justify-center font-mono text-xs">YÜKLENİYOR...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 font-sans text-xs antialiased">
      <div className="max-w-xl mx-auto border border-slate-800 bg-slate-900/40 p-4 rounded-xl shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <div>
            <h1 className="text-base font-black text-cyan-400 tracking-wider">LSMS PANEL v2.0</h1>
            <p className="text-slate-500 text-[9px] font-mono">GÜVENLİ SİSTEM [ID: {uid}]</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={duty ? "text-emerald-400 font-bold" : "text-rose-500 font-bold"}>{duty ? "● MESAİDE" : "○ GÖREV DIŞI"}</span>
            <button onClick={toggleDuty} className="bg-cyan-500 text-slate-950 px-2 py-1 rounded font-bold hover:bg-cyan-400 transition-all">DEĞİŞTİR</button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-[10px] font-mono text-cyan-400 tracking-wider mb-2">// DUYURULAR</h2>
          <div className="space-y-2 max-h-32 overflow-y-auto bg-slate-950 p-2 rounded border border-slate-800">
            {anns.length === 0 ? <p className="text-slate-600 font-mono italic text-center text-[10px] py-2">YENİ DUYURU YOK</p> : anns.map((a: any) => (
              <div key={a._id || a.id} className="border-b border-slate-900 pb-1 last:border-0">
                <div className="text-cyan-500 font-bold font-mono">■ {a.title}</div>
                <p className="text-slate-400 text-[11px] leading-tight">{a.content}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-[10px] font-mono text-cyan-400 tracking-wider mb-2">// VAKA GİRİŞİ</h2>
        <form onSubmit={subReport} className="space-y-2">
          <input type="text" placeholder="Hasta Adı Soyadı" required value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200 outline-none" />
          <input type="text" placeholder="Yaralanma Türü" required value={form.injuryType} onChange={e => setForm({...form, injuryType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200 outline-none" />
          <textarea placeholder="Uygulanan Tedavi" required rows={2} value={form.treatment} onChange={e => setForm({...form, treatment: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-slate-200 resize-none outline-none" />
          <div className="flex gap-2">
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 rounded text-slate-200 flex-1 outline-none">
              <option value="Stabil">Stabil</option>
              <option value="Ex (Vefat)">Ex (Vefat)</option>
              <option value="Yoğun Bakım">Yoğun Bakım</option>
            </select>
            <button type="submit" className="bg-cyan-500 text-slate-950 font-black px-4 rounded-lg flex-1 hover:bg-cyan-400 transition-all">KAYDET</button>
          </div>
        </form>
      </div>
    </div>
  );
}