import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Personel from '@/models/Personel';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, password, role } = await req.json();

    const yeniPersonel = new Personel({ name, password, role: role || 'personnel' });
    await yeniPersonel.save();

    return NextResponse.json({ message: "Personel başarıyla eklendi!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Personel eklenemedi." }, { status: 500 });
  }
}