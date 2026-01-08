
export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  image?: string; // Base64 or URL
  comments?: Comment[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface User {
  name: string;
  role: string;
  bio: string;
}
