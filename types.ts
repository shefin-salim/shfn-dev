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

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  imageUrl: string;
  link: string;
}

export interface User {
  name: string;
  role: string;
  bio: string;
}

export interface Profile {
  id?: string;
  name: string;
  bioParagraph1: string;
  bioParagraph2: string;
  photoUrl: string;
  photoLabel: string;
  stacks: string;
  whatIDoHeading: string;
  whatIDoContent: string;
}
