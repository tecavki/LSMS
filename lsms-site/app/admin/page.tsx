'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('Başhekim');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    personel: 0,
    vakalar: 0,
    bekleyenBasvuru: 0
  });

  useEffect(() => {
    // 1. GÜVENLİK VE OTURUM KONTROLÜ
    const role = localStorage.getItem('lsms_role');
    const name = localStorage.getItem('lsms_name');
    
    if (role !== 'admin') {
      router.push('/'); // Admin değilse ana sayfaya at
      return;
    }
    if (name) setAdminName(name);

    // 2. VERİTABANINDAN CANLI İSTATİSTİKLERİ ÇEKME
    const fetchStats = async () => {
      try {
        const [basvuruRes, vakaRes, personelRes] = await Promise.all([
          fetch('/api/admin/basvuru').catch(() => ({ ok: false })),
          fetch('/api/vaka').catch(() => ({ ok: false })),
          fetch('/api/personel').catch(() => ({ ok: false }))
        ]);

        const basvurular = basvuruRes.ok ? await basvuruRes.json() : [];
        const vakalar = vakaRes.ok ? await vakaRes.json() : [];
        const personeller = personelRes.ok ? await personelRes.json() : [];

        setStats({
          personel: personeller.length || 24, // Veri yoksa şimdilik 24 göster
          vakalar: vakalar.length || 0,
          bekleyenBasvuru: basvurular.filter((b: any) => b.status === 'bekliyor').length || 0
        });
      } catch (error) {
        console.error("İstatistikler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="space-y-8 animate-fade-in p-6">
      
      {/* Üst Karşılama Kısmı */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            LSMS Kontrol Paneli
          </h1>
          <p className="text-gray-400">
            Hoş geldin, <span className="text-red-500 font-bold">{adminName}</span>. Los Santos Medical Service yönetim sistemine hoş geldiniz.
          </p>
        </div>
        <button 
          onClick={() => {
            localStorage.clear();
            router.push('/');
          }} 
          className="px-6 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
        >
          Sistemden Çık
        </button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Aktif Personel" value={loading ? '...' : stats.personel} link="/admin/personel" />
        <StatCard title="Toplam Vakalar" value={loading ? '...' : stats.vakalar} link="/admin/arsiv" />
        <StatCard title="Bekleyen Başvurular" value={loading ? '...' : stats.bekleyenBasvuru} link="/admin/basvurular" isAlert />
      </div>

      {/* Hızlı İşlemler Menüsü */}
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/personel-ekle" className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl text-center font-medium transition-colors shadow-lg shadow-red-900/20">
            ➕ Yeni Personel Ekle
          </Link>
          <ActionLink href="/admin/vaka-ekle" label="📝 Vaka Raporu Yaz" />
          <ActionLink href="#" label="🚑 Araç Durumları" />
          <ActionLink href="#" label="⚙️ Sistem Ayarları" />
        </div>
      </div>
      
    </div>
  );
}

// Yardımcı Kart Bileşeni
function StatCard({ title, value, link, isAlert = false }: { title: string, value: any, link: string, isAlert?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl flex flex-col justify-between border ${isAlert ? 'border-red-500/30' : 'border-white/10'} bg-white/[0.02] hover:scale-105 transition-transform duration-300`}>
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className={`text-4xl font-bold mt-2 ${isAlert ? 'text-red-500' : 'text-white'}`}>{value}</h3>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <Link href={link} className="text-red-400 text-sm hover:text-red-300">
          Detayları Gör →
        </Link>
      </div>
    </div>
  );
}

// Yardımcı Buton Bileşeni
function ActionLink({ href, label }: { href: string, label: string }) {
  return (
    <Link href={href} className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl text-center font-medium transition-all border border-white/5">
      {label}
    </Link>
  );
}