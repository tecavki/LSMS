import mongoose, { Schema, models, model } from 'mongoose';

const ExcuseSchema = new Schema({
  discordId: { type: String, required: true },
  name: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: 'Bekliyor' }
}, { timestamps: true });

// Next.js hot-reload (sürekli yenileme) hatasını önleyen garanti yapı
const Excuse = models.Excuse || model('Excuse', ExcuseSchema, 'excuses');
export default Excuse;