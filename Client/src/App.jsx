import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  // Auth state: true if token exists
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  // Handlers to update auth state after login/register
  const handleLogin = () => setIsAuthenticated(true);
  const handleRegister = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Suspense fallback={<div style={{ textAlign: "center", marginTop: 50 }}>Loading...</div>}>
        <Routes>
          {/* LOGIN */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register onRegister={handleRegister} />
              )
            }
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
