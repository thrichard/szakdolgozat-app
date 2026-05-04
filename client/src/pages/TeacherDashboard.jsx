import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const navigate = useNavigate();
  // Alapértelmezett megszólítás, ha valamiért nem lenne neve a felhasználónak
  const [username, setUsername] = useState('Oktató');

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username'); 
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <nav className="bg-indigo-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Szakdolgozat Portál - TANÁRI FELÜLET</h1>
        <button 
          onClick={handleLogout}
          className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium transition"
        >
          Kijelentkezés
        </button>
      </nav>

      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto mt-4">
          
          {/* ÜDVÖZLŐ KÁRTYA */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Üdvözlöm, {username}! 🎓</h2>
            <p className="text-gray-600">Ez az oktatói irányítópult. Itt kezelheti a diákok tananyagait, hozhat létre új vizsgákat, és ellenőrizheti az eredményeket.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/add-material" className="p-8 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-blue-700 mb-2">Tananyag feltöltése</h3>
              <p className="text-sm text-blue-600">Új dokumentumok és jegyzetek megosztása a diákokkal.</p>
            </Link>

            <Link to="/create-quiz" className="p-8 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-purple-700 mb-2">Új Kvíz készítése</h3>
              <p className="text-sm text-purple-600">Többszörös választós tesztek összeállítása.</p>
            </Link>

            <Link to="/all-results" className="p-8 bg-orange-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-orange-700 mb-2">Osztálynapló</h3>
              <p className="text-sm text-orange-600">Az összes diák kitöltött vizsgájának és osztályzatának megtekintése.</p>
            </Link>

            <Link to="/manage-quizzes" className="p-8 bg-teal-50 rounded-xl border border-teal-100 hover:bg-teal-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="font-bold text-teal-700 mb-2">Kvízeim kezelése</h3>
              <p className="text-sm text-teal-600">Eddigi kvízek listázása, módosítása és törlése.</p>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;