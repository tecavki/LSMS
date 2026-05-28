import mongoose from 'mongoose';

// Kendi MongoDB linkini buraya doğrudan tırnak içinde yapıştır:
const MONGODB_URI = "mongodb+srv://LSMS:IPVcIMq33upXD90X@cluster0.y15eejp.mongodb.net/?appName=Cluster0";

if (!MONGODB_URI || MONGODB_URI.includes("<")) {
  throw new Error('Hata: MongoDB linkindeki <kullanici_adi> ve <sifre> alanlarını doldurmayı unutmuşsun!');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}