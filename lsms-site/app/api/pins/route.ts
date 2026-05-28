import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb'; 
import Pin from '../../models/Pin';

// 1. GET: Admin paneli açıldığında MongoDB'den tüm personelleri listele
export async function GET() {
  try {
    await connectDB();
    // En son eklenen en üstte olacak şekilde (createdAt: -1) tüm listeyi çek
    const pins = await Pin.find({}).sort({ createdAt: -1 });
    
    // Frontend'in (Tablonun) anlayacağı şekle çeviriyoruz
    const formattedPins = pins.map(p => ({
      id: p._id.toString(),
      name: p.name,
      code: p.code,
      role: p.role
    }));
    
    return NextResponse.json(formattedPins);
  } catch (error) {
    console.error("🚨 GET PINS HATASI (Liste Çekilemedi):", error);
    return NextResponse.json({ error: 'Veriler getirilemedi.' }, { status: 500 });
  }
}

// 2. POST: Admin panelinden "Yeni Personel/Kod" eklendiğinde
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Gelen kodun boşluklarını silip BÜYÜK HARF yapıyoruz
    const cleanCode = body.code.toUpperCase().trim();

    // Veritabanında aynı koda sahip başka biri var mı kontrol et
    const existingPin = await Pin.findOne({ code: cleanCode });
    if (existingPin) {
      return NextResponse.json({ error: 'Bu giriş kodu zaten başka bir personele ait!' }, { status: 400 });
    }

    // Yeni personeli MongoDB'ye kaydet
    const newPin = await Pin.create({
      name: body.name,
      code: cleanCode,
      role: body.role
    });

    return NextResponse.json({ success: true, pin: newPin });
  } catch (error) {
    console.error("🚨 POST PIN HATASI (Yeni Kayıt Eklenemedi):", error);
    return NextResponse.json({ error: 'Ekleme başarısız. Lütfen bilgileri kontrol edin.' }, { status: 500 });
  }
}

// 3. DELETE: Admin panelinden bir personel silindiğinde (Kovulduğunda)
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // ID'ye göre bul ve veritabanından yok et
    await Pin.findByIdAndDelete(body.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🚨 DELETE PIN HATASI (Personel Silinemedi):", error);
    return NextResponse.json({ error: 'Silme işlemi başarısız oldu.' }, { status: 500 });
  }
}