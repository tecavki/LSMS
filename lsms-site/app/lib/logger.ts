import { connectDB } from '../lib/mongodb'; 
import Log from '../models/Log';

export async function logAction(admin: string, action: string, target: string) {
  try {
    await connectDB();
    await Log.create({ adminName: admin, action, target });
  } catch (err) {
    console.error("Log atılırken hata:", err); // Hatayı terminalde görmeni sağlayacağız
  }
}