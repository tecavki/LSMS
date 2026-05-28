import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import Basvuru from '@/models/Basvuru';
import Personel from '@/models/Personel';
import { logAction } from '@/lib/logger'; // Loglama kütüphanemizi import ettik

export async function POST(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    // 1. Başvuruyu bul
    const basvuru = await Basvuru.findById(id);
    if (!basvuru) return NextResponse.json({ message: "Başvuru bulunamadı" }, { status: 404 });

    // 2. Yeni Personel oluştur
    const yeniPersonel = new Personel({
      name: basvuru.icIsim,
      rank: 'Stajyer', // Otomatik başlangıç rütbesi
      code: Math.floor(1000 + Math.random() * 9000).toString(), // Otomatik kod üretimi
      role: 'personnel',
      status: 'pasif'
    });

    await yeniPersonel.save();

    // 3. Başvuruyu "onaylandi" olarak işaretle
    basvuru.durum = 'onaylandi';
    await basvuru.save();

    // ADIM 2: İŞLEMİ LOGLA
    // Bu satır sayesinde "Sistem Hareketleri" ekranında bu onayı görebileceksin.
    await logAction("Başhekim", "Başvuru Onaylandı", basvuru.icIsim);

    return NextResponse.json({ 
      message: "Personel başarıyla atandı!", 
      code: yeniPersonel.code 
    }, { status: 200 });

  } catch (error) {
    console.error("Onaylama hatası:", error);
    return NextResponse.json({ message: "İşlem hatası" }, { status: 500 });
  }
}