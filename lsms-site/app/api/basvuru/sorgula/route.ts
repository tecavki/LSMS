import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Application from '../../../models/Application';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { basvuruId } = body;

    // 1. Gelen ID boş mu kontrolü
    if (!basvuruId) {
      return NextResponse.json({ error: "Lütfen bir takip numarası girin." }, { status: 400 });
    }

    // 2. Veritabanında ara
    const basvuru = await Application.findOne({ basvuruId: basvuruId });

    // 3. Bulunamazsa hata dön
    if (!basvuru) {
      return NextResponse.json({ error: "Bu takip numarasına ait bir başvuru bulunamadı." }, { status: 404 });
    }

    // 4. Bulunursa isim ve durumu gönder
    return NextResponse.json({ icIsim: basvuru.icIsim, status: basvuru.status }, { status: 200 });

  } catch (error: any) {
    console.error("SORGULA API HATASI:", error);
    return NextResponse.json({ error: "Sunucu ile iletişim kurulamadı." }, { status: 500 });
  }
}