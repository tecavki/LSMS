import mongoose from 'mongoose';

const NobetSchema = new mongoose.Schema({
  personelName: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.Nobet || mongoose.model('Nobet', NobetSchema, 'nobetler');