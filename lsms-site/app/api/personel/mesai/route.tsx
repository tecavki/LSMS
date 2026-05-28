import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Personnel from '@/app/models/Personnel';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { discordId } = await req.json();
    
    if (!discordId) return NextResponse.json({ success: false, error: 'ID gerekli.' }, { status: 400 });

    const person = await Personnel.findOne({ discordId: String(discordId) });
    if (!person) {
      return NextResponse.json({ success: false, error: 'Bu ID ile eşleşen personel bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: person });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { discordId, action } = await req.json();

    const person = await Personnel.findOne({ discordId: String(discordId) });
    if (!person) throw new Error("Personel bulunamadı.");

    if (action === 'start') {
      // strict: false komutu, şema kurallarını ezip geçerek veriyi ZORLA yazar!
      await Personnel.updateOne(
        { discordId: String(discordId) },
        { $set: { isDutyActive: true, dutyStartTime: new Date() } },
        { strict: false } 
      );
    } else if (action === 'stop') {
      let extraMins = 0;
      if (person.isDutyActive && person.dutyStartTime) {
        const diffMs = new Date().getTime() - new Date(person.dutyStartTime).getTime();
        extraMins = Math.floor(diffMs / 60000);
      }
      await Personnel.updateOne(
        { discordId: String(discordId) },
        { $set: { isDutyActive: false, dutyStartTime: null, totalDutyMinutes: (person.totalDutyMinutes || 0) + extraMins } },
        { strict: false }
      );
    }

    // Zorla güncellenmiş tertemiz veriyi tekrar çekip ön yüze yolluyoruz
    const updatedPerson = await Personnel.findOne({ discordId: String(discordId) });
    return NextResponse.json({ success: true, data: updatedPerson });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}