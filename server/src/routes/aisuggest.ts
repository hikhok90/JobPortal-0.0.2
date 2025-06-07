import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { query } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful job recommender AI." },
        { role: "user", content: `Find jobs based on this: ${query}` },
      ],
    });

    const suggestions = response.choices[0].message.content;
    res.json({ suggestions });
  } catch (error: any) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "AI suggestion failed." });
  }
});

export default router;
