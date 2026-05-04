import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AllResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Eredmények lekérése az oldal betöltésekor
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
        setLoading(false);
      }
    };

    fetchAllResults();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">📊 Osztálynapló</h2>
          
          {/* Vissza gomb */}
          <Link to="/teacher" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Vissza
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 font-medium">
            {error}
          </div>
        )}

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
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="p-4">
                        <div className="font-bold text-gray-800">
                          {result.studentId?.username || 'Ismeretlen / Törölt'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.studentId?.email || ''}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 font-medium">
                        {result.quizId?.title || 'Ismeretlen / Törölt'}
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