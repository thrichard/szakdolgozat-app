import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddMaterial() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    link: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Tananyag sikeresen feltöltve!');
        setFormData({ title: '', description: '', subject: '', link: '' });
        
        // 2 másodperc múlva visszadobjuk a tanárt a műszerfalra
        setTimeout(() => {
          navigate('/teacher'); 
        }, 2000);
      } else {
        setError(data.message || 'Hiba történt a feltöltés során.');
      }
    } catch (err) {
      setError('Hálózati hiba. Kérjük, próbálja újra később.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Új Tananyag Feltöltése 📚</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-500 hover:text-gray-700"
          >
            Vissza
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cím</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="pl. Biológia 10. osztály - Sejttan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tantárgy</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="pl. Biológia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leírás</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Rövid leírás a tananyagról..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fájl vagy Dokumentum Linkje (URL)</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Feltöltés
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMaterial;