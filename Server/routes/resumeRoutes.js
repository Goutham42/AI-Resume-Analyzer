const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const axios = require("axios");

router.post("/analyze", auth, async (req, res) => {
  const { resumeText, jobRole } = req.body;

  if (!resumeText) {
    return res.status(400).json({ message: "Resume text required" });
  }

  const prompt = `
You are a professional ATS Resume Analyzer.

Analyze this resume for a ${jobRole} role.

Give structured output:

Strengths:
Weaknesses:
Improvement tips:

Resume:
${resumeText}
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a professional resume reviewer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    const feedback = response.data.choices[0].message.content;

    res.json({ feedback });

  } catch (err) {
    console.error("Groq Error:", err.response?.data || err.message);

    if (err.response?.status === 401) {
      return res.status(500).json({ message: "Invalid Groq API key" });
    }

    if (err.response?.status === 429) {
      return res.status(503).json({ message: "AI service busy. Try later." });
    }

    res.status(500).json({ message: "AI analysis failed" });
  }
});

module.exports = router;
