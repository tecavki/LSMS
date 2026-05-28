import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  adminName: String,  // İşlemi yapan admin
  action: String,     // Ne yapıldı? (Örn: "Personel Eklendi")
  target: String,     // Hangi personel/vaka için?
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.models.Log || mongoose.model('Log', LogSchema);
export default Log;