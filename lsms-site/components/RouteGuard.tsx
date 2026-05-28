'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Sadece /admin ile başlayan sayfaları kilit altına al
    if (pathname.startsWith('/admin')) {
      const role = localStorage.getItem('lsms_role');
      
      if (role !== 'admin') {
        alert("Erişim yetkiniz yok, ana sayfaya yönlendiriliyorsunuz.");
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    } else {
      // Admin dışı sayfalar (ana sayfa, profil vb.) serbest
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // Henüz kontrol aşamasındaysa veya admin değilse beyaz ekran yerine boş bir şey dön
  if (!isAuthorized && pathname.startsWith('/admin')) {
    return null; 
  }

  return <>{children}</>;
}