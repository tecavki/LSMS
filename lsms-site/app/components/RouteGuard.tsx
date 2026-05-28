'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Sadece tarayıcıda çalışması için basit bir kontrol
    const role = localStorage.getItem('lsms_role');
    if (role !== 'admin') {
      router.push('/');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return <div className="p-8 text-white">Güvenlik kontrolü yapılıyor...</div>;
  }

  return <>{children}</>;
}