import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // 1. URL'den gelen 'code' parametresini yakala
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  // 2. Eğer kod geldiyse, giriş başarılı sayılır
  if (code) {
    // BURAYA GİRİŞİ DOĞRULAYAN MANTIK GELECEK
    
    // 3. Kullanıcıyı ana sayfaya (/) yönlendir
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Eğer bir hata varsa, ana sayfaya at veya hata mesajı ver
  return NextResponse.redirect(new URL('/', req.url));
}