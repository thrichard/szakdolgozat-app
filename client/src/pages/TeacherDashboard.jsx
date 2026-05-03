import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-900 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Szakdolgozat Portál - TANÁRI FELÜLET</h1>
        <button 
          onClick={handleLogout}
          className="text-indigo-200 hover:text-white font-medium transition"
        >
          Kijelentkezés
        </button>
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Üdvözlöm, Tanár Úr/Nő! 👨‍🏫👩‍🏫</h2>
          <p className="text-gray-600 mb-8">
            Ez az oktatói irányítópult. Itt kezelheti a diákok tananyagait, hozhat létre új vizsgákat, és ellenőrizheti az eredményeket.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/add-material" className="p-6 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-blue-700 mb-2">Tananyag feltöltése</h3>
              <p className="text-sm text-blue-600">Új dokumentumok és jegyzetek megosztása a diákokkal.</p>
            </Link>
            
            <Link to="/create-quiz" className="p-6 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-purple-700 mb-2">Új Kvíz készítése</h3>
              <p className="text-sm text-purple-600">Többszörös választós tesztek összeállítása.</p>
            </Link>

            <Link to="/all-results" className="p-6 bg-orange-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition block text-center shadow-sm">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-orange-700 mb-2">Osztálynapló</h3>
              <p className="text-sm text-orange-600">Az összes diák kitöltött vizsgájának és osztályzatának megtekintése.</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;