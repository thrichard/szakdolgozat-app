/**
 * Tananyag rögzítéséért felelős kliensoldali komponens.
 * Űrlapot biztosít a metaadatok (cím, leírás, tantárgy, hivatkozás) bevitelére,
 * és POST kérést küld a backend API felé a hitelesítési token (Bearer) csatolásával.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddMaterial() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const navigate = useNavigate();

  /**
   * Űrlap beküldésének eseménykezelője (Event Handler).
   * Megakadályozza az oldal újratöltését, majd aszinkron módon elküldi az adatokat.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, subject, link })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Tananyag sikeresen regisztrálva a rendszerben. 🎉' });
        // Űrlap mezőinek alaphelyzetbe állítása (Reset state)
        setTitle('');
        setDescription('');
        setSubject('');
        setLink('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Hiba történt a művelet feldolgozása során.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Hálózati hiba: Nem sikerült kapcsolódni a szerverhez.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Új Tananyag Feltöltése</h2>
          <Link to="/teacher" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Vissza a tanári pultra
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Tananyag Címe *</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pl. Sejtbiológia alapjai"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Tantárgy *</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pl. Biológia"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Rövid leírás *</label>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Miről szól ez a tananyag?"
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Link (URL) *</label>
              <input 
                type="url" 
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pl. https://youtube.com/..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md"
            >
              Mentés és Közzététel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMaterial;