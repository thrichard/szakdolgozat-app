/**
 * Dinamikus kvízösszeállító komponens.
 * Lehetővé teszi komplex adatszerkezetek (kérdések, opciók, helyes válaszok indexe)
 * kliensoldali összeállítását lokális állapotkezeléssel (state array), majd azok
 * beküldését a REST API felé véglegesítés céljából.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [message, setMessage] = useState('');

  // Komplex állapot: Kérdések tömbje (Array of objects)
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  /**
   * Új elem hozzáadása a kérdések tömbjéhez az immutabilitás elvének megtartásával.
   */
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  /**
   * Specifikus kérdés vagy opció állapotának módosítása a megadott index alapján.
   * @param {number} index - A módosítandó kérdés indexe a tömbben.
   * @param {string} field - A frissítendő mező kulcsa.
   * @param {any} value - Az új érték.
   * @param {number|null} optIndex - (Opcionális) A válaszlehetőség indexe, amennyiben opciót módosítunk.
   */
  const updateQuestion = (index, field, value, optIndex = null) => {
    const newQuestions = [...questions];
    if (optIndex !== null) {
      newQuestions[index].options[optIndex] = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  /**
   * Kvíz adatstruktúrájának szerializálása (JSON) és továbbítása a szervernek.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, difficulty, questions })
      });

      if (response.ok) {
        alert("Kvíz adatszerkezete sikeresen validálva és mentve. 🎉");
        navigate('/teacher');
      } else {
        const data = await response.json();
        setMessage(data.message || "Validációs hiba a mentés során.");
      }
    } catch (err) {
      setMessage("Hálózati hiba: Nem sikerült csatlakozni a szerverhez.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Új Kvíz Összeállítása</h2>
          <Link to="/teacher" className="text-indigo-600 hover:underline">Vissza</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alapadatok bekérése */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="grid gap-4">
              <input 
                type="text" placeholder="Kvíz címe" required
                className="text-xl font-bold border-b-2 border-gray-100 focus:border-indigo-500 outline-none p-2 w-full"
                value={title} onChange={(e) => setTitle(e.target.value)}
              />
              <textarea 
                placeholder="Rövid leírás a diákoknak..."
                className="border rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-indigo-500"
                value={description} onChange={(e) => setDescription(e.target.value)}
              />
              <select 
                className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Könnyű</option>
                <option value="medium">Közepes</option>
                <option value="hard">Nehéz</option>
              </select>
            </div>
          </div>

          {/* Dinamikus kérdések listájának renderelése */}
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white p-6 rounded-xl shadow-sm border-l-8 border-indigo-500 border">
              <input 
                type="text" placeholder={`${qIndex + 1}. Kérdés szövege`} required
                className="w-full font-bold mb-4 p-2 bg-gray-50 rounded"
                value={q.questionText} onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
              />
              <div className="grid gap-3">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input 
                      type="radio" name={`correct-${qIndex}`} 
                      checked={q.correctAnswer === oIndex}
                      onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                    />
                    <input 
                      type="text" placeholder={`${oIndex + 1}. válasz`} required
                      className="border rounded p-2 flex-1 text-sm"
                      value={opt} onChange={(e) => updateQuestion(qIndex, 'options', e.target.value, oIndex)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <button 
              type="button" onClick={addQuestion}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition"
            >
              + Új kérdés hozzáadása
            </button>
            <button 
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition"
            >
              Kvíz Véglegesítése
            </button>
          </div>
          {message && <p className="text-red-500 text-center font-bold">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;