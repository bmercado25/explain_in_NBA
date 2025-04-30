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

async function run() {
try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}
}
run().catch(console.dir);

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
