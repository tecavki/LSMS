'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('lsms_role');
    if (role !== 'admin') {
      router.push('/'); // Admin değilse ana sayfaya gönder
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return <div className="p-10 text-white">Güvenlik kontrolü...</div>;

  return <>{children}</>;
}