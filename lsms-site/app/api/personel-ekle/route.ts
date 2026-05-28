// app/api/personel-ekle/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import Personnel from '@/models/Personnel';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const yeniPersonel = await Personnel.create(body);
    return NextResponse.json({ message: "Başarıyla eklendi", data: yeniPersonel }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Kayıt sırasında hata oluştu" }, { status: 500 });
  }
}