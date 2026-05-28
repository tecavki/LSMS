import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Personel from '@/models/Personel';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { code } = await request.json();
    
    const personel = await Personel.findOne({ code });
    if (!personel) return NextResponse.json({ message: "Bulunamadı" }, { status: 404 });

    return NextResponse.json(personel, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Hata" }, { status: 500 });
  }
}