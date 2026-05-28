import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Excuse from '@/app/models/Excuse';

export async function GET() {
  try {
    await connectDB();
    const excuses = await Excuse.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: excuses });
  } catch (err: any) {
    console.error("API GET HATASI:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();
    const updatedExcuse = await Excuse.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, data: updatedExcuse });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}