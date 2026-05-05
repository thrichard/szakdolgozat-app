import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Állapot a töltéshez
  const navigate = useNavigate();

  // Dinamikus böngészőfül cím
  useEffect(() => {
    document.title = "Regisztráció | Szakdolgozat Portál";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setIsLoading(true); // Töltés indítása

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Hiba történt a regisztráció során.');
        setIsLoading(false); // Hiba esetén gomb visszaállítása
      }
    } catch (err) {
      setError('Hálózati hiba. Kérjük, próbálja újra később.');
      setIsLoading(false); // Hiba esetén gomb visszaállítása
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
      
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-indigo-50/50 animate-fade-in-up">
        
        {/* LOGÓ ÉS FEJLÉC */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4 text-3xl shadow-inner">
            ✨
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">
            Hozd létre fiókod!
          </h1>
          <p className="text-gray-500 font-medium">Csatlakozz a Szakdolgozat Portálhoz</p>
        </div>
        
        {/* HIBAÜZENET */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-bold text-sm shadow-sm animate-pulse">
            <span>⚠️</span> {error}
          </div>
        )}
        
        {/* ŰRLAP */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Felhasználónév</label>
            <input 
              type="text" 
              placeholder="pl. Kis Pista"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 font-medium text-gray-800"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">E-mail cím</label>
            <input 
              type="email" 
              placeholder="pelda@email.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 font-medium text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Jelszó</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 font-medium text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Szerepkör</label>
            <div className="relative">
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 font-bold text-gray-700 appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">🎓 Diák</option>
                <option value="teacher">👨‍🏫 Oktató / Tanár</option>
              </select>
              {/* Egyedi kis lefelé mutató nyíl a selecthez, hogy minden böngészőben jól nézzen ki */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md flex justify-center items-center gap-2 mt-4 ${
              isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Fiók létrehozása...
              </>
            ) : (
              'Regisztráció'
            )}
          </button>
        </form>

        {/* BEJELENTKEZÉS LINK */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          Már rendelkezel fiókkal?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition-colors">
            Jelentkezz be!
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default Register;