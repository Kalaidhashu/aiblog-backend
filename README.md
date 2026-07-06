# 🤖 AI Blog Platform - Backend

Backend API for the AI Blog Platform built using Node.js, Express.js, MongoDB, and Gemini AI.

## 🚀 Live API

https://aiblog-backend.onrender.com/api

---

## ✨ Features

- JWT Authentication
- User Registration & Login
- Blog CRUD APIs
- Comments API
- Like Blogs
- Favorite Blogs
- AI Blog Generation
- AI Grammar Correction
- AI Image Prompt Generation
- Protected Routes
- Admin Support
- MongoDB Atlas Integration

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt.js
- Gemini API
- Multer
- Axios

---

## 📂 Folder Structure

```
backend/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── utils/
├── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

---

## 📦 Installation

Clone repository

```bash
git clone https://github.com/yourusername/aiblog-backend.git
```

Install dependencies

```bash
npm install
```

Start server

```bash
npm run dev
```

Production

```bash
npm start
```

---

## 📌 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
```

---

### Blogs

```
GET    /api/blogs
GET    /api/blogs/:id
POST   /api/blogs
PUT    /api/blogs/:id
DELETE /api/blogs/:id
POST   /api/blogs/:id/like
POST   /api/blogs/:id/favorite
```

---

### Comments

```
GET    /api/comments/blog/:id
POST   /api/comments
DELETE /api/comments/:id
```

---

### AI

```
POST /api/ai/blog-generator
POST /api/ai/grammar
POST /api/ai/image-generator
POST /api/ai/chat
```

---

## 🌐 Deployment

Backend is deployed using **Render**

Database is hosted on **MongoDB Atlas**

---

## 👨‍💻 Author

Kalaidharshini K
