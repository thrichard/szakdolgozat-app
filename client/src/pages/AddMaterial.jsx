import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddMaterial() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [materialLink, setMaterialLink] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
        body: JSON.stringify({ title, subject, description, link: materialLink })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Tananyag sikeresen feltöltve!');
        setTimeout(() => {
          navigate('/teacher');
        }, 2000);
      } else {
        setError(data.message || 'Hiba történt a feltöltés során.');
      }
    } catch (err) {
      setError('Hálózati hiba: Nem sikerült csatlakozni a szerverhez.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* FEJLÉC ÉS VISSZA GOMB */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Új Tananyag Feltöltése 📚</h2>
          <Link to="/teacher" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Vissza
          </Link>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 font-bold border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 font-bold border border-green-200">{success}</div>}

        {/* AZ ŰRLAP FEHÉR DOBOZA */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Cím</label>
            <input
              type="text"
              placeholder="pl. Biológia 10. osztály - Sejttan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tantárgy</label>
            <input
              type="text"
              placeholder="pl. Biológia"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Leírás</label>
            <textarea
              placeholder="Rövid leírás a tananyagról..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-28 resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Fájl vagy Dokumentum Linkje (URL)</label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={materialLink}
              onChange={(e) => setMaterialLink(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition mt-2 shadow-sm"
          >
            Feltöltés
          </button>
        </form>

      </div>
    </div>
  );
}

export default AddMaterial;