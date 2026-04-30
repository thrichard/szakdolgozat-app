/**
 * Kvíz kitöltését végző kliensoldali komponens (Lépésenkénti űrlap / Wizard).
 * Kezeli az aktív kérdés állapotát, a felhasználói interakciókat (válaszok rögzítése),
 * és az eredmények véglegesítését a szerver felé történő API kéréssel.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function TakeQuiz() {
  const { id } = useParams(); // Dinamikus útvonal paraméter (Kvíz azonosító) kinyerése
  const navigate = useNavigate();
  
  // Komponens szintű állapotok (State Management)
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  /**
   * API hívás a specifikus kvíz és kérdéshalmaz lekérdezésére.
   */
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
        } else {
          setError(data.message || 'Hiba az adatok betöltésekor.');
        }
      } catch (err) {
        setError('Hálózati hiba történt.');
      }
    };
    fetchQuizData();
  }, [id]);

  /**
   * Felhasználói válasz rögzítése a lokális tömbben, majd léptetés a következő kérdésre.
   * @param {number} optionIndex - A kiválasztott opció sorszáma.
   */
  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    // Kérdés léptetése vagy adatok beküldése, ha az utolsó kérdésnél járunk
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  /**
   * Összegyűjtött válaszvektor (payload) továbbítása a backend felé kiértékelésre.
   * @param {Array} finalAnswers - A rögzített válaszok tömbje.
   */
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
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Hiba az eredmények beküldésekor.');
    }
  };

  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
  if (!quiz || questions.length === 0) return <div className="p-8 text-center">Adatok inicializálása...</div>;

  // Eredmény nézet (Kiértékelés utáni állapot) renderelése
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-800">Vizsga befejezve!</h2>
          <p className="text-gray-500 mb-6">A rendszer automatikusan rögzítette az eredményt.</p>
          
          <div className="text-6xl mb-4">
            {result.percentage >= 80 ? '🏆' : result.percentage >= 50 ? '👍' : '📚'}
          </div>
          
          <div className="text-5xl font-black text-indigo-600 mb-2">
            {result.percentage}%
          </div>
          <p className="text-lg font-bold text-gray-700 mb-8">
            Elért pontszám: {result.score} / {result.totalQuestions}
          </p>
          
          <Link to="/dashboard" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition block w-full">
            Vissza az irányítópultra
          </Link>
        </div>
      </div>
    );
  }

  // Aktív kérdés nézet renderelése
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="mb-8 flex justify-between items-center text-sm font-bold text-gray-400">
          <span>{quiz.title}</span>
          <span>Kérdés: {currentQuestion + 1} / {questions.length}</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {questions[currentQuestion].questionText}
        </h2>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition font-medium text-gray-700"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;