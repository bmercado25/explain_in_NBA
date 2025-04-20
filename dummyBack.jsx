const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Enable CORS (Cross-Origin Resource Sharing) to allow requests from different origins
app.use(cors());

// Use body-parser to parse JSON request bodies
app.use(bodyParser.json());

// In-memory storage for chat history (you can use a database in a real-world app)
let chatHistory = [];

// POST endpoint to receive chat history from the frontend and store it
app.post('/api/sendChatHistory', (req, res) => {
  try {
    const { chatHistory: receivedHistory } = req.body;

    if (!Array.isArray(receivedHistory)) {
      return res.status(400).json({ error: "Chat history must be an array." });
    }

    // Store the received chat history in-memory (in a real app, this would be saved to a database)
    chatHistory = receivedHistory;

    // Respond with a success message
    return res.status(200).json({ message: "Chat history received successfully" });
  } catch (error) {
    console.error("Error receiving chat history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to return the stored chat history
app.get('/api/getChatHistory', (req, res) => {
  try {
    // Return the chat history
    return res.status(200).json({ chatHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});