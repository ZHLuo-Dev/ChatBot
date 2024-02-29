
const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());
const uri = "mongodb+srv://zlbot:KUN6jGsHSePv8dQ@webbot.emgbmzs.mongodb.net/?retryWrites=true&w=majority&appName=webbot";


const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);


app.use(express.static(path.join(__dirname, 'my-chatbot-app/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/my-chatbot-app/build/index.html'));
});


app.post('/api/leaveMessage', async (req, res) => {
  try {
    const message = req.body;
    await client.connect();
    
    const db = client.db("leave_m_counter");
    const messagesCollection = db.collection("messages");
    const countCollection = db.collection("m_count");


    const yearMonth = new Date().toISOString().slice(0, 7); 

    const countDoc = await countCollection.findOne({ yearMonth: yearMonth });
    if (countDoc && countDoc.count >= 30) {
      res.status(429).send(); 
      return;
    }


    await messagesCollection.insertOne(message);


    if (countDoc) {
      await countCollection.updateOne({ yearMonth: yearMonth }, { $inc: { count: 1 } });
    } else {
      await countCollection.insertOne({ yearMonth: yearMonth, count: 1 });
    }

    res.status(200).send(); 
  } catch (error) {
    console.error("Failed to save message", error);
    res.status(500).send(); 
  } 
});


app.get('/api/questions', (req, res) => {
  res.json([
    { id: 1, question: "什么是Node.js?", answer: "Node.js是一个JavaScript运行环境。" },
    { id: 2, question: "什么是Express?", answer: "Express是一个Node.js的web应用框架。" }
  ]);
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
