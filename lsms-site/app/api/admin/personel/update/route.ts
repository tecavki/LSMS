import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Personnel from '@/app/models/Personnel';
import Log from '@/app/models/Log';
import mongoose from 'mongoose';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, rank, salary } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Personel Kimliği (ID) eksik." }, { status: 400 });
    }

    await connectDB();

    // ID biçimini her ihtimale karşı temiz string ve ObjectId olarak esnetiyoruz
    const filter = mongoose.Types.ObjectId.isValid(id) 
      ? { _id: new mongoose.Types.ObjectId(id) } 
      : { _id: id };

    // Doğrudan güncelleme komutu (Şema katı kurallarını bypass eder)
    const updated = await Personnel.findOneAndUpdate(
      filter,
      { 
        $set: { 
          rank: String(rank), 
          salary: Number(salary || 0) 
        } 
      },
      { new: true, runValidators: false } // runValidators: false kilitlenmeyi önler
    );

    if (!updated) {
      return NextResponse.json({ error: "Veritabanında eşleşen personel bulunamadı." }, { status: 404 });
    }

    // Başarılı işlem logu
    try {
      await Log.create({
        type: 'SYSTEM',
        message: `Yönetim, ${updated.name} rütbesini "${rank}" olarak güncelledi.`,
        discordId: 'Yönetim',
        createdAt: new Date()
      });
    } catch (logErr) {
      console.log("Log yazılırken atlandı, işleme engel değil.");
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });

  } catch (err: any) {
    console.error("Kadro Güncelleme API Hatası:", err.message);
    return NextResponse.json({ error: "Veritabanı yazma hatası", detay: err.message }, { status: 500 });
  }
}