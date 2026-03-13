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

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: String,
  imageUrl: String,
  link: String,
  date: { type: String, default: () => new Date().toLocaleString() }
});

const ProfileSchema = new mongoose.Schema({
  name: String,
  bioParagraph1: String,
  bioParagraph2: String,
  photoUrl: String,
  photoLabel: String,
  stacks: String,
  whatIDoHeading: String,
  whatIDoContent: String
});

// Prevent model overwrite in serverless environment
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

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

// Project Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await ProjectModel.find().sort({ _id: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = new ProjectModel(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await ProjectModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile Routes
app.get('/api/profile', async (req, res) => {
  try {
    let profile = await ProfileModel.findOne();
    if (!profile) {
      profile = new ProfileModel({
        name: "Mohammed Shefin",
        bioParagraph1: "Iam Mohammed Shefin. I design and build websites that are easy to look at and easy to use. I believe good design should be clean and honest.",
        bioParagraph2: "I love building different chatbots for Telegram, Discord, and other platforms, helping automate tasks, reply to users, connect with services, and make chats faster, easier, and more useful for communities and teams.",
        photoUrl: "https://i.ibb.co/0VsTScJm/photo-2026-01-07-11-14-03.jpg",
        photoLabel: "Portait of Myself // 2025",
        stacks: "Frontend: React\nBackend: Node.js, Express\nBots: python-telegram-bot, Telethon",
        whatIDoHeading: "What I do",
        whatIDoContent: "I’m working on projects that use AI bots to automate everyday tasks and improve efficiency."
      });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    let profile = await ProfileModel.findOne();
    if (profile) {
      profile = await ProfileModel.findByIdAndUpdate(profile._id, req.body, { new: true });
    } else {
      profile = new ProfileModel(req.body);
      await profile.save();
    }
    res.json(profile);
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
