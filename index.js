
const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
// 替换 <password> 为实际的数据库用户密码
const uri = "mongodb+srv://zlbot:KUN6jGsHSePv8dQ@webbot.emgbmzs.mongodb.net/?retryWrites=true&w=majority&appName=webbot";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
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
app.use(express.static(path.join(__dirname, 'my-chatbot-app/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
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

    // 获取当前年月作为标识符
    const yearMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

    // 检查当前月份的留言数量
    const countDoc = await countCollection.findOne({ yearMonth: yearMonth });
    if (countDoc && countDoc.count >= 30) {
      // 如果已达到留言限制
      res.status(429).send(); // 使用 429 Too Many Requests 状态码
      return;
    }

    // 插入新留言
    await messagesCollection.insertOne(message);

    // 更新留言计数
    if (countDoc) {
      // 如果已有计数，增加计数
      await countCollection.updateOne({ yearMonth: yearMonth }, { $inc: { count: 1 } });
    } else {
      // 如果没有计数，创建新记录
      await countCollection.insertOne({ yearMonth: yearMonth, count: 1 });
    }

    res.status(200).send(); // 成功保存留言
  } catch (error) {
    console.error("Failed to save message", error);
    res.status(500).send(); // 服务器内部错误
  } finally {
    await client.close(); // 确保关闭 MongoDB 客户端连接
  }
});

// 示例 API 路由
app.get('/api/questions', (req, res) => {
  // 示例响应，实际应用中这里会根据实际情况返回数据
  res.json([
    { id: 1, question: "什么是Node.js?", answer: "Node.js是一个JavaScript运行环境。" },
    { id: 2, question: "什么是Express?", answer: "Express是一个Node.js的web应用框架。" }
  ]);
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
