import { NextResponse } from 'next/server';
import { connectDB } from '../../app/lib/mongodb';
import Excuse from '../../app/models/Excuse';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { discordId } = await req.json();
    const history = await Excuse.find({ discordId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: history });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}