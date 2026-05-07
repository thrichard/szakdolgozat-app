import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Eredmények lekérése betöltéskor
  useEffect(() => {
    document.title = "Korábbi Eredményeim";

    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/results', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
          setResults(data);
        } else {
          setError(data.message || 'Hiba az eredmények szinkronizálása során.');
        }
      } catch (err) {
        setError('Hálózati hiba: A szerver nem elérhető.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Fejléc */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Korábbi Eredményeim 🏆</h2>
          
          <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Vissza
          </Link>
        </div>

        {/* Hibajelzés */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-bold shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Üres állapot dizájnosan */}
        {results.length === 0 && !error ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-200 animate-fade-in-up">
            <div className="text-6xl mb-4 opacity-50 drop-shadow-sm">📜</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Még nincsenek eredményeid</h3>
            <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
              Úgy tűnik, még nem oldottál meg egyetlen feladatot sem. Tölts ki egy kvízt, hogy gyűjteni kezdd az XP-ket és szintet lépj!
            </p>
            <Link to="/quizzes" className="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-md">
              Kvízek megtekintése 🚀
            </Link>
          </div>
        ) : (
          /* Eredmény kártyák listája */
          <div className="grid gap-5">
            {results.map((result) => (
              <div key={result._id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between hover:shadow-md transition gap-4 group relative overflow-hidden">
                
                {/* Bal oldal: Ikon és Szöveg */}
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 ${
                    result.percentage >= 80 ? 'bg-green-50 border-green-100' : 
                    result.percentage >= 50 ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'
                  }`}>
                    {result.percentage >= 80 ? '🏆' : result.percentage >= 50 ? '👍' : '📚'}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      {result.quizId?.title || 'Ismeretlen kvíz'}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      🗓️ {new Date(result.createdAt).toLocaleString('hu-HU', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Jobb oldal: Százalék és Pontszám */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-none border-gray-100 mt-2 sm:mt-0">
                  <div className={`text-4xl font-black mb-1 sm:mb-0 ${
                    result.percentage >= 80 ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600' : 
                    result.percentage >= 50 ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500' : 'text-red-500'
                  }`}>
                    {result.percentage}%
                  </div>
                  <div className="text-sm font-bold text-gray-500 bg-white sm:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 sm:border-gray-100 sm:mt-1 shadow-sm">
                    {result.score} / {result.totalQuestions} pont
                  </div>
                </div>

                {/* Díszítő elem a kártya szélén */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                  result.percentage >= 80 ? 'bg-green-400' : 
                  result.percentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;