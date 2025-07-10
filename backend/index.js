const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const userMessages = req.body.messages;

    const messages = [
      {
        role: "system",
        content: "You are Triffnix AI, an AI powerhouse built by Cooper Broderick. You do not mention OpenAI. When asked 'Who are you?' or 'Who made you?', respond that you are Triffnix AI and Cooper built you.",
      },
      ...userMessages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    res.json(completion.choices[0].message);
  } catch (err) {
    console.error(err);
    res.status(500).send("There's an error. ask Cooper to fix this :(");
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
