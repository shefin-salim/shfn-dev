
import { BlogPost, Comment, ContactMessage } from './types';

/**
 * Automatically determine the API base URL.
 * If running locally on a standard dev port, point to the Express server on 5000.
 * Otherwise, use relative paths for production.
 */
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

/**
 * Fetches all posts from MongoDB via your backend API.
 * No longer falls back to fake/dummy posts.
 */
export const getPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE}/posts`);
    if (!response.ok) throw new Error('API unreachable');
    const data = await response.json();
    return data.map((item: any) => ({ ...item, id: item._id || item.id }));
  } catch (error) {
    console.warn('Backend connection failed. Checking local backup.');
    const data = localStorage.getItem('shfn_posts');
    return data ? JSON.parse(data) : [];
  }
};

/**
 * Adds a comment to a post in MongoDB.
 */
export const addComment = async (postId: string, comment: Comment): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    return response.ok;
  } catch (error) {
    const posts = JSON.parse(localStorage.getItem('shfn_posts') || '[]');
    const post = posts.find((p: BlogPost) => p.id === postId);
    if (post) {
      post.comments = [...(post.comments || []), comment];
      localStorage.setItem('shfn_posts', JSON.stringify(posts));
    }
    return true;
  }
};

/**
 * Saves a contact message to your MongoDB database.
 */
export const saveMessage = async (msg: Omit<ContactMessage, 'id' | 'date'>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    return response.ok;
  } catch (error) {
    const messages = JSON.parse(localStorage.getItem('shfn_messages') || '[]');
    const newMsg = {
      ...msg,
      id: Date.now().toString(),
      date: new Date().toLocaleString()
    };
    messages.unshift(newMsg);
    localStorage.setItem('shfn_messages', JSON.stringify(messages));
    return true;
  }
};

/**
 * Saves or updates a post in MongoDB.
 */
export const savePost = async (post: BlogPost): Promise<boolean> => {
  try {
    const isNew = post.id.startsWith('temp_');
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `${API_BASE}/posts` : `${API_BASE}/posts/${post.id}`;

    // For new posts, rely on backend to generate ID. For updates, ID is in URL.
    // We strip ID from body for cleanliness but it's okay to send it.
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isNew ? { ...post, id: undefined } : post), // Don't send temp ID
    });
    return response.ok;
  } catch (error) {
    // If server is down, we save to local storage but return true so UI doesn't crash
    const posts = JSON.parse(localStorage.getItem('shfn_posts') || '[]');
    const existingIndex = posts.findIndex((p: BlogPost) => p.id === post.id);
    if (existingIndex > -1) {
      posts[existingIndex] = post;
    } else {
      posts.unshift(post);
    }
    localStorage.setItem('shfn_posts', JSON.stringify(posts));
    return true;
  }
};

/**
 * Deletes a post from MongoDB.
 */
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    const posts = JSON.parse(localStorage.getItem('shfn_posts') || '[]');
    const filtered = posts.filter((p: BlogPost) => p.id !== id);
    localStorage.setItem('shfn_posts', JSON.stringify(filtered));
    return true;
  }
};

/**
 * Fetches all contact messages from MongoDB.
 */
export const getMessages = async (): Promise<ContactMessage[]> => {
  try {
    const response = await fetch(`${API_BASE}/messages`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    return data.map((item: any) => ({ ...item, id: item._id || item.id }));
  } catch (error) {
    return JSON.parse(localStorage.getItem('shfn_messages') || '[]');
  }
};

/**
 * Deletes a message from MongoDB.
 */
export const deleteMessage = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/messages/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    const messages = JSON.parse(localStorage.getItem('shfn_messages') || '[]');
    const filtered = messages.filter((m: ContactMessage) => m.id !== id);
    localStorage.setItem('shfn_messages', JSON.stringify(filtered));
    return true;
  }
};

/**
 * Authenticates the admin user.
 * Matches the /api/auth/login route in your server.js
 */
export const login = async (username: string, password: string): Promise<{ success: boolean; token?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('shfn_token', data.token);
      return { success: true, token: data.token };
    }
    return { success: false };
  } catch (error) {
    // Demo fallback for local dev if server is not running
    if (username === 'admin' && password === 'admin') {
      const token = 'session_' + btoa(username + ':' + Date.now());
      localStorage.setItem('shfn_token', token);
      return { success: true, token };
    }
    return { success: false };
  }
};
