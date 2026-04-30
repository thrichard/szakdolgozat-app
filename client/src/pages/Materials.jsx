/**
 * Tananyagok listázásáért felelős hallgatói komponens.
 * Feladata a szerveren tárolt oktatási anyagok (linkek, leírások)
 * aszinkron lekérdezése és felhasználóbarát felületen (kártyák) történő megjelenítése.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * Komponens inicializálásakor lefutó API hívás.
   * Hitelesítési token ellenőrzése és adatok szinkronizálása a kiszolgálóval.
   */
  useEffect(() => {
    const fetchMaterials = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/materials', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setMaterials(data);
        } else {
          setError(data.message || 'Hiba a tananyagok betöltésekor.');
        }
      } catch (err) {
        setError('Hálózati hiba: A szerver nem elérhető.');
      }
    };

    fetchMaterials();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Tananyagok</h2>
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Vissza a pultra
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Feltételes renderelés üres adathalmaz esetén */}
        {materials.length === 0 && !error ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-600">Jelenleg nincsenek elérhető tananyagok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adattömb bejárása és vizuális elemek generálása */}
            {materials.map((material) => (
              <div key={material._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                    {material.subject}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{material.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">
                    Oktató: {material.teacherId ? material.teacherId.username : 'Ismeretlen'}
                  </span>
                  <a 
                    href={material.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Megnyitás
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Materials;