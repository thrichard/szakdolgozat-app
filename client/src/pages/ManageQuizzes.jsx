import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Az oldal betöltésekor azonnal lekérjük a kvízeket
  useEffect(() => {
    document.title = "Kvízeim Kezelése";
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        setError('Hiba történt a kvízek betöltésekor.');
      }
    } catch (err) {
      setError('Hálózati hiba a csatlakozáskor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Kérünk egy megerősítést, nehogy véletlenül töröljön valamit a tanár
    if (!window.confirm('Biztosan törölni szeretnéd ezt a kvízt és a hozzá tartozó összes kérdést?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Ha sikeres a törlés a szerveren, a képernyőről is eltüntetjük
        setQuizzes(quizzes.filter(quiz => quiz._id !== id));
      } else {
        alert('Hiba történt a törlés során.');
      }
    } catch (err) {
      alert('Hálózati hiba a törléskor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Kvízeim Kezelése ⚙️</h2>
          <Link to="/teacher" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
              ← Vissza
            </Link>
        </div>

        {loading && <div className="text-center text-gray-500 py-10">Kvízek betöltése...</div>}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 font-bold">{error}</div>}

        {!loading && quizzes.length === 0 && !error && (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
            <p className="text-gray-500 mb-4">Még nem hoztál létre egyetlen kvízt sem.</p>
            <Link to="/create-quiz" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-bold">
              + Új kvíz készítése
            </Link>
          </div>
        )}

        <div className="grid gap-4">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  {quiz.title}
                  {/* Verziószám megjelenítése */}
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-bold">
                    v{quiz.version || 1}.0
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mt-1">{quiz.description}</p>
                <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Nehézség: {quiz.difficulty === 'easy' ? 'Könnyű' : quiz.difficulty === 'medium' ? 'Közepes' : 'Nehéz'}
                </span>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                {/* MÓDOSÍTÁS GOMB */}
                <Link 
                  to={`/edit-quiz/${quiz._id}`}
                  className="flex-1 md:flex-none bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition font-bold flex justify-center items-center gap-2"
                >
                  ✏️ Módosítás
                </Link>
                <button 
                  onClick={() => handleDelete(quiz._id)} 
                  className="flex-1 md:flex-none bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-bold flex justify-center items-center gap-2"
                >
                  🗑️ Törlés
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageQuizzes;