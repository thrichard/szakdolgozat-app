import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Aktív kvízek lekérése az oldal betöltésekor
  useEffect(() => {
    document.title = "Elérhető Kvízek";

    const fetchQuizzes = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/quizzes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setQuizzes(data);
        } else {
          setError(data.message || 'Hiba a vizsgák listázása során.');
        }
      } catch (err) {
        setError('Hálózati hiba: Nem sikerült felvenni a kapcsolatot a szerverrel.');
      }
    };

    fetchQuizzes();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Elérhető Kvízek 📝</h2>
          
          {/* Az egységesített Vissza gomb */}
          <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Vissza
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-medium">
            {error}
          </div>
        )}

        {/* Ha nincs elérhető kvíz */}
        {!error && quizzes.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-gray-500 font-medium">Jelenleg nincsenek aktív vizsgafeladatok a rendszerben.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-indigo-700">{quiz.title}</h3>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                    {quiz.difficulty === 'easy' ? 'Könnyű' : quiz.difficulty === 'medium' ? 'Közepes' : 'Nehéz'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-6">{quiz.description}</p>
                
                <Link 
                  to={`/quiz/${quiz._id}`} 
                  className="block text-center w-full bg-indigo-50 text-indigo-600 font-bold py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                >
                  Kvíz indítása
                </Link>
              </div>
            ))}
            
          </div>
        )}
      </div>
    </div>
  );
}

export default Quizzes;