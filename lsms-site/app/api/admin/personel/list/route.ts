import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Personnel from '@/app/models/Personnel';

export async function GET() {
  try {
    await connectDB();
    const staff = await Personnel.find({});
    return NextResponse.json(staff);
  } catch (err) {
    return NextResponse.json({ error: "Kadrosu çekilemedi" }, { status: 500 });
  }
}