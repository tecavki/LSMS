// app/api/admin/personel/toggle-duty/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Personnel from '@/app/models/Personnel';

// Tüm personelleri ve mesai durumlarını admin paneline çeken fonksiyon
export async function GET() {
  try {
    await connectDB();
    const staff = await Personnel.find({});
    return NextResponse.json({ success: true, staff });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Adminin seçtiği personelin mesaisini uzaktan açıp kapatan fonksiyon
export async function POST(req: Request) {
  try {
    await connectDB();
    const { discordId, action } = await req.json();
    const person = await Personnel.findOne({ discordId });
    
    if (!person) {
      return NextResponse.json({ success: false, error: 'Personel veritabanında bulunamadı.' }, { status: 404 });
    }

    person.onDuty = (action === 'start');
    await person.save();
    return NextResponse.json({ success: true, onDuty: person.onDuty });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}