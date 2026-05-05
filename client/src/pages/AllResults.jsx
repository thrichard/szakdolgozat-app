import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AllResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Eredmények lekérése az oldal betöltésekor
  useEffect(() => {
    document.title = "Osztálynapló"; 
    
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
          const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setResults(sortedData);
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
        
        {/* FEJLÉC */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Osztálynapló 📊</h2>
          <Link to="/teacher" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Vissza
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl mb-6 font-bold shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* TÖLTÉS ÁLLAPOT */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : results.length === 0 ? (
          
          /* ÜRES ÁLLAPOT */
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Még nincsenek eredmények</h3>
            <p className="text-gray-500 text-lg">A diákok még nem töltöttek ki egyetlen kvízt sem.</p>
          </div>
          
        ) : (
          
          /* TÁBLÁZAT */
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                
                {/* Táblázat fejléce */}
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-5">Diák Neve</th>
                    <th className="p-5">Kvíz Címe</th>
                    <th className="p-5 text-center">Pontszám</th>
                    <th className="p-5 text-center">Eredmény</th>
                    <th className="p-5 text-right">Dátum</th>
                  </tr>
                </thead>
                
                {/* JAVÍTVA: tbody a hibás tdbody helyett! */}
                <tbody className="divide-y divide-gray-100">
                  {results.map((result, index) => {
                    const initial = result.studentId?.username ? result.studentId.username.charAt(0).toUpperCase() : '?';
                    
                    return (
                      <tr key={index} className="hover:bg-indigo-50/50 transition duration-150">
                        
                        {/* 1. Diák Oszlop (Avatárral) */}
                        <td className="p-5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">
                              {result.studentId?.username || <span className="text-red-400 italic">Törölt felhasználó</span>}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {result.studentId?.email || '-'}
                            </div>
                          </div>
                        </td>
                        
                        {/* 2. Kvíz Címe */}
                        <td className="p-5">
                          <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg text-sm">
                            {result.quizId?.title || <span className="text-red-400 italic">Törölt kvíz</span>}
                          </span>
                        </td>
                        
                        {/* 3. Pontszám */}
                        <td className="p-5 text-center font-bold text-gray-600">
                          {result.score} <span className="text-gray-400 font-normal">/ {result.totalQuestions}</span>
                        </td>
                        
                        {/* 4. Százalék / Értékelés */}
                        <td className="p-5 text-center">
                          <span className={`px-3 py-1.5 rounded-md text-xs font-extrabold tracking-wider ${
                            result.percentage >= 80 ? 'bg-green-100 text-green-700 border border-green-200' : 
                            result.percentage >= 50 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                            'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {result.percentage}%
                          </span>
                        </td>
                        
                        {/* 5. Dátum */}
                        <td className="p-5 text-right text-sm font-medium text-gray-500">
                          {new Date(result.createdAt).toLocaleString('hu-HU', {
                            year: 'numeric', month: 'short', day: 'numeric', 
                            hour: '2-digit', minute:'2-digit'
                          })}
                        </td>
                        
                      </tr>
                    );
                  })}
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