import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Alapértelmezetten 1 kérdés indul, 2 válaszlehetőséggel
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', ''], correctAnswer: 0 }
  ]);

  useEffect(() => {
    document.title = "Új Kvíz Összeállítása";
  }, []);

  //KÉRDÉSEK KEZELÉSE 
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (qIndex) => {
    if (questions.length === 1) return; // Az utolsót ne lehessen törölni
    const newQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(newQuestions);
  };

  const updateQuestionText = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const updateCorrectAnswer = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  // VÁLASZOK KEZELÉSE
  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push(''); // Új üres válasz hozzáadása
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length <= 2) return; // Minimum 2 válasz kell maradjon
    
    // Töröljük a választ
    newQuestions[qIndex].options.splice(oIndex, 1);
    
    // Ha a törölt válasz volt a Helyes, akkor a Helyes indexét visszaállítjuk 0-ra
    if (newQuestions[qIndex].correctAnswer === oIndex) {
      newQuestions[qIndex].correctAnswer = 0;
    } else if (newQuestions[qIndex].correctAnswer > oIndex) {
      // Ha a törölt válasz ELŐTT volt a helyes, akkor a helyes indexe 1-el csökken
      newQuestions[qIndex].correctAnswer -= 1;
    }
    
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Ne lehessen üres válaszokat beküldeni
    for (let q of questions) {
      if (q.options.some(opt => opt.trim() === '')) {
        setError('Kérlek, töltsd ki az összes válaszlehetőséget (vagy töröld a feleslegeseket)!');
        return;
      }
    }

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
                  type="text" placeholder="pl. Programozási Alapok" required
                  className="text-xl font-bold border-b-2 border-gray-100 focus:border-indigo-500 outline-none p-2 w-full transition"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">Leírás</label>
                <textarea 
                  placeholder="Rövid leírás a diákoknak..."
                  className="border border-gray-200 rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] transition resize-y"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">Nehézségi szint</label>
                <select 
                  className="border border-gray-200 rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition cursor-pointer"
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
            <div key={qIndex} className="bg-white p-6 rounded-xl shadow-sm border-l-8 border-indigo-500 border border-gray-200 transition hover:shadow-md relative group">
              
              <div className="flex justify-between items-center mb-4">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                  {qIndex + 1}. KÉRDÉS
                </span>
                
                {questions.length > 1 && (
                  <button 
                    type="button" onClick={() => removeQuestion(qIndex)}
                    className="text-red-400 hover:text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition opacity-0 group-hover:opacity-100"
                  >
                    Kérdés törlése
                  </button>
                )}
              </div>

              <input 
                type="text" placeholder="Írd be a kérdést ide..." required
                className="w-full font-bold mb-5 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
                value={q.questionText} onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              />
              
              <div className="space-y-3 pl-2 border-l-2 border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Válaszlehetőségek (Jelöld be a helyeset)</p>
                
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3 group/opt">
                    {/* Helyes válasz rádiógomb */}
                    <div 
                      className="cursor-pointer flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors"
                      onClick={() => updateCorrectAnswer(qIndex, oIndex)}
                      title="Ez a helyes válasz"
                    >
                      <div className={`w-3 h-3 rounded-full ${q.correctAnswer === oIndex ? 'bg-green-500' : 'bg-transparent'}`}></div>
                    </div>

                    <input 
                      type="text" placeholder={`${oIndex + 1}. válaszlehetőség`} required
                      className={`border rounded-lg p-2 flex-1 text-sm outline-none transition ${q.correctAnswer === oIndex ? 'border-green-400 bg-green-50 focus:ring-green-400' : 'border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400'}`}
                      value={opt} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    />

                    {/* Válasz Törlése gomb (Csak ha több mint 2 van) */}
                    <button 
                      type="button" 
                      onClick={() => removeOption(qIndex, oIndex)}
                      className={`text-gray-300 hover:text-red-500 transition px-2 ${q.options.length <= 2 ? 'invisible' : 'visible'}`}
                      title="Válasz törlése"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              {/* Válasz Hozzáadása Gomb */}
              <button 
                type="button" onClick={() => addOption(qIndex)}
                className="mt-4 ml-6 text-sm font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
              >
                + Új válasz hozzáadása
              </button>
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
              Kvíz Mentése 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;