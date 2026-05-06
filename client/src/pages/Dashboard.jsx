import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Diák');
  
  // Gamifikációs állapotok (később a backendről jönnek)
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  // Név és adatok kiolvasása betöltéskor
  useEffect(() => {
    document.title = "Diák Pult";
    
    const storedName = localStorage.getItem('username');
    if (storedName) {
      setUsername(storedName);
    }

    // IDEIGLENES: Később itt fogjuk lekérni az adatbázisból a diák XP-jét!
    // Egyelőre beállítunk egy teszt értéket, hogy lásd, milyen szép a sáv:
    setXp(65); 
    setLevel(2);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // --- GAMIFIKÁCIÓS MATEK ---
  // Kiszámoljuk, mennyi XP kell a KÖVETKEZŐ szinthez (pl. 1. szint: 100 XP, 2. szint: 200 XP)
  const xpForNextLevel = level * 100; 
  // Kiszámoljuk a százalékos arányt a folyamatjelzőhöz (maximum 100%)
  const progressPercent = Math.min((xp / xpForNextLevel) * 100, 100);

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
          
          {/* ÚJ: GAMIFIKÁLT ÜDVÖZLŐ KÁRTYA XP SÁVVAL */}
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            
            {/* Háttér díszítés (finom gradiens kör a jobb sarokban) */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-50"></div>

            {/* Szint Kijelző (Jelvény) */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-xl border-4 border-white ring-4 ring-orange-100 transform hover:scale-105 transition duration-300">
                <div className="text-center">
                  <div className="text-sm font-bold uppercase tracking-widest opacity-90">Szint</div>
                  <div className="text-4xl font-black">{level}</div>
                </div>
              </div>
              {/* Kis korona ikon */}
              <div className="absolute -top-3 -right-2 text-3xl drop-shadow-md">👑</div>
            </div>

            {/* Szöveg és Folyamatjelző */}
            <div className="flex-1 w-full z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-3 gap-2">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
                    Üdvözlünk, {username}! 🎮
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Oldj meg kvízeket és gyűjts pontokat a szintlépéshez!
                  </p>
                </div>
                
                {/* Pontszám kijelző */}
                <div className="text-right bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {xp}
                  </span>
                  <span className="text-gray-500 font-bold ml-1">/ {xpForNextLevel} XP</span>
                </div>
              </div>

              {/* Animált Progress Bar (Folyamatjelző) */}
              <div className="w-full bg-gray-100 rounded-full h-5 shadow-inner p-1">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Csillogó effekt a sávon */}
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white opacity-20 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-right mt-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Még {xpForNextLevel - xp} XP a következő szintig
              </div>
            </div>
          </div>

          {/* MENÜ GOMBOK (Ezek maradtak az eredetiek) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/quizzes" className="p-8 bg-purple-50 rounded-2xl border border-purple-100 hover:bg-purple-100 hover:shadow-md transition block text-center transform hover:-translate-y-1">
              <div className="text-5xl mb-4 drop-shadow-sm">📝</div>
              <h3 className="font-extrabold text-purple-800 text-xl mb-2">Kvízek kitöltése</h3>
              <p className="text-sm text-purple-600 font-medium">Elérhető tesztek és vizsgák megtekintése.</p>
            </Link>

            <Link to="/materials" className="p-8 bg-green-50 rounded-2xl border border-green-100 hover:bg-green-100 hover:shadow-md transition block text-center transform hover:-translate-y-1">
              <div className="text-5xl mb-4 drop-shadow-sm">📚</div>
              <h3 className="font-extrabold text-green-800 text-xl mb-2">Tananyagok</h3>
              <p className="text-sm text-green-600 font-medium">Órai jegyzetek, kódok tanulmányozása.</p>
            </Link>

            <Link to="/results" className="p-8 bg-orange-50 rounded-2xl border border-orange-100 hover:bg-orange-100 hover:shadow-md transition block text-center transform hover:-translate-y-1">
              <div className="text-5xl mb-4 drop-shadow-sm">🏆</div>
              <h3 className="font-extrabold text-orange-800 text-xl mb-2">Eredményeim</h3>
              <p className="text-sm text-orange-600 font-medium">Korábbi kvízek pontszámai és értékelése.</p>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;