import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Diák');

  // Név kiolvasása betöltéskor
  useEffect(() => {
    document.title = "Diák Pult";
    
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
      
      {/* FEJLÉC */}
      <nav className="bg-indigo-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Szakdolgozat Portál - DIÁK FELÜLET</h1>
        <button 
          onClick={handleLogout}
          className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium transition shadow-sm"
        >
          Kijelentkezés
        </button>
      </nav>

      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto mt-4">
          
          {/* ÜDVÖZLŐ KÁRTYA */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Üdvözlünk, {username}! 🎓</h2>
            <p className="text-gray-600">Itt érheted el az oktatók által feltöltött anyagokat, és töltheted ki a kiadott feladatokat.</p>
          </div>

          {/* MENÜ GOMBOK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/quizzes" className="p-8 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-purple-700 mb-2">Kvízek kitöltése</h3>
              <p className="text-sm text-purple-600">Elérhető tesztek és vizsgák megtekintése.</p>
            </Link>

            <Link to="/materials" className="p-8 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-green-700 mb-2">Tananyagok</h3>
              <p className="text-sm text-green-600">Órai jegyzetek, dokumentumok letöltése.</p>
            </Link>

            <Link to="/results" className="p-8 bg-orange-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-orange-700 mb-2">Eredményeim</h3>
              <p className="text-sm text-orange-600">Korábbi kvízek pontszámai és értékelése.</p>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;