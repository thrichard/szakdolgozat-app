import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      }
    } catch (err) {
      setError('Hiba történt. Kérlek, ellenőrizd az internetkapcsolatod.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Bejelentkezés</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">E-mail cím</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Jelszó</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Belépés
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Nincs még fiókod? <Link to="/register" className="text-blue-600 hover:underline">Regisztráció</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;