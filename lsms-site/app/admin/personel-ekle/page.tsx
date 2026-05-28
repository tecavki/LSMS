'use client';

import { useState } from 'react';

export default function PersonelEkle() {
  const [formData, setFormData] = useState({
    isim: '',
    rutbe: '',
    departman: '',
  });
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setMesaj('');

    try {
      // Az önce düzelttiğimiz 404 vermeyen API yolu
     const res = await fetch('/api/personel-ekle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

      if (res.ok) {
        setMesaj('✅ Personel başarıyla sisteme eklendi!');
        setFormData({ isim: '', rutbe: '', departman: '' }); // Formu temizle
      } else {
        setMesaj('❌ Personel eklenirken bir hata oluştu.');
      }
    } catch (error) {
      setMesaj('❌ Sunucuya ulaşılamadı.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500 border-b border-red-500 pb-2">
        LSMS Yeni Personel Kaydı
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col gap-4">
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">İsim Soyisim</label>
          <input 
            type="text" 
            required 
            value={formData.isim}
            onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-red-500"
            placeholder="Örn: Teco Shine"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Rütbe / Ünvan</label>
          <input 
            type="text" 
            required 
            value={formData.rutbe}
            onChange={(e) => setFormData({ ...formData, rutbe: e.target.value })}
            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-red-500"
            placeholder="Örn: Chief of Medicine"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Departman</label>
          <input 
            type="text" 
            required 
            value={formData.departman}
            onChange={(e) => setFormData({ ...formData, departman: e.target.value })}
            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-red-500"
            placeholder="Örn: Cerrahi"
          />
        </div>

        <button 
          type="submit" 
          disabled={yukleniyor}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {yukleniyor ? 'Sisteme İşleniyor...' : 'Personeli Kaydet'}
        </button>

        {mesaj && (
          <div className={`mt-4 p-3 rounded text-center ${mesaj.includes('✅') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
            {mesaj}
          </div>
        )}
      </form>
    </div>
  );
}