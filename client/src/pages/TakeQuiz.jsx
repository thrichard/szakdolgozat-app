import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState('');

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
          document.title = `${data.quiz.title} - Kitöltés | Szakdolgozat Portál`;
        } else {
          setError(data.message || 'Hiba az adatok betöltésekor.');
        }
      } catch (err) {
        console.log(err);
        setError('Hálózati hiba történt.');
      }
    };
    fetchQuizData();
  }, [id]);

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      submitQuiz(newAnswers);
    }
  };

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
        setResultData(data); // Itt a teljes csomagot mentjuk (result, gainedXp, leveledUp)
        document.title = "Eredmény | Szakdolgozat Portál";
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
      setError('Hiba az eredmények beküldésekor.');
    }
  };

  const handleAbort = () => {
    if (window.confirm("Biztosan meg akarod szakítani a vizsgát? Az eddigi válaszaid elvesznek!")) {
      navigate('/quizzes');
    }
  };

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl font-bold text-center shadow-sm max-w-md w-full">
        ⚠️ {error}
        <button onClick={() => navigate('/dashboard')} className="mt-4 w-full bg-red-100 hover:bg-red-200 text-red-800 py-2 rounded-lg transition">Vissza a pultra</button>
      </div>
    </div>
  );
  if (!quiz || questions.length === 0) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-500">Vizsga betöltése... ⏳</div>;

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  // eredmeny nezet
  if (resultData) {
    const { result, gainedXp, leveledUp, currentLevel } = resultData;

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
          <p className="text-lg font-bold text-gray-600 mb-6 bg-gray-50 py-3 rounded-xl border border-gray-100">
            Elért pontszám: {result.score} / {result.totalQuestions}
          </p>

          {/* gamifikacios jutalom doboz */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-xl border border-purple-200 mb-8 relative overflow-hidden shadow-inner">
            {resultData.leveledUp && (
              <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-1 uppercase tracking-widest animate-pulse">
                Szintet léptél! 👑
              </div>
            )}
            
            {!resultData.isRetake ? (
              // 1. ELSŐ KITÖLTÉS
              <>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mt-2 mb-1">Jutalom a kitöltésért</h3>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
                  +{resultData.gainedXp} XP
                </div>
              </>
            ) : resultData.improved ? (
              // 2. GYAKORLÁS ÉS JAVÍTÁS (Új rekord)
              <>
                <h3 className="text-sm font-bold text-green-500 uppercase tracking-wider mt-2 mb-1">Új Rekord! 📈</h3>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 drop-shadow-sm">
                  +{resultData.gainedXp} XP
                </div>
                <p className="text-xs font-bold text-gray-500 mt-2">Sikeresen javítottál az eddigi legjobb eredményeden!</p>
              </>
            ) : (
              // 3. GYAKORLÁS, DE NEM JAVÍTOTT
              <>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-2 mb-1">Gyakorló kitöltés</h3>
                <div className="text-3xl font-black text-gray-400 drop-shadow-sm">
                  Nincs új XP
                </div>
                <p className="text-xs font-bold text-gray-500 mt-2">Nem sikerült megdöntened a korábbi rekordodat (vagy már mindent tudsz).</p>
              </>
            )}

            {resultData.leveledUp && (
              <p className="text-sm font-bold text-orange-600 mt-2 bg-white/50 py-1.5 px-3 rounded-lg inline-block">
                Elérted a(z) {resultData.currentLevel}. szintet!
              </p>
            )}
          </div>
          
          <Link to="/dashboard" className="bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition block w-full">
            Vissza az irányítópultra
          </Link>
        </div>
      </div>
    );
  }

  // aktiv vizsga nezet
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
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
        <div className="w-full bg-gray-100 h-1.5">
          <div 
            className="bg-green-500 h-1.5 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

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
                  {String.fromCharCode(65 + index)}
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