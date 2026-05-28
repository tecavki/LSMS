import mongoose from 'mongoose';

const VakaSchema = new mongoose.Schema({
  personelName: { type: String, required: true },
  hastaIsmi: { type: String, required: true },
  tedaviTuru: { type: String, required: true },
  ucret: { type: Number, required: true },
  aciklama: { type: String },
  tarih: { type: Date, default: Date.now }
}, { timestamps: true });

const Vaka = mongoose.models.Vaka || mongoose.model('Vaka', VakaSchema, 'vakas');
export default Vaka;