import mongoose from 'mongoose';

const PinSchema = new mongoose.Schema({
  code: { type: String, required: true }, // Veritabanındaki alan adın "code" ise
  role: { type: String, required: true },
});

export default mongoose.models.Pin || mongoose.model('Pin', PinSchema);