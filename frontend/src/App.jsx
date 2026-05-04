import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import DocumentDetailPage from './pages/Documents/DocDetailPage.jsx';
import DocumentListPage from './pages/Documents/DocListPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import FlashcardPage from './pages/Flashcards/FlashcardPage.jsx';
import FlashcardsListPage from './pages/Flashcards/FlashcardListPage.jsx';
import SharedFlashcardPage from './pages/Flashcards/SharedFlashcardPage.jsx';
import QuizTakePage from './pages/Quizzes/QuizTakePage.jsx';
import QuizResultPage from './pages/Quizzes/QuizResultPage.jsx';
import SharedQuizPage from './pages/Quizzes/SharedQuizPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/flashcards/:id" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/result" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Public Share Routes - No authentication required */}
        <Route path="/share/:token/flashcard" element={<SharedFlashcardPage />} />
        <Route path="/share/:token/quiz" element={<SharedQuizPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
