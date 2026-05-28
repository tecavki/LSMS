import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb'; // 🚀 BURASI DÜZELTİLDİ
import Application from '../../../models/Application';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Benzersiz ve havalı bir ID oluştur (Örn: LSMS-X7B2)
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const takipId = `LSMS-${randomStr}`;

    const newApp = new Application({ ...body, basvuruId: takipId });
    await newApp.save();

    return NextResponse.json({ message: "Başarılı", basvuruId: takipId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}