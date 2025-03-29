import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Auth from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminAuth from "./pages/Admin-Panel/AdminAuth";
import AdminDashboard from "./pages/Admin-Panel/AdminDashBoard";
import QuestionPaperGenerator from "./pages/NewPages/GenerateQuestionPaperTest";
import DashboardPage from "./pages/NewPages/Dashboard";
import WelcomePage from "./pages/NewPages/WelcomePage";
import Layout from "./components/Layout";
import AddNotesPage from "./pages/NewPages/UploadNotesTest";
import AddSubject from "./pages/NewPages/AddSubject";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<Auth />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addSubject"
          element={
            <ProtectedRoute>
              <AddSubject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-notes"
          element={
            <ProtectedRoute>
              <AddNotesPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/generate-question-paper"
          element={
            <ProtectedRoute>
              {/* <GlobalVariableProvider> */}
              <QuestionPaperGenerator />
              {/* </GlobalVariableProvider> */}
            </ProtectedRoute>
          }
        />
        <Route path="/admin/signin" element={<AdminAuth />} />
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute>
              {/* <GlobalVariableProvider> */}
              <AdminDashboard />
              {/* </GlobalVariableProvider> */}
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
