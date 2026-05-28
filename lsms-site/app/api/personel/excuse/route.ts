import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Excuse from '@/app/models/Excuse';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Veri kontrolü
    if (!data.discordId || !data.name || !data.reason) {
      return NextResponse.json({ success: false, error: 'Lütfen tüm alanları doldurun!' }, { status: 400 });
    }

    // Veritabanına kayıt işlemi
    const newExcuse = await Excuse.create({
      discordId: String(data.discordId),
      name: String(data.name),
      reason: String(data.reason),
      status: 'Bekliyor'
    });

    return NextResponse.json({ success: true, data: newExcuse });
  } catch (err: any) {
    console.error("MAZERET EKLEME HATASI:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}