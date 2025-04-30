const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors()); 
app.use(express.json());

const uri = process.env.DB_CONN; 

console.log(uri);


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  client.connect().then(() => {
    console.log("Connected to MongoDB!");
  
    const chatCollection = client.db('NBACluster').collection('chatHistory');
  
    // POST route
    app.post('/api/PostChatHistory', async (req, res) => {
      const { deviceID, history } = req.body;
  
      if (!deviceID || !Array.isArray(history)) {
        return res.status(400).json({ error: 'Invalid request format' });
      }
  
      try {
        const lastChat = await chatCollection.findOne({ deviceID }, { sort: { index: -1 } });
        const newIndex = lastChat ? lastChat.index + 1 : 0;
  
        const newChat = {
          deviceID,
          history,
          index: newIndex,
          createdAt: new Date(),
        };
  
        await chatCollection.insertOne(newChat);
        res.status(200).json({ status: 'Chat stored successfully', newIndex });
      } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
    // GET route
    app.get('/api/getChatHistory', async (req, res) => {
      const { deviceID } = req.query;
  
      if (!deviceID) {
        return res.status(400).json({ error: 'Missing deviceID' });
      }
  
      try {
        const history = await chatCollection.find({ deviceID: Number(deviceID) }).sort({ index: 1 }).toArray();
        res.status(200).json({ history });
        console.log(history);
      } catch (error) {
        console.error(' Error fetching history:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
    // Start server after DB is connected
    app.listen(PORT, () => {
      console.log(`Server live at http://localhost:${PORT}`);
    });
  
  }).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });