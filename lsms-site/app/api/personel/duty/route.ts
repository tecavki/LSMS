// app/api/personel/duty/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Personnel from '@/app/models/Personnel';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { discordId, action } = await req.json();
    
    // VS Code Terminaline (Siyah ekrana) detaylı rapor yazdırıyoruz:
    console.log("=== LSMS MESAİ TETİKLEME LOGU ===");
    console.log("Gelen ID:", discordId);
    console.log("İstenen Durum:", action);

    // Boşlukları temizleyerek veritabanında aratıyoruz
    const person = await Personnel.findOne({ discordId: String(discordId).trim() });
    
    if (!person) {
      console.log(`❌ BAŞARISIZ: Veritabanında "${discordId}" ID'li personel bulunamadı!`);
      return NextResponse.json({ 
        success: false, 
        error: `Sistem kaydınız bulunamadı. Kodun içindeki ID (${discordId}) ile veritabanındaki ID eşleşmiyor.` 
      }, { status: 404 });
    }

    console.log(`✅ BAŞARILI: Personel Bulundu -> ${person.name}`);
    person.onDuty = (action === 'start');
    await person.save();
    
    return NextResponse.json({ success: true, onDuty: person.onDuty });
  } catch (err: any) {
    console.log("❌ SUNUCU HATASI:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}