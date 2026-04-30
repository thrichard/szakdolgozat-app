/**
 * Bejelentkezési felület komponense.
 * Kezeli a felhasználói hitelesítést, a JWT (JSON Web Token) kliensoldali tárolását (localStorage),
 * valamint a dekódolt token alapján a szerepkör-specifikus (RBAC) átirányítást.
 */

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
        // Sikeres hitelesítés esetén a token perzisztens tárolása
        localStorage.setItem('token', data.token);

        // JWT Payload dekódolása (Base64) a felhasználói szerepkör kinyeréséhez
        const tokenPayload = data.token.split('.')[1];
        const decodedPayload = JSON.parse(atob(tokenPayload));

        // Szerepkör alapú átirányítás (Role-based redirection)
        if (decodedPayload.role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Helytelen belépési adatok.');
      }
    } catch (err) {
      setError('Hálózati hiba. Nem sikerült csatlakozni a szerverhez.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Rendszer Bejelentkezés</h2>
        
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
            Bejelentkezés
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Nincs még fiókja? <Link to="/register" className="text-blue-600 hover:underline">Regisztráció</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;