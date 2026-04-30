/**
 * Fő alkalmazás komponens (Root Component).
 * Felelős a kliensoldali útválasztásért (Client-side Routing) a react-router-dom segítségével.
 * Itt történik a különböző nézetek (View) regisztrálása és a navigációs struktúra felépítése.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/Quizzes';
import TakeQuiz from './pages/TakeQuiz';
import Results from './pages/Results';
import Materials from './pages/Materials';
import TeacherDashboard from './pages/TeacherDashboard';
import AddMaterial from './pages/AddMaterial';
import CreateQuiz from './pages/CreateQuiz';
import AllResults from './pages/AllResults';

function App() {
  return (
    <Router>
      <Routes>
        {/* Alapértelmezett átirányítás a bejelentkezési felületre */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Publikus útvonalak */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Diák specifikus útvonalak */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/materials" element={<Materials />} />
        
        {/* Oktató specifikus útvonalak */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/add-material" element={<AddMaterial />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/all-results" element={<AllResults />} />
      </Routes>
    </Router>
  );
}

export default App;