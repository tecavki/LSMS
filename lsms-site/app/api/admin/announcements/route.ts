export const dynamic = 'force-dynamic'; // Önbelleğe almayı tamamen kapatır

import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Announcement from '@/app/models/Announcement';
// ... kodun geri kalanı aynen kalabilir

// Tüm duyuruları getirir
export async function GET() {
  try {
    await connectDB();
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    return NextResponse.json(announcements);
  } catch (err) {
    return NextResponse.json({ error: "Duyurular çekilemedi" }, { status: 500 });
  }
}

// Yeni duyuru yayınlar
export async function POST(req: Request) {
  try {
    const { title, content, type } = await req.json();
    await connectDB();

    const newAnnouncement = await Announcement.create({ title, content, type });

    // Sistem loglarına işle
    await Log.create({
      type: 'SYSTEM',
      message: `Yeni bir ${type} duyurusu yayınlandı: "${title}"`,
      discordId: 'Yönetim',
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, data: newAnnouncement }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Duyuru yayınlanamadı" }, { status: 500 });
  }
}