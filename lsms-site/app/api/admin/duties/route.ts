import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Duty from '@/app/models/Duty';

export async function GET() {
  try {
    await connectDB();
    const logs = await Duty.find({}).sort({ startTime: -1 });
    return NextResponse.json(logs);
  } catch (err) {
    return NextResponse.json({ error: "Veri çekilemedi" }, { status: 500 });
  }
}