import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb'; 
import Duty from '@/app/models/Duty';

export async function POST(req: Request) {
  try {
    const { discordId, action } = await req.json();
    await connectDB();

    if (action === 'start') {
      const newDuty = await Duty.create({ discordId, startTime: new Date() });
      return NextResponse.json({ success: true, data: newDuty });
    } else {
      const duty = await Duty.findOne({ discordId, endTime: null }).sort({ startTime: -1 });
      if (duty) {
        duty.endTime = new Date();
        duty.durationInSeconds = Math.floor((duty.endTime.getTime() - duty.startTime.getTime()) / 1000);
        await duty.save();
        return NextResponse.json({ success: true, data: duty });
      }
    }
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 400 });
  } catch (err) {
    console.error("API Hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}