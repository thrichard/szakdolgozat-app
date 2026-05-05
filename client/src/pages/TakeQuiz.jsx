import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Adatok lekérése
  useEffect(() => {
    const fetchQuizData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setQuiz(data.quiz);
          setQuestions(data.questions);
          // A böngésző fül címe a kvíz neve lesz
          document.title = `${data.quiz.title} - Kitöltés | Szakdolgozat Portál`;
        } else {
          setError(data.message || 'Hiba az adatok betöltésekor.');
        }
      } catch (err) {
        setError('Hálózati hiba történt.');
      }
    };
    fetchQuizData();
  }, [id]);

  // Válasz kiválasztása
  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    // Ha van még kérdés, lépünk. Ha nincs, beküldjük.
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300); // Kicsi késleltetés a szebb élményért
    } else {
      submitQuiz(newAnswers);
    }
  };

  // Kvíz beküldése
  const submitQuiz = async (finalAnswers) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: finalAnswers })
      });
      
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        document.title = "Eredmény | Szakdolgozat Portál";
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Hiba az eredmények beküldésekor.');
    }
  };

  // Kvíz megszakítása
  const handleAbort = () => {
    if (window.confirm("Biztosan meg akarod szakítani a vizsgát? Az eddigi válaszaid elvesznek!")) {
      navigate('/quizzes');
    }
  };

  // Hibakezelés és töltés állapota
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl font-bold text-center shadow-sm max-w-md w-full">
        ⚠️ {error}
        <button onClick={() => navigate('/dashboard')} className="mt-4 w-full bg-red-100 hover:bg-red-200 text-red-800 py-2 rounded-lg transition">Vissza a pultra</button>
      </div>
    </div>
  );
  if (!quiz || questions.length === 0) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-500">Vizsga betöltése... ⏳</div>;

  // PROGRESS BAR Számolás
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  // EREDMÉNY NÉZET
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 animate-fade-in-up">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-800">Vizsga befejezve!</h2>
          <p className="text-gray-500 mb-6">A rendszer automatikusan rögzítette az eredményedet.</p>
          
          <div className="text-7xl mb-4 transform hover:scale-110 transition cursor-default">
            {result.percentage >= 80 ? '🏆' : result.percentage >= 50 ? '👍' : '📚'}
          </div>
          
          <div className={`text-6xl font-black mb-2 ${result.percentage >= 80 ? 'text-green-500' : result.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
            {result.percentage}%
          </div>
          <p className="text-lg font-bold text-gray-600 mb-8 bg-gray-50 py-3 rounded-xl border border-gray-100">
            Elért pontszám: {result.score} / {result.totalQuestions}
          </p>
          
          <Link to="/dashboard" className="bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition block w-full">
            Vissza az irányítópultra
          </Link>
        </div>
      </div>
    );
  }

  // AKTÍV VIZSGA NÉZET
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* VIZSGA FEJLÉC ÉS PROGRESS BAR */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-gray-800 truncate max-w-[200px] sm:max-w-md">{quiz.title}</h1>
            <p className="text-xs text-gray-500 font-bold tracking-wider uppercase mt-1">Kérdés: {currentQuestion + 1} / {questions.length}</p>
          </div>
          <button 
            onClick={handleAbort}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg font-bold text-sm transition"
          >
            Megszakítás ✖
          </button>
        </div>
        {/* Zöld csík */}
        <div className="w-full bg-gray-100 h-1.5">
          <div 
            className="bg-green-500 h-1.5 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* KÉRDÉS ÉS VÁLASZOK */}
      <div className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
              {questions[currentQuestion].questionText}
            </h2>
          </div>

          <div className="grid gap-3 md:gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-5 md:p-6 rounded-2xl border-2 border-gray-200 bg-white hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all duration-200 font-medium text-gray-700 text-lg flex items-center gap-4 group"
              >
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-indigo-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {String.fromCharCode(65 + index)} {/* A, B, C, D betűk generálása */}
                </div>
                {option}
              </button>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

export default TakeQuiz;