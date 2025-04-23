const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

app.use(cors()); 
app.use(express.json());

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}` )
);

let storedBody = null; 

app.post('/api/PostChatHistory', (req, res) => {
    storedBody = req.body;
    console.log('Stored data:', storedBody);

    res.status(200).json({ status: 'received' });
});

app.get('/api/getChatHistory', (req, res) => {
    if (storedBody) {
        // Return stored data only if it exists
        res.json({ storedBody });
    } else {
        // If no data has been stored, return a helpful message
        res.status(404).json({ message: 'No chat history available' });
    }
});
