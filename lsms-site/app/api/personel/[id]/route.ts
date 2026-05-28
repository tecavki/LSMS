// Dosya Yolu: app/api/personel/[id]/route.ts

import { NextResponse } from 'next/server';
// Proje dizinine göre doğru yukarı çıkış seviyesi (3 kat yukarı çıkıyoruz)
import { connectDB } from '../../../lib/mongodb'; 
import Personel from '../../../models/Personel';

// 🚀 BİLGİ GÜNCELLEME (PUT)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    // Params'ı güvenli şekilde çözüyoruz
    const { id } = await params;
    const body = await req.json();
    
    const guncelPersonel = await Personel.findByIdAndUpdate(id, body, { new: true });

    if (!guncelPersonel) {
      return NextResponse.json({ error: "Personel bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Başarıyla güncellendi", 
      personel: guncelPersonel 
    }, { status: 200 });

  } catch (error: any) {
    console.error("PUT Güncelleme Hatası:", error);
    
    // Veritabanı çakışma hatası (Örn: Aynı rozet numarası)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Bu rozet numarası zaten kullanılıyor!" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Sunucu hatası oluştu" }, { status: 500 });
  }
}

// 🚀 PERSONELİ SİLME (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const silinen = await Personel.findByIdAndDelete(id);

    if (!silinen) {
      return NextResponse.json({ error: "Personel zaten silinmiş veya bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Personel başarıyla silindi" }, { status: 200 });
    
  } catch (error) {
    console.error("DELETE Silme Hatası:", error);
    return NextResponse.json({ error: "Silme işlemi sırasında hata oluştu" }, { status: 500 });
  }
}