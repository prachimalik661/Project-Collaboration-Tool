import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
// import Dashboard from "./pages/Dashboard";
import NotAuthorized from "./pages/unauthorized";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected: Any logged-in user */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", "ProjectManager", "TeamMember"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Restricted Roles Example (for future): */}
        {/* <Route
          path="/admin-panel"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/unauthorized" element={<unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
