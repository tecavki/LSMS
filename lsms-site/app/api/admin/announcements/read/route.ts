import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Announcement from '@/app/models/Announcement';

export async function PATCH(req: Request) {
  try {
    const { announcementId, discordId } = await req.json();
    await connectDB();

    // Personel zaten okuduysa tekrar ekleme, okumadıysa listeye push et ($addToSet)
    const updated = await Announcement.findByIdAndUpdate(
      announcementId,
      { $addToSet: { readBy: discordId } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ error: "Okundu bilgisi işlenemedi" }, { status: 500 });
  }
}