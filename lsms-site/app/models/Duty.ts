import mongoose, { Schema, models, model } from 'mongoose';

const DutySchema = new Schema({
  discordId: String,
  startTime: Date,
  endTime: Date,
  durationInSeconds: Number,
});

// Koleksiyon adını 'duties' olarak zorla
export default models.Duty || model('Duty', DutySchema, 'duties');