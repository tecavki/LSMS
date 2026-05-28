import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Personnel from '@/app/models/Personnel';

// Personelleri Listele
export async function GET() {
  try {
    await connectDB();
    // .lean() ile veriyi ham ve eksiksiz çekiyoruz
    const personnel = await Personnel.find().sort({ isDutyActive: -1, name: 1 }).lean();
    return NextResponse.json({ success: true, data: personnel });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Admin Tarafından Mesai Başlat / Bitir
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, action } = await req.json();

    const person = await Personnel.findById(id).lean();
    if (!person) throw new Error("Personel bulunamadı.");

    const personData: any = person;

    if (action === 'start') {
      await Personnel.findByIdAndUpdate(id, 
        { $set: { isDutyActive: true, dutyStartTime: new Date() } },
        { strict: false } // Zorla yazdır
      );
    } else if (action === 'stop') {
      let extraMins = 0;
      if (personData.isDutyActive && personData.dutyStartTime) {
        const diffMs = new Date().getTime() - new Date(personData.dutyStartTime).getTime();
        extraMins = Math.floor(diffMs / 60000);
        if (extraMins < 0) extraMins = 0;
      }
      await Personnel.findByIdAndUpdate(id, 
        { $set: { isDutyActive: false, dutyStartTime: null, totalDutyMinutes: (personData.totalDutyMinutes || 0) + extraMins } },
        { strict: false }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}