// Minimal Node/Express Server (server.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to your MongoDB Atlas string
mongoose.connect('mongodb+srv://shefinsalim8848_db_user:EqAulAclnSyzoubs@cluster0.dszqrzx.mongodb.net/?appName=cluster0');

const Post = mongoose.model('Post', { title: String, content: String, date: String, image: String, excerpt: String, comments: Array });
const Message = mongoose.model('Message', { name: String, email: String, message: String, date: String });

// Routes
app.get('/api/posts', async (req, res) => res.json(await Post.find().sort({_id: -1})));
app.post('/api/posts', async (req, res) => res.json(await new Post(req.body).save()));
app.post('/api/messages', async (req, res) => res.json(await new Message({...req.body, date: new Date().toLocaleString()}).save()));
app.get('/api/messages', async (req, res) => res.json(await Message.find()));
app.post('/api/auth/login', (req, res) => res.json({ token: 'secure_session_token' })); // Use proper JWT in production

app.listen(5000, () => console.log('Server running on 5000'));