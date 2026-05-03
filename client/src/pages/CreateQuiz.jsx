import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const updateQuestion = (index, field, value, optIndex = null) => {
    const newQuestions = [...questions];
    if (optIndex !== null) {
      newQuestions[index].options[optIndex] = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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

      const data = await response.json();

      if (response.ok) {
        setSuccess('Kvíz sikeresen létrehozva! 🎉');
        setTimeout(() => navigate('/teacher'), 2000);
      } else {
        setError(data.message || 'Hiba történt a mentés során.');
      }
    } catch (err) {
      setError('Hálózati hiba: Nem sikerült csatlakozni a szerverhez.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Új Kvíz Összeállítása</h2>
          <Link to="/teacher" className="text-indigo-600 hover:underline">Vissza</Link>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-bold">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm font-bold">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="border rounded p-2 flex-1 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;