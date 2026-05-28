import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import Vaka from '../../models/Vaka';

export async function GET() {
  try {
    await connectDB();
    const vakalar = await Vaka.find({});
    return NextResponse.json(vakalar, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const yeniVaka = new Vaka({
      personelName: body.personelName,
      hastaIsmi: body.hastaIsmi,
      tedaviTuru: body.tedaviTuru,
      ucret: body.ucret,
      aciklama: body.aciklama
    });
    await yeniVaka.save();
    return NextResponse.json({ message: "Başarılı" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}