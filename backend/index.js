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
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    res.json(completion.choices[0].message);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error from OpenAI API");
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
