import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Application from '../../../models/Application';

export const dynamic = 'force-dynamic'; // Her zaman güncel veriyi çekmesi için

// Başvuruları Listeleme (GET)
export async function GET() {
  try {
    await connectDB();
    // En yeni başvurular en üstte gelecek şekilde sıralıyoruz
    const basvurular = await Application.find({}).sort({ createdAt: -1 });
    return NextResponse.json(basvurular, { status: 200 });
  } catch (error) {
    console.error("Admin API Hatası:", error);
    return NextResponse.json({ error: "Veri çekilemedi" }, { status: 500 });
  }
}

// Başvuru Onay/Red Güncelleme (PATCH)
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Eksik bilgi gönderildi." }, { status: 400 });
    }

    await Application.findByIdAndUpdate(id, { status: status });
    return NextResponse.json({ message: "Durum başarıyla güncellendi!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}