import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
  if (!email || !password) return alert("Fill all fields");

  try {
    const { data } = await API.post("/auth/register", { email, password });

    localStorage.setItem("token", data.token);

    alert("Account created successfully 🚀");
    navigate("/dashboard"); // go to dashboard directly
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed. Try again.");
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join & analyze your resume ✨</p>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "0 10px 30px rgba(34,197,94,0.6)",
          }}
          onClick={handleRegister}
        >
          Register
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}



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
    padding: "14px 16px",
    marginBottom: 16,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.1)",
    fontFamily: "Raleway, sans-serif",
    fontWeight: "bold",
    color: "#fff",
    outline: "none",
    fontSize: 15,
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
