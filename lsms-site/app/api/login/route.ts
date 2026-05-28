import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb'; // Yolunu kontrol et
import Personel from '../../models/Personel'; // Yolunu kontrol et

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, password } = body;

    // 1. Gelen verileri kontrol et
    console.log("--- GİRİŞ DENEMESİ ---");
    console.log("Giriş yapmaya çalışan:", name);
    console.log("Girilen şifre:", password);

    // 2. Tüm veritabanını dök (Hata burada mı görelim)
    const tumPersonel = await Personel.find({});
    console.log("Veritabanındaki kayıtlı personel sayısı:", tumPersonel.length);
    console.log("Veritabanındaki ilk kayıt örneği:", tumPersonel[0]);

    // 3. Kullanıcıyı bul
    const personel = await Personel.findOne({ name: name });

    if (!personel) {
      console.log("❌ HATA: Veritabanında bu isimde biri yok.");
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // 4. Şifre kontrolü
    if (personel.password !== password) {
      console.log("❌ HATA: Şifreler eşleşmiyor.");
      console.log("DB'deki şifre:", personel.password);
      return NextResponse.json({ error: "Şifre hatalı!" }, { status: 401 });
    }

    return NextResponse.json({ message: "Giriş başarılı", user: personel }, { status: 200 });

  } catch (error: any) {
    console.error("Sunucu Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}