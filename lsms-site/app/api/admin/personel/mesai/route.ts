import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Personnel from '@/app/models/Personnel';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { discordId } = await req.json();
    
    if (!discordId) return NextResponse.json({ success: false, error: 'ID gerekli.' }, { status: 400 });

    // .lean() KRİTİKTİR! Mongoose'un saati gizlemesini engeller, ham veriyi çeker.
    const person = await Personnel.findOne({ discordId: String(discordId) }).lean();
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

    const person = await Personnel.findOne({ discordId: String(discordId) }).lean();
    if (!person) throw new Error("Personel bulunamadı.");

    if (action === 'start') {
      await Personnel.updateOne(
        { discordId: String(discordId) },
        { $set: { isDutyActive: true, dutyStartTime: new Date() } },
        { strict: false } 
      );
    } else if (action === 'stop') {
      let extraMins = 0;
      // TS Hatasını önlemek için any tipine çeviriyoruz
      const personData: any = person; 
      if (personData.isDutyActive && personData.dutyStartTime) {
        const diffMs = new Date().getTime() - new Date(personData.dutyStartTime).getTime();
        extraMins = Math.floor(diffMs / 60000);
        if (extraMins < 0) extraMins = 0;
      }
      await Personnel.updateOne(
        { discordId: String(discordId) },
        { $set: { isDutyActive: false, dutyStartTime: null, totalDutyMinutes: (personData.totalDutyMinutes || 0) + extraMins } },
        { strict: false }
      );
    }

    // Güncellenmiş veriyi tekrar lean() ile alıp gönderiyoruz
    const updatedPerson = await Personnel.findOne({ discordId: String(discordId) }).lean();
    return NextResponse.json({ success: true, data: updatedPerson });
  } catch (err: any) {
    return NextResponse.json({ success: false