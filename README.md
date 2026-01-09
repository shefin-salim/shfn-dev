# shfn.dev

A minimalist, high-performance portfolio and blog built with **React**, **Vite**, and **Tailwind CSS**. 
The backend is a serverless **Express** API connected to **MongoDB Atlas**, designed for seamless deployment on **Vercel**.

## Features
- **Dynamic Blog System**: Create, edit, and manage posts via a secure admin dashboard.
- **Comment System**: Real-time commenting on blog posts.
- **Contact Form**: Messages are saved directly to the database.
- **Authentication**: Secure admin login for content management.
- **Responsive Design**: Mobile-first approach with smooth animations and dark mode aesthetics.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS (CDN)
- **Backend**: Node.js, Express (Serverless), Mongoose
- **Database**: MongoDB Atlas

## Getting Started

### 1. Installation
Clone the repo and install dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
```

### 3. Run Locally
Start the frontend and backend:
```bash
# Terminal 1: Frontend (Port 3000)
npm run dev

# Terminal 2: Backend (Port 5000)
node server.js
```

## Deployment
This project is optimized for **Vercel**.
1. Import the repository to Vercel.
2. Add the environment variables (MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD) in the Vercel dashboard.
3. Deploy. The `vercel.json` configuration handles the routing automatically.
