import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import Personel from '../../models/Personel'; // Buranın doğru olduğundan emin ol!

export async function GET() {
  try {
    await connectDB();
    
    // Hata buradaysa, Personel modeli doğru import edilmemiştir
    const list = await Personel.find({}); 
    
    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}