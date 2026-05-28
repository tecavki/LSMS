import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Personnel from '@/app/models/Personnel';
import Log from '@/app/models/Log';

export async function PATCH(req: Request) {
  try {
    const { id, rank, salary } = await req.json();
    await connectDB();

    // Personeli bul ve güncelle
    const updatedPersonnel = await Personnel.findByIdAndUpdate(
      id,
      { rank, salary },
      { new: true }
    );

    if (!updatedPersonnel) {
      return NextResponse.json({ error: "Personel bulunamadı" }, { status: 404 });
    }

    // Sistem loglarına otomatik kayıt düşelim
    await Log.create({
      type: 'SYSTEM',
      message: `${updatedPersonnel.name} isimli personelin bilgileri güncellendi. Yeni Rütbe: ${rank}`,
      discordId: 'Yönetim',
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, data: updatedPersonnel });
  } catch (err) {
    console.error("Güncelleme API Hatası:", err);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}