import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import Nobet from '../../models/Nobet';

// NÖBETİ BAŞLAT/BİTİR (POST)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { personelName, action } = await req.json();

    if (action === 'start') {
      const yeniNobet = new Nobet({ personelName, isActive: true });
      await yeniNobet.save();
      return NextResponse.json({ message: "Nöbet Başladı" }, { status: 200 });
    } 
    
    else if (action === 'end') {
      await Nobet.findOneAndUpdate(
        { personelName, isActive: true }, 
        { isActive: false, endTime: new Date() }
      );
      return NextResponse.json({ message: "Nöbet Bitti" }, { status: 200 });
    }
    
    return NextResponse.json({ message: "Geçersiz işlem" }, { status: 400 });

  } catch (error) {
    console.error("İşlem hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}

// NÖBETİ ÇEKME (GET)
export async function GET() {
  try {
    await connectDB();
    const aktifler = await Nobet.find({ isActive: true });
    return NextResponse.json(aktifler, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Veri çekilemedi" }, { status: 500 });
  }
}