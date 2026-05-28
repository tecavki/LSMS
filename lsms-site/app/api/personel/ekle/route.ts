import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Personel from '../../../models/Personel';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, rank, code, role } = body;

    // Veritabanına kaydet
    const yeniPersonel = new Personel({ name, rank, code, role });
    await yeniPersonel.save();

    return NextResponse.json({ message: "Personel başarıyla eklendi!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Kayıt başarısız." }, { status: 500 });
  }
}