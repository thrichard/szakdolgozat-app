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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Publikus oldalak */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Diák oldalak */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/materials" element={<Materials />} />

        {/* Tanári oldalak */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/add-material" element={<AddMaterial />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/all-results" element={<AllResults />} />
        <Route path="/manage-quizzes" element={<ManageQuizzes />} />
        <Route path="/edit-quiz/:id" element={<EditQuiz />} />
        <Route path="/manage-materials" element={<ManageMaterials />} />
        <Route path="/edit-material/:id" element={<EditMaterial />} />
      </Routes>
    </Router>
  );
}

export default App;
