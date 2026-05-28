import mongoose, { Schema, models, model } from 'mongoose';

const AnnouncementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['IC', 'OOC'], default: 'IC' }, // IC: Oyun içi, OOC: Oyun dışı
  createdBy: { type: String, default: 'Başhekimlik' },
  readBy: { type: [String], default: [] }, // Okuyan personellerin Discord ID'leri buraya birikecek
  createdAt: { type: Date, default: Date.now }
});

export default models.Announcement || model('Announcement', AnnouncementSchema, 'announcements');