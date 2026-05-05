  import React, { useState, useEffect } from 'react';
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

    // Dinamikus böngésző cím beállítása
    useEffect(() => {
      document.title = "Új Kvíz Összeállítása";
    }, []);

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
          
          {/* FEJLÉC ÉS VISSZA GOMB */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Új Kvíz Összeállítása 📝</h2>
            <Link to="/teacher" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
              ← Vissza
            </Link>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold border border-red-200">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm font-bold border border-green-200">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ALAPADATOK KÁRTYA */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="grid gap-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">Kvíz címe</label>
                  <input 
                    type="text" placeholder="pl. Sejttan alapjai" required
                    className="text-xl font-bold border-b-2 border-gray-100 focus:border-indigo-500 outline-none p-2 w-full transition"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">Leírás</label>
                  <textarea 
                    placeholder="Rövid leírás a diákoknak..."
                    className="border border-gray-200 rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] transition"
                    value={description} onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">Nehézségi szint</label>
                  <select 
                    className="border border-gray-200 rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition"
                    value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Könnyű</option>
                    <option value="medium">Közepes</option>
                    <option value="hard">Nehéz</option>
                  </select>
                </div>
              </div>
            </div>

            {/* KÉRDÉSEK LISTÁJA */}
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white p-6 rounded-xl shadow-sm border-l-8 border-indigo-500 border border-gray-200 transition hover:shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                    {qIndex + 1}. KÉRDÉS
                  </span>
                </div>
                <input 
                  type="text" placeholder="Mi a kérdésed?" required
                  className="w-full font-bold mb-4 p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 transition"
                  value={q.questionText} onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                />
                <div className="grid gap-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3 group">
                      <input 
                        type="radio" name={`correct-${qIndex}`} 
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={q.correctAnswer === oIndex}
                        onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                      />
                      <input 
                        type="text" placeholder={`${oIndex + 1}. válaszlehetőség`} required
                        className="border border-gray-200 rounded-lg p-2 flex-1 text-sm outline-none group-hover:border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        value={opt} onChange={(e) => updateQuestion(qIndex, 'options', e.target.value, oIndex)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* MŰVELETEK */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button 
                type="button" onClick={addQuestion}
                className="flex-1 bg-white border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>➕</span> Új kérdés hozzáadása
              </button>
              <button 
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 active:translate-y-0"
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