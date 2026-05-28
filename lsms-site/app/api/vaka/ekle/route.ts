import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb'; 
import Vaka from '../../../models/Vaka'; // Model ismini doğru yazdığından emin ol

export async function GET() {
  try {
    await connectDB();
    const vakalar = await Vaka.find().sort({ createdAt: -1 }); // En yeniler başta
    
    // Her zaman JSON dön
    return NextResponse.json(vakalar, { status: 200 });
  } catch (error) {
    console.error("API Hatası:", error);
    // Hata durumunda bile JSON dön ki frontend çökmesin
    return NextResponse.json({ message: "Vakalar yüklenemedi", error: true }, { status: 500 });
  }
}