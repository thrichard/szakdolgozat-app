import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Állapot a törlést megerősítő felugró ablakhoz
  const [quizToDelete, setQuizToDelete] = useState(null);

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

  const confirmDelete = async () => {
    if (!quizToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Sikeres törlés után eltüntetjük a listából és bezárjuk a modalt
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizToDelete._id));
        setQuizToDelete(null);
      } else {
        alert('Hiba történt a törlés során.');
      }
    } catch (err) {
      alert('Hálózati hiba a törléskor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* FEJLÉC */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Kvízeim Kezelése ⚙️</h2>
          <Link to="/teacher" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Vissza
          </Link>
        </div>

        {/* ÁLLAPOTOK: Töltés, Hiba, Üres */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-bold border border-red-100">{error}</div>}

        {!loading && quizzes.length === 0 && !error && (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-200">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nincsenek még kvízeid</h3>
            <p className="text-gray-500 mb-6">Készíts egy új kvízt, hogy a diákok számot adhassanak tudásukról!</p>
            <Link to="/create-quiz" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition font-bold transform hover:-translate-y-1">
              + Új kvíz összeállítása
            </Link>
          </div>
        )}

        {/* KVÍZEK LISTÁJA */}
        <div className="grid gap-5">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition">
              
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {quiz.title}
                  </h3>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md font-extrabold tracking-wider border border-indigo-100">
                    v{quiz.version || 1}.0
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                
                <div className="flex items-center gap-3">
                  {/* Dinamikus nehézségi címke színek */}
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                    quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {quiz.difficulty === 'easy' ? 'Könnyű' : quiz.difficulty === 'medium' ? 'Közepes' : 'Nehéz'}
                  </span>
                  
                  <span className="text-xs text-gray-400 font-medium">
                    Kérdések száma: {quiz.questions?.length || 0} db
                  </span>
                </div>
              </div>
              
              {/* GOMBOK */}
              <div className="flex gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <Link 
                  to={`/edit-quiz/${quiz._id}`}
                  className="flex-1 md:flex-none bg-white text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-300 transition font-bold flex justify-center items-center gap-2 shadow-sm"
                >
                  ✏️ Módosítás
                </Link>
                <button 
                  onClick={() => setQuizToDelete(quiz)} 
                  className="flex-1 md:flex-none bg-white text-red-600 border border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition font-bold flex justify-center items-center gap-2 shadow-sm"
                >
                  🗑️ Törlés
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TÖRLÉS MEGERŐSÍTŐ MODAL */}
      {quizToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
              🗑️
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Biztosan törlöd?</h3>
            <p className="text-center text-gray-500 mb-6 text-sm">
              A(z) <span className="font-bold text-gray-700">"{quizToDelete.title}"</span> nevű kvíz és a hozzá tartozó összes kérdés véglegesen törlődik. Ezt nem lehet visszavonni.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setQuizToDelete(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                Mégse
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-md"
              >
                Igen, törlöm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageQuizzes;