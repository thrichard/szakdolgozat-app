/**
 * Hallgatói irányítópult (Dashboard) komponense.
 * Alapértelmezett landoló oldal a 'student' jogosultsággal rendelkező felhasználók számára.
 * Grafikus navigációs pontokat biztosít az elérhető modulokhoz (Kvízek, Tananyagok, Eredmények).
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  /**
   * Kliensoldali munkamenet megszakítása és JWT token törlése.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">Szakdolgozat Portál</h1>
        <button 
          onClick={handleLogout}
          className="text-gray-600 hover:text-indigo-600 font-medium transition"
        >
          Kijelentkezés
        </button>
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Üdvözlünk a Diák Pulton! 🎓</h2>
          <p className="text-gray-600 mb-8">
            Itt érheted el az oktatók által feltöltött anyagokat, és töltheted ki a kiadott feladatokat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/quizzes" className="p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition block text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-indigo-700 mb-2">Kvízek kitöltése</h3>
              <p className="text-sm text-indigo-600">Elérhető tesztek és vizsgák megtekintése.</p>
            </Link>
            
            <Link to="/materials" className="p-6 bg-green-50 rounded-xl hover:bg-green-100 transition block text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-green-700 mb-2">Tananyagok</h3>
              <p className="text-sm text-green-600">Órai jegyzetek, dokumentumok letöltése.</p>
            </Link>

            <Link to="/results" className="p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition block text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-purple-700 mb-2">Eredményeim</h3>
              <p className="text-sm text-purple-600">Korábbi kvízek pontszámai és értékelése.</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;