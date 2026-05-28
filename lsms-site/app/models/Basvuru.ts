import mongoose from 'mongoose';

const BasvuruSchema = new mongoose.Schema({
  icIsim: String,
  icYas: Number,
  oocYas: Number,
  deneyim: String,
  legalSaat: String,
  emsRutbe: String,
  gunlukAktiflik: String,
  primeSaat: String,
  hiyerarsi: String,
  nedenEms: String,
  mesaiKabul: String,
  durum: { type: String, default: 'bekliyor' },
  tarih: { type: Date, default: Date.now }
});

const Basvuru = mongoose.models.Basvuru || mongoose.model('Basvuru', BasvuruSchema);
export default Basvuru;