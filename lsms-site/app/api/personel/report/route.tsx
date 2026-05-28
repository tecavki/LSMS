import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Report from '@/app/models/Report';
import Log from '@/app/models/Log';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { patientName, injuryType, treatment, status, discordId } = body;

    // 1. Raporu veritabanına kaydet
    const newReport = await Report.create({
      discordId: discordId || "123456789",
      patientName,
      injuryType, // Modelinizde yoksa otomatik ekler, esnektir
      details: injuryType, // Detay kısmına türü de iliştirelim
      treatment,
      status,
      date: new Date()
    });

    // 2. Admin paneli için otomatik log üret
    await Log.create({
      type: 'REPORT',
      message: `Yeni Vaka Raporu! Hasta: ${patientName} - Müdahale Durumu: [${status}]`,
      discordId: discordId || 'Personel',
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (err: any) {
    console.error("Vaka Kayıt API Hatası:", err);
    return NextResponse.json({ error: "Rapor veritabanına yazılamadı." }, { status: 500 });
  }
}