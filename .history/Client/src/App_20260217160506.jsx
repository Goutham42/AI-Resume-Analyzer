import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Regular small pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy-load big pages to reduce initial bundle size
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
