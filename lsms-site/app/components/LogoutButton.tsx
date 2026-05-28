'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Yetki verisini temizle
    localStorage.removeItem('lsms_role');
    
    // 2. Giriş sayfasına yönlendir
    router.push('/');
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors"
    >
      Çıkış Yap
    </button>
  );
}