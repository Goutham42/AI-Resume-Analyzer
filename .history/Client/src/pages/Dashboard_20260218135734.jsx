import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { jsPDF } from "jspdf";

/* ---------- HELPERS ---------- */

// Resume score logic
const calculateScore = (text) => {
  let score = 0;
  const lower = text.toLowerCase();

  if (text.length > 300) score += 20;
  if (text.length > 700) score += 20;

  const keywords = ["react", "javascript", "node", "api", "project", "experience", "skills"];
  keywords.forEach((k) => lower.includes(k) && (score += 5));

  if (/\d+%|\d+\+|\d+ years/.test(text)) score += 10;
  if (lower.includes("github")) score += 5;

  return Math.min(score, 100);
};

// Detect resume sections
const detectSections = (text) => {
  const lower = text.toLowerCase();
  return {
    skills: /skills|technologies/.test(lower),
    experience: /experience|employment/.test(lower),
    projects: /projects|works/.test(lower),
    certifications: /certification|certificate/.test(lower),
  };
};

// Parse AI feedback
const parseFeedback = (text = "") => ({
  strengths: text.match(/Strengths:(.*?)(Weaknesses:|$)/s)?.[1]?.trim() || "—",
  weaknesses: text.match(/Weaknesses:(.*?)(Improvement|$)/s)?.[1]?.trim() || "—",
  improvements: text.match(/Improvement tips:(.*)/s)?.[1]?.trim() || "—",
});

/* ---------- STYLES ---------- */

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #6366f1, #020617 65%), repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  glass: {
    width: "100%",
    maxWidth: 1200,
    padding: 32,
    borderRadius: 24,
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
    color: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  content: {
    display: "flex",
    gap: 28,
    flexWrap: "wrap",
  },
  panel: {
    flex: "1 1 420px",
    maxWidth: 520,
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    marginBottom: 14,
    color: "#fff",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    minHeight: 200,
    padding: 14,
    borderRadius: 14,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 1.5,
  },
  button: {
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    background: "linear-gradient(135deg,#6366f1,#22d3ee)",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
  },
  meter: {
    height: 8,
    background: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 6,
  },
  meterFill: (score) => ({
    width: `${score}%`,
    height: "100%",
    background:
      score > 70
        ? "linear-gradient(90deg,#22c55e,#4ade80)"
        : score > 40
        ? "linear-gradient(90deg,#facc15,#fde047)"
        : "linear-gradient(90deg,#ef4444,#f87171)",
    transition: "width .6s ease",
  }),
  card: {
    padding: 18,
    borderRadius: 16,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    marginBottom: 14,
  },
};

/* ---------- DASHBOARD COMPONENT ---------- */

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("Frontend Developer");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else setHistory(JSON.parse(localStorage.getItem("history")) || []);
  }, [navigate]);

  const hasValidFeedback =
    feedback &&
    (feedback.strengths !== "—" ||
      feedback.weaknesses !== "—" ||
      feedback.improvements !== "—");

  const handleAnalyze = async () => {
    if (!resumeText) return alert("Paste resume first!");
    setFeedback(null);
    setScore(null);
    setIsAnalyzing(true);

    try {
      const res = await API.post("/resume/analyze", { resumeText, jobRole });

      const finalScore = calculateScore(resumeText);
      setScore(finalScore);
      setFeedback(parseFeedback(res.data.feedback));

      const updated = [
        { date: new Date().toLocaleDateString(), role: jobRole, score: finalScore },
        ...history,
      ].slice(0, 5);

      setHistory(updated);
      localStorage.setItem("history", JSON.stringify(updated));
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        alert(err.response?.data?.message || "AI service error");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!feedback || score === null) return alert("Analyze resume first!");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AI Resume Analysis Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Job Role: ${jobRole}`, 20, 35);
    doc.text(`Resume Score: ${score}/100`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 55);

    doc.setFontSize(14);
    doc.text("Strengths:", 20, 70);
    doc.setFontSize(11);
    doc.text(feedback.strengths, 20, 80, { maxWidth: 170 });

    doc.setFontSize(14);
    doc.text("Weaknesses:", 20, 110);
    doc.setFontSize(11);
    doc.text(feedback.weaknesses, 20, 120, { maxWidth: 170 });

    doc.setFontSize(14);
    doc.text("Improvements:", 20, 150);
    doc.setFontSize(11);
    doc.text(feedback.improvements, 20, 160, { maxWidth: 170 });

    doc.save("resume-analysis.pdf");
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.glass, padding: isMobile ? 20 : 32 }}>
        <div style={styles.header}>
          <h2>🐋 AI Resume Analyzer</h2>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{ ...styles.button, width: isMobile ? "100%" : "auto" }}
              onClick={() => setShowHistory(!showHistory)}
            >
              ⌛ History
            </button>
            <button
              style={{ ...styles.button, width: isMobile ? "100%" : "auto" }}
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              👋 Logout
            </button>
          </div>
        </div>

        <div style={{ ...styles.content, flexDirection: isMobile ? "column" : "row" }}>
          {/* LEFT PANEL */}
          <div style={{ ...styles.panel, maxWidth: isMobile ? "100%" : 520 }}>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              style={styles.select}
            >
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
            </select>

            <textarea
              style={styles.textarea}
              placeholder="Paste your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />

            <button
              style={{ ...styles.button, width: isMobile ? "100%" : "auto" }}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </button>

            {score !== null && (
              <>
                <p style={{ marginTop: 14 }}>🎯 Resume Score: {score}/100</p>
                <div style={styles.meter}>
                  <div style={styles.meterFill(score)} />
                </div>
              </>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div style={{ ...styles.panel, maxWidth: isMobile ? "100%" : 520 }}>
            {hasValidFeedback && !isAnalyzing && (
              <div style={styles.card}>
                <h3>💪 Strengths</h3>
                <p>{feedback.strengths}</p>

                <h3>⚠ Weaknesses</h3>
                <p>{feedback.weaknesses}</p>

                <h3>🚀 Improvements</h3>
                <p>{feedback.improvements}</p>

                <button
                  style={{ ...styles.button, marginTop: 12, width: "100%" }}
                  onClick={handleDownloadPDF}
                >
                  📄 Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
