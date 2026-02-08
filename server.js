const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const messages = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/messages", (req, res) => {
  res.json({ count: messages.length, messages });
});

app.post("/api/messages", (req, res) => {
  const { name, email, topic, message } = req.body || {};

  if (!name || !email || !topic || !message) {
    return res.status(400).json({
      error: "All fields are required.",
    });
  }

  const newMessage = {
    id: messages.length + 1,
    name,
    email,
    topic,
    message,
    receivedAt: new Date().toISOString(),
  };

  messages.unshift(newMessage);
  res.status(201).json({
    success: true,
    data: newMessage,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
