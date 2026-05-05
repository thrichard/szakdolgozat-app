import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Új állapot a töltéshez
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Bejelentkezés | Szakdolgozat Portál";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Töltés indítása

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Token mentése
        localStorage.setItem('token', data.token);

        // Kinyerjük a tokenből az adatokat
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const role = payload.role;
        
        // Név megkeresése ahonnan épp jön, vagy alapértelmezett érték
        const username = payload.username || data?.user?.username || data?.username || 'Tanár Úr/Nő';

        // Szükséges infók mentése a felülethez
        localStorage.setItem('role', role);
        localStorage.setItem('username', username);

        // Átirányítás szerepkör alapján
        if (role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Helytelen belépési adatok.');
        setIsLoading(false); // Töltés leállítása hiba esetén
      }
    } catch (err) {
      setError('Hálózati hiba. Kérlek, ellenőrizd az internetkapcsolatod.');
      setIsLoading(false); // Töltés leállítása hiba esetén
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
      
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-indigo-50/50 animate-fade-in-up">
        
        {/* LOGÓ ÉS FEJLÉC */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4 text-3xl shadow-inner">
            🎓
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">
            Üdvözlünk újra!
          </h1>
          <p className="text-gray-500 font-medium">Jelentkezz be a fiókodba</p>
        </div>
        
        {/* HIBAÜZENET */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-bold text-sm shadow-sm animate-pulse">
            <span>⚠️</span> {error}
          </div>
        )}
        
        {/* ŰRLAP */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex justify-between items-center mb-2 ml-1 mr-1">
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider">Jelszó</label>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 font-medium text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md flex justify-center items-center gap-2 mt-2 ${
              isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Bejelentkezés...
              </>
            ) : (
              'Belépés'
            )}
          </button>
        </form>

        {/* REGISZTRÁCIÓS LINK */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          Nincs még fiókod?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition-colors">
            Regisztrálj itt!
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default Login;