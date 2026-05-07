import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quizzes from "./pages/Quizzes";
import TakeQuiz from "./pages/TakeQuiz";
import Results from "./pages/Results";
import Materials from "./pages/Materials";
import TeacherDashboard from "./pages/TeacherDashboard";
import AddMaterial from "./pages/AddMaterial";
import CreateQuiz from "./pages/CreateQuiz";
import AllResults from "./pages/AllResults";
import ManageQuizzes from "./pages/ManageQuizzes";
import EditQuiz from "./pages/EditQuiz";
import ManageMaterials from "./pages/ManageMaterials";
import EditMaterial from "./pages/EditMaterial";

//  BIZTONSÁGI ŐR KOMPONENS (Route Protection)
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1. Ha nincs token (nincs bejelentkezve), irány a login!
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Ha az oldalhoz specifikus szerepkör kell, de a user nem az
  if (allowedRole && role !== allowedRole) {
    // Visszadobjuk a saját pultjára
    return <Navigate to={role === "teacher" ? "/teacher" : "/dashboard"} replace />;
  }

  // Ha minden rendben, betöltjük a kért oldalt
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Publikus oldalak */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*  DIÁK OLDALAK (Csak 'student' szerepkörrel)  */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRole="student"><Dashboard /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute allowedRole="student"><Quizzes /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute allowedRole="student"><TakeQuiz /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute allowedRole="student"><Results /></ProtectedRoute>} />
        <Route path="/materials" element={<ProtectedRoute allowedRole="student"><Materials /></ProtectedRoute>} />

        {/* TANÁRI OLDALAK (Csak 'teacher' szerepkörrel) */}
        <Route path="/teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/add-material" element={<ProtectedRoute allowedRole="teacher"><AddMaterial /></ProtectedRoute>} />
        <Route path="/create-quiz" element={<ProtectedRoute allowedRole="teacher"><CreateQuiz /></ProtectedRoute>} />
        <Route path="/all-results" element={<ProtectedRoute allowedRole="teacher"><AllResults /></ProtectedRoute>} />
        <Route path="/manage-quizzes" element={<ProtectedRoute allowedRole="teacher"><ManageQuizzes /></ProtectedRoute>} />
        <Route path="/edit-quiz/:id" element={<ProtectedRoute allowedRole="teacher"><EditQuiz /></ProtectedRoute>} />
        <Route path="/manage-materials" element={<ProtectedRoute allowedRole="teacher"><ManageMaterials /></ProtectedRoute>} />
        <Route path="/edit-material/:id" element={<ProtectedRoute allowedRole="teacher"><EditMaterial /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;