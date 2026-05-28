// app/api/personel/delete/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Personel from '../../../models/Personel';
import { logAction } from '../../../lib/logger'; 

export async function POST(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    const personel = await Personel.findById(id);
    if (!personel) {
       return NextResponse.json({ message: "Personel bulunamadı" }, { status: 404 });
    }

    const isim = personel.name;
    await Personel.findByIdAndDelete(id);

    // Log at
    await logAction("Başhekim", "Personel Silindi", isim);

    return NextResponse.json({ message: "Silindi" });
  } catch (error) {
    console.error("SİLME HATASI:", error); // Terminale detaylı hata bas
    return NextResponse.json({ message: "İşlem hatası" }, { status: 500 });
  }
}