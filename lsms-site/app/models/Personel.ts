// models/Personel.ts
import mongoose from 'mongoose';

const gecerliRutbeler = [
  'Stajyer Doktor', 'Pratisyen Doktor', 'Uzman Doktor', 'Operatör Doktor',
  'Doçent Doktor', 'Profesör Doktor', 'Supervisor', 'Direktör',
  'Başhekim Yardımcısı', 'Başhekim'
];

const PersonelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: String, required: true }, // Profil sayfanla uyumlu olması için rank eklendi
  code: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'personnel' },
  status: { type: String, default: 'aktif' }
}, { timestamps: true });

// 🚀 SİHİRLİ DOKUNUŞ: 
// 3. parametre olan 'personels' sayesinde tüm API'lerin aynı veritabanı koleksiyonuna 
// odaklanmasını garantiliyoruz. 'mongoose.models.Personel ||' kısmı ise Next.js 
// yeniden başlarken modelin zaten var olduğunu kontrol ederek hata vermesini önler.
const Personel = mongoose.models.Personel || mongoose.model('Personel', PersonelSchema, 'personels');

export default Personel;