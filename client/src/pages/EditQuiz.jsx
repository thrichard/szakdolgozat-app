import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function EditQuiz() {
  const { id } = useParams(); // URL-ből kivesszük a kvíz ID-ját
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Oldal betöltésekor lekérjük a meglévő kvíz adatait
  useEffect(() => {
    fetchQuizData();
  }, [id]);

  const fetchQuizData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTitle(data.quiz.title);
        setDescription(data.quiz.description || '');
        setDifficulty(data.quiz.difficulty);
        
        // Kérdések formázása a frontend számára
        const formattedQuestions = data.questions.map(q => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswerIndex
        }));
        
        setQuestions(formattedQuestions.length > 0 ? formattedQuestions : [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
      } else {
        setError('Nem sikerült betölteni a kvíz adatait.');
      }
    } catch (err) {
      setError('Hálózati hiba a kvíz betöltésekor.');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (indexToRemove) => {
    if (questions.length === 1) return; // Ne lehessen az utolsót is törölni
    setQuestions(questions.filter((_, index) => index !== indexToRemove));
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
      //PUT kérést küldünk a módosítás miatt!
      const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, difficulty, questions })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Kvíz sikeresen frissítve!');
        setTimeout(() => navigate('/manage-quizzes'), 2000); // Vissza a listához
      } else {
        setError(data.message || 'Hiba történt a mentés során.');
      }
    } catch (err) {
      setError('Hálózati hiba: Nem sikerült csatlakozni a szerverhez.');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center font-bold text-gray-500">Adatok betöltése...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Kvíz Módosítása ✏️</h2>
          <Link to="/manage-quizzes" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">  ← Mégsem</Link>
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
            <div key={qIndex} className="bg-white p-6 rounded-xl shadow-sm border-l-8 border-yellow-400 border relative">
              {questions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-bold"
                  title="Kérdés törlése"
                >
                  ✕
                </button>
              )}
              <input 
                type="text" placeholder={`${qIndex + 1}. Kérdés szövege`} required
                className="w-full font-bold mb-4 p-2 bg-gray-50 rounded pr-10"
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
                      className="border rounded p-2 flex-1 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
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
              + Kérdés hozzáadása
            </button>
            <button 
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl shadow-lg transition"
            >
              Módosítások Mentése
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditQuiz;