import mongoose, { Schema, models, model } from 'mongoose';

const ReportSchema = new Schema({
  discordId: String,
  patientName: String,
  details: String,
  treatment: String,
  date: { type: Date, default: Date.now }
});

export default models.Report || model('Report', ReportSchema, 'reports');