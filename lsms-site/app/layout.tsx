import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LSMS Portal',
  description: 'Los Santos Medical Service Personel Yönetim Sistemi',
};

import RouteGuard from '../components/RouteGuard';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-black text-white antialiased">
        {/* Sadece çocuk bileşenleri çağırıyoruz, RouteGuard admin tarafında olacak */}
        {children}
      </body>
    </html>
  );
}