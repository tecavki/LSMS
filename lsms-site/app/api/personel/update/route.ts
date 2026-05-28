import { NextResponse } from 'next/server';
// Yolları mutlaka dosya yapına göre kontrol et (../../ veya ../../..)
import { connectDB } from '../../lib/mongodb'; 
import Personel from '../../models/Personel';

export async function GET() {
  try {
    await connectDB();
    const veriler = await Personel.find({}); // Tüm personeli çek
    
    // Her durumda JSON döndür
    return NextResponse.json(veriler, { status: 200 });
  } catch (error) {
    // HATA DURUMUNDA BİLE JSON DÖN Kİ FRONTEND ÇÖKMESİN
    return NextResponse.json({ message: "Veritabanına bağlanılamadı", error: String(error) }, { status: 500 });
  }
}

// Fonksiyonun başladığı yer burası:
export async function POST(req: Request) {
  try {
    // 1. Veritabanına bağlan
    await connectDB();
    
    // 2. Gelen veriyi al
    const body = await req.json();
    
    // 3. Yeni personeli oluştur (Güvenlik için sadece izin verdiğimiz alanları alıyoruz)
    const yeniPersonel = new Personel({
      name: body.name,
      code: body.code,
      rank: body.rank
      // role ve status veritabanı tarafından varsayılan olarak (personnel, pasif) eklenecek
    });
    
    // 🚀 Asıl veritabanına yazma işlemini yapan komut
    await yeniPersonel.save();
    
    // 4. Başarılı yanıt
    return NextResponse.json({ message: "Personel başarıyla kaydedildi" }, { status: 201 });

  } catch (error: any) {
    // 5. Hata durumu
    console.error("Kayıt Hatası:", error);
    
    // 🚀 EĞER EKLENEN ROZET NUMARASI SİSTEMDE VARSA (MongoDB 11000 Hatası)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Bu rozet numarası zaten başka bir personelde kayıtlı!" }, { status: 400 });
    }
    
    return NextResponse.json({ message: "Personeller yüklenemedi", error: String(error) }, { status: 500 });
  }
} // Fonksiyonun bittiği yer burası.