import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Results() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Eredmények lekérése betöltéskor
  useEffect(() => {
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
      }
    };

    fetchResults();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Korábbi Eredményeim 🏆</h2>
          
          {/* Vissza gomb */}
          <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Vissza
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-medium">
            {error}
          </div>
        )}

        {results.length === 0 && !error ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-gray-500 font-medium">Még nem állnak rendelkezésre vizsgaeredmények.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {results.map((result) => (
              <div key={result._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {result.quizId?.title || 'Ismeretlen kvíz'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Kitöltés ideje: {new Date(result.createdAt).toLocaleString('hu-HU')}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-black mb-1 ${
                    result.percentage >= 80 ? 'text-green-600' : 
                    result.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {result.percentage}%
                  </div>
                  <div className="text-sm font-bold text-gray-500">
                    {result.score} / {result.totalQuestions} pont
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;