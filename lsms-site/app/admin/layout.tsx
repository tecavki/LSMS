'use client'; 
import Link from 'next/link';
// 🚀 1. useRouter'ı sayfalar arası yönlendirme yapabilmek için ekledik
import { usePathname, useRouter } from 'next/navigation'; 

// 🚀 YOL HATASI ÇÖZÜLDÜ: app/admin içinden components'e gitmek için sadece ../../ yeterlidir!
import RouteGuard from '../components/RouteGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter(); // 🚀 2. Router'ı tanımladık

  const menuItems = [
    { name: 'Ana Panel', path: '/admin', icon: '📊' },
    { name: 'Personeller', path: '/admin/personel', icon: '👨‍⚕️' },
    { name: 'Personel Ekle', path: '/admin/personel-ekle', icon: '➕' },
    { name: 'Vaka Arşivi', path: '/admin/vaka-arsiv', icon: '🚑' },
    { name: 'Yeni Vaka', path: '/admin/vaka-ekle', icon: '📝' },
  ];

  // 🚀 3. ÇIKIŞ YAPMA FONKSİYONU
  const handleLogout = () => {
    // Tarayıcıdaki oturum iznini tamamen sil (RouteGuard artık izin vermeyecek)
    localStorage.clear();
    sessionStorage.clear();
    
    // Kullanıcıyı ana sayfaya (giriş ekranına) yönlendir
    router.push('/');
  };

  return (
    // Admin paneline giren herkes önce RouteGuard güvenlik kontrolünden geçer
    <RouteGuard>
      <div className="flex h-screen overflow-hidden bg-[#050505] text-white antialiased">
        
        {/* Sol Yan Menü (Sidebar) */}
        <aside className="w-64 glass-card border-r border-white/5 flex flex-col z-10">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-3xl font-black text-gradient tracking-wider">LSMS</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Yönetim Paneli</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            {/* 🚀 4. Link yerine onClick ile çalışan buton kullandık */}
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Sistemden Çık</span>
            </button>
          </div>
        </aside>

        {/* Ana İçerik */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-red-900/10 blur-[120px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
          {children}
        </main>

      </div>
    </RouteGuard>
  );
}