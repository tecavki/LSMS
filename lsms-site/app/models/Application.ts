import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  basvuruId: { type: String, required: true, unique: true }, // 🚀 YENİ: Takip Numarası
  icIsim: { type: String, required: true },
  icYas: { type: Number, required: true },
  oocYas: { type: Number, required: true },
  deneyim: { type: String },
  legalSaat: { type: Number },
  emsRutbe: { type: String },
  gunlukAktiflik: { type: String },
  primeSaat: { type: String },
  hiyerarsi: { type: String },
  mesaiKabul: { type: String },
  nedenEms: { type: String, required: true },
  status: { type: String, default: 'bekliyor' }, // 🚀 YENİ: bekliyor, onaylandi, reddedildi
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema, 'applications');