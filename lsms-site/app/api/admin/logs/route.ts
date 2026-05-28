import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Log from '@/app/models/Log';

export async function GET() {
  await connectDB();
  const logs = await Log.find().sort({ createdAt: -1 }).limit(50);
  return NextResponse.json(logs);
}