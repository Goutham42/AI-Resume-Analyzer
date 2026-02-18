import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!email || !password) return alert("Fill all fields");
  setLoading(true);

  try {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token); // store token
    onLogin(); // 🔑 update auth state in App.jsx
    navigate("/dashboard"); // navigate immediately
  } catch {
    alert("Login failed. Check credentials.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h2 style={styles.title}>🔐 Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue</p>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p style={styles.text}>
          New here?{" "}
          <span style={styles.link} onClick={() => navigate("/register")}>
            Create account →
          </span>
        </p>
      </div>
    </div>
  );
}

// ...styles remain same as your previous code


// ...styles unchanged from your previous code



const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top, #6366f1, #0f172a 60%)",
    overflow: "hidden",
  },

  glassCard: {
    width: 380,
    padding: "40px 35px",
    borderRadius: 24,
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    textAlign: "center",
    animation: "slideUp 0.7s ease",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Raleway, sans-serif",
    color: "#fff",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 18,
    fontFamily: "Raleway, sans-serif",
    color: "#c7d2fe",
    marginBottom: 28,
  },

  input: {
    width: "100%",
    padding: "14px 0px",
    marginBottom: 16,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.3)",
    fontFamily: "Raleway, sans-serif",
    fontWeight: "bold",
    color: "black",
    outline: "none",
    fontSize: 15,
    transition: "0.3s",
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    marginTop: 6,
    fontFamily: "Raleway, sans-serif",
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    cursor: "pointer",
    background:
      "linear-gradient(135deg, #6366f1, #22d3ee)",
    boxShadow: "0 10px 30px rgba(99,102,241,0.6)",
    transition: "all 0.3s ease",
  },

  text: {
    marginTop: 22,
    fontSize: 14,
    fontFamily: "Raleway, sans-serif",
    color: "#e0e7ff",
  },

  link: {
    color: "#38bdf8",
    fontWeight: 600,
    cursor: "pointer",
  },
};
