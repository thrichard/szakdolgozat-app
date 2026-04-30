/**
 * Összesített eredményeket megjelenítő komponens (Osztálynapló).
 * Felelős a szerverről érkező aggregált vizsgaeredmények aszinkron lekérdezéséért,
 * az állapotkezelésért (betöltés, hiba, adatok), valamint az adatok táblázatos rendereléséért.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AllResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * Komponens csatolásakor (mount) lefutó mellékhatás (Effect).
   * Lekérdezi az összes rögzített eredményt az API-tól.
   */
  useEffect(() => {
    const fetchAllResults = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/results/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
          setResults(data);
        } else {
          setError(data.message || 'Hiba történt az adatok betöltésekor.');
        }
      } catch (err) {
        setError('Hálózati hiba. Nem sikerült csatlakozni a szerverhez.');
      } finally {
        // Állapot frissítése a lekérdezés befejeztével (sikeres és sikertelen esetben is)
        setLoading(false);
      }
    };

    fetchAllResults();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">📊 Osztálynapló</h2>
          <Link to="/teacher" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Vissza a tanári pultra
          </Link>
        </div>

        {/* Hibakezelés UI renderelése */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Feltételes renderelés: Betöltés, Üres állapot, vagy Adattábla */}
        {loading ? (
          <p className="text-gray-600 text-center font-bold text-xl mt-10">Adatok szinkronizálása folyamatban...</p>
        ) : results.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">Jelenleg nem állnak rendelkezésre vizsgaeredmények a rendszerben.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-900 text-white text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Diák Neve</th>
                    <th className="p-4 font-semibold">Kvíz Címe</th>
                    <th className="p-4 font-semibold text-center">Eredmény</th>
                    <th className="p-4 font-semibold text-center">Százalék</th>
                    <th className="p-4 font-semibold text-right">Dátum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Kapott adatok leképezése (mapping) táblázatsorokká */}
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="p-4">
                        <div className="font-bold text-gray-800">
                          {result.studentId ? result.studentId.username : 'Ismeretlen / Törölt felhasználó'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.studentId ? result.studentId.email : ''}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 font-medium">
                        {result.quizId ? result.quizId.title : 'Ismeretlen / Törölt kvíz'}
                      </td>
                      <td className="p-4 text-center font-bold text-gray-700">
                        {result.score} / {result.totalQuestions}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          result.percentage >= 80 ? 'bg-green-100 text-green-800' : 
                          result.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.percentage}%
                        </span>
                      </td>
                      <td className="p-4 text-right text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleString('hu-HU', {
                          year: 'numeric', month: 'short', day: 'numeric', 
                          hour: '2-digit', minute:'2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllResults;