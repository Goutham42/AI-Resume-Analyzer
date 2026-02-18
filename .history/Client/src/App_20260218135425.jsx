import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              localStorage.getItem("token") ? (
                <Dashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
