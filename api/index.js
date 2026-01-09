import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection Logic (Reuse connection if it exists)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined in environment variables.");
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

// Define Schemas
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: String,
  image: String,
  excerpt: String,
  comments: { type: Array, default: [] }
});

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: String
});

// Prevent model overwrite in serverless environment
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

// Middleware to ensure DB is connected before handling routes
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const msg = new Message({
      ...req.body,
      date: new Date().toLocaleString()
    });
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ _id: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';

  if (username === adminUser && password === adminPass) {
    res.json({ token: 'secure_session_token_' + Date.now() });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default app;
