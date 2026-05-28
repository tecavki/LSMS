import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Personel from '../../../models/Personel';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();
    
    const personel = await Personel.findById(id);
    if (!personel) return NextResponse.json({ message: "Bulunamadı" }, { status: 404 });

    // Aktifse pasif yap, pasifse aktif yap
    personel.status = personel.status === 'aktif' ? 'pasif' : 'aktif';
    await personel.save();

    return NextResponse.json({ status: personel.status }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Hata" }, { status: 500 });
  }
}